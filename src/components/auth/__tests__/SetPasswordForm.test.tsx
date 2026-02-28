import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SetPasswordForm } from '@/components/auth/SetPasswordForm'

const noop = vi.fn()

describe('SetPasswordForm', () => {
  it('renderiza los campos de nueva contraseña y confirmación', () => {
    render(<SetPasswordForm onSubmit={noop} />)

    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cargo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/empresa/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nueva contraseña/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /activar cuenta/i })).toBeInTheDocument()
  })

  it('muestra error si la contraseña tiene menos de 8 caracteres', async () => {
    const user = userEvent.setup()
    render(<SetPasswordForm onSubmit={noop} />)

    await user.type(screen.getByLabelText(/nombre completo/i), 'Juan Pérez')
    await user.type(screen.getByLabelText(/teléfono/i), '+57 300 000 0000')
    await user.type(screen.getByLabelText(/cargo/i), 'Analista')
    await user.type(screen.getByLabelText(/empresa/i), 'Empresa S.A.')
    await user.type(screen.getByLabelText(/nueva contraseña/i), '1234567')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), '1234567')
    await user.click(screen.getByRole('button', { name: /activar cuenta/i }))

    expect(await screen.findByText(/al menos 8 caracteres/i)).toBeInTheDocument()
    expect(noop).not.toHaveBeenCalled()
  })

  it('muestra error si las contraseñas no coinciden', async () => {
    const user = userEvent.setup()
    render(<SetPasswordForm onSubmit={noop} />)

    await user.type(screen.getByLabelText(/nombre completo/i), 'Juan Pérez')
    await user.type(screen.getByLabelText(/teléfono/i), '+57 300 000 0000')
    await user.type(screen.getByLabelText(/cargo/i), 'Analista')
    await user.type(screen.getByLabelText(/empresa/i), 'Empresa S.A.')
    await user.type(screen.getByLabelText(/nueva contraseña/i), 'password123')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'diferente456')
    await user.click(screen.getByRole('button', { name: /activar cuenta/i }))

    expect(await screen.findByText(/las contraseñas no coinciden/i)).toBeInTheDocument()
    expect(noop).not.toHaveBeenCalled()
  })

  it('muestra errores si los campos de perfil están vacíos', async () => {
    const user = userEvent.setup()
    render(<SetPasswordForm onSubmit={noop} />)

    await user.click(screen.getByRole('button', { name: /activar cuenta/i }))

    expect(await screen.findByText(/ingresa tu nombre completo/i)).toBeInTheDocument()
    expect(noop).not.toHaveBeenCalled()
  })

  it('deshabilita el botón cuando isLoading es true', () => {
    render(<SetPasswordForm onSubmit={noop} isLoading={true} />)

    expect(screen.getByRole('button', { name: /activar cuenta/i })).toBeDisabled()
  })

  it('llama a onSubmit cuando el formulario es válido', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn().mockResolvedValue(undefined)
    render(<SetPasswordForm onSubmit={handleSubmit} />)

    await user.type(screen.getByLabelText(/nombre completo/i), 'Juan Pérez')
    await user.type(screen.getByLabelText(/teléfono/i), '+57 300 000 0000')
    await user.type(screen.getByLabelText(/cargo/i), 'Analista')
    await user.type(screen.getByLabelText(/empresa/i), 'Empresa S.A.')
    await user.type(screen.getByLabelText(/nueva contraseña/i), 'password123')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'password123')
    await user.click(screen.getByRole('button', { name: /activar cuenta/i }))

    expect(handleSubmit).toHaveBeenCalledWith(
      {
        nombre: 'Juan Pérez',
        telefono: '+57 300 000 0000',
        cargo: 'Analista',
        empresa: 'Empresa S.A.',
        password: 'password123',
        confirmPassword: 'password123',
      },
      expect.anything(),
    )
  })
})
