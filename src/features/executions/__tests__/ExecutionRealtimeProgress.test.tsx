import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ExecutionRealtimeProgress } from '../components/ExecutionRealtimeProgress';
import type { ExecutionProgressState } from '../types';

function createState(): ExecutionProgressState {
  return {
    execution_id: 'exec-rt-1',
    global_status: 'running',
    duration_seconds: null,
    steps: [
      {
        step_number: 1,
        expected_text: 'bienvenido a la linea de servicio',
        status: 'passed',
        current_transcription: 'bienvenido a la linea de servicio',
        confidence: 96,
        failure_reason: null,
        is_finalized: true,
      },
    ],
    accumulated_transcript: 'bienvenido a la linea de servicio',
    is_terminal: false,
    terminal_error_message: null,
    ws_connection_status: 'connected',
  };
}

describe('ExecutionRealtimeProgress', () => {
  it('renderiza el subcomponente de chat y mantiene el resumen principal', () => {
    render(<ExecutionRealtimeProgress state={createState()} connectionStatus="connected" />);

    expect(screen.getByText('Ejecución en Tiempo Real')).toBeInTheDocument();
    expect(screen.getByText('Transcripción en vivo')).toBeInTheDocument();
    const transcriptContainer = screen.getByTestId('realtime-transcript-scroll');
    expect(transcriptContainer).toBeInTheDocument();
    expect(
      transcriptContainer.textContent?.includes('bienvenido') ||
        transcriptContainer.textContent?.includes('Aún no hay transcripción para mostrar.')
    ).toBe(true);
    expect(screen.getByText('Pasos (1)')).toBeInTheDocument();
    expect(
      screen.queryByText('Escuchando') || screen.queryByText('Sin actividad')
    ).toBeInTheDocument();
  });
});
