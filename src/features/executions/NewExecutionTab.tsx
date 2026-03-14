'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Loader2, Phone } from 'lucide-react';
import { useCreateTestExecution } from './hooks';
import type { TestCase } from '@/features/test-cases/types';
import type { IVRArchitecture } from '@/features/ivr-architectures/types';

interface NewExecutionTabProps {
  architecture: IVRArchitecture | null;
  testCaseId: string | null;
  testCase: TestCase | null;
}

export function NewExecutionTab({ architecture, testCaseId, testCase }: NewExecutionTabProps) {
  const {
    execute,
    isLoading: isExecuting,
    isSuccess,
    errorMessage,
  } = useCreateTestExecution(architecture?.id || null, testCaseId);

  const isReady = !!architecture && !!testCaseId && !!testCase;

  const handleExecuteClick = async () => {
    if (!isReady || !architecture) return;

    try {
      await execute({ phone_number: architecture.phone_number });
    } catch (error) {
      console.error('Error executing test case:', error);
      // Error is handled by the hook
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Architecture Info */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Arquitectura
            </label>
            <p className="text-lg font-semibold mt-1">{architecture.name}</p>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-blue-200 dark:border-blue-700">
            <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-mono text-blue-700 dark:text-blue-300">
              {architecture.phone_number}
            </span>
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
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100 break-words">
                      {step.listen}
                    </p>
                    {step.action && (
                      <>
                        <p className="font-medium text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Accionar
                        </p>
                        <p className="text-base text-gray-700 dark:text-gray-300 break-words">
                          {step.action}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-6 border-dashed">
              <p className="text-center text-muted-foreground">
                No hay pasos definidos en este caso de prueba
              </p>
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

      {/* Success Message */}
      {isSuccess && (
        <Card className="p-4 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <div className="flex items-start gap-2">
            <div className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5">✓</div>
            <p className="text-sm text-green-800 dark:text-green-200">
              Ejecución iniciada. Puedes ver el progreso en el historial.
            </p>
          </div>
        </Card>
      )}

      {/* Execute Button */}
      <Button
        onClick={handleExecuteClick}
        disabled={!isReady || isExecuting}
        className="w-full gap-2"
        size="lg"
      >
        {isExecuting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isExecuting ? 'Ejecutando...' : 'Ejecutar Prueba'}
      </Button>
    </div>
  );
}
