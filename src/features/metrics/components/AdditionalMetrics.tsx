'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock } from 'lucide-react';
import type { Summary } from '../types';

interface AdditionalMetricsProps {
  summary: Summary | null | undefined;
  isLoading: boolean;
}

export function AdditionalMetrics({ summary, isLoading }: AdditionalMetricsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Detalles Adicionales</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Detalles Adicionales</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-cyan-500 bg-cyan-50 dark:bg-cyan-950">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Tasa de Fallos</p>
              <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                {summary.failure_rate.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-pink-500 bg-pink-50 dark:bg-pink-950">
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Duración Promedio</p>
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {summary.avg_duration_seconds
                  ? `${summary.avg_duration_seconds.toFixed(2)}s`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Total Ejecutadas</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {summary.total_executions}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
