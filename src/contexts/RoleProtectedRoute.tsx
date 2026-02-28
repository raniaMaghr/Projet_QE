// RoleProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setShowSpinner(false);
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

  // Check role if required
  if (allowedRoles && user) {
    const hasAccess = allowedRoles.includes(user.role);
    if (!hasAccess) {
      console.warn(`Access denied for role: ${user.role}`);
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}