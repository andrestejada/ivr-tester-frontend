import { Navigate, Route, Routes } from 'react-router-dom'

import AuthLayout from '@/layouts/AuthLayout'
import ProtectedLayout from '@/pages/ProtectedLayout'
import LoginPage from '@/pages/auth/LoginPage'
import SetPasswordPage from '@/pages/auth/SetPasswordPage'
import InvalidLinkPage from '@/pages/auth/InvalidLinkPage'
import ProfilePage from '@/pages/profile/ProfilePage'
import { IVRArchitecturesPage } from '@/features/ivr-architectures'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">Sección en construcción.</p>
    </div>
  )
}

export default function AppRouter() {
  return (
    <Routes>
      {/* ── Rutas públicas — AuthLayout (sin sidebar) ── */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/set-password" element={<SetPasswordPage />} />
        <Route path="/auth/invalid-link" element={<InvalidLinkPage />} />
      </Route>

      {/* ── Rutas protegidas — ProtectedLayout (con sidebar) ── */}
      <Route element={<ProtectedLayout />}>
        <Route index element={<Navigate to="/architectures" replace />} />
        <Route path="/architectures" element={<IVRArchitecturesPage />} />
        <Route path="/test-cases" element={<PlaceholderPage title="Casos de Prueba" />} />
        <Route path="/executions" element={<PlaceholderPage title="Ejecuciones" />} />
        <Route path="/results" element={<PlaceholderPage title="Resultados" />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback — redirige cualquier ruta desconocida al login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
