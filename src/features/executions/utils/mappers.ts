/**
 * Mappers para traducir valores del backend a etiquetas legibles en español
 */

/**
 * Mapea el valor de action_taken del backend a una etiqueta legible en español
 * @param actionTaken - Valor crudo desde el backend (puede ser null)
 * @returns Etiqueta en español o el valor original si no hay mapeo
 */
export function mapActionToSpanish(actionTaken: string | null): string {
  if (!actionTaken) return '-';

  // Caso 1: Sin acción (paso pasivo)
  if (actionTaken === 'No action (passive step)') {
    return 'Sin acción';
  }

  // Caso 2: Envío de DTMF - "Sent DTMF: {digits}"
  if (actionTaken.startsWith('Sent DTMF:')) {
    const digits = actionTaken.replace('Sent DTMF:', '').trim();
    return `Envió DTMF: ${digits}`;
  }

  // Caso 3: Error DTMF - "DTMF error: {message}"
  if (actionTaken.startsWith('DTMF error:')) {
    const error = actionTaken.replace('DTMF error:', '').trim();
    return `Error DTMF: ${error}`;
  }

  // Caso 4: Fallo de coincidencia de texto
  if (actionTaken === 'Failed text match') {
    return 'Fallo de coincidencia de texto';
  }

  // Caso 5: Timeout esperando audio
  if (actionTaken === 'Timeout waiting for audio') {
    return 'Timeout al esperar audio';
  }

  // Caso 6: Sin transcripción recibida
  if (actionTaken === 'No transcription received') {
    return 'Sin transcripción recibida';
  }

  // Caso 7: Error de conexión ASR - "ASR connect error: {message}"
  if (actionTaken.startsWith('ASR connect error:')) {
    const error = actionTaken.replace('ASR connect error:', '').trim();
    return `Error de conexión ASR: ${error}`;
  }

  // Fallback: retornar valor original si no hay mapeo conocido (compatibilidad futura)
  return actionTaken;
}
