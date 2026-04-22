import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createIVRArchitecture,
  deleteIVRArchitecture,
  listIVRArchitectures,
  updateIVRArchitecture,
} from './api';
import { getErrorMessage } from '@/lib/helpers/getErrorMessage';
import type { IVRArchitecture, CreateIVRArchitectureInput } from './types';

export function useIVRArchitectures() {
  const { data, error, isError, isLoading } = useQuery<IVRArchitecture[]>({
    queryKey: ['ivr-architectures'],
    queryFn: listIVRArchitectures,
  });

  return {
    architectures: data ?? [],
    error,
    errorMessage: getErrorMessage(error) ?? '',
    isError,
    isLoading,
  };
}

export function useCreateIVRArchitecture() {
  const queryClient = useQueryClient();
  const { error, isError, mutateAsync, isPending } = useMutation({
    mutationFn: (data: CreateIVRArchitectureInput) => createIVRArchitecture(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ivr-architectures'] });
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

export function useUpdateIVRArchitecture() {
  const queryClient = useQueryClient();
  const { error, isError, mutateAsync, isPending } = useMutation({
    mutationFn: ({
      architectureId,
      data,
    }: {
      architectureId: string;
      data: Partial<CreateIVRArchitectureInput>;
    }) => updateIVRArchitecture(architectureId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ivr-architectures'] });
    },
  });

  return {
    update: mutateAsync,
    error,
    errorMessage: getErrorMessage(error) ?? '',
    isError,
    isLoading: isPending,
  };
}

export function useDeleteIVRArchitecture() {
  const queryClient = useQueryClient();
  const { error, isError, mutateAsync, isPending } = useMutation({
    mutationFn: (architectureId: string) => deleteIVRArchitecture(architectureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ivr-architectures'] });
    },
  });

  return {
    remove: mutateAsync,
    error,
    errorMessage: getErrorMessage(error) ?? '',
    isError,
    isLoading: isPending,
  };
}
