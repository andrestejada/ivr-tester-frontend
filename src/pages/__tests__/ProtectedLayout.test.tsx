import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useAuth } from '@/hooks/useAuth'
import ProtectedLayout from '@/pages/ProtectedLayout'
import type { AuthContextType } from '@/contexts/auth'
import { mockUser, mockSession } from '@/test/auth-mocks'

vi.mock('@/hooks/useAuth')
vi.mock('@/components/app-sidebar', () => ({
  AppSidebar: () => <div>Sidebar</div>,
}))

const mockUseAuth = vi.mocked(useAuth)

function makeAuth(overrides: Partial<AuthContextType> = {}): AuthContextType {
  return {
    session: null,
    user: null,
    loading: false,
    signOut: vi.fn(),
    ...overrides,
  }
}

function renderLayout(initialPath = '/architectures') {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/architectures" element={<ProtectedLayout />} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedLayout', () => {
  beforeEach(() => vi.clearAllMocks())

  it('muestra skeleton mientras carga la sesión', () => {
    mockUseAuth.mockReturnValue(makeAuth({ loading: true }))
    renderLayout()

    expect(screen.queryByText('IVR Tester')).not.toBeInTheDocument()
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })

  it('redirige a /login cuando no hay sesión activa', () => {
    mockUseAuth.mockReturnValue(makeAuth({ loading: false, session: null }))
    renderLayout()

    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('renderiza el layout cuando hay sesión activa', () => {
    mockUseAuth.mockReturnValue(
      makeAuth({
        loading: false,
        session: mockSession,
        user: mockUser,
      }),
    )
    renderLayout()

    expect(screen.getByText('IVR Tester')).toBeInTheDocument()
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })
})
