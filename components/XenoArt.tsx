import React from 'react';
import { FloraType } from '../types';
import { FLORA_DATA } from '../constants';

interface Props {
  type: FloraType;
  stage: number; // 0 to 100
  isMutated?: boolean;
  isDecayed?: boolean;
  className?: string;
}

export const XenoArt: React.FC<Props> = ({ type, stage, isMutated, isDecayed, className = "" }) => {
  const config = FLORA_DATA[type];
  const scale = 0.2 + (stage / 100) * 0.8;
  const opacity = stage < 5 ? 0 : 1;
  
  // Colors
  let mainColor = isDecayed ? "#334155" : config.colorMain;
  let accentColor = isDecayed ? "#475569" : config.colorAccent;
  
  if (isMutated && !isDecayed) {
      mainColor = "#22c55e"; // Toxic Green
      accentColor = "#86efac";
  }

  const pulseSpeed = isDecayed ? '0s' : '3s';

  return (
    <div 
      className={`relative flex items-end justify-center ${className}`}
      style={{ 
        width: '100px', 
        height: '100px',
        opacity: opacity,
        transition: 'all 0.5s ease-out'
      }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="overflow-visible"
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'bottom center',
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <defs>
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
               <feGaussianBlur stdDeviation="3" result="blur" />
               <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="stem-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={mainColor} stopOpacity="0.8"/>
                <stop offset="100%" stopColor="transparent" />
            </linearGradient>
        </defs>

        {/* --- LUMINA (Orb) --- */}
        {type === FloraType.Lumina && (
            <g>
                <path d="M 50 100 L 50 50" stroke={mainColor} strokeWidth="2" fill="none" />
                <circle cx="50" cy="40" r="20" fill={mainColor} opacity="0.3" className="animate-pulse" style={{animationDuration: pulseSpeed}} />
                <circle cx="50" cy="40" r="12" fill={accentColor} filter="url(#neon-glow)" />
                <circle cx="50" cy="40" r="5" fill="#fff" />
                {stage > 50 && <circle cx="65" cy="55" r="4" fill={accentColor} filter="url(#neon-glow)" />}
                {stage > 70 && <circle cx="35" cy="60" r="3" fill={accentColor} filter="url(#neon-glow)" />}
            </g>
        )}

        {/* --- IGNIS (Spikes) --- */}
        {type === FloraType.Ignis && (
            <g>
                <path d="M 50 100 L 45 70 L 55 40" stroke={mainColor} strokeWidth="3" fill="none" />
                <path d="M 55 40 L 40 20 L 55 5 Z" fill={accentColor} filter="url(#neon-glow)" />
                {stage > 40 && <path d="M 45 70 L 30 50 L 35 40 Z" fill={mainColor} opacity="0.8" />}
                {stage > 60 && <path d="M 50 60 L 70 50 L 75 35 Z" fill={mainColor} opacity="0.8" />}
            </g>
        )}

        {/* --- CRYSTAL (Shards) --- */}
        {type === FloraType.Crystal && (
            <g>
                <path d="M 40 100 L 45 60 L 30 20 L 50 40 L 70 15 L 55 60 L 60 100 Z" fill="url(#stem-gradient)" opacity="0.5" />
                <polygon points="50,40 30,20 45,60" fill={accentColor} opacity="0.9" filter="url(#neon-glow)" />
                <polygon points="50,40 70,15 55,60" fill={mainColor} opacity="0.9" filter="url(#neon-glow)" />
                {/* Floating shards */}
                {stage > 80 && (
                     <polygon points="45,10 50,0 55,10 50,20" fill="#fff" className="animate-float" />
                )}
            </g>
        )}

        {/* --- NEBULA (Cloud) --- */}
        {type === FloraType.Nebula && (
            <g>
                <path d="M 50 100 Q 30 80 50 60" stroke={mainColor} strokeWidth="1" fill="none" />
                <circle cx="50" cy="40" r="25" fill={mainColor} filter="url(#neon-glow)" opacity="0.2" />
                <circle cx="40" cy="35" r="10" fill={accentColor} opacity="0.6" className="animate-float" style={{animationDelay: '0s'}} />
                <circle cx="60" cy="45" r="8" fill={accentColor} opacity="0.6" className="animate-float" style={{animationDelay: '1s'}} />
                <circle cx="50" cy="25" r="6" fill={accentColor} opacity="0.6" className="animate-float" style={{animationDelay: '2s'}} />
            </g>
        )}

        {/* --- VOID (Vortex) --- */}
        {type === FloraType.Void && (
             <g className="animate-spin-slow" style={{transformBox: 'fill-box', transformOrigin: 'center'}}>
                 <circle cx="50" cy="50" r="20" stroke={mainColor} strokeWidth="2" fill="#000" />
                 <path d="M 50 30 Q 70 30 70 50" stroke={accentColor} strokeWidth="2" fill="none" />
                 <path d="M 70 50 Q 70 70 50 70" stroke={accentColor} strokeWidth="2" fill="none" />
                 <path d="M 50 70 Q 30 70 30 50" stroke={accentColor} strokeWidth="2" fill="none" />
                 <path d="M 30 50 Q 30 30 50 30" stroke={accentColor} strokeWidth="2" fill="none" />
                 <circle cx="50" cy="50" r="5" fill="#fff" filter="url(#neon-glow)" />
             </g>
        )}
        
        {isMutated && !isDecayed && (
             <circle cx="80" cy="20" r="5" fill="#22c55e" filter="url(#neon-glow)" className="animate-ping" />
        )}
      </svg>
    </div>
  );
};