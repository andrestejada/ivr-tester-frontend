import { describe, it, expect } from 'vitest';
import { mapActionToSpanish } from '../mappers';

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
