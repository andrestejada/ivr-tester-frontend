import { renderHook, waitFor, type RenderHookResult } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAnalytics } from '../hooks'
import * as api from '../api'

vi.mock('../api')

const mockGetAnalytics = vi.mocked(api.getAnalytics)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

function renderHookWithQuery<T>(hook: () => T): RenderHookResult<T, void> {
  return renderHook(hook, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    ),
  })
}

describe('useAnalytics Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
  })

  it('debería retornar undefined cuando architectureId es null', () => {
    const { result } = renderHookWithQuery(() => useAnalytics(null))

    expect(result.current.analytics).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
    expect(mockGetAnalytics).not.toHaveBeenCalled()
  })

  it('debería cargar analytics cuando architectureId está disponible', async () => {
    const mockData = {
      selected_context: {
        architecture_id: '123',
        architecture_name: 'Test Arch',
        test_case_id: null,
        test_case_name: null,
        date_from: '2026-03-23',
        date_to: '2026-03-30',
      },
      summary: {
        total_executions: 10,
        passed_count: 8,
        failed_count: 2,
        error_count: 0,
        running_count: 0,
        success_rate: 80,
        failure_rate: 20,
        avg_duration_seconds: 15.5,
      },
      trend: [
        { date: '2026-03-23', total: 2, passed: 2, failed: 0, error_count: 0 },
        { date: '2026-03-24', total: 3, passed: 2, failed: 1, error_count: 0 },
      ],
      rankings: null,
    }

    mockGetAnalytics.mockResolvedValueOnce(mockData)

    const { result } = renderHookWithQuery(() => useAnalytics('123'))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.analytics).toEqual(mockData)
    expect(mockGetAnalytics).toHaveBeenCalledWith('123', {})
  })

  it('debería pasar filtros al getAnalytics', async () => {
    const mockData = {
      selected_context: {
        architecture_id: '123',
        architecture_name: 'Test Arch',
        test_case_id: '456',
        test_case_name: 'Test Case',
        date_from: '2026-03-20',
        date_to: '2026-03-30',
      },
      summary: null,
      trend: [],
      rankings: null,
    }

    mockGetAnalytics.mockResolvedValueOnce(mockData)

    const params = {
      test_case_id: '456',
      date_from: '2026-03-20',
      date_to: '2026-03-30',
    }

    const { result } = renderHookWithQuery(() => useAnalytics('123', params))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockGetAnalytics).toHaveBeenCalledWith('123', params)
    expect(result.current.analytics).toEqual(mockData)
  })

  it('debería manejar errores correctamente', async () => {
    const errorMessage = 'Error al obtener analíticas'
    mockGetAnalytics.mockRejectedValueOnce(
      new Error(errorMessage)
    )

    const { result } = renderHookWithQuery(() => useAnalytics('123'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.isError).toBe(true)
  })
})
