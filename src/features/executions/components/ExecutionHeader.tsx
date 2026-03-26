'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Phone, CheckCircle2, XCircle, AlertCircle, Loader } from 'lucide-react';
import type { TestExecutionDetailsResponse } from '../types';

interface ExecutionHeaderProps {
  execution: TestExecutionDetailsResponse;
}

const getStatusBadgeConfig = (status: string) => {
  switch (status) {
    case 'PASSED':
      return {
        icon: <CheckCircle2 className="h-4 w-4" />,
        label: 'Exitosa',
        bgColor: 'bg-green-50 dark:bg-green-950',
        badgeColor: 'bg-green-600 text-white',
      };
    case 'FAILED':
      return {
        icon: <XCircle className="h-4 w-4" />,
        label: 'Fallida',
        bgColor: 'bg-red-50 dark:bg-red-950',
        badgeColor: 'bg-red-600 text-white',
      };
    case 'ERROR':
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        label: 'Error',
        bgColor: 'bg-orange-50 dark:bg-orange-950',
        badgeColor: 'bg-orange-600 text-white',
      };
    case 'RUNNING':
      return {
        icon: <Loader className="h-4 w-4 animate-spin" />,
        label: 'En ejecución',
        bgColor: 'bg-blue-50 dark:bg-blue-950',
        badgeColor: 'bg-blue-600 text-white',
      };
    default:
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        label: status,
        bgColor: 'bg-gray-50 dark:bg-gray-950',
        badgeColor: 'bg-gray-600 text-white',
      };
  }
};

export const ExecutionHeader = ({ execution }: ExecutionHeaderProps) => {
  const statusConfig = getStatusBadgeConfig(execution.status);
  const executedDate = new Date(execution.executed_at);

  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return '-';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Card className={statusConfig.bgColor}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {statusConfig.icon}
              Ejecución de Prueba
            </CardTitle>
          </div>
          <Badge className={statusConfig.badgeColor}>{statusConfig.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Duración */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duración
            </p>
            <p className="text-lg font-semibold">{formatDuration(execution.duration_seconds)}</p>
          </div>

          {/* SID del proveedor */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Phone className="h-4 w-4" />
              SID del Proveedor
            </p>
            {execution.provider_call_sid ? (
              <code className="block text-sm font-mono bg-black/5 dark:bg-white/5 px-2 py-1 rounded overflow-x-auto">
                {execution.provider_call_sid}
              </code>
            ) : (
              <p className="text-sm text-muted-foreground">-</p>
            )}
          </div>

          {/* Fecha de ejecución */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Fecha de ejecución</p>
            <div className="text-sm">
              <p className="font-semibold">{executedDate.toLocaleDateString('es-ES')}</p>
              <p className="text-muted-foreground">
                {executedDate.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
