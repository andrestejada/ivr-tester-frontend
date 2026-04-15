import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NewExecutionTab } from '../NewExecutionTab';
import type { ExecutionProgressState } from '../types';
import type { IVRArchitecture } from '@/features/ivr-architectures/types';
import type { TestCase } from '@/features/test-cases/types';
import * as executionHooks from '../hooks';
import * as websocketHooks from '@/hooks/useExecutionWebSocket';

vi.mock('../hooks');
vi.mock('@/hooks/useExecutionWebSocket');
vi.mock('../components/ExecutionRealtimeProgress', () => ({
  ExecutionRealtimeProgress: ({ state }: { state: ExecutionProgressState }) => (
    <div data-testid="realtime-progress">Realtime:{state.execution_id ?? 'none'}</div>
  ),
}));

const architecture: IVRArchitecture = {
  id: 'arch-1',
  name: 'Emcali',
  phone_number: '+576025240177',
  description: 'Arquitectura de prueba',
  user_id: 'user-1',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

const testCaseA: TestCase = {
  id: 'tc-a',
  ivr_architecture_id: 'arch-1',
  name: 'menu principal',
  created_at: '2026-01-01T00:00:00Z',
  flow_script: [{ step: 1, listen: 'Bienvenido', action: 'send_dtmf_1' }],
};

const testCaseB: TestCase = {
  id: 'tc-b',
  ivr_architecture_id: 'arch-1',
  name: 'consulta saldo',
  created_at: '2026-01-01T00:00:00Z',
  flow_script: [{ step: 1, listen: 'Saldo', action: 'send_dtmf_2' }],
};

function createWsState(executionId: string | null): ExecutionProgressState {
  return {
    execution_id: executionId,
    global_status: executionId ? 'running' : 'pending',
    duration_seconds: null,
    steps: [],
    accumulated_transcript: '',
    is_terminal: Boolean(executionId),
    terminal_error_message: null,
    ws_connection_status: executionId ? 'connected' : 'disconnected',
  };
}

describe('NewExecutionTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(websocketHooks.useExecutionWebSocket).mockImplementation((executionId) => ({
      state: createWsState(executionId),
      isConnected: Boolean(executionId),
      connectionStatus: executionId ? 'connected' : 'disconnected',
      error: null,
      isTerminal: Boolean(executionId),
    }));
  });

  it('limpia la ejecución activa cuando cambia el caso de prueba', async () => {
    const executeMock = vi.fn().mockResolvedValue({
      id: 'exec-1',
      test_case_id: testCaseA.id,
      status: 'RUNNING',
      duration_seconds: null,
      provider_call_sid: null,
      executed_at: '2026-01-01T10:00:00Z',
    });
    const resetMock = vi.fn();

    vi.mocked(executionHooks.useCreateTestExecution).mockReturnValue({
      execute: executeMock,
      error: null,
      errorMessage: '',
      isError: false,
      isLoading: false,
      isSuccess: false,
      reset: resetMock,
    });

    const user = userEvent.setup();
    const { rerender } = render(
      <NewExecutionTab architecture={architecture} testCaseId={testCaseA.id} testCase={testCaseA} />
    );

    await user.click(screen.getByRole('button', { name: /ejecutar prueba/i }));

    await waitFor(() => {
      expect(executeMock).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByTestId('realtime-progress')).toHaveTextContent('Realtime:exec-1');
    });

    const resetCallsBeforeChange = resetMock.mock.calls.length;

    rerender(
      <NewExecutionTab architecture={architecture} testCaseId={testCaseB.id} testCase={testCaseB} />
    );

    await waitFor(() => {
      expect(screen.queryByTestId('realtime-progress')).not.toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /ejecutar prueba/i })).toBeInTheDocument();
    expect(resetMock.mock.calls.length).toBeGreaterThan(resetCallsBeforeChange);
  });

  it('vuelve a estado pre-ejecución al presionar Nueva Ejecución', async () => {
    const executeMock = vi.fn().mockResolvedValue({
      id: 'exec-2',
      test_case_id: testCaseA.id,
      status: 'RUNNING',
      duration_seconds: null,
      provider_call_sid: null,
      executed_at: '2026-01-01T11:00:00Z',
    });
    const resetMock = vi.fn();

    vi.mocked(executionHooks.useCreateTestExecution).mockReturnValue({
      execute: executeMock,
      error: null,
      errorMessage: '',
      isError: false,
      isLoading: false,
      isSuccess: false,
      reset: resetMock,
    });

    const user = userEvent.setup();
    render(<NewExecutionTab architecture={architecture} testCaseId={testCaseA.id} testCase={testCaseA} />);

    await user.click(screen.getByRole('button', { name: /ejecutar prueba/i }));

    await waitFor(() => {
      expect(screen.getByTestId('realtime-progress')).toHaveTextContent('Realtime:exec-2');
    });

    await user.click(screen.getByRole('button', { name: /nueva ejecución/i }));

    await waitFor(() => {
      expect(screen.queryByTestId('realtime-progress')).not.toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /ejecutar prueba/i })).toBeInTheDocument();
  });
});
