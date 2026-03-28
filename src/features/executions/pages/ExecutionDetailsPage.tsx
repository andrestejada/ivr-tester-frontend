'use client';

import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useTestExecutionDetails } from '../hooks';
import { ExecutionHeader } from '../components/ExecutionHeader';
import { ExecutionOverview } from '../components/ExecutionOverview';
import { ExecutionTranscript } from '../components/ExecutionTranscript';
import { ExecutionLogsList } from '../components/ExecutionLogsList';

export const ExecutionDetailsPage = () => {
  const navigate = useNavigate();
  const { architectureId, testCaseId, executionId } = useParams<{
    architectureId: string;
    testCaseId: string;
    executionId: string;
  }>();

  const { executionDetails, isLoading, isError, errorMessage } = useTestExecutionDetails(
    architectureId ?? null,
    testCaseId ?? null,
    executionId ?? null
  );

  if (!architectureId || !testCaseId || !executionId) {
    return (
      <div className="p-6 space-y-4">
        <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">
              Parámetros inválidos en la URL
            </p>
          </div>
        </Card>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Cargando detalles de la ejecución...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !executionDetails) {
    return (
      <div className="p-6 space-y-4">
        <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 dark:text-red-200">Error al cargar</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {errorMessage || 'No se pudieron cargar los detalles de la ejecución'}
              </p>
            </div>
          </div>
        </Card>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Back Button */}
      <div>
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="sm"
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al historial
        </Button>
      </div>

      {/* Overview de Test Case e IVR Architecture */}
      <ExecutionOverview execution={executionDetails} />

      {/* Header con KPIs */}
      <ExecutionHeader execution={executionDetails} />

      {/* Transcripción Completa */}
      <ExecutionTranscript transcript={executionDetails.full_call_transcript} />

      {/* Logs de Ejecución */}
      <ExecutionLogsList logs={executionDetails.logs} />
    </div>
  );
};
