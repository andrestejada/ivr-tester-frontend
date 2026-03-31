'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Rankings } from '../types'

interface RankingsComparisonProps {
  rankings: Rankings | null | undefined
  isLoading: boolean
}

export function RankingsComparison({ rankings, isLoading }: RankingsComparisonProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Rankings</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 w-full rounded-lg" />
            <Skeleton className="h-80 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!rankings || (rankings.top_failed.length === 0 && rankings.top_success.length === 0)) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Rankings</h3>
        <Card className="p-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              No hay datos de rankings disponibles para mostrar.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  // Prepare data for top failed chart
  const topFailedData = rankings.top_failed.map((item) => ({
    name: item.test_case_name,
    failureRate: item.failure_rate,
    successRate: item.success_rate,
    executions: item.execution_count,
  }))

  // Prepare data for top success chart
  const topSuccessData = rankings.top_success.map((item) => ({
    name: item.test_case_name,
    successRate: item.success_rate,
    failureRate: item.failure_rate,
    executions: item.execution_count,
  }))

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Rankings</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Failed Cases */}
        <Card className="p-3">
          <h4 className="text-sm font-semibold mb-2">Casos con Más Fallos</h4>
          {topFailedData.length > 0 ? (
            <ResponsiveContainer width="100%" height={topFailedData.length * 45 + 40}>
              <BarChart
                data={topFailedData}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" domain={[0, 100]} className="text-xs" height={15} />
                <YAxis dataKey="name" type="category" width={95} className="text-xs" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => `${(value as number).toFixed(1)}%`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                />
                <Legend height={18} wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                <Bar dataKey="failureRate" fill="#ef4444" name="Fallo" radius={[0, 2, 2, 0]} isAnimationActive={false} />
                <Bar dataKey="successRate" fill="#10b981" name="Éxito" radius={[0, 2, 2, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-32 flex items-center justify-center text-center">
              <p className="text-xs text-muted-foreground">No hay datos</p>
            </div>
          )}
        </Card>

        {/* Top Success Cases */}
        <Card className="p-3">
          <h4 className="text-sm font-semibold mb-2">Casos con Mejor Desempeño</h4>
          {topSuccessData.length > 0 ? (
            <ResponsiveContainer width="100%" height={topSuccessData.length * 45 + 40}>
              <BarChart
                data={topSuccessData}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" domain={[0, 100]} className="text-xs" height={15} />
                <YAxis dataKey="name" type="category" width={95} className="text-xs" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => `${(value as number).toFixed(1)}%`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                />
                <Legend height={18} wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                <Bar dataKey="successRate" fill="#10b981" name="Éxito" radius={[0, 2, 2, 0]} isAnimationActive={false} />
                <Bar dataKey="failureRate" fill="#ef4444" name="Fallo" radius={[0, 2, 2, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-32 flex items-center justify-center text-center">
              <p className="text-xs text-muted-foreground">No hay datos</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
