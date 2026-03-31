'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { TrendPoint } from '../types'

interface TrendChartProps {
  trend: TrendPoint[] | null | undefined
  isLoading: boolean
}

export function TrendChart({ trend, isLoading }: TrendChartProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tendencia de Ejecuciones</h3>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  if (!trend || trend.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tendencia de Ejecuciones</h3>
        <Card className="p-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800 h-80 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              No hay datos de tendencia para el período seleccionado.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Tendencia de Ejecuciones</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={trend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorPassed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="date"
            className="text-xs"
            tick={{ fill: 'currentColor' }}
          />
          <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '4px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTotal)"
            name="Total"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="passed"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPassed)"
            name="Exitosas"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="failed"
            stroke="#ef4444"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorFailed)"
            name="Fallidas"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
