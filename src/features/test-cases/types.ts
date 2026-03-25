import { z } from 'zod';
import type { createTestCaseSchema } from './schemas';

export type CreateTestCaseInput = z.infer<typeof createTestCaseSchema>;

export interface FlowStep {
  step: number;
  listen: string;
  action?: string;
}

export type FlowStepInput = Omit<FlowStep, 'step'>;

export interface TestCase {
  id: string;
  ivr_architecture_id: string;
  name: string;
  flow_script: FlowStep[];
  created_at: string;
}

export interface TestExecution {
  id: string;
  test_case_id: string;
  status: 'PASSED' | 'FAILED' | 'ERROR' | 'RUNNING';
  duration_seconds: number | null;
  provider_call_sid: string | null;
  executed_at: string;
}
