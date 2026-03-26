'use client';

import { DataTable } from '@/features/test-cases/DataTable';
import { useTestExecutions } from './hooks';
import { getColumns } from './columns';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ExecutionHistoryTabProps {
  architectureId: string | null;
  testCaseId: string | null;
}

export function ExecutionHistoryTab({
  architectureId,
  testCaseId,
}: ExecutionHistoryTabProps) {
  const { executions, isLoading, isError, errorMessage } = useTestExecutions(
    architectureId,
    testCaseId
  );

  // Show empty state if no architecture or test case selected
  if (!architectureId || !testCaseId) {
    return (
      <Card className="p-6 border-dashed">
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="h-5 w-5" />
          <p>Selecciona una arquitectura y caso de prueba para ver el historial</p>
        </div>
      </Card>
    );
  }

  // Generate columns with context (architectureId, testCaseId)
  const columns = getColumns(architectureId, testCaseId);

  return (
    <div className="space-y-4">
      {isError && (
        <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">{errorMessage}</p>
          </div>
        </Card>
      )}

      <DataTable
        columns={columns}
        data={executions}
        isLoading={isLoading}
        isEmpty={executions.length === 0 && !isLoading}
        emptyMessage="No hay ejecuciones registradas para este caso de prueba"
      />
    </div>
  );
}
