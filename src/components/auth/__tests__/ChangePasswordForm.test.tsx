import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm'

const noop = vi.fn()

describe('ChangePasswordForm', () => {
  it('renderiza los tres campos de contraseña', () => {
    render(<ChangePasswordForm onSubmit={noop} />)

    expect(screen.getByLabelText('Contraseña actual')).toBeInTheDocument()
    expect(screen.getByLabelText('Nueva contraseña')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmar nueva contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cambiar contraseña/i })).toBeInTheDocument()
  })

  it('muestra error si la contraseña actual está vacía', async () => {
    const user = userEvent.setup()
    render(<ChangePasswordForm onSubmit={noop} />)

    await user.type(screen.getByLabelText('Nueva contraseña'), 'newpass123')
    await user.type(screen.getByLabelText('Confirmar nueva contraseña'), 'newpass123')
    await user.click(screen.getByRole('button', { name: /cambiar contraseña/i }))

    expect(await screen.findByText('Ingresa tu contraseña actual')).toBeInTheDocument()
    expect(noop).not.toHaveBeenCalled()
  })

  it('muestra error si la nueva contraseña tiene menos de 8 caracteres', async () => {
    const user = userEvent.setup()
    render(<ChangePasswordForm onSubmit={noop} />)

    await user.type(screen.getByLabelText('Contraseña actual'), 'currentpass')
    await user.type(screen.getByLabelText('Nueva contraseña'), '1234567')
    await user.type(screen.getByLabelText('Confirmar nueva contraseña'), '1234567')
    await user.click(screen.getByRole('button', { name: /cambiar contraseña/i }))

    expect(await screen.findByText(/al menos 8 caracteres/i)).toBeInTheDocument()
    expect(noop).not.toHaveBeenCalled()
  })

  it('muestra error si la nueva contraseña y la confirmación no coinciden', async () => {
    const user = userEvent.setup()
    render(<ChangePasswordForm onSubmit={noop} />)

    await user.type(screen.getByLabelText('Contraseña actual'), 'currentpass')
    await user.type(screen.getByLabelText('Nueva contraseña'), 'newpass123')
    await user.type(screen.getByLabelText('Confirmar nueva contraseña'), 'diferente456')
    await user.click(screen.getByRole('button', { name: /cambiar contraseña/i }))

    expect(await screen.findByText(/las contraseñas no coinciden/i)).toBeInTheDocument()
    expect(noop).not.toHaveBeenCalled()
  })

  it('deshabilita el botón cuando isLoading es true', () => {
    render(<ChangePasswordForm onSubmit={noop} isLoading={true} />)

    expect(screen.getByRole('button', { name: /cambiar contraseña/i })).toBeDisabled()
  })

  it('llama a onSubmit cuando el formulario es válido', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ChangePasswordForm onSubmit={handleSubmit} />)

    await user.type(screen.getByLabelText('Contraseña actual'), 'currentpass')
    await user.type(screen.getByLabelText('Nueva contraseña'), 'newpass123')
    await user.type(screen.getByLabelText('Confirmar nueva contraseña'), 'newpass123')
    await user.click(screen.getByRole('button', { name: /cambiar contraseña/i }))

    expect(handleSubmit).toHaveBeenCalledWith(
      {
        currentPassword: 'currentpass',
        newPassword: 'newpass123',
        confirmPassword: 'newpass123',
      },
      expect.anything(),
    )
  })
})
