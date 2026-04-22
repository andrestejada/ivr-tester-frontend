'use client';

import { DataTable } from './DataTable';
import { createColumns } from './columns';
import type { TestCase } from './types';

interface TestCaseTableProps {
  testCases: TestCase[];
  isLoading: boolean;
  isEmpty: boolean;
  onEdit?: (testCase: TestCase) => void;
  onDelete?: (testCase: TestCase) => void;
}

export function TestCaseTable({
  testCases,
  isLoading,
  isEmpty,
  onEdit,
  onDelete,
}: TestCaseTableProps) {
  const columns = createColumns(onEdit, onDelete);

  return (
    <DataTable
      columns={columns}
      data={testCases}
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyMessage="Sin casos de prueba"
    />
  );
}
