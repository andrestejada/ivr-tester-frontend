# IVR Tester Frontend

Frontend del proyecto IVR Tester. Panel de control interactivo para la gestión y visualización de pruebas automatizadas sobre IVRs en Genesys Cloud, construido con **React + Vite**, **shadcn/ui** y **Feature-Based Architecture**.

## Prerrequisitos

- [Node.js 20+](https://nodejs.org/)
- [npm 10+](https://www.npmjs.com/)

## Instalación

```bash
# 1. Clonar el repositorio y entrar a la carpeta del frontend
cd ivr-tester-frontend

# 2. Instalar dependencias
npm install
```

## Variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con los valores reales
```

| Variable | Descripción |
|---|---|
| `VITE_API_BASE_URL` | URL base del backend (default: `http://localhost:8000`) |

## Arrancar el servidor de desarrollo

```bash
npm run dev
```

- Aplicación disponible en: `http://localhost:3000`

## Estructura del proyecto

```
ivr-tester-frontend/
 public/                        # Archivos estáticos
 src/
    components/                # Componentes UI reutilizables
       ui/                    # Componentes generados por shadcn/ui
    features/                  # Módulos por funcionalidad
       auth/                  # Autenticación (login, sesión)
       test-cases/            # Gestión de casos de prueba
       test-runs/             # Ejecución de pruebas
       results/               # Visualización de resultados
    lib/
       queryClient.ts         # Instancia de TanStack Query
    pages/                     # Componentes de página raíz (nivel de ruta)
    App.tsx                    # Root de la aplicación
    main.tsx                   # Entry point de React
 components.json                # Configuración de shadcn/ui
 vite.config.ts                 # Configuración de Vite
 tsconfig.json                  # Configuración de TypeScript
 eslint.config.js               # Configuración de ESLint
```

## Comandos útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Verificar linting
npm run lint

# Formatear código
npm run format

# Previsualizar build de producción
npm run preview
```

## Stack tecnológico

| Librería | Versión | Propósito |
|---|---|---|
| React | 19 | UI framework |
| Vite | 7 | Bundler y dev server |
| TypeScript | 5.9 | Tipado estático |
| Tailwind CSS | 4 | Estilos utilitarios |
| shadcn/ui | latest | Componentes accesibles |
| React Router | 7 | Enrutamiento |
| TanStack Query | 5 | Gestión de estado del servidor |
| Axios | 1 | Cliente HTTP |
| ESLint + Prettier | latest | Linting y formateo |
