import { useState } from 'react';
import { useIVRArchitectures } from './hooks';
import { CreateIVRArchitectureForm } from './CreateIVRArchitectureForm';
import { UpdateIVRArchitectureForm } from './UpdateIVRArchitectureForm';
import { ArchitectureTable } from './ArchitectureTable';
import type { IVRArchitecture } from './types';

export function IVRArchitecturesPage() {
  const [activeTab, setActiveTab] = useState<'form' | 'list' | 'edit'>('form');
  const [selectedArchitectureToEdit, setSelectedArchitectureToEdit] = useState<IVRArchitecture | null>(null);
  const { architectures, isLoading } = useIVRArchitectures();

  const handleEditArchitecture = (architecture: IVRArchitecture) => {
    setSelectedArchitectureToEdit(architecture);
    setActiveTab('edit');
  };

  const handleUpdateSuccess = () => {
    setSelectedArchitectureToEdit(null);
    setActiveTab('list');
  };

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Arquitecturas IVR</h1>

        <div className="flex gap-4 mb-6">
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
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Listado ({architectures.length})
          </button>
        </div>

        {activeTab === 'form' && <CreateIVRArchitectureForm />}
        {activeTab === 'list' && (
          <ArchitectureTable 
            architectures={architectures} 
            isLoading={isLoading}
            onEdit={handleEditArchitecture}
          />
        )}
        {activeTab === 'edit' && selectedArchitectureToEdit && (
          <UpdateIVRArchitectureForm
            architecture={selectedArchitectureToEdit}
            onSuccess={handleUpdateSuccess}
          />
        )}
      </div>
    </div>
  );
}
