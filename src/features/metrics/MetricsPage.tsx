'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle, Calendar } from 'lucide-react';
import { useIVRArchitectures } from '@/features/ivr-architectures/hooks';
import { useTestCases } from '@/features/test-cases/hooks';
import { useAnalytics } from './hooks';
import { PieChartMetrics } from './components/PieChartMetrics';
import { TrendChart } from './components/TrendChart';
import { RankingsComparison } from './components/RankingsComparison';

// Helper function to get last N days
function getLastNDays(days: number): { from: string; to: string } {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  
  const from = new Date(today);
  from.setDate(from.getDate() - (days - 1));
  
  const toDate = today.toISOString().split('T')[0];
  const fromDate = from.toISOString().split('T')[0];
  
  return { from: fromDate, to: toDate };
}

export function MetricsPage() {
  // Initialize with last 7 days
  const { from: initialFrom, to: initialTo } = getLastNDays(7);
  
  const [selectedArchId, setSelectedArchId] = useState<string | null>(null);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<string>(initialFrom);
  const [dateTo, setDateTo] = useState<string>(initialTo);
  
  // Format dates for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00Z');
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Fetch architectures
  const {
    architectures,
    isLoading: isLoadingArchs,
    errorMessage: archError,
  } = useIVRArchitectures();

  // Fetch test cases for selected architecture
  const {
    testCases,
    isLoading: isLoadingTcs,
    errorMessage: tcError,
  } = useTestCases(selectedArchId);

  // Fetch analytics with filters
  const {
    analytics,
    isLoading: isLoadingAnalytics,
    errorMessage: analyticsError,
  } = useAnalytics(selectedArchId, {
    test_case_id: selectedTestCaseId || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    include: ['summary', 'trend', 'rankings'],
  });

  // Reset test case selection when architecture changes
  const handleArchitectureChange = (archId: string) => {
    setSelectedArchId(archId);
    setSelectedTestCaseId(null);
  };

  // Show message if selected architecture has no test cases
  const showNoCasesMessage = selectedArchId && testCases.length === 0 && !isLoadingTcs;

  // Check if analytics is loading
  const isLoadingData = isLoadingAnalytics;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold">Métricas</h1>
        <p className="text-muted-foreground mt-1">
          Analiza el desempeño de tus pruebas por arquitectura
        </p>
      </div>

      {/* Selectors and Filters */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Filtros</h2>

        {/* Architecture Error */}
        {archError && (
          <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{archError}</p>
            </div>
          </Card>
        )}

        {/* Architecture Selector */}
        <div className="space-y-2">
          <label htmlFor="architecture-select" className="text-sm font-medium">
            Arquitectura IVR
          </label>
          <select
            id="architecture-select"
            value={selectedArchId || ''}
            onChange={(e) => handleArchitectureChange(e.target.value)}
            disabled={isLoadingArchs}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              {isLoadingArchs ? 'Cargando arquitecturas...' : 'Selecciona una arquitectura'}
            </option>
            {architectures.map((arch) => (
              <option key={arch.id} value={arch.id}>
                {arch.name}
              </option>
            ))}
          </select>
        </div>

        {/* Test Case Error */}
        {tcError && selectedArchId && (
          <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{tcError}</p>
            </div>
          </Card>
        )}

        {/* No Test Cases Message */}
        {showNoCasesMessage && (
          <Card className="p-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                No hay casos de prueba asociados a esta arquitectura. Las métricas mostrarán
                agregación de todas las ejecuciones.
              </p>
            </div>
          </Card>
        )}

        {/* Test Case Selector (optional) */}
        <div className="space-y-2">
          <label htmlFor="testcase-select" className="text-sm font-medium">
            Caso de Prueba (Opcional)
          </label>
          <select
            id="testcase-select"
            value={selectedTestCaseId || ''}
            onChange={(e) => setSelectedTestCaseId(e.target.value || null)}
            disabled={!selectedArchId || isLoadingTcs}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              {!selectedArchId
                ? 'Selecciona primero una arquitectura'
                : isLoadingTcs
                  ? 'Cargando casos...'
                  : 'Todos los casos de prueba'}
            </option>
            {testCases.map((tc) => (
              <option key={tc.id} value={tc.id}>
                {tc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="date-from" className="text-sm font-medium">
              Desde (Opcional)
            </label>
            <input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              disabled={!selectedArchId}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="date-to" className="text-sm font-medium">
              Hasta (Opcional)
            </label>
            <input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              disabled={!selectedArchId}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        {/* Date Range Display */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <span className="font-semibold">Rango de análisis:</span> {formatDate(dateFrom)} al{' '}
            {formatDate(dateTo)}
          </p>
        </div>

        {/* Analytics Error */}
        {analyticsError && (
          <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{analyticsError}</p>
            </div>
          </Card>
        )}
      </Card>

      {/* Content Area */}
      {selectedArchId ? (
        <div className="space-y-6">
          {/* Pie Chart Metrics & Summary */}
          <PieChartMetrics summary={analytics?.summary} isLoading={isLoadingData} />

          {/* Trend Chart */}
          <TrendChart trend={analytics?.trend} isLoading={isLoadingData} />

          {/* Rankings Comparison */}
          <RankingsComparison rankings={analytics?.rankings} isLoading={isLoadingData} />
        </div>
      ) : (
        <Card className="p-8 text-center border-dashed">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Selecciona una arquitectura para ver las métricas</p>
        </Card>
      )}
    </div>
  );
}
