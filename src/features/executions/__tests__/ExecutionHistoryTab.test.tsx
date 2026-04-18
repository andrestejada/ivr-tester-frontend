import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ExecutionHistoryTab } from '../ExecutionHistoryTab';
import * as executionHooks from '../hooks';
import * as columnsModule from '../columns';

vi.mock('../hooks');
vi.mock('../columns');
vi.mock('@/features/test-cases/DataTable', () => ({
  DataTable: ({
    data,
    isLoading,
    isEmpty,
  }: {
    data: Array<{ id: string }>;
    isLoading: boolean;
    isEmpty: boolean;
  }) => (
    <div>
      data-table:{data.length}:{String(isLoading)}:{String(isEmpty)}
    </div>
  ),
}));

const mockUseTestExecutions = vi.mocked(executionHooks.useTestExecutions);
const mockGetColumns = vi.mocked(columnsModule.getColumns);

describe('ExecutionHistoryTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetColumns.mockReturnValue([]);
    mockUseTestExecutions.mockReturnValue({
      executions: [],
      isLoading: false,
      isError: false,
      error: null,
      errorMessage: '',
      refetch: vi.fn(),
    });
  });

  it('muestra estado vacio cuando faltan arquitectura o caso de prueba', () => {
    render(<ExecutionHistoryTab architectureId={null} testCaseId={null} />);

    expect(
      screen.getByText(/selecciona una arquitectura y caso de prueba para ver el historial/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/data-table:/i)).not.toBeInTheDocument();
  });

  it('muestra banner de error cuando falla la carga del historial', () => {
    mockUseTestExecutions.mockReturnValue({
      executions: [],
      isLoading: false,
      isError: true,
      error: new Error('error de consulta'),
      errorMessage: 'Error de consulta en historial',
      refetch: vi.fn(),
    });

    render(<ExecutionHistoryTab architectureId="arch-1" testCaseId="tc-1" />);

    expect(screen.getByText(/error de consulta en historial/i)).toBeInTheDocument();
    expect(screen.getByText('data-table:0:false:true')).toBeInTheDocument();
  });

  it('renderiza tabla con columnas contextualizadas cuando hay seleccion valida', () => {
    mockUseTestExecutions.mockReturnValue({
      executions: [
        {
          id: 'exec-1',
          test_case_id: 'tc-1',
          status: 'PASSED',
          duration_seconds: 12,
          provider_call_sid: null,
          executed_at: '2026-01-01T10:00:00Z',
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
      errorMessage: '',
      refetch: vi.fn(),
    });

    render(<ExecutionHistoryTab architectureId="arch-1" testCaseId="tc-1" />);

    expect(mockGetColumns).toHaveBeenCalledWith('arch-1', 'tc-1');
    expect(screen.getByText('data-table:1:false:false')).toBeInTheDocument();
  });
});
