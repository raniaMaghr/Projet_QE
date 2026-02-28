/**
 * Header principal de l'application
 */

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Logo } from '../Logo';
import { useAuth, useTheme } from '../../contexts';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onToggleMobileMenu?: () => void;
  sidebarCollapsed?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function Header({ 
  onToggleSidebar, 
  onToggleMobileMenu,
  sidebarCollapsed = false,
  showBackButton = false,
  onBack,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    const names = user.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.fullName[0].toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="flex h-16 items-center gap-4 px-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onToggleMobileMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop Sidebar Toggle */}
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Logo (visible quand sidebar collapsed ou sur mobile) */}
        {(sidebarCollapsed || window.innerWidth < 768) && (
          <div className="flex items-center gap-2">
            <Logo size="sm" />
          </div>
        )}

        {/* Bouton retour (optionnel) */}
        {showBackButton && onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
        )}

        {/* Search bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des cours, QCM..."
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Search button - Mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden ml-auto"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Right side buttons */}
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" title="Notifications">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">{user?.fullName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {user?.anneeEtude}
                    </span>
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                      {user?.faculte}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Mon Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search - Expandable */}
      {searchOpen && (
        <div className="border-t p-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-full pl-10"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
