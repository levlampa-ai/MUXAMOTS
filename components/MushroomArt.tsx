
import React from 'react';
import { MushroomType } from '../types';
import { MUSHROOMS } from '../constants';

interface Props {
  type: MushroomType;
  stage: number; // 0 to 100
  isMutated?: boolean;
  isDecayed?: boolean;
  isContaminated?: boolean; // New prop
  form?: 'growing' | 'powder';
  className?: string;
}

export const MushroomArt: React.FC<Props> = ({ type, stage, isMutated, isDecayed, isContaminated, form = 'growing', className = "" }) => {
  const config = MUSHROOMS[type];
  const color = config ? config.color : '#888';

  // --- POWDER FORM VISUAL ---
  if (form === 'powder') {
      return (
          <div className={`relative flex items-center justify-center ${className}`} style={{ width: '100px', height: '60px' }}>
              <svg viewBox="0 0 100 60" className="overflow-visible drop-shadow-md">
                  {/* Grain filter assumes global defs or browser handling */}
                  <path 
                    d="M 10 60 Q 30 30 50 25 Q 70 30 90 60 Z" 
                    fill={color} 
                    opacity="0.9"
                    filter="url(#grain)"
                  />
                  {/* Highlights/Texture */}
                  <path d="M 30 60 Q 40 40 50 45" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
                  <path d="M 60 60 Q 70 45 80 55" stroke="rgba(0,0,0,0.1)" strokeWidth="1" fill="none" />
                  
                  {/* Particles */}
                  <circle cx="45" cy="20" r="1" fill={color} className="animate-pulse" />
                  <circle cx="55" cy="15" r="1.5" fill={color} className="animate-pulse" style={{animationDelay: '0.5s'}} />
                  <circle cx="35" cy="30" r="1" fill={color} opacity="0.6" />
              </svg>
          </div>
      );
  }

  // --- GROWING/MUSHROOM FORM ---
  
  // Scale based on growth. Visible immediately (0.2 scale at 0 growth)
  const growthScale = 0.2 + (stage / 100) * 0.8;
  const opacity = 1; // Always visible
  
  // Filters for gritty look
  const filter = isDecayed ? 'grayscale(100%) brightness(40%) sepia(20%)' : isMutated ? 'hue-rotate(90deg) contrast(120%)' : 'none';

  return (
    <div 
      className={`relative flex items-end justify-center pointer-events-none ${className}`}
      style={{ 
        width: '140px', 
        height: '140px',
        opacity: opacity,
        transition: 'all 0.5s ease-out',
        filter: filter
      }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="overflow-visible"
        style={{ 
          transform: `scale(${growthScale})`, 
          transformOrigin: 'bottom center',
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* DEFS MOVED TO GLOBAL SVG IN APP.TSX TO PREVENT ID COLLISION */}

        {/* --- MUSCARIA --- */}
        {type === MushroomType.Muscaria && (
            <g filter="url(#grain)">
                <path d="M 45 100 L 45 50 Q 42 45 35 45 L 65 45 Q 58 45 55 50 L 55 100" fill="url(#stem-gradient)" />
                <path d="M 45 65 Q 50 75 55 65 L 56 68 Q 50 80 44 68 Z" fill="#e5e5e5" />
                <path d="M 15 45 Q 50 -10 85 45" fill="url(#grad-muscaria)" stroke="#7f1d1d" strokeWidth="1" />
                <g fill="#f5f5f5" opacity="0.9">
                    <circle cx="35" cy="30" r="3" /> <circle cx="60" cy="25" r="4" /> <circle cx="50" cy="15" r="2.5" />
                </g>
            </g>
        )}

        {/* --- CUBENSIS --- */}
        {type === MushroomType.Cubensis && (
            <g filter="url(#grain)">
                <path d="M 45 100 Q 40 80 48 50 L 55 50 Q 60 80 55 100" fill="url(#stem-gradient)" />
                <path d="M 47 55 Q 51 60 56 55" fill="none" stroke="#57534e" strokeWidth="2" strokeDasharray="2 1" />
                <path d="M 25 50 Q 20 40 35 30 Q 50 10 65 30 Q 80 40 75 50 Q 50 55 25 50" fill="url(#grad-cubensis)" stroke="#b45309" strokeWidth="0.5" />
            </g>
        )}

        {/* --- PANTHERINA --- */}
        {type === MushroomType.Pantherina && (
             <g filter="url(#grain)">
                <path d="M 46 100 L 47 45 L 53 45 L 54 100" fill="url(#stem-gradient)" />
                <path d="M 47 60 L 53 60 L 55 65 L 45 65 Z" fill="#d6d3d1" />
                <path d="M 20 45 Q 50 0 80 45" fill="#573a26" stroke="#292524" />
                <g fill="#e7e5e4" opacity="0.8">
                    <path d="M 30 30 L 34 28 L 32 34 Z" /> <path d="M 60 25 L 65 24 L 62 29 Z" />
                </g>
            </g>
        )}

        {/* --- CYANESCENS --- */}
        {type === MushroomType.Cyanescens && (
            <g filter="url(#grain)">
                <path d="M 48 100 Q 46 70 47 50 L 53 50 Q 54 70 52 100" fill="#f5f5f4" stroke="#d6d3d1" />
                <path d="M 20 45 C 20 20, 40 20, 50 15 C 60 20, 80 20, 80 45 C 80 55, 60 45, 50 48 C 40 45, 20 55, 20 45" fill="#a16207" stroke="#451a03" />
            </g>
        )}

        {/* --- LION'S MANE --- */}
        {type === MushroomType.LionMane && (
            <g filter="url(#grain)">
                {/* Main Mass */}
                <ellipse cx="50" cy="50" rx="30" ry="35" fill="#f3f4f6" />
                {/* Icicles */}
                <path d="M 25 60 L 25 80" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" />
                <path d="M 35 70 L 35 90" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" />
                <path d="M 45 75 L 45 95" stroke="#d1d5db" strokeWidth="3" strokeLinecap="round" />
                <path d="M 55 75 L 55 95" stroke="#d1d5db" strokeWidth="3" strokeLinecap="round" />
                <path d="M 65 70 L 65 90" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" />
                <path d="M 75 60 L 75 80" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" />
            </g>
        )}

        {/* --- CORDYCEPS --- */}
        {type === MushroomType.Cordyceps && (
             <g filter="url(#grain)">
                {/* Bug Body */}
                <ellipse cx="50" cy="90" rx="15" ry="8" fill="#57534e" />
                {/* Spikes */}
                <path d="M 45 90 Q 40 60 30 40" stroke="#f97316" strokeWidth="3" fill="none" />
                <circle cx="30" cy="40" r="3" fill="#fdba74" />
                <path d="M 50 90 Q 55 50 60 30" stroke="#ea580c" strokeWidth="4" fill="none" />
                <ellipse cx="60" cy="30" rx="4" ry="8" fill="#fb923c" />
                <path d="M 55 90 Q 70 70 80 50" stroke="#f97316" strokeWidth="2" fill="none" />
                <circle cx="80" cy="50" r="2" fill="#fdba74" />
             </g>
        )}

        {/* --- REISHI --- */}
        {type === MushroomType.Reishi && (
            <g filter="url(#grain)">
                 <path d="M 45 100 L 45 70 L 30 50 Q 20 40 30 30 L 45 70" fill="url(#grad-reishi)" stroke="#450a0a" />
                 <path d="M 55 100 L 55 60 L 70 40 Q 80 30 70 20 L 55 60" fill="url(#grad-reishi)" stroke="#450a0a" />
                 <path d="M 50 100 L 50 40 Q 50 10 60 10 Q 40 10 40 30 L 50 100" fill="url(#grad-reishi)" stroke="#450a0a" />
            </g>
        )}

        {/* --- AZURESCENS --- */}
        {type === MushroomType.Azurescens && (
             <g filter="url(#grain)">
                <path d="M 42 100 L 48 45 L 54 45 L 60 100" fill="#e7e5e4" />
                <path d="M 15 50 Q 50 35 50 10 Q 50 35 85 50 L 50 55 Z" fill="#854d0e" stroke="#451a03" />
                <ellipse cx="50" cy="15" rx="3" ry="5" fill="#fcd34d" opacity="0.2" />
            </g>
        )}

        {/* --- GHOST --- */}
        {type === MushroomType.Ghost && (
            <g filter="url(#grain)">
                <path d="M 40 100 Q 35 70 45 50 L 55 50 Q 65 70 60 100" fill="#f0f9ff" opacity="0.8" />
                <path d="M 30 50 Q 20 20 50 20 Q 80 20 70 50 Q 50 60 30 50" fill="#e0f2fe" stroke="#bae6fd" opacity="0.9" />
                <path d="M 50 20 L 50 50" stroke="#7dd3fc" strokeWidth="1" opacity="0.5" />
            </g>
        )}

        {/* --- ENIGMA --- */}
        {type === MushroomType.Enigma && (
            <g filter="url(#grain)">
                <path d="M 20 100 Q 10 50 30 40 Q 50 20 70 40 Q 90 50 80 100 Z" fill="#115e59" />
                <path d="M 30 90 Q 30 50 40 60 Q 50 70 45 90" fill="#134e4a" />
                <path d="M 50 90 Q 50 40 60 50 Q 70 60 65 90" fill="#134e4a" />
                {/* Brain folds */}
                <path d="M 30 40 Q 40 30 50 40 T 70 40" stroke="#2dd4bf" fill="none" strokeWidth="2" opacity="0.5" />
                <path d="M 35 50 Q 45 40 55 50 T 75 50" stroke="#2dd4bf" fill="none" strokeWidth="2" opacity="0.5" />
            </g>
        )}

        {/* --- BIOLUME --- */}
        {type === MushroomType.Biolume && (
            <g>
                <path d="M 48 100 L 52 100 L 50 50 Z" fill="#3f6212" />
                <circle cx="50" cy="40" r="20" fill="url(#grad-biolume)" filter="url(#glow)" />
                <circle cx="30" cy="60" r="5" fill="#bef264" filter="url(#glow)" />
                <circle cx="70" cy="55" r="8" fill="#bef264" filter="url(#glow)" />
            </g>
        )}
        
        {/* --- CONTAMINATION OVERLAY (MOLD) --- */}
        {isContaminated && (
            <g>
                <circle cx="30" cy="70" r="10" fill="#14532d" opacity="0.8" filter="url(#grain)" />
                <circle cx="35" cy="75" r="5" fill="#86efac" opacity="0.6" />
                
                <circle cx="70" cy="30" r="8" fill="#14532d" opacity="0.8" filter="url(#grain)" />
                <circle cx="68" cy="32" r="3" fill="#86efac" opacity="0.6" />
                
                <path d="M 20 80 Q 50 50 80 90" stroke="#166534" strokeWidth="2" fill="none" strokeDasharray="2 2" opacity="0.7" />
            </g>
        )}
        
      </svg>
    </div>
  );
};
