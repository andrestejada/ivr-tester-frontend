import { describe, it, expect } from 'vitest';
import {
  formatConfidencePercentage,
  getConfidenceBadgeColor,
  isStepFailureAction,
  mapActionToSpanish,
  mapFailureReasonToSpanish,
  normalizeConfidencePercentage,
} from '../mappers';

describe('mapActionToSpanish', () => {
  // Caso 1: Sin acción (paso pasivo)
  it('mapea "No action (passive step)" a "Sin acción"', () => {
    expect(mapActionToSpanish('No action (passive step)')).toBe('Sin acción');
  });

  // Caso 2: Envío de DTMF simple
  it('mapea "Sent DTMF: 1" a "Envió DTMF: 1"', () => {
    expect(mapActionToSpanish('Sent DTMF: 1')).toBe('Envió DTMF: 1');
  });

  // Caso 2b: Envío de DTMF múltiple
  it('mapea "Sent DTMF: 123" a "Envió DTMF: 123"', () => {
    expect(mapActionToSpanish('Sent DTMF: 123')).toBe('Envió DTMF: 123');
  });

  // Caso 2c: Envío de DTMF con caracteres especiales
  it('mapea "Sent DTMF: *0#" a "Envió DTMF: *0#"', () => {
    expect(mapActionToSpanish('Sent DTMF: *0#')).toBe('Envió DTMF: *0#');
  });

  // Caso 3: Error DTMF
  it('mapea "DTMF error: Connection timeout" a "Error DTMF: Connection timeout"', () => {
    expect(mapActionToSpanish('DTMF error: Connection timeout')).toBe(
      'Error DTMF: Connection timeout'
    );
  });

  // Caso 4: Fallo de coincidencia de texto
  it('mapea "Failed text match" a "Fallo de coincidencia de texto"', () => {
    expect(mapActionToSpanish('Failed text match')).toBe('Fallo de coincidencia de texto');
  });

  // Caso 5: Timeout esperando audio
  it('mapea "Timeout waiting for audio" a "Timeout al esperar audio"', () => {
    expect(mapActionToSpanish('Timeout waiting for audio')).toBe('Timeout al esperar audio');
  });

  // Caso 6: Sin transcripción recibida
  it('mapea "No transcription received" a "Sin transcripción recibida"', () => {
    expect(mapActionToSpanish('No transcription received')).toBe('Sin transcripción recibida');
  });

  // Caso 7: Error de conexión ASR
  it('mapea "ASR connect error: SSL error" a "Error de conexión ASR: SSL error"', () => {
    expect(mapActionToSpanish('ASR connect error: SSL error')).toBe(
      'Error de conexión ASR: SSL error'
    );
  });

  // Fallback: valor desconocido
  it('retorna el valor original si no hay mapeo conocido', () => {
    const unknownValue = 'Some unknown action';
    expect(mapActionToSpanish(unknownValue)).toBe(unknownValue);
  });

  // Caso 9: Stagnation
  it('mapea razón de stagnation a mensaje amigable', () => {
    expect(
      mapActionToSpanish('Step stagnated: no similarity improvement for 8.0s with best_ratio=40.35%')
    ).toContain('No hubo avance en el reconocimiento');
  });

  // Caso 10: Step timeout
  it('mapea razón de timeout de step a mensaje amigable', () => {
    expect(
      mapActionToSpanish('Step timeout exceeded: 30.0s >= 30.0s (best_ratio=69.72%)')
    ).toContain('Se agotó el tiempo de espera del paso');
  });

  // Null o vacío
  it('retorna "-" si el valor es null', () => {
    expect(mapActionToSpanish(null)).toBe('-');
  });

  it('retorna "-" si el valor es cadena vacía', () => {
    expect(mapActionToSpanish('')).toBe('-');
  });

  // Edge case: whitespace en DTMF
  it('maneja correctamente espacios en DTMF error', () => {
    expect(mapActionToSpanish('DTMF error:  Connection failed  ')).toBe(
      'Error DTMF: Connection failed'
    );
  });
});

describe('mapFailureReasonToSpanish', () => {
  it('retorna mensaje genérico amigable para fallback', () => {
    expect(mapFailureReasonToSpanish('Unknown backend failure')).toContain('La prueba falló en este paso');
  });
});

describe('isStepFailureAction', () => {
  it('retorna false para acciones exitosas', () => {
    expect(isStepFailureAction('Sent DTMF: 1')).toBe(false);
    expect(isStepFailureAction('No action (passive step)')).toBe(false);
    expect(isStepFailureAction('No action (passive step - timeout fallback accepted: 84.38%)')).toBe(
      false
    );
  });

  it('retorna true para acciones de fallo conocidas', () => {
    expect(isStepFailureAction('Failed text match')).toBe(true);
    expect(isStepFailureAction('Step timeout exceeded: 30.0s >= 30.0s (best_ratio=69.72%)')).toBe(
      true
    );
    expect(isStepFailureAction('DTMF error: Connection timeout')).toBe(true);
  });
});

describe('confidence helpers', () => {
  it('normaliza valores 0-1 a porcentaje', () => {
    expect(normalizeConfidencePercentage(0.4035)).toBeCloseTo(40.35, 2);
  });

  it('mantiene valores 0-100 sin modificar', () => {
    expect(normalizeConfidencePercentage(87.48)).toBe(87.48);
  });

  it('formatea porcentaje con dos decimales', () => {
    expect(formatConfidencePercentage(40.35)).toBe('40.35%');
  });

  it('asigna color crítico rojo a confianza baja en step fallido', () => {
    expect(getConfidenceBadgeColor(20, 'failed')).toContain('red');
  });
});
