import React from 'react';

interface ECGPatternProps {
  className?: string;
  animated?: boolean;
  color?: string;
}

export function ECGPattern({ className = '', animated = false, color = '#4f7cff' }: ECGPatternProps) {
  return (
    <div className={`w-full ${className}`}>
      <svg 
        viewBox="0 0 800 100" 
        className="w-full h-16"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* Grid lines for medical authenticity */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Main ECG line */}
        <path
          d="M0 50 L80 50 L90 20 L100 80 L110 50 L150 50 L160 30 L170 70 L180 50 L220 50 L230 25 L240 75 L250 50 L300 50 L310 35 L320 65 L330 50 L380 50 L390 20 L400 80 L410 50 L450 50 L460 30 L470 70 L480 50 L520 50 L530 25 L540 75 L550 50 L600 50 L610 35 L620 65 L630 50 L680 50 L690 20 L700 80 L710 50 L800 50"
          stroke={color}
          strokeWidth="2.5"
          className="transition-all duration-300"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {animated && (
          <>
            {/* Animated pulse dot */}
            <circle 
              r="3" 
              fill={color}
            >
              <animateMotion
                dur="4s"
                repeatCount="indefinite"
                path="M0 50 L80 50 L90 20 L100 80 L110 50 L150 50 L160 30 L170 70 L180 50 L220 50 L230 25 L240 75 L250 50 L300 50 L310 35 L320 65 L330 50 L380 50 L390 20 L400 80 L410 50 L450 50 L460 30 L470 70 L480 50 L520 50 L530 25 L540 75 L550 50 L600 50 L610 35 L620 65 L630 50 L680 50 L690 20 L700 80 L710 50 L800 50"
              />
            </circle>
            
            {/* Glow effect */}
            <path
              d="M0 50 L80 50 L90 20 L100 80 L110 50 L150 50 L160 30 L170 70 L180 50 L220 50 L230 25 L240 75 L250 50 L300 50 L310 35 L320 65 L330 50 L380 50 L390 20 L400 80 L410 50 L450 50 L460 30 L470 70 L480 50 L520 50 L530 25 L540 75 L550 50 L600 50 L610 35 L620 65 L630 50 L680 50 L690 20 L700 80 L710 50 L800 50"
              stroke={color}
              strokeWidth="6"
              className="opacity-20"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
      </svg>
    </div>
  );
}
