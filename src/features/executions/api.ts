import httpClient from '@/lib/http/client';
import type { TestExecution } from '@/features/test-cases/types';
import type { TestExecutionDetailsResponse } from './types';

export interface ExecuteTestCaseRequest {
  phone_number: string;
}

export interface ExecuteTestCaseResponse {
  id: string;
  test_case_id: string;
  status: 'PASSED' | 'FAILED' | 'ERROR' | 'RUNNING';
  duration_seconds: number | null;
  provider_call_sid: string | null;
  executed_at: string;
}

/**
 * List all test executions for a specific test case
 * @param architectureId - The IVR architecture ID
 * @param testCaseId - The test case ID
 * @returns Array of test executions
 */
export async function listTestExecutions(
  architectureId: string,
  testCaseId: string
): Promise<TestExecution[]> {
  const response = await httpClient.get(
    `/api/v1/ivr-architectures/${architectureId}/test-cases/${testCaseId}/executions`
  );
  return response.data;
}

/**
 * Execute a specific test case
 * @param architectureId - The IVR architecture ID
 * @param testCaseId - The test case ID
 * @param request - The execution request with phone_number
 * @returns The created execution response
 */
export async function executeTestCase(
  architectureId: string,
  testCaseId: string,
  request: ExecuteTestCaseRequest
): Promise<ExecuteTestCaseResponse> {
  const response = await httpClient.post(
    `/api/v1/ivr-architectures/${architectureId}/test-cases/${testCaseId}/executions`,
    request
  );
  return response.data;
}

/**
 * Get detailed information about a specific test execution
 * @param architectureId - The IVR architecture ID
 * @param testCaseId - The test case ID
 * @param executionId - The execution ID
 * @returns The execution details with logs and test case info
 */
export async function getTestExecutionDetails(
  architectureId: string,
  testCaseId: string,
  executionId: string
): Promise<TestExecutionDetailsResponse> {
  const response = await httpClient.get(
    `/api/v1/ivr-architectures/${architectureId}/test-cases/${testCaseId}/executions/${executionId}`
  );
  return response.data;
}
