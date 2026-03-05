export function getErrorMessage(error: unknown): string | null {
  if (!error) {
    return null;
  }

  const err = error as any;

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

  if (err.message === 'Network Error' || err.message?.includes('timeout')) {
    return 'No se pudo conectar con el servidor. Inténtalo de nuevo.';
  }

  if (err.message) {
    return err.message;
  }

  return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
}
