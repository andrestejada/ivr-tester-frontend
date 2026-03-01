import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChangePasswordForm, type ChangePasswordFormData } from '@/components/auth/ChangePasswordForm'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState(false)

  const metadata = user?.user_metadata ?? {}

  async function handleChangePassword(data: ChangePasswordFormData) {
    setIsLoading(true)
    setError(undefined)
    setSuccess(false)

    // Verificar contraseña actual antes de actualizar
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email ?? '',
      password: data.currentPassword,
    })

    if (signInError) {
      setError('La contraseña actual es incorrecta.')
      setIsLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: data.newPassword,
    })

    if (updateError) {
      setError('No se pudo actualizar la contraseña. Intenta de nuevo.')
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setIsLoading(false)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Mi perfil</CardTitle>
          <CardDescription>Información de tu cuenta en IVR Tester.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p><span className="font-medium text-foreground">Email:</span> {user?.email ?? '—'}</p>
          {metadata.nombre && (
            <p><span className="font-medium text-foreground">Nombre:</span> {metadata.nombre}</p>
          )}
          {metadata.cargo && (
            <p><span className="font-medium text-foreground">Cargo:</span> {metadata.cargo}</p>
          )}
          {metadata.empresa && (
            <p><span className="font-medium text-foreground">Empresa:</span> {metadata.empresa}</p>
          )}
          {metadata.telefono && (
            <p><span className="font-medium text-foreground">Teléfono:</span> {metadata.telefono}</p>
          )}
        </CardContent>
      </Card>

      <ChangePasswordForm
        onSubmit={handleChangePassword}
        isLoading={isLoading}
        error={error}
        success={success}
      />
    </div>
  )
}
