/**
 * Analytics types mapped from backend AnalyticsResponse DTO.
 */

export interface SelectedContext {
  architecture_id: string | null
  architecture_name: string | null
  test_case_id: string | null
  test_case_name: string | null
  date_from: string // ISO8601
  date_to: string // ISO8601
}

export interface Summary {
  total_executions: number
  passed_count: number
  failed_count: number
  error_count: number
  running_count: number
  success_rate: number // 0-100
  failure_rate: number // 0-100
  avg_duration_seconds: number | null
}

export interface TrendPoint {
  date: string // YYYY-MM-DD
  total: number
  passed: number
  failed: number
  error_count: number
}

export interface RankingItem {
  test_case_id: string
  test_case_name: string
  execution_count: number
  passed_count: number
  failed_count: number
  error_count: number
  success_rate: number // 0-100
  failure_rate: number // 0-100
  avg_duration_seconds: number
}

export interface Rankings {
  top_failed: RankingItem[]
  top_success: RankingItem[]
}

export interface AnalyticsResponse {
  selected_context: SelectedContext
  summary: Summary | null
  trend: TrendPoint[] | null
  rankings: Rankings | null
}

/**
 * Query parameters for analytics endpoint.
 * Accepts optional filters; backend applies defaults.
 */
export interface AnalyticsQueryParams {
  test_case_id?: string
  date_from?: string
  date_to?: string
  top_n?: number
  include?: string[] // default: ['summary', 'trend']
}
