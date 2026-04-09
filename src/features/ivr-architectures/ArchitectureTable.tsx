import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import type { IVRArchitecture } from './types';

interface ArchitectureTableProps {
  architectures: IVRArchitecture[];
  isLoading: boolean;
  onEdit?: (architecture: IVRArchitecture) => void;
}

export function ArchitectureTable({ architectures, isLoading, onEdit }: ArchitectureTableProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (!architectures.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-sm text-gray-500">No hay arquitecturas registradas.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-sm">Nombre</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Teléfono</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Descripción</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Fecha de creación</th>
              <th className="text-center py-3 px-4 font-semibold text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {architectures.map((arch) => (
              <tr key={arch.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm">{arch.name}</td>
                <td className="py-3 px-4 text-sm">{arch.phone_number}</td>
                <td className="py-3 px-4 text-sm">{arch.description || '-'}</td>
                <td className="py-3 px-4 text-sm">
                  {new Date(arch.created_at).toLocaleDateString('es-ES')}
                </td>
                <td className="py-3 px-4 text-sm text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(arch)}>
                        Editar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
