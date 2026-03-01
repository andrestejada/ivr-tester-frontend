import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { supabase } from '@/lib/supabase'
import { LoginForm, type LoginFormData } from '@/components/auth/LoginForm'

export default function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  async function handleLogin(data: LoginFormData) {
    setIsLoading(true)
    setError(undefined)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.')
      setIsLoading(false)
      return
    }

    navigate('/dashboard')
  }

  return <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
}
