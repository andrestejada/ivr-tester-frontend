import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LoginForm } from '@/components/auth/LoginForm'

const noop = vi.fn()

describe('LoginForm', () => {
  it('renderiza los campos de email y contraseña', () => {
    render(<LoginForm onSubmit={noop} />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('no muestra enlace de registrarse', () => {
    render(<LoginForm onSubmit={noop} />)

    expect(screen.queryByText(/registr/i)).not.toBeInTheDocument()
  })

  it('muestra error si el email es inválido al hacer submit', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={noop} />)

    await user.type(screen.getByLabelText(/email/i), 'no-es-un-email')
    await user.type(screen.getByLabelText(/contraseña/i), '123456')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(await screen.findByText(/ingresa un email válido/i)).toBeInTheDocument()
    expect(noop).not.toHaveBeenCalled()
  })

  it('muestra error si la contraseña tiene menos de 6 caracteres', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={noop} />)

    await user.type(screen.getByLabelText(/email/i), 'test@ejemplo.com')
    await user.type(screen.getByLabelText(/contraseña/i), '123')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(await screen.findByText(/al menos 6 caracteres/i)).toBeInTheDocument()
    expect(noop).not.toHaveBeenCalled()
  })

  it('deshabilita el botón cuando isLoading es true', () => {
    render(<LoginForm onSubmit={noop} isLoading={true} />)

    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeDisabled()
  })

  it('llama a onSubmit con los datos correctos cuando el formulario es válido', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn().mockResolvedValue(undefined)
    render(<LoginForm onSubmit={handleSubmit} />)

    await user.type(screen.getByLabelText(/email/i), 'test@ejemplo.com')
    await user.type(screen.getByLabelText(/contraseña/i), 'password123')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(handleSubmit).toHaveBeenCalledWith(
      { email: 'test@ejemplo.com', password: 'password123' },
      expect.anything(),
    )
  })
})
