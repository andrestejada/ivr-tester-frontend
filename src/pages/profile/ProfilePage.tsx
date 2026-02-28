import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChangePasswordForm, type ChangePasswordFormData } from '@/components/auth/ChangePasswordForm'

/**
 * ProfilePage — ruta protegida /profile
 *
 * Muestra información básica del usuario autenticado e integra el formulario
 * de cambio de contraseña. Los datos del usuario serán provistos por el contexto
 * de autenticación de HU-09.
 */
export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)

  /** Stub handler — reemplazar con llamada real a Supabase Auth en HU-09 */
  async function handleChangePassword(data: ChangePasswordFormData) {
    setIsLoading(true)
    try {
      console.log('[ProfilePage] stub handleChangePassword:', data)
      // TODO HU-09: await supabase.auth.updateUser({ password: data.newPassword })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      {/* Información del usuario — placeholder hasta HU-09 */}
      <Card>
        <CardHeader>
          <CardTitle>Mi perfil</CardTitle>
          <CardDescription>
            Información de tu cuenta en IVR Tester.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {/* TODO HU-09: reemplazar con datos reales del usuario autenticado */}
          <p><span className="font-medium text-foreground">Email:</span> usuario@ejemplo.com</p>
          <p><span className="font-medium text-foreground">Cargo:</span> —</p>
        </CardContent>
      </Card>

      {/* Formulario de cambio de contraseña */}
      <ChangePasswordForm onSubmit={handleChangePassword} isLoading={isLoading} />
    </div>
  )
}
