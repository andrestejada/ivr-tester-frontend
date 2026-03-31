'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import type { Summary } from '../types'

interface SummaryCardsProps {
  summary: Summary | null | undefined
  isLoading: boolean
}

export function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Resumen General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Resumen General</h3>
        <Card className="p-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              No hay datos de resumen disponibles para los filtros seleccionados.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  const metrics = [
    {
      label: 'Total',
      value: summary.total_executions,
      color: 'bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Exitosas',
      value: summary.passed_count,
      color: 'bg-green-50 dark:bg-green-950 border-l-4 border-green-500',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Fallidas',
      value: summary.failed_count,
      color: 'bg-red-50 dark:bg-red-950 border-l-4 border-red-500',
      textColor: 'text-red-600 dark:text-red-400',
    },
    {
      label: 'Errores',
      value: summary.error_count,
      color: 'bg-orange-50 dark:bg-orange-950 border-l-4 border-orange-500',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: 'En Ejecución',
      value: summary.running_count,
      color: 'bg-purple-50 dark:bg-purple-950 border-l-4 border-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Tasa de Éxito',
      value: `${summary.success_rate.toFixed(1)}%`,
      color: 'bg-indigo-50 dark:bg-indigo-950 border-l-4 border-indigo-500',
      textColor: 'text-indigo-600 dark:text-indigo-400',
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Resumen General</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className={`p-4 border ${metric.color}`}>
            <p className="text-xs font-medium text-muted-foreground mb-2">{metric.label}</p>
            <p className={`text-2xl font-bold ${metric.textColor}`}>{metric.value}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
