import { z } from 'zod';

export const createIVRArchitectureSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(250, 'Máximo 250 caracteres'),
  phone_number: z
    .string()
    .min(1, 'El teléfono es obligatorio')
    .regex(/^\d+$/, 'Solo se permiten números'),
  description: z
    .string()
    .max(500, 'Máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
});

interface BackendError {
  status?: number
  data?: { detail?: unknown; msg?: string }
  message?: string
}

export function mapBackendError(error: unknown): string {
  if (!error) {
    return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  }

  const err = error as BackendError;

  if (err.status === 409) {
    return 'Ya existe una arquitectura con ese nombre o número de teléfono.';
  }

  if (err.status === 422) {
    const detail = err.data?.detail;
    if (Array.isArray(detail) && detail.length > 0) {
      return detail[0]?.msg || 'Error en la validación de datos.';
    }
    return 'Error en la validación de datos.';
  }

  if (err.status === 400) {
    const message = err.data?.detail;
    if (typeof message === 'string') {
      return message;
    }
    return 'Solicitud inválida. Verifica los datos e inténtalo de nuevo.';
  }

  if (err.status === 401 || err.status === 403) {
    return 'No tienes permiso para realizar esta acción.';
  }

  if (err.message === 'Failed to fetch' || err.message?.includes('timeout')) {
    return 'No se pudo conectar con el servidor. Inténtalo de nuevo.';
  }

  return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
}
