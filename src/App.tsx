import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { queryClient } from '@/lib/queryClient'
import { TooltipProvider } from '@/components/ui/tooltip'
import ProtectedLayout from '@/pages/ProtectedLayout'

/* ───────────────────────────────────────────
   Páginas placeholder — se reemplazarán en
   HU-10, HU-11 y HU-12
─────────────────────────────────────────── */
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">Sección en construcción.</p>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
        <Routes>
          {/* Rutas protegidas — ProtectedLayout envuelve todas las páginas autenticadas */}
          <Route element={<ProtectedLayout />}>
            {/* Redirige la raíz al dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
            <Route path="/test-cases" element={<PlaceholderPage title="Casos de Prueba" />} />
            <Route path="/executions" element={<PlaceholderPage title="Ejecuciones" />} />
            <Route path="/results" element={<PlaceholderPage title="Resultados" />} />
          </Route>

          {/* Fallback — redirige cualquier ruta desconocida al dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
