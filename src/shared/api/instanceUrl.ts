export type Credentials = { apiUrl: string; idInstance: string; apiTokenInstance: string };

export function instanceUrl(credentials: Credentials, method: string): string {
  return `${credentials.apiUrl.replace(/\/$/, '')}/waInstance${credentials.idInstance}/${method}/${credentials.apiTokenInstance}`;
}
