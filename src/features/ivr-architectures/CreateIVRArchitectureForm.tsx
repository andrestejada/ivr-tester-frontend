import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateIVRArchitecture } from './hooks';
import { createIVRArchitectureSchema } from './schemas';
import type { CreateIVRArchitectureInput } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export function CreateIVRArchitectureForm() {
  const [successMessage, setSuccessMessage] = useState('');

  const { create, isLoading, errorMessage: apiErrorMessage } = useCreateIVRArchitecture();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm<CreateIVRArchitectureInput>({
    resolver: zodResolver(createIVRArchitectureSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateIVRArchitectureInput) => {
    setSuccessMessage('');

    try {
      await create(data);
      setSuccessMessage('Arquitectura creada correctamente');
      reset();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      // Error is handled by hook
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-6">Nueva Arquitectura IVR</h2>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-700">{successMessage}</span>
        </div>
      )}

      {apiErrorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-sm text-red-700">{apiErrorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <Input
            placeholder="Ej: Centro de Atención Telefónica"
            {...register('name')}
            onBlur={() => trigger('name')}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Número de Teléfono</label>
          <Input
            placeholder="Ej: 573001234567"
            {...register('phone_number')}
            onBlur={() => trigger('phone_number')}
            className={errors.phone_number ? 'border-red-500' : ''}
          />
          {errors.phone_number && (
            <p className="text-sm text-red-600 mt-1">{errors.phone_number.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción (Opcional)</label>
          <Textarea
            placeholder="Describe esta arquitectura IVR..."
            {...register('description')}
            onBlur={() => trigger('description')}
            className={errors.description ? 'border-red-500' : ''}
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Spinner className="w-4 h-4 mr-2" />
              Guardando...
            </>
          ) : (
            'Guardar'
          )}
        </Button>
      </form>
    </div>
  );
}
