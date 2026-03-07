import { z } from 'zod';

export const flowStepSchema = z.object({
  listen: z.string().min(1, "El campo 'Texto esperado' es requerido"),
  action: z.string().optional().or(z.literal('')),
});

export const createTestCaseSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(255, 'Máximo 255 caracteres'),
  flow_script: z
    .array(flowStepSchema)
    .min(1, 'Debes agregar al menos un paso'),
});

interface ApiError {
  status?: number;
  data?: { detail?: string | Array<{ msg: string }> };
  message?: string;
}

export function mapTestCaseBackendError(error: unknown): string {
  if (!error) {
    return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  }

  const err = error as ApiError;

  if (err.status === 404) {
    return 'La arquitectura IVR seleccionada no existe.';
  }

  if (err.status === 422) {
    const detail = err.data?.detail;
    if (Array.isArray(detail) && detail.length > 0) {
      return detail[0]?.msg || 'Error en la validación de datos.';
    }
    if (typeof detail === 'string') {
      return detail;
    }
    return 'Error en la validación de datos.';
  }

  if (err.status === 400) {
    const message = err.data?.detail;
    if (typeof message === 'string') return message;
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
