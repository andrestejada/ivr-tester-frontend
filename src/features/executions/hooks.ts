import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listTestExecutions, executeTestCase, getTestExecutionDetails } from './api';
import type { ExecuteTestCaseRequest } from './api';
import { getErrorMessage } from '@/lib/helpers/getErrorMessage';
import type { TestExecution } from '@/features/test-cases/types';
import type { TestExecutionDetailsResponse } from './types';

/**
 * Hook to fetch test executions for a specific test case
 * @param architectureId - The IVR architecture ID (null to disable query)
 * @param testCaseId - The test case ID (null to disable query)
 * @returns Object with executions data, loading and error states
 */
export function useTestExecutions(architectureId: string | null, testCaseId: string | null) {
  const { data, error, isError, isLoading, refetch } = useQuery<TestExecution[]>({
    queryKey: ['test-executions', architectureId, testCaseId],
    queryFn: () => listTestExecutions(architectureId!, testCaseId!),
    enabled: !!architectureId && !!testCaseId,
  });

  return {
    executions: data ?? [],
    error,
    errorMessage: getErrorMessage(error) ?? '',
    isError,
    isLoading,
    refetch,
  };
}

/**
 * Hook to create and execute a new test execution (mutation)
 * @param architectureId - The IVR architecture ID
 * @param testCaseId - The test case ID
 * @returns Object with execute function, loading and error states
 */
export function useCreateTestExecution(architectureId: string | null, testCaseId: string | null) {
  const queryClient = useQueryClient();
  const { error, isError, mutateAsync, isPending, isSuccess, reset } = useMutation({
    mutationFn: (request: ExecuteTestCaseRequest) =>
      executeTestCase(architectureId!, testCaseId!, request),
    onSuccess: () => {
      // Invalidate the test executions query to refresh the history
      queryClient.invalidateQueries({
        queryKey: ['test-executions', architectureId, testCaseId],
      });
    },
  });

  return {
    execute: mutateAsync,
    error,
    errorMessage: getErrorMessage(error) ?? '',
    isError,
    isLoading: isPending,
    isSuccess,
    reset,
  };
}

/**
 * Hook to fetch detailed information about a specific test execution
 * @param architectureId - The IVR architecture ID (null to disable query)
 * @param testCaseId - The test case ID (null to disable query)
 * @param executionId - The execution ID (null to disable query)
 * @returns Object with execution details, loading and error states
 */
export function useTestExecutionDetails(
  architectureId: string | null,
  testCaseId: string | null,
  executionId: string | null
) {
  const { data, error, isError, isLoading, refetch } = useQuery<TestExecutionDetailsResponse>({
    queryKey: ['test-execution-details', architectureId, testCaseId, executionId],
    queryFn: () => getTestExecutionDetails(architectureId!, testCaseId!, executionId!),
    enabled: !!architectureId && !!testCaseId && !!executionId,
  });

  return {
    executionDetails: data,
    error,
    errorMessage: getErrorMessage(error) ?? '',
    isError,
    isLoading,
    refetch,
  };
}
