/** Sidebar de navegación principal. */
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, PlayCircle, BarChart2 } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { NavUser } from '@/components/nav-user'
import { useAuth } from '@/hooks/useAuth'

/** Ítems de navegación principal */
const navItems = [
  {
    label: 'Arquitecturas',
    href: '/architectures',
    icon: LayoutDashboard,
  },
  {
    label: 'Casos de Prueba',
    href: '/test-cases',
    icon: ClipboardList,
  },
  {
    label: 'Ejecuciones',
    href: '/executions',
    icon: PlayCircle,
  },
  {
    label: 'Métricas',
    href: '/metrics',
    icon: BarChart2,
  },
]

export function AppSidebar() {
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()

  const navUser = {
    name: user?.user_metadata?.nombre ?? user?.email?.split('@')[0] ?? 'Usuario',
    email: user?.email ?? '',
  }

  return (
    <Sidebar collapsible="icon">
      {/* Encabezado del sidebar con nombre de la app */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <span className="font-semibold text-sm group-data-[collapsible=icon]:hidden">
            IVR Tester
          </span>
        </div>
      </SidebarHeader>

      {/* Contenido — ítems de navegación */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  {/* isActive resalta visualmente el ítem cuando la URL coincide */}
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                    tooltip={item.label}
                  >
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — dropdown de usuario */}
      <SidebarFooter>
        <NavUser user={navUser} onSignOut={signOut} />
      </SidebarFooter>
    </Sidebar>
  )
}
