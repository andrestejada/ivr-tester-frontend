import { useState } from 'react';
import { useDeleteIVRArchitecture, useIVRArchitectures } from './hooks';
import { CreateIVRArchitectureForm } from './CreateIVRArchitectureForm';
import { UpdateIVRArchitectureForm } from './UpdateIVRArchitectureForm';
import { ArchitectureTable } from './ArchitectureTable';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import type { IVRArchitecture } from './types';

export function IVRArchitecturesPage() {
  const [activeTab, setActiveTab] = useState<'form' | 'list' | 'edit'>('form');
  const [selectedArchitectureToEdit, setSelectedArchitectureToEdit] = useState<IVRArchitecture | null>(null);
  const [selectedArchitectureToDelete, setSelectedArchitectureToDelete] = useState<IVRArchitecture | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const { architectures, isLoading } = useIVRArchitectures();
  const { remove, isLoading: isDeleting, errorMessage: deleteErrorMessage } = useDeleteIVRArchitecture();

  const handleEditArchitecture = (architecture: IVRArchitecture) => {
    setSelectedArchitectureToEdit(architecture);
    setActiveTab('edit');
  };

  const handleUpdateSuccess = () => {
    setSelectedArchitectureToEdit(null);
    setActiveTab('list');
  };

  const handleDeleteArchitecture = (architecture: IVRArchitecture) => {
    setDeleteError('');
    setSelectedArchitectureToDelete(architecture);
  };

  const handleConfirmDelete = async () => {
    if (!selectedArchitectureToDelete) {
      return;
    }

    setDeleteError('');
    try {
      await remove(selectedArchitectureToDelete.id);
      if (selectedArchitectureToEdit?.id === selectedArchitectureToDelete.id) {
        setSelectedArchitectureToEdit(null);
      }
      setActiveTab('list');
      setSelectedArchitectureToDelete(null);
    } catch {
      setDeleteError(deleteErrorMessage || 'No se pudo eliminar la arquitectura.');
    }
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
            onDelete={handleDeleteArchitecture}
          />
        )}
        {activeTab === 'edit' && selectedArchitectureToEdit && (
          <UpdateIVRArchitectureForm
            architecture={selectedArchitectureToEdit}
            onSuccess={handleUpdateSuccess}
          />
        )}
      </div>

      <ConfirmationDialog
        open={!!selectedArchitectureToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedArchitectureToDelete(null);
            setDeleteError('');
          }
        }}
        title="Eliminar arquitectura"
        description={`Si continúas, se eliminarán en cascada todos los test cases, ejecuciones y datos relacionados de ${selectedArchitectureToDelete?.name ?? 'esta arquitectura'}. Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        errorMessage={deleteError}
      />
    </div>
  );
}
