/**
 * Point d'entrée principal de l'application - Version restructurée
 * Gère le routing avec React Router et les providers de contexte
 * 
 * CHANGEMENTS MAJEURS depuis l'ancien App.tsx:
 * - Utilisation de React Router au lieu de navigation manuelle
 * - Séparation des concerns avec des composants dédiés
 * - Gestion d'état via Context API au lieu de props drilling
 * - Routes protégées avec authentification
 * - Structure modulaire et maintenable
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ThemeProvider, useAuth } from './contexts';
import { MainLayout } from './components/layout';
import { LoadingSpinner } from './components/common';
import { 
  HomePage, 
  LoginPage, 
  DashboardPage,
  QCMPageWrapper,
  StatsPageWrapper,
} from './pages';
import { Toaster } from './components/ui/sonner';

// Composant pour protéger les routes qui nécessitent une authentification
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
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

// Composant pour rediriger les utilisateurs connectés
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Chargement..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Composant principal de routing
function AppRoutes() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={
        <PublicRoute>
          <HomePage />
        </PublicRoute>
      } />
      
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />

      {/* Routes protégées avec MainLayout */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/stats" element={<StatsPageWrapper />} />
        <Route path="/qcm" element={<QCMPageWrapper />} />
        
        {/* Placeholder pages - à implémenter */}
        <Route path="/learn/courses" element={<div className="p-8 text-center">Cours Communs - En développement</div>} />
        <Route path="/learn/summaries" element={<div className="p-8 text-center">Résumés - En développement</div>} />
        <Route path="/planning" element={<div className="p-8 text-center">Planning - En développement</div>} />
        <Route path="/train/series" element={<div className="p-8 text-center">QCM par Séries - En développement</div>} />
        <Route path="/train/custom" element={<div className="p-8 text-center">QCM à la Carte - En développement</div>} />
        <Route path="/exam" element={<div className="p-8 text-center">Examens Blancs - En développement</div>} />
        <Route path="/blog" element={<div className="p-8 text-center">Blog - En développement</div>} />
        <Route path="/tutorials" element={<div className="p-8 text-center">Tutoriels - En développement</div>} />
        <Route path="/profile" element={<div className="p-8 text-center">Profil - En développement</div>} />
        <Route path="/settings" element={<div className="p-8 text-center">Paramètres - En développement</div>} />
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

// Composant App principal avec tous les providers
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
