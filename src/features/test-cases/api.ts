import httpClient from '@/lib/http/client';
import type { TestCase, CreateTestCaseInput, FlowStepInput } from './types';

function buildFlowScriptPayload(flowScript: FlowStepInput[]) {
  return flowScript.map((step: FlowStepInput, index: number) => ({
    step: index + 1,
    listen: step.listen,
    ...(step.action ? { action: step.action } : {}),
  }));
}

export async function createTestCase(
  architectureId: string,
  data: CreateTestCaseInput
): Promise<void> {
  const payload = {
    name: data.name,
    flow_script: buildFlowScriptPayload(data.flow_script),
  };
  await httpClient.post(
    `/api/v1/ivr-architectures/${architectureId}/test-cases`,
    payload
  );
}

export async function updateTestCase(
  architectureId: string,
  testCaseId: string,
  data: Partial<CreateTestCaseInput>
): Promise<void> {
  const payload: Record<string, unknown> = {};
  
  if (data.name) {
    payload.name = data.name;
  }
  
  if (data.flow_script) {
    payload.flow_script = buildFlowScriptPayload(data.flow_script);
  }
  
  await httpClient.put(
    `/api/v1/ivr-architectures/${architectureId}/test-cases/${testCaseId}`,
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
