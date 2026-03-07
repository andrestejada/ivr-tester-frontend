import { useState } from 'react';
import { useIVRArchitectures } from '@/features/ivr-architectures/hooks';
import { useTestCases } from './hooks';
import { TestCaseTable } from './TestCaseTable';
import { CreateTestCaseForm } from './CreateTestCaseForm';
import { Card } from '@/components/ui/card';

export function TestCasesPage() {
  const [selectedArchitectureId, setSelectedArchitectureId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('form');

  const { architectures, isLoading: loadingArchitectures } = useIVRArchitectures();
  const { testCases, isLoading: loadingTestCases } = useTestCases(selectedArchitectureId);

  const selectedArchitecture = architectures.find((arch) => arch.id === selectedArchitectureId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Casos de Prueba</h1>
        <p className="text-muted-foreground">
          Crea y gestiona los casos de prueba para tus arquitecturas IVR.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'list'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Listado ({testCases.length})
        </button>
        <button
          onClick={() => setActiveTab('form')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'form'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Crear Nueva
        </button>
      </div>

      {/* Selector de Arquitectura - Visible en ambos tabs */}
      <Card className="p-6">
        <label className="block text-sm font-medium mb-2">Selecciona una Arquitectura IVR</label>
        <select
          value={selectedArchitectureId || ''}
          onChange={(e) => setSelectedArchitectureId(e.target.value || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={loadingArchitectures}
        >
          <option value="">-- Selecciona una arquitectura --</option>
          {architectures.map((arch) => (
            <option key={arch.id} value={arch.id}>
              {arch.name}
            </option>
          ))}
        </select>
      </Card>

      {/* Tab: Listado */}
      {activeTab === 'list' && selectedArchitectureId && (
        <TestCaseTable
          testCases={testCases}
          isLoading={loadingTestCases}
          isEmpty={testCases.length === 0}
        />
      )}

      {/* Tab: Crear Nuevo */}
      {activeTab === 'form' && selectedArchitectureId && (
        <>
          {/* Información de la Arquitectura Seleccionada */}
          {selectedArchitecture && (
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-semibold text-gray-600">Nombre</span>
                  <p className="text-lg font-medium">{selectedArchitecture.name}</p>
                </div>
                {selectedArchitecture.description && (
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Descripción</span>
                    <p className="text-sm text-gray-700">{selectedArchitecture.description}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-semibold text-gray-600">Fecha de creación</span>
                  <p className="text-sm text-gray-700">
                    {new Date(selectedArchitecture.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Formulario de Creación */}
          <CreateTestCaseForm
            architectureId={selectedArchitectureId}
            onSuccess={() => setActiveTab('list')}
          />
        </>
      )}
    </div>
  );
}
