import axios from 'axios';
import { isRequestCancelled, normalizeApiError } from './errors';

export const apiClient = axios.create({ timeout: 40_000 });
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(isRequestCancelled(error) ? error : normalizeApiError(error)),
);
