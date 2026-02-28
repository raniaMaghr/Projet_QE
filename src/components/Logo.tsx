import React from 'react';

interface LogoProps {
  variant?: 'primary' | 'secondary' | 'white' | 'minimal' | 'sepia';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showECG?: boolean;
  iconOnly?: boolean; // ✅ AJOUT : Propriété pour afficher uniquement l'icône
  className?: string;
}

export function Logo({ 
  variant = 'primary', 
  size = 'md', 
  showECG = true,
  iconOnly = false, // ✅ AJOUT : Valeur par défaut
  className = '' 
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-24 h-12',
    md: 'w-32 h-16',
    lg: 'w-48 h-24',
    xl: 'w-64 h-32'
  };

  // ✅ AJOUT : Tailles pour le mode iconOnly
  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  // ✅ AJOUT : Tailles de texte pour iconOnly
  const iconTextSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const getColors = () => {
    switch (variant) {
      case 'primary':
        return {
          text: 'text-medical-blue',
          accent: 'text-medical-orange',
          ecg: 'stroke-medical-green'
        };
      case 'secondary':
        return {
          text: 'text-slate-600',
          accent: 'text-medical-red',
          ecg: 'stroke-medical-blue'
        };
      case 'white':
        return {
          text: 'text-white',
          accent: 'text-red-400',
          ecg: 'stroke-green-400'
        };
      case 'minimal':
        return {
          text: 'text-slate-800',
          accent: 'text-slate-600',
          ecg: 'stroke-slate-400'
        };
      case 'sepia':
        return {
          text: 'text-sepia-brown',
          accent: 'text-sepia-accent',
          ecg: 'stroke-sepia-dark'
        };
      default:
        return {
          text: 'text-medical-blue',
          accent: 'text-medical-red',
          ecg: 'stroke-medical-green'
        };
    }
  };

  const colors = getColors();

  // ✅ AJOUT : Mode iconOnly - affiche seulement "QE"
  if (iconOnly) {
    return (
      <div className={`${iconSizeClasses[size]} flex items-center justify-center ${className}`}>
        <div className={`${iconTextSizes[size]} font-bold tracking-tight`}>
          <span className={colors.text}>QE</span>
        </div>
      </div>
    );
  }

  // Mode normal - affiche "QE.tn" + ECG
  return (
    <div className={`${sizeClasses[size]} flex items-center ${className}`}>
      <div className="relative flex items-center justify-center md:justify-start">
        {/* Logo Text */}
        <div className={`${textSizes[size]} font-bold tracking-tight`}>
          <span className={colors.text}>QE</span>
          <span className={colors.accent}>.tn</span>
        </div>
        
        {/* ECG Line */}
        {showECG && (
          <div className="ml-2 flex items-center">
            <svg 
              viewBox="0 0 100 30" 
              className={`w-16 h-6 ${size === 'sm' ? 'w-12 h-4' : size === 'lg' ? 'w-24 h-8' : size === 'xl' ? 'w-32 h-10' : ''}`}
              fill="none"
            >
              <path
                d="M0 15 L20 15 L25 5 L30 25 L35 15 L40 15 L45 10 L50 20 L55 15 L100 15"
                stroke="currentColor"
                strokeWidth="2"
                className={`${colors.ecg} transition-colors duration-300`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}