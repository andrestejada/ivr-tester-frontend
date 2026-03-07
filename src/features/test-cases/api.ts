import httpClient from '@/lib/http/client';
import type { TestCase, CreateTestCaseInput, FlowStepInput } from './types';

export async function createTestCase(
  architectureId: string,
  data: CreateTestCaseInput
): Promise<void> {
  const payload = {
    name: data.name,
    flow_script: data.flow_script.map((step: FlowStepInput, index: number) => ({
      step: index + 1,
      listen: step.listen,
      ...(step.action ? { action: step.action } : {}),
    })),
  };
  await httpClient.post(
    `/api/v1/ivr-architectures/${architectureId}/test-cases`,
    payload
  );
}

export async function listTestCases(
  architectureId: string
): Promise<TestCase[]> {
  const response = await httpClient.get(
    `/api/v1/ivr-architectures/${architectureId}/test-cases`
  );
  return response.data;
}
