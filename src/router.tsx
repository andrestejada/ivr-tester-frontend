import { Navigate, Route, Routes } from 'react-router-dom';

import AuthLayout from '@/layouts/AuthLayout';
import ProtectedLayout from '@/pages/ProtectedLayout';
import LoginPage from '@/pages/auth/LoginPage';
import SetPasswordPage from '@/pages/auth/SetPasswordPage';
import InvalidLinkPage from '@/pages/auth/InvalidLinkPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import { IVRArchitecturesPage } from '@/features/ivr-architectures';
import { TestCasesPage } from '@/features/test-cases';
import { ExecutionsPage } from '@/features/executions';
import { ExecutionDetailsPage } from '@/features/executions/pages/ExecutionDetailsPage';
import { MetricsPage } from '@/features/metrics';

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
        <Route path="/test-cases" element={<TestCasesPage />} />
        <Route path="/executions" element={<ExecutionsPage />} />
        <Route
          path="/executions/:architectureId/test-cases/:testCaseId/details/:executionId"
          element={<ExecutionDetailsPage />}
        />
        <Route path="/metrics" element={<MetricsPage />} />
        <Route path="/results" element={<Navigate to="/metrics" replace />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback — redirige cualquier ruta desconocida al login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
