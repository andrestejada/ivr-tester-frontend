interface ErrorResponse {
  response?: {
    status?: number
    data?: { detail?: unknown; msg?: string }
  }
  status?: number
  data?: { detail?: unknown; msg?: string }
  message?: string
}

export function getErrorMessage(error: unknown): string | null {
  if (!error) {
    return null;
  }

  const err = error as ErrorResponse;
  
  const status = err.response?.status || err.status;
  const data = err.response?.data || err.data;

  if (status === 409) {
    return 'Ya existe una arquitectura con ese nombre o número de teléfono.';
  }

  if (status === 422) {
    const detail = data?.detail;
    if (Array.isArray(detail) && detail.length > 0) {
      return detail[0]?.msg || 'Error en la validación de datos.';
    }
    return 'Error en la validación de datos.';
  }

  if (status === 400) {
    const message = data?.detail;
    if (typeof message === 'string') {
      return message;
    }
    return 'Solicitud inválida. Verifica los datos e inténtalo de nuevo.';
  }

  if (status === 401 || status === 403) {
    return 'No tienes permiso para realizar esta acción.';
  }

  if (err.message === 'Network Error' || err.message?.includes('timeout')) {
    return 'No se pudo conectar con el servidor. Inténtalo de nuevo.';
  }

  if (data?.detail && typeof data.detail === 'string') {
    return data.detail;
  }

  if (err.message) {
    return err.message;
  }

  return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
}
