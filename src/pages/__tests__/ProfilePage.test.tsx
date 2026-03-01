import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { User } from '@supabase/supabase-js'

import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import ProfilePage from '@/pages/profile/ProfilePage'
import { mockSession, makeAuthError } from '@/test/auth-mocks'

vi.mock('@/hooks/useAuth')
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      updateUser: vi.fn(),
    },
  },
}))

const mockUseAuth = vi.mocked(useAuth)
const mockSignIn = vi.mocked(supabase.auth.signInWithPassword)
const mockUpdateUser = vi.mocked(supabase.auth.updateUser)

const mockUser: User = {
  id: 'user-1',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'ana@ejemplo.com',
  email_confirmed_at: '2024-01-01T00:00:00Z',
  phone: '',
  confirmed_at: '2024-01-01T00:00:00Z',
  last_sign_in_at: '2024-01-01T00:00:00Z',
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: {
    nombre: 'Ana García',
    cargo: 'QA Engineer',
    empresa: 'ACME',
    telefono: '555-1234',
  },
  identities: [],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  is_anonymous: false,
}

function renderPage() {
  render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>,
  )
}

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      session: { ...mockSession, user: mockUser },
      user: mockUser,
      loading: false,
      signOut: vi.fn(),
    })
  })

  it('muestra el email y metadata del usuario', () => {
    renderPage()

    expect(screen.getByText('ana@ejemplo.com')).toBeInTheDocument()
    expect(screen.getByText('Ana García')).toBeInTheDocument()
    expect(screen.getByText('QA Engineer')).toBeInTheDocument()
    expect(screen.getByText('ACME')).toBeInTheDocument()
    expect(screen.getByText('555-1234')).toBeInTheDocument()
  })

  it('muestra error cuando la contraseña actual es incorrecta', async () => {
    mockSignIn.mockResolvedValue({
      data: { user: null, session: null },
      error: makeAuthError('Invalid credentials'),
    })
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText(/contraseña actual/i), 'wrongpass')
    await user.type(screen.getByLabelText(/^nueva contraseña$/i), 'NuevaPass123!')
    await user.type(screen.getByLabelText(/confirmar nueva contraseña/i), 'NuevaPass123!')
    await user.click(screen.getByRole('button', { name: /cambiar contraseña/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/contraseña actual es incorrecta/i)
    expect(mockUpdateUser).not.toHaveBeenCalled()
  })

  it('muestra mensaje de éxito tras cambiar la contraseña', async () => {
    mockSignIn.mockResolvedValue({ data: { user: mockUser, session: mockSession }, error: null })
    mockUpdateUser.mockResolvedValue({ data: { user: mockUser }, error: null })
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText(/contraseña actual/i), 'correctpass')
    await user.type(screen.getByLabelText(/^nueva contraseña$/i), 'NuevaPass123!')
    await user.type(screen.getByLabelText(/confirmar nueva contraseña/i), 'NuevaPass123!')
    await user.click(screen.getByRole('button', { name: /cambiar contraseña/i }))

    expect(await screen.findByRole('status')).toBeInTheDocument()
    expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'NuevaPass123!' })
  })

  it('muestra error si updateUser falla', async () => {
    mockSignIn.mockResolvedValue({ data: { user: mockUser, session: mockSession }, error: null })
    mockUpdateUser.mockResolvedValue({
      data: { user: null },
      error: makeAuthError('Update failed'),
    })
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText(/contraseña actual/i), 'correctpass')
    await user.type(screen.getByLabelText(/^nueva contraseña$/i), 'NuevaPass123!')
    await user.type(screen.getByLabelText(/confirmar nueva contraseña/i), 'NuevaPass123!')
    await user.click(screen.getByRole('button', { name: /cambiar contraseña/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/no se pudo actualizar/i)
  })
})
