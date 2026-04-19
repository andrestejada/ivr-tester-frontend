import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TestCasesPage } from '../TestCasesPage';
import * as ivrHooks from '@/features/ivr-architectures/hooks';
import * as testCasesHooks from '../hooks';
import type { TestCase } from '../types';

vi.mock('@/features/ivr-architectures/hooks');
vi.mock('../hooks');
vi.mock('../CreateTestCaseForm', () => ({
  CreateTestCaseForm: ({ architectureId, onSuccess }: { architectureId: string; onSuccess: () => void }) => (
    <div>
      <p>create-form:{architectureId}</p>
      <button type="button" onClick={onSuccess}>
        completar-creacion
      </button>
    </div>
  ),
}));
vi.mock('../UpdateTestCaseForm', () => ({
  UpdateTestCaseForm: ({ testCase, onSuccess }: { testCase: TestCase; onSuccess: () => void }) => (
    <div>
      <p>update-form:{testCase.name}</p>
      <button type="button" onClick={onSuccess}>
        completar-edicion
      </button>
    </div>
  ),
}));
vi.mock('../TestCaseTable', () => ({
  TestCaseTable: ({ testCases, onEdit }: { testCases: TestCase[]; onEdit?: (testCase: TestCase) => void }) => (
    <div>
      <p>table-size:{testCases.length}</p>
      <button type="button" onClick={() => onEdit?.(testCases[0])}>
        editar-primer-caso
      </button>
    </div>
  ),
}));

const mockUseIVRArchitectures = vi.mocked(ivrHooks.useIVRArchitectures);
const mockUseTestCases = vi.mocked(testCasesHooks.useTestCases);

const ARCHITECTURES = [
  {
    id: 'arch-1',
    name: 'Arquitectura A',
    phone_number: '573001234567',
    description: 'Descripcion A',
    user_id: 'user-1',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'arch-2',
    name: 'Arquitectura B',
    phone_number: '573001111111',
    description: undefined,
    user_id: 'user-1',
    created_at: '2026-01-02T00:00:00Z',
    updated_at: '2026-01-02T00:00:00Z',
  },
];

const TEST_CASES_BY_ARCH: Record<string, TestCase[]> = {
  'arch-1': [
    {
      id: 'tc-1',
      ivr_architecture_id: 'arch-1',
      name: 'Caso principal',
      flow_script: [{ step: 1, listen: 'Bienvenido', action: 'send_dtmf_1' }],
      created_at: '2026-01-01T10:00:00Z',
    },
  ],
  'arch-2': [
    {
      id: 'tc-2',
      ivr_architecture_id: 'arch-2',
      name: 'Caso alterno',
      flow_script: [{ step: 1, listen: 'Menu alterno', action: 'send_dtmf_2' }],
      created_at: '2026-01-01T11:00:00Z',
    },
  ],
};

function setupDefaultMocks() {
  mockUseIVRArchitectures.mockReturnValue({
    architectures: ARCHITECTURES,
    isLoading: false,
    isError: false,
    error: null,
    errorMessage: '',
  });

  mockUseTestCases.mockImplementation((architectureId: string | null) => ({
    testCases: architectureId ? TEST_CASES_BY_ARCH[architectureId] ?? [] : [],
    isLoading: false,
    isError: false,
    error: null,
    errorMessage: '',
  }));
}

function getArchitectureSelector() {
  return screen.getByRole('combobox');
}

describe('TestCasesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDefaultMocks();
  });

  it('muestra opciones de arquitectura en el selector', () => {
    render(<TestCasesPage />);

    const selector = getArchitectureSelector();
    expect(selector).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /arquitectura a/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /arquitectura b/i })).toBeInTheDocument();
  });

  it('renderiza formulario de creacion al seleccionar arquitectura y cambia a listado al completar', async () => {
    const user = userEvent.setup();
    render(<TestCasesPage />);

    await user.selectOptions(
      getArchitectureSelector(),
      'arch-1'
    );

    expect(screen.getByText('create-form:arch-1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /completar-creacion/i }));

    expect(screen.getByText('table-size:1')).toBeInTheDocument();
  });

  it('abre tab de edicion desde listado y muestra boton de editando', async () => {
    const user = userEvent.setup();
    render(<TestCasesPage />);

    await user.selectOptions(getArchitectureSelector(), 'arch-1');
    await user.click(screen.getByRole('button', { name: /listado/i }));
    await user.click(screen.getByRole('button', { name: /editar-primer-caso/i }));

    expect(screen.getByText('update-form:Caso principal')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /editando: caso principal/i })).toBeInTheDocument();
  });

  it('vuelve al listado cuando termina la edicion y limpia estado de editando', async () => {
    const user = userEvent.setup();
    render(<TestCasesPage />);

    await user.selectOptions(getArchitectureSelector(), 'arch-1');
    await user.click(screen.getByRole('button', { name: /listado/i }));
    await user.click(screen.getByRole('button', { name: /editar-primer-caso/i }));

    await user.click(screen.getByRole('button', { name: /completar-edicion/i }));

    expect(screen.getByText('table-size:1')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /editando:/i })).not.toBeInTheDocument();
  });
});
