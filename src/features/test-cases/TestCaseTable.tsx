'use client';

import { DataTable } from './DataTable';
import { columns } from './columns';
import type { TestCase } from './types';

interface TestCaseTableProps {
  testCases: TestCase[];
  isLoading: boolean;
  isEmpty: boolean;
}

export function TestCaseTable({ testCases, isLoading, isEmpty }: TestCaseTableProps) {
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
