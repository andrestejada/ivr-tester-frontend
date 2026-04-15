/**
 * Reducer puro para mapear eventos WebSocket a estado de progreso de pasos.
 * 
 * No tiene side effects. Solo transforma datos.
 */

import type {
  ExecutionProgressState,
  ExecutionWebSocketEvent,
  StepProgress,
} from '../types';
import type { FlowStep } from '@/features/test-cases/types';

export interface ResetProgressAction {
  type: '__reset__';
  execution_id: string | null;
  flow_script: FlowStep[];
}

export type ProgressReducerAction = ExecutionWebSocketEvent | ResetProgressAction;

function isResetProgressAction(action: ProgressReducerAction): action is ResetProgressAction {
  return (action as ResetProgressAction).type === '__reset__';
}

/**
 * Estado inicial de progreso para una ejecución
 */
export function createInitialProgressState(
  executionId: string,
  flowScript: FlowStep[]
): ExecutionProgressState {
  const steps: StepProgress[] = flowScript.map((step, idx) => ({
    step_number: step.step || idx + 1,
    expected_text: step.listen || '',
    status: 'pending',
    current_transcription: '',
    confidence: null,
    failure_reason: null,
    is_finalized: false,
  }));

  return {
    execution_id: executionId,
    global_status: 'pending',
    duration_seconds: null,
    steps,
    accumulated_transcript: '',
    is_terminal: false,
    terminal_error_message: null,
    ws_connection_status: 'disconnected',
  };
}

/**
 * Reducer que toma el estado actual y un evento, retorna nuevo estado.
 */
export function progressReducer(
  state: ExecutionProgressState,
  action: ProgressReducerAction
): ExecutionProgressState {
  if (isResetProgressAction(action)) {
    return createInitialProgressState(action.execution_id || '', action.flow_script || []);
  }

  const event: ExecutionWebSocketEvent = action;
  console.log(`[Reducer] Procesando evento: ${event.event_type}`, event.data);

  switch (event.event_type) {
    case 'execution_started':
      return {
        ...state,
        global_status: 'running',
      };

    case 'transcript_partial': {
      const data = event.data as { text: string; is_final: false };
      // Buscar el step en estado 'running' (no ya procesado)
      const activeStepIdx = state.steps.findIndex((s) => s.status === 'running');
      if (activeStepIdx === -1) return state;

      const newSteps = [...state.steps];
      newSteps[activeStepIdx] = {
        ...newSteps[activeStepIdx],
        status: 'running',
        current_transcription: data.text,
      };

      return {
        ...state,
        steps: newSteps,
        accumulated_transcript: state.accumulated_transcript + data.text,
      };
    }

    case 'transcript_final': {
      const data = event.data as { text: string; is_final: true };
      // Buscar el step en estado 'running' (no ya procesado)
      const activeStepIdx = state.steps.findIndex((s) => s.status === 'running');
      if (activeStepIdx === -1) return state;

      const newSteps = [...state.steps];
      newSteps[activeStepIdx] = {
        ...newSteps[activeStepIdx],
        status: 'running',
        current_transcription: data.text,
      };

      return {
        ...state,
        steps: newSteps,
        accumulated_transcript: state.accumulated_transcript + data.text,
      };
    }

    case 'step_started': {
      const data = event.data as { step_number: number; expected_text: string };
      const stepIdx = state.steps.findIndex((s) => s.step_number === data.step_number);
      if (stepIdx === -1) return state;

      const newSteps = [...state.steps];
      newSteps[stepIdx] = {
        ...newSteps[stepIdx],
        status: 'running',
        current_transcription: '',
        confidence: null,
        failure_reason: null,
      };

      return {
        ...state,
        steps: newSteps,
      };
    }

    case 'step_matched': {
      const data = event.data as {
        step_number: number;
        matched_text: string;
        confidence: number;
      };
      const stepIdx = state.steps.findIndex((s) => s.step_number === data.step_number);
      if (stepIdx === -1) return state;

      const newSteps = [...state.steps];
      newSteps[stepIdx] = {
        ...newSteps[stepIdx],
        status: 'passed',
        current_transcription: data.matched_text,
        confidence: data.confidence,
        failure_reason: null,
      };

      return {
        ...state,
        steps: newSteps,
      };
    }

    case 'step_failed': {
      const data = event.data as {
        step_number: number;
        expected_text: string;
        actual_text: string | null;
        reason: string;
      };
      const stepIdx = state.steps.findIndex((s) => s.step_number === data.step_number);
      if (stepIdx === -1) return state;

      const newSteps = [...state.steps];
      newSteps[stepIdx] = {
        ...newSteps[stepIdx],
        status: 'failed',
        current_transcription: data.actual_text || '',
        failure_reason: data.reason,
      };

      return {
        ...state,
        steps: newSteps,
      };
    }

    case 'step_logged': {
      const data = event.data as { step_number: number };
      const stepIdx = state.steps.findIndex((s) => s.step_number === data.step_number);
      if (stepIdx === -1) return state;

      const newSteps = [...state.steps];
      newSteps[stepIdx] = {
        ...newSteps[stepIdx],
        is_finalized: true,
      };

      return {
        ...state,
        steps: newSteps,
      };
    }

    case 'execution_finished': {
      const data = event.data as { status: 'PASSED' | 'FAILED'; duration_seconds: number };
      const genericFailedMessage = 'La prueba finalizó con uno o más pasos fallidos.';
      return {
        ...state,
        global_status: data.status === 'PASSED' ? 'passed' : 'failed',
        duration_seconds: data.duration_seconds,
        terminal_error_message:
          data.status === 'PASSED' ? null : state.terminal_error_message || genericFailedMessage,
        is_terminal: true,
      };
    }

    case 'execution_error': {
      const data = event.data as {
        status: 'ERROR';
        error_message: string;
        duration_seconds: number;
      };
      return {
        ...state,
        global_status: 'error',
        duration_seconds: data.duration_seconds,
        terminal_error_message: data.error_message || 'Ocurrió un error inesperado. Intenta de nuevo.',
        is_terminal: true,
      };
    }

    default:
      // Eventos no procesados
      return state;
  }
}

/**
 * Helper: aplica una lista de eventos secuencialmente al estado
 */
export function applyEvents(
  initialState: ExecutionProgressState,
  events: ExecutionWebSocketEvent[]
): ExecutionProgressState {
  return events.reduce((state, event) => progressReducer(state, event), initialState);
}
