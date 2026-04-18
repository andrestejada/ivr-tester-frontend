import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MetricsPage } from '../MetricsPage'
import * as architecturesHooks from '@/features/ivr-architectures/hooks'
import * as testCasesHooks from '@/features/test-cases/hooks'
import * as metricsHooks from '../hooks'

vi.mock('@/features/ivr-architectures/hooks')
vi.mock('@/features/test-cases/hooks')
vi.mock('../hooks')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

function renderPage() {
  return render(
    <QueryClientProvider client={queryClient}>
      <MetricsPage />
    </QueryClientProvider>
  )
}

describe('MetricsPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
  })

  it('debería renderizar la página con título y filtros', () => {
    vi.mocked(architecturesHooks.useIVRArchitectures).mockReturnValueOnce({
      architectures: [],
      error: null,
      errorMessage: '',
      isError: false,
      isLoading: false,
    })

    vi.mocked(testCasesHooks.useTestCases).mockReturnValueOnce({
      testCases: [],
      error: null,
      errorMessage: '',
      isError: false,
      isLoading: false,
    })

    vi.mocked(metricsHooks.useAnalytics).mockReturnValueOnce({
      analytics: undefined,
      error: null,
      errorMessage: '',
      isError: false,
      isLoading: false,
      refetch: vi.fn(),
    })

    renderPage()

    expect(screen.getByText('Métricas')).toBeInTheDocument()
    expect(screen.getByText(/Analiza el desempeño/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Arquitectura IVR/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Caso de Prueba/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Desde/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Hasta/i)).toBeInTheDocument()
  })

  it('debería mostrar empty state cuando no hay arquitectura seleccionada', () => {
    vi.mocked(architecturesHooks.useIVRArchitectures).mockReturnValueOnce({
      architectures: [],
      error: null,
      errorMessage: '',
      isError: false,
      isLoading: false,
    })

    vi.mocked(testCasesHooks.useTestCases).mockReturnValueOnce({
      testCases: [],
      error: null,
      errorMessage: '',
      isError: false,
      isLoading: false,
    })

    vi.mocked(metricsHooks.useAnalytics).mockReturnValueOnce({
      analytics: undefined,
      error: null,
      errorMessage: '',
      isError: false,
      isLoading: false,
      refetch: vi.fn(),
    })

    renderPage()

    expect(
      screen.getByText(/Selecciona una arquitectura para ver las métricas/i)
    ).toBeInTheDocument()
  })

  it('debería cargar architecturas en el selector', async () => {
    const mockArchitectures = [
      { id: '1', name: 'Arch 1', phone_number: '573001111111', user_id: 'user-1', created_at: '', updated_at: '' },
      { id: '2', name: 'Arch 2', phone_number: '573002222222', user_id: 'user-1', created_at: '', updated_at: '' },
    ]

    vi.mocked(architecturesHooks.useIVRArchitectures).mockReturnValueOnce({
      architectures: mockArchitectures,
      error: null,
      errorMessage: '',
      isError: false,
      isLoading: false,
    })

    vi.mocked(testCasesHooks.useTestCases).mockReturnValueOnce({
      testCases: [],
      error: null,
      errorMessage: '',
      isError: false,
      isLoading: false,
    })

    vi.mocked(metricsHooks.useAnalytics).mockReturnValueOnce({
      analytics: undefined,
      error: null,
      errorMessage: '',
      isError: false,
      isLoading: false,
      refetch: vi.fn(),
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Arch 1' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Arch 2' })).toBeInTheDocument()
    })
  })

  it('debería mostrar summary cards cuando hay datos', async () => {
    const mockAnalytics = {
      selected_context: {
        architecture_id: '1',
        architecture_name: 'Arch 1',
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
      trend: [],
      rankings: null,
    }

    vi.mocked(architecturesHooks.useIVRArchitectures).mockReturnValue({
      architectures: [
        { id: '1', name: 'Arch 1', phone_number: '573001111111', user_id: 'user-1', created_at: '', updated_at: '' },
      ],
      error: null,
      errorMessage: '',
      isError: false,
      isLoading: false,
    })

    vi.mocked(testCasesHooks.useTestCases).mockReturnValue({
      testCases: [],
      error: null,
      errorMessage: '',
      isError: false,
      isLoading: false,
    })

    vi.mocked(metricsHooks.useAnalytics).mockReturnValue({
      analytics: mockAnalytics,
      error: null,
      errorMessage: '',
      isError: false,
      isLoading: false,
      refetch: vi.fn(),
    })

    const user = userEvent.setup()
    renderPage()

    // Seleccionar arquitectura
    const archSelect = screen.getByLabelText(/arquitectura ivr/i)
    await user.selectOptions(archSelect, '1')

    await waitFor(() => {
      expect((archSelect as HTMLSelectElement).value).toBe('1')
    })

    await waitFor(() => {
      expect(screen.getByText(/^Total$/i)).toBeInTheDocument()
      expect(screen.getByText(/Exitosas/i)).toBeInTheDocument()
      expect(screen.getByText(/Fallidas/i)).toBeInTheDocument()
      expect(screen.getByText(/Errores/i)).toBeInTheDocument()
    })
  })
})
