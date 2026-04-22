import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { TestCase } from './types';

export function createColumns(
  onEdit?: (testCase: TestCase) => void,
  onDelete?: (testCase: TestCase) => void
): ColumnDef<TestCase>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 hover:bg-transparent"
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'flow_script',
      header: 'Pasos',
      cell: ({ row }) => {
        const flowScript = row.getValue('flow_script') as Record<string, unknown>[];
        return (
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-blue-600 rounded-full">
            {flowScript.length}
          </span>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 hover:bg-transparent"
        >
          Fecha de creación
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at') as string);
        return date.toLocaleDateString('es-ES');
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const testCase = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(testCase)}>
                Editar
              </DropdownMenuItem>
              {onDelete ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(testCase)}
                  >
                    Eliminar
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

// Para compatibilidad con componentes que aún usan el export por defecto
export const columns = createColumns();
