/**
 * ProtectedLayout — shell para las rutas protegidas de la aplicación.
 *
 * Envuelve todas las rutas autenticadas con el sidebar de navegación y el
 * encabezado. Se configura como `element` de un <Route> padre en React Router
 * y el contenido de cada ruta hija se renderiza a través del <Outlet />.
 *
 * La guardia de autenticación (redirección al login si no hay sesión) se
 * implementará en HU-09.
 */
import { Outlet } from 'react-router-dom'

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

export default function ProtectedLayout() {
  return (
    <SidebarProvider>
      {/* Sidebar de navegación — colapsable a iconos en desktop, offcanvas en mobile */}
      <AppSidebar />

      <SidebarInset>
        {/* Encabezado de página */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          {/* Botón para colapsar / expandir el sidebar */}
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-muted-foreground">IVR Tester</span>
        </header>

        {/* Área de contenido — cada ruta hija se renderiza aquí */}
        <main className="flex flex-1 flex-col p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
