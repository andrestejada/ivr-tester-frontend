import { describe, expect, it } from 'vitest';

import { createInitialProgressState, progressReducer } from '../progressReducer';
import type { ExecutionWebSocketEvent } from '../../types';
import type { FlowStep } from '@/features/test-cases/types';

const flowScriptA: FlowStep[] = [
  { step: 1, listen: 'Bienvenido' },
  { step: 2, listen: 'Opción uno' },
];

const flowScriptB: FlowStep[] = [{ step: 1, listen: 'Opción dos' }];

function createEvent<T>(
  event_type: ExecutionWebSocketEvent<T>['event_type'],
  data: T
): ExecutionWebSocketEvent<T> {
  return {
    event_type,
    execution_id: 'exec-1',
    timestamp: '2026-01-01T00:00:00Z',
    data,
    schema_version: 'v1',
  };
}

describe('progressReducer reset behavior', () => {
  it('reinicia todo el estado al cambiar de ejecución', () => {
    let state = createInitialProgressState('exec-1', flowScriptA);

    state = progressReducer(state, createEvent('execution_started', { status: 'RUNNING' }));
    state = progressReducer(
      state,
      createEvent('step_started', {
        step_number: 1,
        expected_text: 'Bienvenido',
      })
    );
    state = progressReducer(state, createEvent('transcript_final', { text: 'Bienvenido', is_final: true }));
    state = progressReducer(
      state,
      createEvent('execution_finished', {
        status: 'FAILED',
        duration_seconds: 20,
      })
    );

    expect(state.global_status).toBe('failed');
    expect(state.is_terminal).toBe(true);
    expect(state.accumulated_transcript).toContain('Bienvenido');

    const resetState = progressReducer(state, {
      type: '__reset__',
      execution_id: 'exec-2',
      flow_script: flowScriptB,
    });

    expect(resetState.execution_id).toBe('exec-2');
    expect(resetState.global_status).toBe('pending');
    expect(resetState.is_terminal).toBe(false);
    expect(resetState.duration_seconds).toBeNull();
    expect(resetState.accumulated_transcript).toBe('');
    expect(resetState.terminal_error_message).toBeNull();
    expect(resetState.steps).toHaveLength(1);
    expect(resetState.steps[0].step_number).toBe(1);
    expect(resetState.steps[0].expected_text).toBe('Opción dos');
    expect(resetState.steps[0].status).toBe('pending');
  });
});
