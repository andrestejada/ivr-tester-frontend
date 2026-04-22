import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IVRArchitecturesPage } from '../IVRArchitecturesPage';
import * as api from '../api';

vi.mock('../api');

const mockCreateIVRArchitecture = vi.mocked(api.createIVRArchitecture);
const mockDeleteIVRArchitecture = vi.mocked(api.deleteIVRArchitecture);
const mockListIVRArchitectures = vi.mocked(api.listIVRArchitectures);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

function renderPage() {
  return render(
    <QueryClientProvider client={queryClient}>
      <IVRArchitecturesPage />
    </QueryClientProvider>
  );
}

describe('IVRArchitecturesPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    mockListIVRArchitectures.mockResolvedValue([]);
  });

  it('renderiza página con tabs de Crear y Listado', async () => {
    mockListIVRArchitectures.mockResolvedValueOnce([]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Arquitecturas IVR')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /crear nueva/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /listado/i })).toBeInTheDocument();
    });
  });

  it('muestra formulario en tab Crear Nueva por defecto', async () => {
    mockListIVRArchitectures.mockResolvedValueOnce([]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Nueva Arquitectura IVR')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
    });
  });

  it('cambia a tab de Listado al hacer click', async () => {
    mockListIVRArchitectures.mockResolvedValueOnce([]);
    const user = userEvent.setup();
    renderPage();

    await screen.findByText('Arquitecturas IVR');
    const listadoTab = screen.getByRole('button', { name: /listado/i });
    await user.click(listadoTab);

    await waitFor(() => {
      expect(screen.getByText(/no hay arquitecturas registradas/i)).toBeInTheDocument();
    });
  });

  it('crea arquitectura y muestra confirmación de éxito', async () => {
    const newArch = {
      id: '123',
      name: 'Test Arch',
      phone_number: '573001234567',
      description: 'Test description',
      user_id: 'user-123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockListIVRArchitectures.mockResolvedValueOnce([]);
    mockCreateIVRArchitecture.mockResolvedValueOnce(newArch);

    const user = userEvent.setup();
    renderPage();

    await screen.findByText('Nueva Arquitectura IVR');
    
    await user.type(
      screen.getByPlaceholderText(/ej: centro de atención telefónica/i),
      'Test Arch'
    );
    await user.type(
      screen.getByPlaceholderText(/ej: 573001234567/i),
      '573001234567'
    );
    await user.type(
      screen.getByPlaceholderText(/describe esta arquitectura ivr/i),
      'Test description'
    );

    await user.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => {
      expect(screen.getByText('Arquitectura creada correctamente')).toBeInTheDocument();
    });
  });

  it('muestra contador de arquitecturas en tab Listado', async () => {
    mockListIVRArchitectures.mockResolvedValueOnce([
      {
        id: '1',
        name: 'Arch 1',
        phone_number: '573001111111',
        description: 'Desc 1',
        user_id: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Arch 2',
        phone_number: '573002222222',
        description: 'Desc 2',
        user_id: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
    
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /listado \(2\)/i })).toBeInTheDocument();
    });
  });

  it('cumple con AC-6: muestra erro banner no bloqueante', async () => {
    mockListIVRArchitectures.mockResolvedValueOnce([]);
    mockCreateIVRArchitecture.mockRejectedValueOnce({
      status: 409,
      data: {},
    });

    const user = userEvent.setup();
    renderPage();

    await screen.findByText('Nueva Arquitectura IVR');
    
    await user.type(
      screen.getByPlaceholderText(/ej: centro de atención telefónica/i),
      'Duplicado'
    );
    await user.type(
      screen.getByPlaceholderText(/ej: 573001234567/i),
      '573001234567'
    );

    await user.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/ya existe una arquitectura/i)
      ).toBeInTheDocument();
    });
  });

  it('abre confirmación y elimina arquitectura desde el dropdown', async () => {
    mockListIVRArchitectures.mockResolvedValue([
      {
        id: 'arch-1',
        name: 'Arch para borrar',
        phone_number: '573001111111',
        description: 'Desc',
        user_id: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
    mockDeleteIVRArchitecture.mockResolvedValueOnce();

    const user = userEvent.setup();
    renderPage();

    await screen.findByText('Arquitecturas IVR');
    await user.click(screen.getByRole('button', { name: /listado/i }));

    await user.click(screen.getByRole('button', { name: /abrir menú/i }));
    await user.click(await screen.findByRole('menuitem', { name: /eliminar/i }));

    expect(screen.getByText(/esta acción no se puede deshacer/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^eliminar$/i }));

    await waitFor(() => {
      expect(mockDeleteIVRArchitecture).toHaveBeenCalledWith('arch-1');
    });
  });
});
