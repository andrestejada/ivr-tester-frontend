/**
 * Types for Execution Details feature
 * Corresponds to TestExecutionDetailsResponse from backend
 */

import type { FlowStep } from '@/features/test-cases/types';

export interface ExecutionLogResponse {
  id: string;
  execution_id: string;
  step_number: number;
  expected_text: string | null;
  actual_transcription: string | null;
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
