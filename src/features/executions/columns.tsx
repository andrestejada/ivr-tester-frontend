import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TestExecution } from '@/features/test-cases/types';
import { ExecutionActionsCell } from './components/ExecutionActionsCell';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PASSED':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'FAILED':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'ERROR':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'RUNNING':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    PASSED: 'Exitosa',
    FAILED: 'Fallida',
    ERROR: 'Error',
    RUNNING: 'En ejecución',
  };
  return labels[status] || status;
};

export const getColumns = (
  architectureId: string,
  testCaseId: string
): ColumnDef<TestExecution>[] => [
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 hover:bg-transparent"
      >
        Estado
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge className={`${getStatusColor(status)} border-0`}>{getStatusLabel(status)}</Badge>
      );
    },
  },
  {
    accessorKey: 'duration_seconds',
    header: 'Duración (seg)',
    cell: ({ row }) => {
      const duration = row.getValue('duration_seconds') as number | null;
      return <span className="font-mono">{duration ?? '-'}</span>;
    },
  },
  {
    accessorKey: 'provider_call_sid',
    header: 'SID Proveedor',
    cell: ({ row }) => {
      const sid = row.getValue('provider_call_sid') as string | null;
      if (!sid) return <span className="text-gray-400">-</span>;
      return (
        <span className="font-mono text-sm" title={sid}>
          {sid.slice(0, 8)}...
        </span>
      );
    },
  },
  {
    accessorKey: 'executed_at',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 hover:bg-transparent"
      >
        Fecha de ejecución
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('executed_at') as string);
      return (
        <span title={date.toLocaleString('es-ES')}>
          {date.toLocaleDateString('es-ES')}{' '}
          {date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => (
      <ExecutionActionsCell
        executionId={row.original.id}
        architectureId={architectureId}
        testCaseId={testCaseId}
      />
    ),
    enableSorting: false,
  },
];
