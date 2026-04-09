/**
 * Hook global para suscribirse a eventos WebSocket de una ejecución en tiempo real.
 *
 * Maneja:
 * - Conexión al WebSocket con JWT token en query param
 * - Parseo seguro de eventos
 * - Acumulación y procesamiento de eventos → estado de progreso
 * - Reconexión automática con backoff si se desconecta sin evento terminal
 * - Cierre de socket cuando llega evento terminal
 *
 * Ubicación: src/hooks/useExecutionWebSocket.ts (hook global, reutilizable en cualquier parte)
 */

import { useEffect, useReducer, useRef, useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  createInitialProgressState,
  progressReducer,
} from '@/features/executions/utils/progressReducer';
import type { ExecutionWebSocketEvent } from '@/features/executions/types';

/**
 * Hook para suscribirse a eventos WebSocket de una ejecución en tiempo real.
 *
 * @param executionId - UUID de la ejecución a monitorear (null para no conectar)
 * @param flowScript - Script de flujo para inicializar estado de pasos (necesario para sincronizar)
 * @returns { state, isConnected, connectionStatus, error, isTerminal }
 *
 * @example
 * const { state, connectionStatus, isTerminal } = useExecutionWebSocket(executionId, flowScript);
 * if (state.is_terminal) {
 *   // Mostrar resultado final
 * }
 */
export function useExecutionWebSocket(executionId: string | null, flowScript: any[] = []) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReconnectRef = useRef(true);

  // Estado de progreso de ejecución
  const [progressState, dispatchProgressEvent] = useReducer(
    progressReducer,
    { execution_id: executionId, flow_script: flowScript },
    (init) => createInitialProgressState(init.execution_id || '', init.flow_script || [])
  );

  // Estados de conexión
  const [connectionStatus, setConnectionStatus] = useState<
    'disconnected' | 'connecting' | 'connected' | 'reconnecting'
  >('disconnected');
  const [wsError, setWsError] = useState<string | null>(null);

  // Contador de reconexiones para backoff exponencial
  const reconnectCountRef = useRef(0);

  /**
   * Calcula delay de reconexión con backoff exponencial (1s, 2s, 4s, 8s, max 30s)
   */
  const getReconnectDelay = useCallback(() => {
    const baseDelay = 1000; // 1 segundo
    const maxDelay = 30000; // 30 segundos
    const delay = Math.min(baseDelay * Math.pow(2, reconnectCountRef.current), maxDelay);
    return delay;
  }, []);

  /**
   * Conecta al WebSocket
   */
  const connect = useCallback(async () => {
    if (!executionId || !shouldReconnectRef.current) {
      console.log(
        `[WebSocket] Connect abortado: executionId=${executionId}, shouldReconnect=${shouldReconnectRef.current}`
      );
      return;
    }

    console.log(`[WebSocket] Iniciando conexión para execution: ${executionId}`);

    try {
      setConnectionStatus('connecting');
      setWsError(null);

      // Obtener token JWT de Supabase
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      // Construir URL del WebSocket
      const apiBase = import.meta.env.VITE_API_BASE_URL;
      if (!apiBase) {
        throw new Error('VITE_API_BASE_URL not configured');
      }

      // Convertir http(s) a ws(s)
      const wsProtocol = apiBase.startsWith('https') ? 'wss' : 'ws';
      const wsBase = apiBase.replace(/^https?:\/\//, '');
      const wsUrl = `${wsProtocol}://${wsBase}/ws/executions/${executionId}?token=${token}`;

      console.log(`[WebSocket] Conectando a ${wsUrl}`);

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log(`[WebSocket] Conectado a ejecución ${executionId}`);
        setConnectionStatus('connected');
        reconnectCountRef.current = 0; // Reset count en conexión exitosa
        wsRef.current = ws;
      };

      ws.onmessage = (event) => {
        try {
          const parsedEvent = JSON.parse(event.data) as ExecutionWebSocketEvent;

          // Validar estructura básica del evento
          if (!parsedEvent.event_type || !parsedEvent.execution_id) {
            console.warn('[WebSocket] Evento con estructura invalida:', parsedEvent);
            return;
          }

          // Procesar el evento a través del reductor
          dispatchProgressEvent(parsedEvent);

          // Chequear si es terminal para cerrar conexión
          if (
            parsedEvent.event_type === 'execution_finished' ||
            parsedEvent.event_type === 'execution_error'
          ) {
            console.log(`[WebSocket] Evento terminal recibido: ${parsedEvent.event_type}`);
            shouldReconnectRef.current = false; // No reconectar si es terminal
            ws.close(1000, 'Execution finished');
          }
        } catch (error) {
          console.error('[WebSocket] Error parseando evento:', error);
          setWsError(
            `Error procesando evento: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      };

      ws.onerror = (event) => {
        const errorMsg = `WebSocket error: ${event}`;
        console.error(`[WebSocket] ${errorMsg}`);
        setWsError(errorMsg);
        setConnectionStatus('disconnected');
      };

      ws.onclose = (event) => {
        console.log(
          `[WebSocket] Desconectado (code=${event.code}, reason=${event.reason}, clean=${event.wasClean})`
        );
        wsRef.current = null;
        setConnectionStatus('disconnected');

        // Intentar reconexión solo si no fue cierre normal y no es terminal
        if (!event.wasClean && shouldReconnectRef.current && !progressState.is_terminal) {
          const delay = getReconnectDelay();
          console.log(
            `[WebSocket] Reconectando en ${delay}ms (intento ${reconnectCountRef.current + 1})`
          );
          setConnectionStatus('reconnecting');
          reconnectCountRef.current++;

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown connection error';
      console.error(`[WebSocket] Error conectando: ${errorMsg}`);
      setWsError(errorMsg);
      setConnectionStatus('disconnected');
    }
  }, [executionId, progressState.is_terminal, getReconnectDelay]);

  /**
   * Effect: conectar SOLO cuando executionId es válido (no null / no vacío)
   */
  useEffect(() => {
    // No conectar si no hay executionId
    if (!executionId || executionId.trim() === '') {
      console.log(`[WebSocket] No conectando: executionId es null o vacío`);
      shouldReconnectRef.current = false;
      if (wsRef.current) {
        console.log(`[WebSocket] Cerrando WebSocket existente: executionId vacío`);
        wsRef.current.close();
        wsRef.current = null;
      }
      setConnectionStatus('disconnected');
      setWsError(null);
      return;
    }

    console.log(`[WebSocket] Activando conexión: executionId = ${executionId}`);

    // Resetear flags de reconexión cuando se asigna nuevo executionId
    shouldReconnectRef.current = true;
    reconnectCountRef.current = 0;

    connect();

    // Cleanup al desmontar o cambiar executionId
    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [executionId, connect]);

  return {
    /**
     * Estado actual de progreso de la ejecución
     */
    state: progressState,

    /**
     * true si WebSocket está conectado
     */
    isConnected: connectionStatus === 'connected',

    /**
     * Estado actual de conexión: 'disconnected' | 'connecting' | 'connected' | 'reconnecting'
     */
    connectionStatus,

    /**
     * Último error de WebSocket (null si sin errores)
     */
    error: wsError,

    /**
     * true si ejecución terminó (execution_finished o execution_error recibido)
     */
    isTerminal: progressState.is_terminal,
  };
}
