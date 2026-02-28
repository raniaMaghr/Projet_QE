/**
 * Sidebar mobile (drawer)
 */

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { Logo } from '../Logo';
import { Button } from '../ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
  ChevronUp,
} from 'lucide-react';

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
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

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
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

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle>
            <Logo size="md" />
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Main Navigation */}
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <Button
                    variant={isParentActive(item) ? 'default' : 'ghost'}
                    className="w-full justify-between"
                    onClick={() => toggleExpanded(item.label)}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-4 w-4" />
                      <span className="ml-3">{item.label}</span>
                    </div>
                    {expandedItems.includes(item.label) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  {expandedItems.includes(item.label) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Button
                          key={child.path}
                          variant={isActive(child.path) ? 'secondary' : 'ghost'}
                          size="sm"
                          className="w-full justify-start text-sm"
                          onClick={() => handleNavigate(child.path)}
                        >
                          <span className="ml-3">{child.label}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Button
                  variant={isActive(item.path) ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => item.path && handleNavigate(item.path)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="ml-3">{item.label}</span>
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
              className="w-full justify-start"
              onClick={() => item.path && handleNavigate(item.path)}
            >
              <item.icon className="h-4 w-4" />
              <span className="ml-3">{item.label}</span>
            </Button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground text-center">
            QE.tn v1.0.0
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
