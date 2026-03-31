import { useQuery } from '@tanstack/react-query'
import { getAnalytics } from './api'
import { getErrorMessage } from '@/lib/helpers/getErrorMessage'
import type { AnalyticsResponse, AnalyticsQueryParams } from './types'

/**
 * Hook to fetch analytics for a specific architecture
 * @param architectureId - The IVR architecture ID (null to disable query)
 * @param params - Optional query parameters for filtering
 * @returns Object with analytics data, loading and error states
 */
export function useAnalytics(
  architectureId: string | null,
  params: AnalyticsQueryParams = {}
) {
  const { data, error, isError, isLoading, refetch } = useQuery<AnalyticsResponse>({
    queryKey: [
      'analytics',
      architectureId,
      params.test_case_id,
      params.date_from,
      params.date_to,
      params.include?.join(','),
    ],
    queryFn: () => getAnalytics(architectureId!, params),
    enabled: !!architectureId,
    staleTime: 1000 * 300, // 5 minutes
  })

  return {
    analytics: data,
    error,
    errorMessage: getErrorMessage(error) ?? '',
    isError,
    isLoading,
    refetch,
  }
}
