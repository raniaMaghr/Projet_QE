/**
 * Sidebar de navigation principale
 */

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Logo } from '../Logo';
import { cn } from '../ui/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Calendar,
  PenTool,
  Trophy,
  BarChart3,
  FileText,
  School,
  ChevronDown,
  Shield,
  ChevronUp,
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: {
    label: string;
    path: string;
  }[];
}

const navItems: NavItem[] = [
  {
    label: 'Accueil',
    icon: Home,
    path: '/dashboard',
  },
  {
    label: 'Apprendre',
    icon: BookOpen,
    children: [
      { label: 'Cours Communs', path: '/learn/courses' },
      { label: 'Résumé By HM', path: '/learn/summaries' },
    ],
  },
  {
    label: "S'organiser",
    icon: Calendar,
    path: '/planning',
  },
  {
    label: "S'entraîner",
    icon: PenTool,
    children: [
      { label: 'QCM par Séries', path: '/train/series' },
      { label: 'QCM à la Carte', path: '/train/custom' },
      { label: '🎯 Test QCM (Demo)', path: '/qcm' },
    ],
  },
  {
    label: "S'examiner",
    icon: Trophy,
    path: '/exam',
  },
  {
    label: 'Mes Stats',
    icon: BarChart3,
    path: '/stats',
  },
  {
    label: 'Gestion des utilisateurs',
    icon: Shield,
    path: '/superadmin',
  },
  {
    label: 'Gestion des rôles',
    icon: Shield,
    path: '/role-manager',
  },
];

const secondaryNavItems: NavItem[] = [
  {
    label: 'Blog',
    icon: FileText,
    path: '/blog',
  },
  {
    label: 'Tutoriels',
    icon: School,
    path: '/tutorials',
  },
];

export function Sidebar({ collapsed = false }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Apprendre', "S'entraîner"]);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isParentActive = (item: NavItem) => {
    if (item.path) return isActive(item.path);
    return item.children?.some(child => isActive(child.path)) || false;
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-4">
          <Logo size={collapsed ? 'sm' : 'md'} iconOnly={collapsed} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Main Navigation */}
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                // Navigation item with children
                <>
                  <Button
                    variant={isParentActive(item) ? 'default' : 'ghost'}
                    className={cn(
                      'w-full justify-between',
                      collapsed && 'justify-center'
                    )}
                    onClick={() => !collapsed && toggleExpanded(item.label)}
                    title={collapsed ? item.label : undefined}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span className="ml-3">{item.label}</span>}
                    </div>
                    {!collapsed && (
                      expandedItems.includes(item.label) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    )}
                  </Button>

                  {/* Submenu */}
                  {!collapsed && expandedItems.includes(item.label) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Button
                          key={child.path}
                          variant={isActive(child.path) ? 'secondary' : 'ghost'}
                          size="sm"
                          className="w-full justify-start text-sm"
                          onClick={() => navigate(child.path)}
                        >
                          <span className="ml-3">{child.label}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // Simple navigation item
                <Button
                  variant={isActive(item.path) ? 'default' : 'ghost'}
                  className={cn(
                    'w-full',
                    collapsed ? 'justify-center' : 'justify-start'
                  )}
                  onClick={() => item.path && navigate(item.path)}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Button>
              )}
            </div>
          ))}

          {/* Separator */}
          <div className="h-px bg-border my-4" />

          {/* Secondary Navigation */}
          {secondaryNavItems.map((item) => (
            <Button
              key={item.label}
              variant={isActive(item.path) ? 'default' : 'ghost'}
              className={cn(
                'w-full',
                collapsed ? 'justify-center' : 'justify-start'
              )}
              onClick={() => item.path && navigate(item.path)}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-4 w-4" />
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Button>
          ))}
        </nav>

        {/* Footer - Version */}
        {!collapsed && (
          <div className="border-t p-4">
            <p className="text-xs text-muted-foreground text-center">
              QE.tn v1.0.0
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
