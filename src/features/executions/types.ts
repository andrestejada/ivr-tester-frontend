/**
 * Types for Execution Details feature
 * Corresponds to TestExecutionDetailsResponse from backend
 */

import type { FlowStep } from '@/features/test-cases/types';

// ========== Realtime WebSocket Event Types ==========

export type ExecutionEventType =
  | 'execution_started'
  | 'status_changed'
  | 'transcript_partial'
  | 'transcript_final'
  | 'step_started'
  | 'step_matched'
  | 'step_failed'
  | 'step_logged'
  | 'execution_finished'
  | 'execution_error';

export interface ExecutionWebSocketEvent<T = Record<string, any>> {
  event_type: ExecutionEventType;
  execution_id: string;
  timestamp: string; // ISO 8601
  data: T;
  schema_version: 'v1';
}

// Event-specific payloads
export interface ExecutionStartedData {
  status: 'RUNNING';
}

export interface StatusChangedData {
  old_status: string;
  new_status: string;
}

export interface TranscriptPartialData {
  text: string;
  is_final: false;
}

export interface TranscriptFinalData {
  text: string;
  is_final: true;
}

export interface StepStartedData {
  step_number: number;
  expected_text: string;
}

export interface StepMatchedData {
  step_number: number;
  matched_text: string;
  confidence: number; // porcentaje 0-100
}

export interface StepFailedData {
  step_number: number;
  expected_text: string;
  actual_text: string | null;
  reason: string;
}

export interface StepLoggedData {
  step_number: number;
}

export interface ExecutionFinishedData {
  status: 'PASSED' | 'FAILED';
  duration_seconds: number;
}

export interface ExecutionErrorData {
  status: 'ERROR';
  error_message: string;
  duration_seconds: number;
}

// ========== Real-time Step Progress Model ==========

export type StepProgressStatus = 'pending' | 'running' | 'passed' | 'failed' | 'error';

export interface StepProgress {
  step_number: number;
  expected_text: string;
  status: StepProgressStatus;
  /**
   * Transcripción parcial/final que va llegando en tiempo real.
   * Se va acumulando conforme llegan eventos transcript_partial/final
   */
  current_transcription: string;
  /**
   * Porcentaje de confianza una vez que step_matched o se determina fallo.
    * Rango esperado: 0-100 (UI tolera también 0-1 por compatibilidad)
   */
  confidence: number | null;
  /**
   * Razón de fallo si aplica (si status === 'failed' o 'error')
   */
  failure_reason: string | null;
  /**
   * Marca si hemos recibido el evento terminal de este step (step_logged o similar)
   */
  is_finalized: boolean;
}

export interface ExecutionProgressState {
  /**
   * ID de la ejecución actual
   */
  execution_id: string | null;
  /**
   * Estado global: 'pending' | 'running' | 'passed' | 'failed' | 'error'
   */
  global_status: 'pending' | 'running' | 'passed' | 'failed' | 'error';
  /**
   * Duración en segundos (solo set cuando terminal)
   */
  duration_seconds: number | null;
  /**
   * Progreso por cada step del flujo
   */
  steps: StepProgress[];
  /**
   * Transcripción completa acumulada (solo en realtime)
   */
  accumulated_transcript: string;
  /**
   * Indica si hemos recibido un evento terminal (execution_finished o execution_error)
   */
  is_terminal: boolean;
  /**
   * Mensaje de error si execution_error fue recibido
   */
  terminal_error_message: string | null;
  /**
   * Estado de conexión WebSocket
   */
  ws_connection_status: 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
}

// ========== Legacy Response Types (API) ==========

export interface ExecutionLogResponse {
  id: string;
  execution_id: string;
  step_number: number;
  expected_text: string | null;
  actual_transcription: string | null;
  matched_excerpt: string | null;
  confidence_score: number | null;
  action_taken: string | null;
  created_at: string; // ISO 8601 datetime
}

export interface IVRArchitectureDetailResponse {
  id: string;
  user_id: string;
  name: string;
  phone_number: string;
  provider: string;
  description: string | null;
  created_at: string; // ISO 8601 datetime
}

export interface TestCaseDetailResponse {
  id: string;
  ivr_architecture_id: string;
  name: string;
  flow_script: FlowStep[];
  created_at: string; // ISO 8601 datetime
  ivr_architecture: IVRArchitectureDetailResponse;
}

export interface TestExecutionDetailsResponse {
  id: string;
  test_case_id: string;
  status: 'PASSED' | 'FAILED' | 'ERROR' | 'RUNNING';
  duration_seconds: number | null;
  provider_call_sid: string | null;
  full_call_transcript: string | null;
  executed_at: string; // ISO 8601 datetime
  test_case: TestCaseDetailResponse;
  logs: ExecutionLogResponse[];
}
