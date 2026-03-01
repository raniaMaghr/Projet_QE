/**
 * Point d'entrée principal de l'application - CORRIGÉ
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ThemeProvider, useAuth } from './contexts';
import { MainLayout } from './components/layout';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  DashboardPage,
  QCMPageWrapper,
  StatsPageWrapper,
  SeriesPage,
  CustomQCMPage,
} from './pages';
import RoleManager from './pages/SuperAdmin/RoleManager';
import { SuperAdminDashboard } from './pages/SuperAdmin';
import UploadPage from './components/UploadPage';
import SeriesPageWrapper from './pages/SeriesPageWrapper';
import QuestionDetailPage from './components/QuestionDetailPage';
import { Toaster } from './components/ui/sonner';
import { RoleProtectedRoute } from "./contexts/RoleProtectedRoute";

// ─────────────────────────────────────────────
// Routes protégées
// ─────────────────────────────────────────────
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const [showSpinner, setShowSpinner] = useState(true);

  // GARDE-FOU : Si le chargement prend plus de 5 secondes, on arrête d'afficher le spinner
  // pour éviter le blocage infini, et on laisse la logique de redirection prendre le relais.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn("Auth check taking too long, disabling spinner...");
        setShowSpinner(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading && showSpinner) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Vérification de la session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// ─────────────────────────────────────────────
// Routes publiques
// ─────────────────────────────────────────────
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return null;

  if (isAuthenticated && user) {

    switch (user.role) {
      case 'admin':
        return <Navigate to="/tutorials" replace />;

      case 'superAdmin':
        return <Navigate to="/stats" replace />;

      case 'student':
      default:
        return <Navigate to="/exam" replace />;
    }
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/*<Route path="/stats" element={<StatsPageWrapper />} />*/}
        <Route path="/qcm" element={<QCMPageWrapper />} />
        <Route path="/learn/courses"  element={<div className="p-8 text-center">Cours Communs — En développement</div>} />
        <Route path="/learn/summaries" element={<div className="p-8 text-center">Résumés — En développement</div>} />
        <Route path="/planning"        element={<div className="p-8 text-center">Planning — En développement</div>} />
        <Route path="/train/series"    element={<SeriesPage />} />
        <Route path="/train/custom"    element={<CustomQCMPage />} />
        <Route path="/exam"            element={<div className="p-8 text-center">Examens Blancs — En développement</div>} />
        <Route path="/blog"            element={<div className="p-8 text-center">Blog — En développement</div>} />
        {/*<Route path="/tutorials"       element={<div className="p-8 text-center">Tutoriels — En développement</div>} />*/}
        <Route path="/profile"         element={<div className="p-8 text-center">Profil — En développement</div>} />
        <Route path="/settings"        element={<div className="p-8 text-center">Paramètres — En développement</div>} />
      </Route>

      {/* Admin only */}
      <Route
        element={<RoleProtectedRoute allowedRoles={["admin", "superAdmin"]}><MainLayout /></RoleProtectedRoute>}
      >
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/role-manager" element={<RoleManager />} />
        <Route path="/tutorials" element={<div>Tutoriels — Admin only</div>} />
        <Route path="/stats" element={<StatsPageWrapper />} />
        <Route
  path="/insert-question"
  element={
    <UploadPage
      onSeriesUploaded={(data) => {
        console.log("Série reçue :", data);
      }}
    />
  }
/>
        <Route path="/series/:seriesId" element={<SeriesPageWrapper />} />
        <Route path="/question/:questionId" element={<QuestionDetailPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
