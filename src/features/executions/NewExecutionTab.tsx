'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Loader2, Phone } from 'lucide-react';
import { useCreateTestExecution } from './hooks';
import { useExecutionWebSocket } from '@/hooks/useExecutionWebSocket';
import { ExecutionRealtimeProgress } from './components/ExecutionRealtimeProgress';
import type { TestCase } from '@/features/test-cases/types';
import type { IVRArchitecture } from '@/features/ivr-architectures/types';
import type { ExecuteTestCaseResponse } from './api';

interface NewExecutionTabProps {
  architecture: IVRArchitecture | null;
  testCaseId: string | null;
  testCase: TestCase | null;
}

export function NewExecutionTab({ architecture, testCaseId, testCase }: NewExecutionTabProps) {
  // Estado para ejecutión activa
  const [activeExecutionId, setActiveExecutionId] = useState<string | null>(null);

  // Hook para crear/ejecutar test case
  const { execute, isLoading: isExecuting, errorMessage, reset: resetExecutionMutation } = useCreateTestExecution(
    architecture?.id || null,
    testCaseId
  );

  // Hook para suscribirse a eventos WebSocket en tiempo real
  const wsResult = useExecutionWebSocket(activeExecutionId, testCase?.flow_script || []);

  useEffect(() => {
    // Cambiar arquitectura/caso invalida cualquier ejecución activa previa.
    setActiveExecutionId(null);
    resetExecutionMutation();
  }, [architecture?.id, testCaseId, resetExecutionMutation]);

  const isReady = !!architecture && !!testCaseId && !!testCase;

  const handleExecuteClick = async () => {
    if (!isReady || !architecture) return;

    try {
      resetExecutionMutation();
      console.log('[NewExecutionTab] Iniciando ejecuci\u00f3n de test case...');
      // Ejecutar test case
      const response: ExecuteTestCaseResponse = await execute();

      console.log('[NewExecutionTab] Respuesta de API:', response);

      // Activar suscripci\u00f3n WebSocket con el execution_id retornado
      if (response?.id) {
        console.log('[NewExecutionTab] Activando WebSocket para execution_id:', response.id);
        setActiveExecutionId(response.id);
      } else {
        console.warn('[NewExecutionTab] API no retorn\u00f3 execution ID:', response);
      }
    } catch (error) {
      console.error('Error executing test case:', error);
      // Error is handled by the hook
    }
  };

  /**
   * Re-habilitar botón: cuando llegue evento terminal (isTerminal=true)
   * o cuando usuario cliquee "Nueva Ejecución"
   */
  const handleNewExecution = () => {
    setActiveExecutionId(null);
    resetExecutionMutation();
  };

  // Mostrar estado de no listo
  if (!isReady) {
    return (
      <Card className="p-6 border-dashed">
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="h-5 w-5" />
          <p>Selecciona una arquitectura y caso de prueba para crear una nueva ejecución</p>
        </div>
      </Card>
    );
  }

  // Si hay ejecución activa, mostrar progreso en vivo
  if (activeExecutionId) {
    return (
      <div className="space-y-6">
        {/* Progreso en Vivo */}
        <ExecutionRealtimeProgress state={wsResult.state} connectionStatus={wsResult.connectionStatus} />

        {/* Error del WebSocket */}
        {wsResult.error && (
          <Card className="p-4 border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-orange-800 dark:text-orange-200">{wsResult.error}</p>
            </div>
          </Card>
        )}

        {/* Error de ejecución HTTP */}
        {errorMessage && (
          <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{errorMessage}</p>
            </div>
          </Card>
        )}

        {/* Botones de Acción */}
        <div className="flex gap-3">
          {/* Re-habilitar botón cuando terminal */}
          {wsResult.isTerminal && (
            <Button onClick={handleNewExecution} variant="default" className="flex-1">
              Nueva Ejecución
            </Button>
          )}

          {/* Botón deshabilitado mientras en curso */}
          {!wsResult.isTerminal && (
            <Button disabled className="flex-1 gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Ejecución en Curso...
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Pantalla pre-ejecución
  return (
    <div className="space-y-6">
      {/* Architecture Info */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Arquitectura</label>
            <p className="text-lg font-semibold mt-1">{architecture.name}</p>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-blue-200 dark:border-blue-700">
            <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-mono text-blue-700 dark:text-blue-300">{architecture.phone_number}</span>
          </div>
        </div>
      </Card>

      {/* Flow Steps Preview */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Pasos a ejecutar</h3>
        <div className="space-y-3">
          {testCase?.flow_script && testCase.flow_script.length > 0 ? (
            testCase.flow_script.map((step) => (
              <Card key={step.step} className="p-4 border-l-4 border-l-blue-500">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-600 dark:text-gray-400">Escuchar</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100 break-words">{step.listen}</p>
                    {step.action && (
                      <>
                        <p className="font-medium text-sm text-gray-600 dark:text-gray-400 mt-2">Accionar</p>
                        <p className="text-base text-gray-700 dark:text-gray-300 break-words">{step.action}</p>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-6 border-dashed">
              <p className="text-center text-muted-foreground">No hay pasos definidos en este caso de prueba</p>
            </Card>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">{errorMessage}</p>
          </div>
        </Card>
      )}

      {/* Execute Button - Deshabilitado cuando isExecuting (POST en curso) */}
      <Button
        onClick={handleExecuteClick}
        disabled={!isReady || isExecuting}
        className="w-full gap-2"
        size="lg"
      >
        {isExecuting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isExecuting ? 'Iniciando ejecución...' : 'Ejecutar Prueba'}
      </Button>
    </div>
  );
}
