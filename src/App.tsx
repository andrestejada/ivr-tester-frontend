import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
          <h1 className="text-3xl font-bold">IVR Tester</h1>
          <p className="text-muted-foreground">Plataforma de pruebas automatizadas para IVR</p>
          {/* Smoke-test shadcn Button */}
          <Button>Comenzar</Button>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
