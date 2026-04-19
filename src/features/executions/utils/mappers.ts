/**
 * Mappers para traducir valores del backend a etiquetas legibles en español
 */

type StepUiStatus = 'pending' | 'running' | 'passed' | 'failed' | 'error';

/**
 * Normaliza confianza para manejar payloads 0-1 y 0-100 de forma consistente.
 */
export function normalizeConfidencePercentage(confidence: number | null): number | null {
  if (confidence === null || Number.isNaN(confidence)) return null;
  if (confidence <= 1) return Math.max(0, Math.min(100, confidence * 100));
  return Math.max(0, Math.min(100, confidence));
}

/**
 * Formatea porcentaje de confianza para la UI.
 */
export function formatConfidencePercentage(confidence: number | null): string {
  const normalized = normalizeConfidencePercentage(confidence);
  if (normalized === null) return '-';
  return `${normalized.toFixed(2)}%`;
}

/**
 * Obtiene clases de badge según confianza y estado del paso.
 */
export function getConfidenceBadgeColor(
  confidence: number | null,
  stepStatus?: StepUiStatus
): string {
  const normalized = normalizeConfidencePercentage(confidence);
  if (normalized === null) {
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }

  if (stepStatus === 'passed') {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  }

  if (stepStatus === 'failed' || stepStatus === 'error') {
    if (normalized < 30) return 'bg-red-200 text-red-900 dark:bg-red-950 dark:text-red-200';
    if (normalized < 50) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (normalized < 70) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
  }

  if (normalized >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  if (normalized >= 75) return 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200';
  if (normalized >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  if (normalized >= 45) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
  if (normalized >= 25) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  return 'bg-red-200 text-red-900 dark:bg-red-950 dark:text-red-200';
}

/**
 * Traduce razones técnicas de fallo a mensajes amigables.
 */
export function mapFailureReasonToSpanish(reason: string | null): string {
  if (!reason) return 'La prueba falló en este paso.';

  const stagnationMatch = reason.match(
    /^Step stagnated: no similarity improvement for\s*([\d.]+)s\s*with\s*best_ratio=([\d.]+)%$/i
  );
  if (stagnationMatch) {
    const seconds = stagnationMatch[1];
    const ratio = stagnationMatch[2];
    return `No hubo avance en el reconocimiento durante ${seconds}s (mejor coincidencia: ${ratio}%). El menú actual no coincide con lo esperado para este paso.`;
  }

  const timeoutMatch = reason.match(
    /^Step timeout exceeded:\s*([\d.]+)s\s*>=\s*([\d.]+)s\s*\(best_ratio=([\d.]+)%\)$/i
  );
  if (timeoutMatch) {
    const elapsed = timeoutMatch[1];
    const threshold = timeoutMatch[2];
    const ratio = timeoutMatch[3];
    return `Se agotó el tiempo de espera del paso (${elapsed}s de ${threshold}s). Mejor coincidencia detectada: ${ratio}%.`;
  }

  if (reason.includes('IVR repeated menu without matching expected step')) {
    return 'El IVR repitió el menú y no se detectó la opción esperada para este paso.';
  }

  if (reason.includes('Call session ended before completing step')) {
    return 'La llamada se cerró antes de completar este paso.';
  }

  if (reason.startsWith('Extreme caller silence')) {
    return 'La llamada se cerró por silencio prolongado del usuario.';
  }

  if (reason === 'Failed text match') {
    return 'La transcripción no coincide con el texto esperado del paso.';
  }

  if (reason === 'Timeout waiting for audio') {
    return 'No se recibió audio a tiempo para evaluar este paso.';
  }

  if (reason === 'No transcription received') {
    return 'No se recibió transcripción para este paso.';
  }

  if (reason.startsWith('DTMF error:')) {
    const error = reason.replace('DTMF error:', '').trim();
    return `No fue posible enviar el tono DTMF. Detalle: ${error}`;
  }

  return `La prueba falló en este paso. Detalle: ${reason}`;
}

/**
 * Clasifica si la acción registrada corresponde a un paso fallido.
 */
export function isStepFailureAction(actionTaken: string | null): boolean {
  if (!actionTaken) return false;

  if (actionTaken.startsWith('Sent DTMF:')) return false;
  if (actionTaken.startsWith('No action (passive step')) return false;

  if (
    actionTaken === 'Failed text match' ||
    actionTaken === 'Timeout waiting for audio' ||
    actionTaken === 'No transcription received' ||
    actionTaken === 'Call session ended before completing step' ||
    actionTaken.includes('IVR repeated menu without matching expected step')
  ) {
    return true;
  }

  if (
    actionTaken.startsWith('DTMF error:') ||
    actionTaken.startsWith('ASR connect error:') ||
    actionTaken.startsWith('Step timeout exceeded:') ||
    actionTaken.startsWith('Step stagnated:') ||
    actionTaken.startsWith('Extreme caller silence:')
  ) {
    return true;
  }

  const lowered = actionTaken.toLowerCase();
  return (
    lowered.includes('error') ||
    lowered.includes('failed') ||
    lowered.includes('timeout') ||
    lowered.includes('stagnated') ||
    lowered.includes('silence')
  );
}

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

  // Caso 8: Razones de fallo terminal del step (timeout/stagnation/repetition/silence)
  if (
    actionTaken.startsWith('Step timeout exceeded:') ||
    actionTaken.startsWith('Step stagnated:') ||
    actionTaken.includes('IVR repeated menu without matching expected step') ||
    actionTaken.startsWith('Extreme caller silence:') ||
    actionTaken === 'Call session ended before completing step'
  ) {
    return mapFailureReasonToSpanish(actionTaken);
  }

  // Fallback: retornar valor original si no hay mapeo conocido (compatibilidad futura)
  return actionTaken;
}
