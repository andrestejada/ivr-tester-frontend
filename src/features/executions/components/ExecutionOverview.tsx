'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Package } from 'lucide-react';
import type { TestExecutionDetailsResponse } from '../types';

interface ExecutionOverviewProps {
  execution: TestExecutionDetailsResponse;
}

export const ExecutionOverview = ({ execution }: ExecutionOverviewProps) => {
  const {
    test_case,
    test_case: { ivr_architecture },
  } = execution;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* IVR Architecture Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5" />
            Arquitectura IVR
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nombre</p>
            <p className="font-semibold">{ivr_architecture.name}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Número de teléfono</p>
            <code className="block text-sm font-mono bg-black/5 dark:bg-white/5 px-2 py-1 rounded">
              {ivr_architecture.phone_number}
            </code>
          </div>

          {ivr_architecture.description && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Descripción</p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {ivr_architecture.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Test Case Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5" />
            Caso de Prueba
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nombre</p>
            <p className="font-semibold">{test_case.name}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Pasos del flujo</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {test_case.flow_script.length}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Creado</p>
            <p className="text-sm">{new Date(test_case.created_at).toLocaleDateString('es-ES')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
