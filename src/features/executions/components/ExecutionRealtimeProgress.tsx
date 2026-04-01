/**
 * Componente para mostrar el progreso de la ejecución en tiempo real.
 * Renderiza un card por cada step con estado, transcripción y confianza.
 */

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertCircle, Loader, ListChecks } from 'lucide-react';
import type { ExecutionProgressState, StepProgressStatus } from '../types';

interface ExecutionRealtimeProgressProps {
  /**
   * Estado actual de progreso de la ejecución
   */
  state: ExecutionProgressState;
  /**
   * Conexión WebSocket: 'disconnected' | 'connecting' | 'connected' | 'reconnecting'
   */
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
}

/**
 * Obtiene color y icono según el estado del step
 */
const getStatusConfig = (status: StepProgressStatus) => {
  switch (status) {
    case 'pending':
      return {
        icon: <div className="h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />,
        bgColor: 'bg-gray-50 dark:bg-gray-900',
        borderColor: 'border-l-gray-300',
        badgeColor: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        label: 'Pendiente',
      };
    case 'running':
      return {
        icon: <Loader className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />,
        bgColor: 'bg-blue-50 dark:bg-blue-950',
        borderColor: 'border-l-blue-500',
        badgeColor: 'bg-blue-600 text-white',
        label: 'En curso',
      };
    case 'passed':
      return {
        icon: <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />,
        bgColor: 'bg-green-50 dark:bg-green-950',
        borderColor: 'border-l-green-500',
        badgeColor: 'bg-green-600 text-white',
        label: 'Aprobado',
      };
    case 'failed':
      return {
        icon: <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
        bgColor: 'bg-red-50 dark:bg-red-950',
        borderColor: 'border-l-red-500',
        badgeColor: 'bg-red-600 text-white',
        label: 'Fallido',
      };
    case 'error':
      return {
        icon: <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
        bgColor: 'bg-orange-50 dark:bg-orange-950',
        borderColor: 'border-l-orange-500',
        badgeColor: 'bg-orange-600 text-white',
        label: 'Error',
      };
    default:
      return {
        icon: <AlertCircle className="h-5 w-5" />,
        bgColor: 'bg-gray-50 dark:bg-gray-900',
        borderColor: 'border-l-gray-300',
        badgeColor: 'bg-gray-200 text-gray-800',
        label: status,
      };
  }
};

/**
 * Obtiene color para el indicador de confianza
 */
const getConfidenceBadgeColor = (confidence: number | null) => {
  if (confidence === null) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  if (confidence >= 0.9) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
};

/**
 * Formatea confianza como porcentaje (backend ya envía como %)
 */
const formatConfidence = (confidence: number | null) => {
  if (confidence === null) return '-';
  return `${confidence.toFixed(1)}%`;
};

/**
 * Obtiene color para el indicador de estado de conexión
 */
const getConnectionStatusColor = (status: string) => {
  switch (status) {
    case 'connected':
      return 'bg-green-600 text-white';
    case 'connecting':
      return 'bg-yellow-600 text-white';
    case 'reconnecting':
      return 'bg-orange-600 text-white';
    case 'disconnected':
      return 'bg-red-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
};

/**
 * Obtiene label legible para estado de conexión
 */
const getConnectionStatusLabel = (status: string) => {
  switch (status) {
    case 'connected':
      return '🟢 En Vivo';
    case 'connecting':
      return '🟡 Conectando...';
    case 'reconnecting':
      return '🟠 Reconectando...';
    case 'disconnected':
      return '🔴 Desconectado';
    default:
      return status;
  }
};

export function ExecutionRealtimeProgress({ state, connectionStatus }: ExecutionRealtimeProgressProps) {
  const globalStatusConfig = getStatusConfig(state.global_status);

  return (
    <div className="space-y-6">
      {/* Global Status Card */}
      <Card className={globalStatusConfig.bgColor}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {globalStatusConfig.icon}
              Ejecución en Tiempo Real
            </CardTitle>
            <Badge className={getConnectionStatusColor(connectionStatus)}>
              {getConnectionStatusLabel(connectionStatus)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Global Status */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <Badge className={globalStatusConfig.badgeColor}>{globalStatusConfig.label}</Badge>
            </div>

            {/* Steps Progress */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Progreso</p>
              <p className="text-sm font-mono">
                {state.steps.filter((s) => s.status === 'passed').length}/{state.steps.length} pasos
              </p>
            </div>

            {/* Duration */}
            {state.duration_seconds !== null && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Duración</p>
                <p className="text-sm font-mono">{state.duration_seconds}s</p>
              </div>
            )}
          </div>

          {/* Terminal Error Message */}
          {state.terminal_error_message && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded text-sm text-red-800 dark:text-red-200">
              {state.terminal_error_message}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Steps Timeline */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 font-semibold">
          <ListChecks className="h-5 w-5" />
          Pasos ({state.steps.length})
        </h4>

        <div className="space-y-3">
          {state.steps.map((step) => {
            const stepStatusConfig = getStatusConfig(step.status);
            return (
              <Card key={step.step_number} className={`border-l-4 ${stepStatusConfig.borderColor} ${stepStatusConfig.bgColor}`}>
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Step Number Circle */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex-shrink-0">
                      {stepStatusConfig.icon}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Expected Text */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Esperado</p>
                        <p className="text-sm font-semibold text-foreground break-words">
                          {step.expected_text || '—'}
                        </p>
                      </div>

                      {/* Current Transcription (Live) */}
                      {step.current_transcription && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Transcripción
                          </p>
                          <p className="text-sm text-foreground break-words italic">
                            {step.current_transcription}
                          </p>
                        </div>
                      )}

                      {/* Confidence & Status */}
                      <div className="flex items-center gap-2 pt-1">
                        {step.confidence !== null && (
                          <>
                            <Badge className={getConfidenceBadgeColor(step.confidence)}>
                              {formatConfidence(step.confidence)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">confianza</span>
                          </>
                        )}
                      </div>

                      {/* Failure Reason */}
                      {step.failure_reason && (
                        <div className="text-xs text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 px-2 py-1 rounded">
                          {step.failure_reason}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Accumulated Transcript (if available) */}
      {state.accumulated_transcript && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Transcripción Completa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
              {state.accumulated_transcript}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
