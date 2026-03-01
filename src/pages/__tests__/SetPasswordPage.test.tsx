import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { supabase } from '@/lib/supabase'
import SetPasswordPage from '@/pages/auth/SetPasswordPage'
import { mockUser, mockSession, makeAuthError } from '@/test/auth-mocks'

const mockNavigate = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      verifyOtp: vi.fn(),
      updateUser: vi.fn(),
    },
  },
}))

vi.mock('react-router-dom', async () => {
  const real = await vi.importActual('react-router-dom')
  return { ...real, useNavigate: () => mockNavigate }
})

const mockVerifyOtp = vi.mocked(supabase.auth.verifyOtp)
const mockUpdateUser = vi.mocked(supabase.auth.updateUser)

function renderPage(search = '') {
  render(
    <MemoryRouter initialEntries={[`/auth/set-password${search}`]}>
      <Routes>
        <Route path="/auth/set-password" element={<SetPasswordPage />} />
        <Route path="/auth/invalid-link" element={<div>Enlace inválido</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('SetPasswordPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('redirige a /auth/invalid-link cuando no hay parámetros PKCE', async () => {
    renderPage()

    expect(await screen.findByText('Enlace inválido')).toBeInTheDocument()
    expect(mockVerifyOtp).not.toHaveBeenCalled()
  })

  it('llama a verifyOtp con los parámetros del enlace', async () => {
    mockVerifyOtp.mockResolvedValue({ data: { user: mockUser, session: mockSession }, error: null })
    renderPage('?token_hash=abc123&type=invite')

    expect(await screen.findByRole('button', { name: /activar cuenta/i })).toBeInTheDocument()
    expect(mockVerifyOtp).toHaveBeenCalledWith({ type: 'invite', token_hash: 'abc123' })
  })

  it('redirige a /auth/invalid-link cuando verifyOtp devuelve error', async () => {
    mockVerifyOtp.mockResolvedValue({
      data: { user: null, session: null },
      error: makeAuthError('Token expired'),
    })
    renderPage('?token_hash=expirado&type=invite')

    expect(await screen.findByText('Enlace inválido')).toBeInTheDocument()
  })

  it('navega a /dashboard tras activar cuenta correctamente', async () => {
    mockVerifyOtp.mockResolvedValue({ data: { user: mockUser, session: mockSession }, error: null })
    mockUpdateUser.mockResolvedValue({ data: { user: mockUser }, error: null })
    const user = userEvent.setup()
    renderPage('?token_hash=abc123&type=invite')

    await screen.findByRole('button', { name: /activar cuenta/i })
    await user.type(screen.getByLabelText(/nombre completo/i), 'Ana García')
    await user.type(screen.getByLabelText(/teléfono/i), '+57 300 000 0000')
    await user.type(screen.getByLabelText(/cargo/i), 'QA Engineer')
    await user.type(screen.getByLabelText(/empresa/i), 'ACME')
    await user.type(screen.getByLabelText(/^nueva contraseña$/i), 'NuevaPass123!')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'NuevaPass123!')
    await user.click(screen.getByRole('button', { name: /activar cuenta/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })
})
