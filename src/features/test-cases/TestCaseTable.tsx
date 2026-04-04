'use client';

import { DataTable } from './DataTable';
import { createColumns } from './columns';
import type { TestCase } from './types';

interface TestCaseTableProps {
  testCases: TestCase[];
  isLoading: boolean;
  isEmpty: boolean;
  onEdit?: (testCase: TestCase) => void;
}

export function TestCaseTable({ testCases, isLoading, isEmpty, onEdit }: TestCaseTableProps) {
  const columns = createColumns(onEdit);

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
