import { Outlet } from 'react-router-dom'

/**
 * AuthLayout
 *
 * Shell para todas las rutas públicas de autenticación (/login, /auth/set-password, /auth/invalid-link).
 * - Centra el contenido verticalmente y horizontalmente en pantalla completa.
 * - Muestra el logo/nombre de la aplicación sobre el formulario.
 * - No incluye sidebar, navegación ni ningún elemento de ProtectedLayout.
 * - Renderiza las páginas hijas a través de <Outlet />.
 */
export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Logo / Nombre de la app */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <span className="text-2xl font-bold tracking-tight">IVR Tester</span>
        <span className="text-sm text-muted-foreground">
          Plataforma de pruebas automatizadas
        </span>
      </div>

      {/* Contenido de la página de auth (LoginPage, SetPasswordPage, etc.) */}
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  )
}
