import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ExecutionDetailsPage } from '../pages/ExecutionDetailsPage';
import * as hookModule from '../hooks';

const mockUseTestExecutionDetails = vi.spyOn(hookModule, 'useTestExecutionDetails');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

function renderPage() {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/executions/arch-1/test-cases/tc-1/details/execution-1']}>
        <Routes>
          <Route
            path="/executions/:architectureId/test-cases/:testCaseId/details/:executionId"
            element={<ExecutionDetailsPage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('ExecutionDetailsPage', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  it('muestra el estado loading primero', async () => {
    mockUseTestExecutionDetails.mockReturnValue({
      executionDetails: undefined,
      isLoading: true,
      isError: false,
      error: null,
      errorMessage: '',
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByText(/cargando detalles de la ejecución/i)).toBeInTheDocument();
  });

  it('muestra error si la consulta falla', async () => {
    mockUseTestExecutionDetails.mockReturnValue({
      executionDetails: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Error de backend'),
      errorMessage: 'Error de backend',
      refetch: vi.fn(),
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/error al cargar/i)).toBeInTheDocument();
      expect(screen.getByText(/error de backend/i)).toBeInTheDocument();
    });
  });

  it('muestra información y logs cuando hay resultados', async () => {
    mockUseTestExecutionDetails.mockReturnValue({
      error: null,
      executionDetails: {
        id: 'execution-1',
        test_case_id: 'tc-1',
        status: 'PASSED',
        duration_seconds: 12,
        provider_call_sid: 'CS123',
        executed_at: new Date('2026-01-01T10:00:00.000Z').toISOString(),
        full_call_transcript: null,
        test_case: {
          id: 'tc-1',
          ivr_architecture_id: 'arch-1',
          name: 'TC 1',
          flow_script: [{ step: 1, listen: 'Hola', action: 'send_dtmf_1' }],
          created_at: new Date('2026-01-01T09:00:00.000Z').toISOString(),
          ivr_architecture: {
            id: 'arch-1',
            user_id: 'user-1',
            name: 'IVR Test',
            phone_number: '+123456789',
            provider: 'twilio',
            description: 'desc',
            created_at: new Date('2026-01-01T08:00:00.000Z').toISOString(),
          },
        },
        logs: [
          {
            id: 'log-1',
            execution_id: 'execution-1',
            step_number: 1,
            expected_text: 'Hola',
            actual_transcription: 'Hola',
            matched_excerpt: 'Hola',
            confidence_score: 98.56,
            action_taken: 'Sent DTMF: 1',
            created_at: new Date('2026-01-01T10:00:01.000Z').toISOString(),
          },
        ],
      },
      isLoading: false,
      isError: false,
      errorMessage: '',
      refetch: vi.fn(),
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/ejecución de prueba/i)).toBeInTheDocument();
      expect(screen.getByText(/tc 1/i)).toBeInTheDocument();
      expect(screen.getByText(/ivr test/i)).toBeInTheDocument();
      expect(screen.getByText(/98.56%/i)).toBeInTheDocument();
      expect(screen.getAllByText(/hola/i).length).toBeGreaterThanOrEqual(2);
    });
  });

  it('muestra mensaje de no coincidencia cuando el step falla', async () => {
    mockUseTestExecutionDetails.mockReturnValue({
      error: null,
      executionDetails: {
        id: 'execution-2',
        test_case_id: 'tc-2',
        status: 'FAILED',
        duration_seconds: 21,
        provider_call_sid: 'CS456',
        executed_at: new Date('2026-01-02T10:00:00.000Z').toISOString(),
        full_call_transcript: null,
        test_case: {
          id: 'tc-2',
          ivr_architecture_id: 'arch-1',
          name: 'TC 2',
          flow_script: [{ step: 1, listen: 'Texto esperado', action: null }],
          created_at: new Date('2026-01-02T09:00:00.000Z').toISOString(),
          ivr_architecture: {
            id: 'arch-1',
            user_id: 'user-1',
            name: 'IVR Test',
            phone_number: '+123456789',
            provider: 'twilio',
            description: 'desc',
            created_at: new Date('2026-01-01T08:00:00.000Z').toISOString(),
          },
        },
        logs: [
          {
            id: 'log-2',
            execution_id: 'execution-2',
            step_number: 1,
            expected_text: 'Texto esperado',
            actual_transcription: 'texto totalmente distinto',
            matched_excerpt: null,
            confidence_score: 32.11,
            action_taken: 'Failed text match',
            created_at: new Date('2026-01-02T10:00:01.000Z').toISOString(),
          },
        ],
      },
      isLoading: false,
      isError: false,
      errorMessage: '',
      refetch: vi.fn(),
    });

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByText('No se encontraron coincidencias. Revisa el texto ingresado')
      ).toBeInTheDocument();
      expect(screen.queryByText(/texto totalmente distinto/i)).not.toBeInTheDocument();
    });
  });
});
