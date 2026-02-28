/**
 * Layout principal de l'application avec Header et Sidebar
 */

import React, { useState, useEffect } from 'react';
import { Outlet ,useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { cn } from '../ui/utils';

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Gérer le collapse de la sidebar selon la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        open={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content */}
      <div
        className={cn(
          'min-h-screen transition-all duration-300',
          'md:ml-16',
          !sidebarCollapsed && 'lg:ml-64'
        )}
      >
        <Header
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
