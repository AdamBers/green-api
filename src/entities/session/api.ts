import { apiClient } from '@/shared/api/client';
import { instanceUrl, type Credentials } from '@/shared/api/instanceUrl';

export async function getInstanceState(
  credentials: Credentials,
  signal?: AbortSignal,
): Promise<string> {
  const { data } = await apiClient.get<{ stateInstance: string }>(
    instanceUrl(credentials, 'getStateInstance'),
    { signal },
  );
  return data.stateInstance;
}
