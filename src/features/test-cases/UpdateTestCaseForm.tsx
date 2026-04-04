import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateTestCase } from './hooks';
import { createTestCaseSchema, mapTestCaseBackendError } from './schemas';
import type { CreateTestCaseInput, TestCase } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, Check, Plus, Trash2 } from 'lucide-react';

interface UpdateTestCaseFormProps {
  architectureId: string;
  testCase: TestCase;
  onSuccess?: () => void;
}

export function UpdateTestCaseForm({
  architectureId,
  testCase,
  onSuccess,
}: UpdateTestCaseFormProps) {
  const [successMessage, setSuccessMessage] = useState('');

  const { update, isLoading, errorMessage: apiErrorMessage } =
    useUpdateTestCase(architectureId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    control,
  } = useForm<CreateTestCaseInput>({
    resolver: zodResolver(createTestCaseSchema),
    mode: 'onBlur',
    defaultValues: {
      name: testCase.name,
      flow_script: testCase.flow_script.map((step) => ({
        listen: step.listen,
        action: step.action || '',
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'flow_script',
  });

  const onSubmit = async (data: CreateTestCaseInput) => {
    setSuccessMessage('');

    try {
      await update({
        testCaseId: testCase.id,
        data,
      });
      setSuccessMessage('Caso de prueba actualizado correctamente');
      onSuccess?.();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      // Error is handled by hook
    }
  };

  const handleAddStep = () => {
    append({ listen: '', action: '' });
  };

  const handleRemoveStep = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-6">Editar Caso de Prueba</h2>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-700">{successMessage}</span>
        </div>
      )}

      {apiErrorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-sm text-red-700">{mapTestCaseBackendError(apiErrorMessage)}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium mb-1">Nombre del caso de prueba</label>
          <Input
            placeholder="Ej: Flujo de bienvenida"
            {...register('name')}
            onBlur={() => trigger('name')}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        {/* Pasos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium">Pasos del flujo</label>
            <span className="text-xs text-gray-500">{fields.length} paso(s)</span>
          </div>

          {errors.flow_script && errors.flow_script.message && (
            <p className="text-sm text-red-600 mb-3">
              {String(errors.flow_script.message)}
            </p>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border border-gray-200 rounded-md bg-gray-50 space-y-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-500 bg-gray-300 px-2 py-1 rounded">
                    Paso {index + 1}
                  </span>
                </div>

                {/* Listen */}
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Texto esperado *
                  </label>
                  <Input
                    placeholder="Ej: Bienvenido al sistema"
                    {...register(`flow_script.${index}.listen`)}
                    onBlur={() => trigger(`flow_script.${index}.listen`)}
                    className={
                      errors.flow_script?.[index]?.listen ? 'border-red-500' : ''
                    }
                  />
                  {errors.flow_script?.[index]?.listen && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.flow_script[index]?.listen?.message}
                    </p>
                  )}
                </div>

                {/* Action */}
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Acción (Opcional)
                  </label>
                  <Input
                    placeholder="Ej: send_dtmf_1"
                    {...register(`flow_script.${index}.action`)}
                    onBlur={() => trigger(`flow_script.${index}.action`)}
                    className={
                      errors.flow_script?.[index]?.action ? 'border-red-500' : ''
                    }
                  />
                  {errors.flow_script?.[index]?.action && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.flow_script[index]?.action?.message}
                    </p>
                  )}
                </div>

                {/* Botón eliminar */}
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(index)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                    Eliminar paso
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Botón agregar paso */}
          <button
            type="button"
            onClick={handleAddStep}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            Agregar paso
          </button>
        </div>

        {/* Submit */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Spinner className="w-4 h-4 mr-2" />
              Guardando...
            </>
          ) : (
            'Guardar cambios'
          )}
        </Button>
      </form>
    </div>
  );
}
