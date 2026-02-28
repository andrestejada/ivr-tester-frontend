import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

/** Schema de validación: mínimo 8 caracteres y coincidencia de contraseñas */
const setPasswordSchema = z
  .object({
    password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    confirmPassword: z.string().min(1, { message: 'Confirma tu contraseña' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type SetPasswordFormData = z.infer<typeof setPasswordSchema>

interface SetPasswordFormProps {
  /** Stub handler — será reemplazado por la integración con Supabase en HU-09 */
  onSubmit: (data: SetPasswordFormData) => Promise<void>
  isLoading?: boolean
}

/**
 * SetPasswordForm
 *
 * Formulario para establecer contraseña por primera vez (destino del magic link de invitación).
 * Validación client-side con Zod; sin llamadas al SDK de Supabase.
 */
export function SetPasswordForm({ onSubmit, isLoading = false }: SetPasswordFormProps) {
  const form = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl">Establece tu contraseña</CardTitle>
        <CardDescription className="text-center">
          Crea una contraseña segura para activar tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Nueva contraseña */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      autoComplete="new-password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirmar contraseña */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Repite tu contraseña"
                      autoComplete="new-password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Activar cuenta
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
