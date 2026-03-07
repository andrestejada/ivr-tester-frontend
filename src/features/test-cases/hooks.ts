import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTestCase, listTestCases } from './api';
import { getErrorMessage } from '@/lib/helpers/getErrorMessage';
import type { TestCase, CreateTestCaseInput } from './types';

export function useTestCases(architectureId: string | null) {
  const { data, error, isError, isLoading } = useQuery<TestCase[]>({
    queryKey: ['test-cases', architectureId],
    queryFn: () => listTestCases(architectureId!),
    enabled: !!architectureId,
  });

  return {
    testCases: data ?? [],
    error,
    errorMessage: getErrorMessage(error) ?? '',
    isError,
    isLoading,
  };
}

export function useCreateTestCase(architectureId: string | null) {
  const queryClient = useQueryClient();
  const { error, isError, mutateAsync, isPending } = useMutation({
    mutationFn: (data: CreateTestCaseInput) =>
      createTestCase(architectureId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['test-cases', architectureId],
      });
    },
  });

  return {
    create: mutateAsync,
    error,
    errorMessage: getErrorMessage(error) ?? '',
    isError,
    isLoading: isPending,
  };
}
