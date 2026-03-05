import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { supabase } from '@/lib/supabase'
import LoginPage from '@/pages/auth/LoginPage'
import { mockUser, mockSession, makeAuthError } from '@/test/auth-mocks'

const mockNavigate = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}))

vi.mock('react-router-dom', async () => {
  const real = await vi.importActual('react-router-dom')
  return { ...real, useNavigate: () => mockNavigate }
})

const mockSignIn = vi.mocked(supabase.auth.signInWithPassword)

function renderPage() {
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('navega a /architectures cuando las credenciales son correctas', async () => {
    mockSignIn.mockResolvedValue({ data: { user: mockUser, session: mockSession }, error: null })
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText(/email/i), 'test@ejemplo.com')
    await user.type(screen.getByLabelText(/contraseña/i), 'password123')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'test@ejemplo.com',
      password: 'password123',
    })
    expect(mockNavigate).toHaveBeenCalledWith('/architectures')
  })

  it('muestra mensaje de error cuando las credenciales son incorrectas', async () => {
    mockSignIn.mockResolvedValue({
      data: { user: null, session: null },
      error: makeAuthError('Invalid credentials'),
    })
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText(/email/i), 'test@ejemplo.com')
    await user.type(screen.getByLabelText(/contraseña/i), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/credenciales incorrectas/i)
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('no navega si el formulario tiene errores de validación', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText(/email/i), 'no-es-email')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(mockSignIn).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
