import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RealtimeTranscriptChat } from '../RealtimeTranscriptChat';
import type { ExecutionProgressState, StepProgress } from '../../types';

function createState(
  steps: StepProgress[],
  accumulatedTranscript = steps
    .map((step) => step.current_transcription.trim())
    .filter(Boolean)
    .join(' '),
  overrides: Partial<ExecutionProgressState> = {}
): ExecutionProgressState {
  return {
    execution_id: 'exec-1',
    global_status: 'running',
    duration_seconds: null,
    steps,
    accumulated_transcript: accumulatedTranscript,
    is_terminal: false,
    terminal_error_message: null,
    ws_connection_status: 'connected',
    ...overrides,
  };
}

describe('RealtimeTranscriptChat', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('muestra estado vacío cuando aún no hay transcripción y la ejecución sigue en curso', () => {
    const state = createState([
      {
        step_number: 1,
        expected_text: 'Bienvenido',
        status: 'pending',
        current_transcription: '',
        confidence: null,
        failure_reason: null,
        is_finalized: false,
      },
    ]);

    render(<RealtimeTranscriptChat state={state} />);

    expect(screen.getByText('Transcripción en vivo')).toBeInTheDocument();
    expect(screen.getByText('Escuchando')).toBeInTheDocument();
    expect(screen.getByText('Aún no hay transcripción para mostrar.')).toBeInTheDocument();
  });

  it('muestra sin actividad cuando la ejecución ya terminó', () => {
    const state = createState(
      [
        {
          step_number: 1,
          expected_text: 'Bienvenido',
          status: 'passed',
          current_transcription: 'bienvenido al sistema',
          confidence: 97,
          failure_reason: null,
          is_finalized: true,
        },
      ],
      'bienvenido al sistema',
      {
        global_status: 'passed',
        is_terminal: true,
      }
    );

    render(<RealtimeTranscriptChat state={state} />);

    expect(screen.getByText('Sin actividad')).toBeInTheDocument();
    expect(screen.queryByText('Escuchando')).not.toBeInTheDocument();
  });

  it('muestra escuchando cuando hay transcripción en ejecución aunque no haya step running', () => {
    const state = createState(
      [
        {
          step_number: 1,
          expected_text: 'Bienvenido',
          status: 'passed',
          current_transcription: 'bienvenido al sistema',
          confidence: 97,
          failure_reason: null,
          is_finalized: true,
        },
      ],
      'bienvenido al sistema'
    );

    render(<RealtimeTranscriptChat state={state} />);

    expect(screen.getByText('Escuchando')).toBeInTheDocument();
    expect(screen.queryByText('Sin actividad')).not.toBeInTheDocument();
  });

  it('muestra de inmediato el nuevo evento y completa con typing continuo', () => {
    vi.useFakeTimers();

    const state = createState([
      {
        step_number: 1,
        expected_text: 'Bienvenido',
        status: 'passed',
        current_transcription: 'bienvenido al sistema',
        confidence: 98,
        failure_reason: null,
        is_finalized: true,
      },
      {
        step_number: 2,
        expected_text: 'Seleccione opción',
        status: 'running',
        current_transcription: 'opcion uno saldo',
        confidence: null,
        failure_reason: null,
        is_finalized: false,
      },
    ]);

    render(<RealtimeTranscriptChat state={state} />);

    const streamContainer = screen.getByTestId('realtime-transcript-scroll');
    expect(screen.getByText('Escuchando')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(20);
    });

    expect(streamContainer.textContent?.trim().length).toBeGreaterThan(0);
    expect(streamContainer.textContent?.includes('bienven')).toBe(true);

    act(() => {
      vi.runAllTimers();
    });

    expect(streamContainer).toHaveTextContent('bienvenido al sistema opcion uno saldo');
  });

  it('acumula texto entre eventos sin esperar a que termine el evento previo', () => {
    vi.useFakeTimers();

    const initialState = createState([
      {
        step_number: 1,
        expected_text: 'Bienvenido',
        status: 'running',
        current_transcription: 'hola',
        confidence: null,
        failure_reason: null,
        is_finalized: false,
      },
    ]);

    const { rerender } = render(<RealtimeTranscriptChat state={initialState} />);
    const streamContainer = screen.getByTestId('realtime-transcript-scroll');

    act(() => {
      vi.runAllTimers();
    });

    expect(streamContainer).toHaveTextContent('hola');

    const updatedState = createState([
      {
        step_number: 1,
        expected_text: 'Bienvenido',
        status: 'running',
        current_transcription: 'hola desde ivr tester en vivo',
        confidence: null,
        failure_reason: null,
        is_finalized: false,
      },
    ]);

    rerender(<RealtimeTranscriptChat state={updatedState} />);

    act(() => {
      vi.advanceTimersByTime(20);
    });

    expect(streamContainer).toHaveTextContent('hola');
    expect(streamContainer.textContent?.includes('hola ')).toBe(true);

    act(() => {
      vi.runAllTimers();
    });

    expect(streamContainer).toHaveTextContent('hola desde ivr tester en vivo');
  });

  it('usa accumulated_transcript como fuente de datos aunque el step tenga otro texto', () => {
    vi.useFakeTimers();

    const state = createState(
      [
        {
          step_number: 1,
          expected_text: 'Bienvenido',
          status: 'running',
          current_transcription: 'texto-del-step',
          confidence: null,
          failure_reason: null,
          is_finalized: false,
        },
      ],
      'texto-por-eventos'
    );

    render(<RealtimeTranscriptChat state={state} />);
    const streamContainer = screen.getByTestId('realtime-transcript-scroll');

    act(() => {
      vi.runAllTimers();
    });

    expect(streamContainer).toHaveTextContent('texto-por-eventos');
    expect(streamContainer).not.toHaveTextContent('texto-del-step');
  });
});
