
import React from 'react';
import { LampType, SerumType } from '../types';

// --- LAMPS ---
interface LampProps {
  type: LampType;
  className?: string;
}

export const LampArt: React.FC<LampProps> = ({ type, className = "" }) => {
  let bulbColor = "#fcd34d"; // Default
  let glowColor = "rgba(252, 211, 77, 0.5)";
  let glassOpacity = 0.3;
  let filamentType = "standard";

  if (type === LampType.Heat) {
    bulbColor = "#ef4444";
    glowColor = "rgba(239, 68, 68, 0.6)";
    filamentType = "thick";
  } else if (type === LampType.UV) {
    bulbColor = "#a855f7";
    glowColor = "rgba(168, 85, 247, 0.6)";
    glassOpacity = 0.6;
    filamentType = "tube";
  } else if (type === LampType.LED) {
    bulbColor = "#3b82f6";
    glowColor = "rgba(59, 130, 246, 0.6)";
    filamentType = "led";
  }

  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
      <svg viewBox="0 0 100 100" className="drop-shadow-lg overflow-visible">
        <defs>
          <radialGradient id={`glow-${type}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={bulbColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={bulbColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base */}
        <rect x="35" y="75" width="30" height="20" rx="2" fill="#d6d3d1" stroke="#57534e" strokeWidth="1" />
        <path d="M 35 80 L 65 80 M 35 85 L 65 85 M 35 90 L 65 90" stroke="#78716c" strokeWidth="1" />
        <path d="M 45 95 L 55 95 L 50 100 Z" fill="#44403c" />

        {/* Glass Bulb */}
        {filamentType !== "tube" ? (
             <path 
                d="M 25 40 Q 25 5 50 5 Q 75 5 75 40 Q 75 65 65 75 L 35 75 Q 25 65 25 40" 
                fill={bulbColor} 
                fillOpacity={glassOpacity} 
                stroke={bulbColor} 
                strokeWidth="1"
                className="animate-pulse-slow"
             />
        ) : (
             <rect x="30" y="10" width="40" height="65" rx="5" fill={bulbColor} fillOpacity={glassOpacity} stroke={bulbColor} />
        )}

        {/* Filament / Internals */}
        {filamentType === "standard" && (
            <path d="M 40 75 L 40 50 L 45 40 L 55 40 L 60 50 L 60 75" fill="none" stroke="#fca5a5" strokeWidth="1" />
        )}
        {filamentType === "thick" && (
            <path d="M 40 75 L 40 45 Q 50 25 60 45 L 60 75" fill="none" stroke="#b91c1c" strokeWidth="2" />
        )}
        {filamentType === "tube" && (
            <g>
                <rect x="42" y="20" width="6" height="50" fill="#e9d5ff" opacity="0.8" />
                <rect x="52" y="20" width="6" height="50" fill="#e9d5ff" opacity="0.8" />
            </g>
        )}
        {filamentType === "led" && (
            <rect x="40" y="50" width="20" height="20" rx="2" fill="#bfdbfe" />
        )}

        {/* Highlight */}
        <ellipse cx="60" cy="25" rx="5" ry="8" fill="white" opacity="0.4" transform="rotate(-45 60 25)" />
      </svg>
    </div>
  );
};

// --- SERUMS ---
interface SerumProps {
  type: SerumType;
  className?: string;
}

export const SerumArt: React.FC<SerumProps> = ({ type, className = "" }) => {
  const liquidColor = type === SerumType.GrowthHormone ? "#22c55e" : "#d946ef";
  
  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
      <svg viewBox="0 0 100 100" className="drop-shadow-md overflow-visible">
          {/* Needle */}
          <rect x="48" y="85" width="4" height="15" fill="#9ca3af" />
          <path d="M 49 100 L 51 100 L 50 115 Z" fill="#d1d5db" />

          {/* Body */}
          <rect x="35" y="30" width="30" height="60" rx="2" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" opacity="0.5" />
          
          {/* Liquid */}
          <rect x="37" y="45" width="26" height="43" rx="1" fill={liquidColor} opacity="0.8" className="animate-pulse" />
           {/* Bubbles */}
           <circle cx="45" cy="70" r="2" fill="white" opacity="0.5" />
           <circle cx="55" cy="55" r="1.5" fill="white" opacity="0.5" />

          {/* Measurement Lines */}
          <line x1="65" y1="40" x2="55" y2="40" stroke="black" strokeWidth="1" opacity="0.5" />
          <line x1="65" y1="50" x2="55" y2="50" stroke="black" strokeWidth="1" opacity="0.5" />
          <line x1="65" y1="60" x2="55" y2="60" stroke="black" strokeWidth="1" opacity="0.5" />
          <line x1="65" y1="70" x2="55" y2="70" stroke="black" strokeWidth="1" opacity="0.5" />

          {/* Plunger */}
          <rect x="37" y="32" width="26" height="4" fill="#1f2937" />
          <rect x="45" y="5" width="10" height="27" fill="#d1d5db" stroke="#9ca3af" />
          <rect x="35" y="5" width="30" height="4" rx="1" fill="#1f2937" />
      </svg>
    </div>
  )
}

export const SprayBottleArt = ({ className="" }: { className?: string }) => (
    <div className={className} style={{ width: '100%', height: '100%' }}>
        <svg viewBox="0 0 100 100" className="overflow-visible drop-shadow-md">
            {/* Bottle */}
            <path d="M 30 100 L 30 60 Q 30 40 45 35 L 45 25 L 55 25 L 55 35 Q 70 40 70 60 L 70 100 Z" fill="#e5e5e5" stroke="#737373" strokeWidth="1" />
            <rect x="35" y="60" width="30" height="35" fill="#3b82f6" opacity="0.6" />
            {/* Nozzle */}
            <path d="M 45 25 L 45 15 L 25 15 L 20 20" fill="none" stroke="#404040" strokeWidth="4" />
            <rect x="25" y="20" width="5" height="10" fill="#ef4444" /> {/* Trigger */}
            <path d="M 20 20 L 15 25" stroke="#ef4444" strokeWidth="2" />
        </svg>
    </div>
);

// Added targetRange prop to visualize safe zones
export const AnalogGaugeArt = ({ 
    value, 
    label, 
    color = "#22c55e", 
    targetRange, 
    className="" 
}: { 
    value: number, 
    label: string, 
    color?: string, 
    targetRange?: [number, number],
    className?: string 
}) => {
    
    // Convert 0-100 to angle (-120 to 120)
    const toAngle = (v: number) => (v / 100) * 240 - 120;
    
    // SVG Arc for safe zone
    const describeArc = (startVal: number, endVal: number, radius: number) => {
        const startAngle = toAngle(startVal) - 90; // SVG 0 is right, our 0 is top
        const endAngle = toAngle(endVal) - 90;
        
        const startToRad = (startAngle * Math.PI) / 180;
        const endToRad = (endAngle * Math.PI) / 180;

        const x1 = 50 + radius * Math.cos(startToRad);
        const y1 = 50 + radius * Math.sin(startToRad);
        const x2 = 50 + radius * Math.cos(endToRad);
        const y2 = 50 + radius * Math.sin(endToRad);

        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
    };

    return (
        <div className={className} style={{ width: '100%', height: '100%' }}>
            <svg viewBox="0 0 100 100" className="overflow-visible">
                {/* Case */}
                <circle cx="50" cy="50" r="45" fill="#171717" stroke="#404040" strokeWidth="4" />
                
                {/* Safe Zone Arc */}
                {targetRange && (
                    <path 
                        d={describeArc(Math.max(0, targetRange[0] - 10), Math.min(100, targetRange[1] + 10), 35)} 
                        stroke="#22c55e" 
                        strokeWidth="6" 
                        fill="none" 
                        opacity="0.3"
                    />
                )}

                {/* Glass Glare */}
                <path d="M 20 20 Q 50 5 80 20" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                
                {/* Ticks */}
                <line x1="50" y1="10" x2="50" y2="15" stroke="#525252" strokeWidth="2" />
                <line x1="90" y1="50" x2="85" y2="50" stroke="#525252" strokeWidth="2" />
                <line x1="50" y1="90" x2="50" y2="85" stroke="#525252" strokeWidth="2" />
                <line x1="10" y1="50" x2="15" y2="50" stroke="#525252" strokeWidth="2" />
                
                {/* Danger Zone */}
                <path d="M 75 80 A 40 40 0 0 0 90 50" stroke="#ef4444" strokeWidth="3" fill="none" />

                {/* Label */}
                <text x="50" y="70" textAnchor="middle" fill="#a3a3a3" fontSize="10" fontFamily="monospace" letterSpacing="1">{label}</text>
                
                {/* Needle */}
                <g transform={`rotate(${ toAngle(value) } 50 50)`} className="transition-transform duration-500 ease-out">
                    <path d="M 50 50 L 50 15" stroke={color} strokeWidth="2" />
                    <circle cx="50" cy="50" r="3" fill="#d4d4d4" />
                </g>
            </svg>
        </div>
    );
};

export const SporeBagArt = ({ color = "#888", className="" }: { color?: string, className?: string }) => (
    <div className={className} style={{ width: '100%', height: '100%' }}>
        <svg viewBox="0 0 100 100" className="overflow-visible drop-shadow-md">
            <defs>
                <filter id="outline">
                    <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="1" />
                    <feFlood floodColor="black" floodOpacity="0.5" result="FLOOD" />
                    <feComposite in="FLOOD" in2="DILATED" operator="in" result="OUTLINE" />
                    <feMerge>
                        <feMergeNode in="OUTLINE" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <g filter="url(#outline)">
                <path d="M 25 85 Q 25 95 35 95 L 65 95 Q 75 95 75 85 L 70 35 L 30 35 Z" fill="#e5e5e5" stroke="#737373" strokeWidth="2" />
                <path d="M 30 35 L 70 35 L 50 15 Z" fill="#e5e5e5" stroke="#737373" strokeWidth="2" />
                <path d="M 40 35 L 60 35" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
                <circle cx="50" cy="65" r="12" fill="#fff" stroke="#a3a3a3" />
                <circle cx="50" cy="65" r="8" fill={color} opacity="0.9" />
                <path d="M 46 62 L 52 62 M 48 58 L 48 66" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
            </g>
        </svg>
    </div>
);

export const EmptyBoxArt = ({ className="" }: { className?: string }) => (
    <div className={className}>
        <svg viewBox="0 0 100 100" className="overflow-visible opacity-50">
            <path d="M 10 30 L 50 10 L 90 30 L 90 80 L 50 100 L 10 80 Z" fill="none" stroke="#44403c" strokeWidth="2" />
            <path d="M 10 30 L 50 50 L 90 30" fill="none" stroke="#44403c" strokeWidth="2" />
            <path d="M 50 50 L 50 100" fill="none" stroke="#44403c" strokeWidth="2" />
            <line x1="20" y1="90" x2="80" y2="90" stroke="#44403c" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
    </div>
);

export const MortarBaseArt = () => (
    <svg viewBox="0 0 100 100" className="overflow-visible">
        <ellipse cx="50" cy="50" rx="45" ry="45" fill="#292524" stroke="#44403c" strokeWidth="2" />
        <ellipse cx="50" cy="50" rx="35" ry="35" fill="#1c1917" stroke="#0c0a09" strokeWidth="4" />
        <ellipse cx="50" cy="50" rx="30" ry="30" fill="black" opacity="0.3" />
    </svg>
);

export const PestleArt = ({ className="" }: { className?: string }) => (
    <div className={className} style={{width: '100%', height: '100%'}}>
        <svg viewBox="0 0 100 100" className="overflow-visible drop-shadow-2xl">
            <circle cx="50" cy="50" r="10" fill="#78716c" stroke="#44403c" strokeWidth="1" />
            <circle cx="50" cy="50" r="20" fill="url(#pestle-grad)" opacity="0.8" />
            <defs>
                <radialGradient id="pestle-grad">
                    <stop offset="0%" stopColor="#57534e" />
                    <stop offset="100%" stopColor="#292524" />
                </radialGradient>
            </defs>
            <circle cx="45" cy="45" r="5" fill="white" opacity="0.1" />
        </svg>
    </div>
);

export const CentrifugeArt = ({ isRunning }: { isRunning: boolean }) => (
    <svg viewBox="0 0 100 100" className="overflow-visible">
        <circle cx="50" cy="50" r="48" fill="#1c1917" stroke="#44403c" strokeWidth="2" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="#292524" strokeWidth="4" strokeDasharray="5 5" className={isRunning ? "animate-spin-slow" : ""} />
        <circle cx="50" cy="50" r="20" fill="#0c0a09" stroke={isRunning ? "#a855f7" : "#44403c"} strokeWidth="2" />
        <path d="M 35 35 Q 50 20 65 35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
    </svg>
);
