import { Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/** Dirección de contacto del administrador — reemplazar con valor real en configuración */
const ADMIN_EMAIL = 'admin@ejemplo.com'

/**
 * InvalidLinkPage — ruta pública /auth/invalid-link
 *
 * Muestra un mensaje informativo cuando el magic link de invitación ha expirado
 * o ya fue utilizado. No requiere sesión activa.
 */
export default function InvalidLinkPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <Mail className="h-6 w-6 text-destructive" />
        </div>
        <CardTitle className="text-xl">Enlace inválido</CardTitle>
        <CardDescription>
          El enlace ha expirado o ya fue utilizado.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-muted-foreground">
          Si necesitas acceder al sistema, contacta al administrador para que te envíe
          una nueva invitación.
        </p>
        <Button asChild variant="outline" className="w-full">
          <a href={`mailto:${ADMIN_EMAIL}`}>
            <Mail className="mr-2 h-4 w-4" />
            Contactar al administrador
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
