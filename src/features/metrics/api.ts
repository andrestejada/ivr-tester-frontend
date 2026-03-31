import httpClient from '@/lib/http/client'
import type { AnalyticsResponse, AnalyticsQueryParams } from './types'

/**
 * Fetch analytics for a specific IVR architecture
 * @param architectureId - The IVR architecture ID (required)
 * @param params - Optional query parameters (test_case_id, date_from, date_to, top_n, include)
 * @returns AnalyticsResponse with selected_context, summary, and trend
 */
export async function getAnalytics(
  architectureId: string,
  params: AnalyticsQueryParams = {}
): Promise<AnalyticsResponse> {
  // Build query string
  const queryParams = new URLSearchParams()

  if (params.test_case_id) {
    queryParams.append('test_case_id', params.test_case_id)
  }

  if (params.date_from) {
    queryParams.append('date_from', params.date_from)
  }

  if (params.date_to) {
    queryParams.append('date_to', params.date_to)
  }

  if (params.top_n) {
    queryParams.append('top_n', params.top_n.toString())
  }

  // include defaults to 'summary,trend' on backend, but we can be explicit
  if (params.include && params.include.length > 0) {
    queryParams.append('include', params.include.join(','))
  } else {
    // Explicitly request summary and trend if not specified
    queryParams.append('include', 'summary,trend')
  }

  const queryString = queryParams.toString()
  const url = `/api/v1/ivr-architectures/${architectureId}/test-cases/analytics${
    queryString ? `?${queryString}` : ''
  }`

  const response = await httpClient.get<AnalyticsResponse>(url)
  return response.data
}
