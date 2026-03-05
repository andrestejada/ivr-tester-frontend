import { z } from 'zod';
import type { createIVRArchitectureSchema } from './schemas';

export type CreateIVRArchitectureInput = z.infer<typeof createIVRArchitectureSchema>;

export interface IVRArchitecture {
  id: string;
  name: string;
  phone_number: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
