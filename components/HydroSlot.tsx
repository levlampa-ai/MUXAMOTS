import React from 'react';
import { FloraType, HydroSlot, ItemType } from '../types';
import { FLORA_DATA } from '../constants';
import { XenoArt } from './XenoArt';
import { Droplets, Zap, Database, Recycle, Download } from 'lucide-react';

interface Props {
  slot: HydroSlot;
  level: number;
  hasNutrients: boolean;
  onPlant: (slotId: number, type: FloraType) => void;
  onHydrate: (slotId: number) => void;
  onNutrients: (slotId: number) => void;
  onHarvest: (slotId: number) => void;
  onClear: (slotId: number) => void;
  inventory: { type: ItemType; floraType?: FloraType; count: number }[];
}

export const HydroBay: React.FC<Props> = ({ 
  slot, 
  level,
  hasNutrients,
  onPlant, 
  onHydrate, 
  onNutrients, 
  onHarvest,
  onClear,
  inventory 
}) => {
  if (!slot.isUnlocked) {
    return (
      <div className="h-72 rounded-sm bg-slate-900/50 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group">
         <div className="text-slate-600 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 bg-red-900 rounded-full animate-pulse"></div> Bay Locked
         </div>
      </div>
    );
  }

  // Plant Selection UI
  if (slot.status === 'empty') {
    const seeds = inventory.filter(i => i.type === ItemType.Seed && i.count > 0);
    
    return (
      <div className="h-72 rounded-sm holo-panel flex flex-col items-center justify-center p-4 gap-4 transition-all hover:bg-slate-800/40 group">
        <span className="text-cyan-400 font-mono text-sm border-b border-cyan-900/50 pb-1 px-4 uppercase tracking-widest">
            Init Sequence
        </span>
        
        <div className="grid grid-cols-2 gap-2 w-full max-h-48 overflow-y-auto pr-1">
          {seeds.length > 0 ? seeds.map(seed => (
            <button
              key={seed.floraType}
              onClick={() => onPlant(slot.id, seed.floraType!)}
              className="flex flex-col items-center p-2 rounded bg-slate-900/80 hover:bg-cyan-900/20 border border-slate-700 hover:border-cyan-500 transition-colors text-[10px] text-slate-300"
            >
              <span className="font-bold mb-1 text-cyan-200">{FLORA_DATA[seed.floraType!].codeName}</span>
              <span className="text-slate-500">x{seed.count}</span>
            </button>
          )) : (
            <div className="col-span-2 text-center text-xs text-slate-600 py-4 font-mono">
                [NO GENETIC MATERIAL]
            </div>
          )}
        </div>
      </div>
    );
  }

  const floraConfig = slot.plantedFlora ? FLORA_DATA[slot.plantedFlora] : null;
  const isDecayed = slot.status === 'decayed';
  const isReady = slot.status === 'ready';

  return (
    <div className={`h-72 rounded-sm holo-panel relative flex flex-col justify-between overflow-hidden transition-all
      ${isDecayed ? 'border-red-900/50 shadow-[0_0_10px_rgba(220,38,38,0.2)]' : ''}
      ${isReady ? 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : ''}
      ${slot.isMutated ? 'ring-1 ring-green-400' : ''}
    `}>
        
        {/* Header HUD */}
        <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start z-10 bg-gradient-to-b from-slate-900/80 to-transparent">
            <div className="flex flex-col">
                <span className={`text-xs font-bold font-mono uppercase ${isDecayed ? 'text-red-500' : 'text-cyan-300'}`}>
                    {floraConfig?.codeName} {slot.isMutated && <span className="text-green-400 animate-pulse">[MUTATION]</span>}
                </span>
                <span className="text-[10px] text-slate-500">{floraConfig?.name}</span>
            </div>
            
            {!isDecayed && !isReady && (
                <div className="flex items-center gap-1 bg-slate-950/50 px-2 py-0.5 rounded border border-slate-800">
                    <Droplets size={10} className={slot.hydration < 30 ? "text-red-500 animate-pulse" : "text-blue-500"} />
                    <span className={`text-[10px] font-mono ${slot.hydration < 30 ? "text-red-400" : "text-blue-200"}`}>{Math.floor(slot.hydration)}%</span>
                </div>
            )}
        </div>

        {/* Viewport */}
        <div className="flex-1 flex items-end justify-center pb-8 relative">
             {/* Grid Floor */}
             <div className="absolute bottom-0 w-full h-24 bg-[linear-gradient(0deg,rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" style={{perspective: '500px', transform: 'rotateX(60deg)'}}></div>
             
             {slot.plantedFlora && (
                 <XenoArt 
                    type={slot.plantedFlora} 
                    stage={slot.growth} 
                    isMutated={slot.isMutated}
                    isDecayed={isDecayed} 
                 />
             )}
        </div>

        {/* Controls Overlay */}
        <div className="bg-slate-950/90 border-t border-slate-800 p-2 flex flex-col gap-2">
            
            {isDecayed ? (
                <button 
                    onClick={() => onClear(slot.id)}
                    className="w-full py-1.5 bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 rounded-sm flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider"
                >
                    <Recycle size={12} /> Purge Biomass
                </button>
            ) : isReady ? (
                 <button 
                    onClick={() => onHarvest(slot.id)}
                    className="w-full py-1.5 bg-green-950/30 hover:bg-green-900/50 text-green-400 border border-green-900/50 hover:border-green-500 rounded-sm flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                >
                    <Download size={12} /> Extract Sample
                </button>
            ) : (
                <>
                    {/* Growth Bar */}
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden flex">
                        <div className="h-full bg-cyan-600 transition-all duration-300 relative" style={{ width: `${slot.growth}%` }}>
                            {/* Scanning line effect */}
                            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/20 shadow-[0_0_5px_white]"></div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                        <button 
                            onClick={() => onHydrate(slot.id)}
                            className="flex-1 py-1 bg-blue-950/30 hover:bg-blue-900/50 border border-blue-900 hover:border-blue-500 text-blue-300 rounded-sm text-[10px] flex items-center justify-center gap-1"
                        >
                            <Droplets size={10} /> Gel
                        </button>
                        <button 
                            onClick={() => onNutrients(slot.id)}
                            disabled={slot.hasNutrients || !hasNutrients}
                            className={`flex-1 py-1 border rounded-sm text-[10px] flex items-center justify-center gap-1 transition-all
                                ${slot.hasNutrients 
                                    ? 'bg-green-900/20 border-green-900/50 text-green-600 cursor-not-allowed' 
                                    : !hasNutrients
                                        ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                                        : 'bg-yellow-950/30 hover:bg-yellow-900/50 border-yellow-900 hover:border-yellow-500 text-yellow-300'
                                }
                            `}
                        >
                            <Zap size={10} /> {slot.hasNutrients ? 'BST' : 'Boost'}
                        </button>
                    </div>
                </>
            )}
        </div>
    </div>
  );
};