import type { Credentials } from '@/shared/api/instanceUrl';
export type Session =
  | { id: string; mode: 'demo'; credentials?: never }
  | { id: string; mode: 'live'; credentials: Credentials };
