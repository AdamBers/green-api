import { describe, expect, it } from 'vitest';
import { AxiosError, CanceledError, type AxiosResponse } from 'axios';
import { AppError, isRequestCancelled, normalizeApiError } from './errors';

const apiError = (status: number, data: unknown) =>
  new AxiosError('Request failed', undefined, undefined, undefined, {
    status,
    data,
  } as AxiosResponse);
describe('normalizeApiError', () => {
  it.each([
    [401, 'auth'],
    [403, 'auth'],
    [400, 'validation'],
    [429, 'rateLimit'],
    [466, 'rateLimit'],
    [503, 'server'],
    [404, 'unknown'],
  ])('classifies HTTP %s', (status, kind) => {
    expect(normalizeApiError(apiError(status as number, {})).kind).toBe(kind);
  });
  it('recognizes instance errors before generic HTTP errors', () => {
    expect(normalizeApiError(apiError(403, { message: 'Your account is suspended' })).kind).toBe(
      'instance',
    );
    expect(
      normalizeApiError(apiError(400, { message: 'instance is starting or not authorized' }))
        .message,
    ).toContain('QR-код');
  });
  it('never exposes a token or raw response in the UI', () => {
    expect(normalizeApiError(apiError(500, 'secret-token-in-url')).message).not.toContain('secret');
    expect(normalizeApiError(new Error('secret-token')).message).not.toContain('secret');
  });
  it('preserves normalized errors and recognizes cancellation', () => {
    const error = new AppError('Текст', 'instance');
    expect(normalizeApiError(error)).toBe(error);
    expect(isRequestCancelled(new CanceledError())).toBe(true);
  });
  it('classifies a network timeout', () => {
    expect(normalizeApiError(new AxiosError('timeout', 'ECONNABORTED')).kind).toBe('network');
  });
  it('handles malformed JSON error payloads', () => {
    expect(normalizeApiError(apiError(500, { message: 123 })).kind).toBe('server');
    expect(normalizeApiError(apiError(403, null)).kind).toBe('auth');
  });
});
