import { useState } from 'react'
import { LoginForm, type LoginFormData } from '@/components/auth/LoginForm'

/**
 * LoginPage — ruta pública /login
 *
 * Renderiza el formulario de inicio de sesión.
 * El handler `handleLogin` es un stub tipado; la integración real con Supabase
 * se implementará en HU-09.
 */
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  /** Stub handler — reemplazar con llamada real a Supabase Auth en HU-09 */
  async function handleLogin(data: LoginFormData) {
    setIsLoading(true)
    try {
      console.log('[LoginPage] stub handleLogin:', data)
      // TODO HU-09: await supabase.auth.signInWithPassword({ email: data.email, password: data.password })
    } finally {
      setIsLoading(false)
    }
  }

  return <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
}
