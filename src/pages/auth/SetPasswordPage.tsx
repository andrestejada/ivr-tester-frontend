import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import type { EmailOtpType } from '@supabase/supabase-js'

import { supabase } from '@/lib/supabase'
import { SetPasswordForm, type SetPasswordFormData } from '@/components/auth/SetPasswordForm'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Destino del enlace de invitación.
 * Flujo PKCE: espera los query params token_hash y type para verificar el token.
 */
export default function SetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const hasPkceParams = !!(tokenHash && type)

  const [verifying, setVerifying] = useState(hasPkceParams)
  const [tokenInvalid, setTokenInvalid] = useState(!hasPkceParams)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  // Evita que React StrictMode llame a verifyOtp dos veces: el token es de un solo uso
  const verifyCalledRef = useRef(false)

  useEffect(() => {
    if (!hasPkceParams || verifyCalledRef.current) return
    verifyCalledRef.current = true

    supabase.auth
      .verifyOtp({ type: type!, token_hash: tokenHash! })
      .then(({ error }) => {
        if (error) setTokenInvalid(true)
      })
      .finally(() => setVerifying(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (verifying) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (tokenInvalid) {
    return <Navigate to="/auth/invalid-link" replace />
  }

  async function handleSetPassword(data: SetPasswordFormData) {
    setIsLoading(true)
    setError(undefined)

    const { error: updateError } = await supabase.auth.updateUser({
      password: data.password,
      data: {
        nombre: data.nombre,
        telefono: data.telefono,
        cargo: data.cargo,
        empresa: data.empresa,
      },
    })

    if (updateError) {
      setError('No se pudo activar la cuenta. Intenta de nuevo o contacta al administrador.')
      setIsLoading(false)
      return
    }

    navigate('/architectures')
  }

  return <SetPasswordForm onSubmit={handleSetPassword} isLoading={isLoading} error={error} />
}
