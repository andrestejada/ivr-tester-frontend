import httpClient from '@/lib/http/client';
import type { IVRArchitecture, CreateIVRArchitectureInput } from './types';

export async function createIVRArchitecture(
  data: CreateIVRArchitectureInput
): Promise<IVRArchitecture> {
  const response = await httpClient.post('/api/v1/ivr-architectures', data);
  return response.data;
}

export async function listIVRArchitectures(): Promise<IVRArchitecture[]> {
  const response = await httpClient.get('/api/v1/ivr-architectures');
  return response.data;
}
