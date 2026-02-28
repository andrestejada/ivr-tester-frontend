import { useState } from 'react'
import { SetPasswordForm, type SetPasswordFormData } from '@/components/auth/SetPasswordForm'

/**
 * SetPasswordPage — ruta pública /auth/set-password
 *
 * Página destino del magic link de invitación. El usuario establece su contraseña
 * por primera vez para activar su cuenta.
 * El handler `handleSetPassword` es un stub tipado; la integración real con Supabase
 * se implementará en HU-09.
 */
export default function SetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)

  /** Stub handler — reemplazar con llamada real a Supabase Auth en HU-09 */
  async function handleSetPassword(data: SetPasswordFormData) {
    setIsLoading(true)
    try {
      console.log('[SetPasswordPage] stub handleSetPassword:', data)
      // TODO HU-09: await supabase.auth.updateUser({ password: data.password })
    } finally {
      setIsLoading(false)
    }
  }

  return <SetPasswordForm onSubmit={handleSetPassword} isLoading={isLoading} />
}
