'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useIVRArchitectures } from '@/features/ivr-architectures/hooks';
import { useTestCases } from '@/features/test-cases/hooks';
import { ExecutionHistoryTab } from './ExecutionHistoryTab';
import { NewExecutionTab } from './NewExecutionTab';

type Tab = 'history' | 'new';

export function ExecutionsPage() {
  const [selectedArchId, setSelectedArchId] = useState<string | null>(null);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('history');

  // Fetch architectures
  const { architectures, isLoading: isLoadingArchs, errorMessage: archError } = useIVRArchitectures();

  // Fetch test cases for selected architecture
  const { testCases, isLoading: isLoadingTcs, errorMessage: tcError } = useTestCases(selectedArchId);

  // Get the selected architecture and test case objects
  const selectedArchitecture = architectures.find((arch) => arch.id === selectedArchId) || null;
  const selectedTestCase = testCases.find((tc) => tc.id === selectedTestCaseId) || null;

  // Reset test case selection when architecture changes
  const handleArchitectureChange = (archId: string) => {
    setSelectedArchId(archId);
    setSelectedTestCaseId(null);
  };

  // Show message if selected architecture has no test cases
  const showNoCasesMessage =
    selectedArchId && testCases.length === 0 && !isLoadingTcs;

  return (
    <div className="space-y-6">
      {/* Selectors Header */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Configuración</h2>

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
                No hay casos de prueba asociados a esta arquitectura. Crea uno primero.
              </p>
            </div>
          </Card>
        )}

        {/* Test Case Selector */}
        <div className="space-y-2">
          <label htmlFor="testcase-select" className="text-sm font-medium">
            Caso de Prueba
          </label>
          <select
            id="testcase-select"
            value={selectedTestCaseId || ''}
            onChange={(e) => setSelectedTestCaseId(e.target.value)}
            disabled={!selectedArchId || isLoadingTcs || testCases.length === 0}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              {!selectedArchId
                ? 'Selecciona primero una arquitectura'
                : isLoadingTcs
                  ? 'Cargando casos...'
                  : 'Selecciona un caso de prueba'}
            </option>
            {testCases.map((tc) => (
              <option key={tc.id} value={tc.id}>
                {tc.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Tabs Section */}
      <div className="space-y-4">
        <div className="flex gap-2 border-b border-border">
          <Button
            variant={activeTab === 'history' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('history')}
            className="rounded-b-none"
          >
            Historial
          </Button>
          <Button
            variant={activeTab === 'new' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('new')}
            className="rounded-b-none"
          >
            Nueva Ejecución
          </Button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'history' && (
            <ExecutionHistoryTab
              architectureId={selectedArchId}
              testCaseId={selectedTestCaseId}
            />
          )}
          {activeTab === 'new' && (
            <NewExecutionTab
              architecture={selectedArchitecture}
              testCaseId={selectedTestCaseId}
              testCase={selectedTestCase}
            />
          )}
        </div>
      </div>
    </div>
  );
}
