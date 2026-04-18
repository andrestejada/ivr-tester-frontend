import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ExecutionsPage } from '../ExecutionsPage';
import * as ivrHooks from '@/features/ivr-architectures/hooks';
import * as testCaseHooks from '@/features/test-cases/hooks';

vi.mock('@/features/ivr-architectures/hooks');
vi.mock('@/features/test-cases/hooks');
vi.mock('../ExecutionHistoryTab', () => ({
  ExecutionHistoryTab: ({ architectureId, testCaseId }: { architectureId: string | null; testCaseId: string | null }) => (
    <div>
      history-tab:{architectureId ?? 'none'}:{testCaseId ?? 'none'}
    </div>
  ),
}));
vi.mock('../NewExecutionTab', () => ({
  NewExecutionTab: ({
    architecture,
    testCaseId,
    testCase,
  }: {
    architecture: { id: string } | null;
    testCaseId: string | null;
    testCase: { id: string } | null;
  }) => (
    <div>
      new-tab:{architecture?.id ?? 'none'}:{testCaseId ?? 'none'}:{testCase?.id ?? 'none'}
    </div>
  ),
}));

const mockUseIVRArchitectures = vi.mocked(ivrHooks.useIVRArchitectures);
const mockUseTestCases = vi.mocked(testCaseHooks.useTestCases);

const ARCHITECTURES = [
  {
    id: 'arch-1',
    name: 'Arquitectura Uno',
    phone_number: '573001234567',
    description: 'Principal',
    user_id: 'user-1',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'arch-2',
    name: 'Arquitectura Dos',
    phone_number: '573001111111',
    description: 'Sin casos',
    user_id: 'user-1',
    created_at: '2026-01-02T00:00:00Z',
    updated_at: '2026-01-02T00:00:00Z',
  },
];

const TEST_CASES_BY_ARCH = {
  'arch-1': [
    {
      id: 'tc-1',
      ivr_architecture_id: 'arch-1',
      name: 'Caso A',
      flow_script: [{ step: 1, listen: 'Bienvenido', action: 'send_dtmf_1' }],
      created_at: '2026-01-01T10:00:00Z',
    },
  ],
  'arch-2': [],
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
    testCases: architectureId ? TEST_CASES_BY_ARCH[architectureId as keyof typeof TEST_CASES_BY_ARCH] : [],
    isLoading: false,
    isError: false,
    error: null,
    errorMessage: '',
  }));
}

describe('ExecutionsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDefaultMocks();
  });

  it('mantiene deshabilitado el selector de caso de prueba hasta elegir arquitectura', () => {
    render(<ExecutionsPage />);

    const testCaseSelector = screen.getByLabelText(/caso de prueba/i);
    expect(testCaseSelector).toBeDisabled();
    expect(screen.getByText('history-tab:none:none')).toBeInTheDocument();
  });

  it('resetea el caso de prueba seleccionado cuando cambia la arquitectura', async () => {
    const user = userEvent.setup();
    render(<ExecutionsPage />);

    const architectureSelector = screen.getByLabelText(/arquitectura ivr/i);
    const testCaseSelector = screen.getByLabelText(/caso de prueba/i);

    await user.selectOptions(architectureSelector, 'arch-1');
    expect(testCaseSelector).toBeEnabled();

    await user.selectOptions(testCaseSelector, 'tc-1');
    expect((testCaseSelector as HTMLSelectElement).value).toBe('tc-1');

    await user.selectOptions(architectureSelector, 'arch-2');

    expect((testCaseSelector as HTMLSelectElement).value).toBe('');
    expect(testCaseSelector).toBeDisabled();
    expect(
      screen.getByText(/no hay casos de prueba asociados a esta arquitectura/i)
    ).toBeInTheDocument();
  });

  it('muestra error de arquitecturas cuando la carga falla', () => {
    mockUseIVRArchitectures.mockReturnValue({
      architectures: [],
      isLoading: false,
      isError: true,
      error: new Error('error'),
      errorMessage: 'No fue posible cargar arquitecturas',
    });

    render(<ExecutionsPage />);

    expect(screen.getByText(/no fue posible cargar arquitecturas/i)).toBeInTheDocument();
  });

  it('muestra error de casos solo cuando existe una arquitectura seleccionada', async () => {
    const user = userEvent.setup();
    mockUseTestCases.mockImplementation((architectureId: string | null) => ({
      testCases: [],
      isLoading: false,
      isError: Boolean(architectureId),
      error: architectureId ? new Error('error casos') : null,
      errorMessage: architectureId ? 'Error cargando casos de prueba' : '',
    }));

    render(<ExecutionsPage />);

    expect(screen.queryByText(/error cargando casos de prueba/i)).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/arquitectura ivr/i), 'arch-1');

    expect(screen.getByText(/error cargando casos de prueba/i)).toBeInTheDocument();
  });

  it('envia el contexto seleccionado al tab de nueva ejecucion', async () => {
    const user = userEvent.setup();
    render(<ExecutionsPage />);

    await user.selectOptions(screen.getByLabelText(/arquitectura ivr/i), 'arch-1');
    await user.selectOptions(screen.getByLabelText(/caso de prueba/i), 'tc-1');

    await user.click(screen.getByRole('button', { name: /nueva ejecuci.n/i }));

    expect(screen.getByText('new-tab:arch-1:tc-1:tc-1')).toBeInTheDocument();
  });
});
