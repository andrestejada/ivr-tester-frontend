'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import type { Summary } from '../types'

interface PieChartMetricsProps {
  summary: Summary | null | undefined
  isLoading: boolean
}

export function PieChartMetrics({ summary, isLoading }: PieChartMetricsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Distribución de Estados</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full rounded-lg" />
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Distribución de Estados</h3>
        <Card className="p-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              No hay datos disponibles para mostrar las gráficas.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  // Data for pie chart 1: Estados (Exitosas, Fallidas, Errores)
  const statesData = [
    { name: 'Exitosas', value: summary.passed_count, color: '#10b981' },
    { name: 'Fallidas', value: summary.failed_count, color: '#ef4444' },
    { name: 'Errores', value: summary.error_count, color: '#f97316' },
  ].filter(item => item.value > 0)

  // If all values are 0, show a message
  const hasData = statesData.length > 0 && statesData.some(d => d.value > 0)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Distribución de Estados</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado Distribution */}
        <Card className="p-6">
          <h4 className="text-sm font-semibold mb-4">Estados de Ejecución</h4>
          {hasData ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent = 0 }) =>
                    `${(percent * 100).toFixed(1)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-center">
              <p className="text-sm text-muted-foreground">No hay ejecuciones registradas</p>
            </div>
          )}
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
            <p className="text-xs font-medium text-muted-foreground mb-1">Exitosas</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {summary.passed_count}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950">
            <p className="text-xs font-medium text-muted-foreground mb-1">Fallidas</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {summary.failed_count}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950">
            <p className="text-xs font-medium text-muted-foreground mb-1">Errores</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {summary.error_count}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
            <p className="text-xs font-medium text-muted-foreground mb-1">Total</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {summary.total_executions}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
