import React from 'react';
import { FloraType, HydroSlot, ItemType } from '../types';
import { FLORA_DATA } from '../constants';
import { MushroomArt } from './MushroomArt';
import { Droplets, Sparkles, Shovel, Skull } from 'lucide-react';

interface Props {
  slot: HydroSlot;
  hasFertilizer: boolean;
  onPlant: (slotId: number, type: FloraType) => void;
  onWater: (slotId: number) => void;
  onFertilize: (slotId: number) => void;
  onHarvest: (slotId: number) => void;
  onClear: (slotId: number) => void; 
  inventory: { type: ItemType; floraType?: FloraType; count: number }[];
}

export const GrowSlot: React.FC<Props> = ({ 
  slot, 
  hasFertilizer,
  onPlant, 
  onWater, 
  onFertilize, 
  onHarvest,
  onClear,
  inventory 
}) => {
  if (!slot.isUnlocked) {
    return (
      <div className="h-64 rounded-lg bg-stone-900/30 border border-stone-800/50 flex items-center justify-center relative overflow-hidden group">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10"></div>
         <span className="text-stone-700 font-serif italic text-lg flex items-center gap-2">
            Locked Soil
         </span>
      </div>
    );
  }

  // Plant Selection UI
  if (slot.status === 'empty') {
    const seeds = inventory.filter(i => i.type === ItemType.Seed && i.count > 0);
    
    return (
      <div className="h-64 rounded-lg glass-panel border-stone-700 flex flex-col items-center justify-center p-4 gap-4 transition-all hover:bg-stone-800/40">
        <span className="text-stone-400 font-serif text-lg border-b border-stone-700 pb-1 px-4">Empty Plot</span>
        
        <div className="grid grid-cols-2 gap-2 w-full">
          {seeds.length > 0 ? seeds.map(seed => (
            <button
              key={seed.floraType}
              onClick={() => onPlant(slot.id, seed.floraType!)}
              className="flex flex-col items-center p-2 rounded bg-stone-900/50 hover:bg-emerald-900/20 border border-stone-700 hover:border-emerald-700/50 transition-colors text-xs text-stone-300"
            >
              <span className="font-bold mb-1">{FLORA_DATA[seed.floraType!].name}</span>
              <span className="text-stone-500">x{seed.count}</span>
            </button>
          )) : (
            <div className="col-span-2 text-center text-xs text-stone-600 py-4">
                No Spores Available.<br/>Visit the Dark Market.
            </div>
          )}
        </div>
      </div>
    );
  }

  const floraConfig = slot.plantedFlora ? FLORA_DATA[slot.plantedFlora] : null;
  const isWithered = slot.status === 'decayed';
  const isReady = slot.status === 'ready';

  return (
    <div className={`h-64 rounded-lg glass-panel relative flex flex-col justify-between overflow-hidden transition-all duration-500
      ${isWithered ? 'border-red-900/30 bg-red-950/10' : 'border-stone-700'}
      ${isReady ? 'shadow-[0_0_15px_rgba(16,185,129,0.15)] border-emerald-500/30' : ''}
    `}>
        
        {/* Status Bar Top */}
        <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start z-10">
            <div className="flex flex-col">
                <span className={`text-sm font-bold font-serif ${isWithered ? 'text-stone-500 line-through' : 'text-stone-200'}`}>
                    {floraConfig?.name}
                </span>
                <span className="text-[10px] text-stone-500 italic">{floraConfig?.codeName}</span>
            </div>
            
            {/* Hydration Indicator */}
            {!isWithered && !isReady && (
                <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full border border-stone-800">
                    <Droplets size={12} className={slot.hydration < 30 ? "text-red-500 animate-pulse" : "text-sky-500"} />
                    <span className={`text-xs ${slot.hydration < 30 ? "text-red-400 font-bold" : "text-sky-200"}`}>{Math.floor(slot.hydration)}%</span>
                </div>
            )}
        </div>

        {/* Center Art */}
        <div className="flex-1 flex items-end justify-center pb-4 relative">
             {/* Dirt Mound */}
             <div className="absolute bottom-0 w-32 h-8 bg-stone-800 rounded-[50%] blur-sm opacity-60"></div>
             
             {slot.plantedFlora && (
                 <MushroomArt 
                    type={slot.plantedFlora} 
                    stage={slot.growth} 
                    withered={isWithered} 
                 />
             )}

            {/* Growth Particles if fertilized */}
            {slot.hasNutrients && !isWithered && !isReady && (
                <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="absolute bottom-10 left-1/4 animate-ping bg-emerald-400 w-1 h-1 rounded-full"></div>
                    <div className="absolute bottom-20 right-1/3 animate-ping bg-emerald-400 w-1 h-1 rounded-full delay-300"></div>
                </div>
            )}
        </div>

        {/* Controls Overlay */}
        <div className="bg-stone-950/80 backdrop-blur-sm p-3 border-t border-stone-800 flex flex-col gap-2">
            
            {isWithered ? (
                <button 
                    onClick={() => onClear(slot.id)}
                    className="w-full py-2 bg-stone-900 hover:bg-red-900/20 text-stone-400 hover:text-red-400 border border-stone-800 hover:border-red-900/50 rounded flex items-center justify-center gap-2 transition-all text-sm uppercase tracking-widest"
                >
                    <Skull size={14} /> Clear Debris
                </button>
            ) : isReady ? (
                 <button 
                    onClick={() => onHarvest(slot.id)}
                    className="w-full py-2 bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-900 hover:border-emerald-500 rounded flex items-center justify-center gap-2 transition-all text-sm uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.2)] animate-pulse"
                >
                    <Shovel size={14} /> Harvest Specimen
                </button>
            ) : (
                <>
                    {/* Growth Progress */}
                    <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-emerald-700 transition-all duration-300"
                            style={{ width: `${slot.growth}%` }}
                        ></div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button 
                            onClick={() => onWater(slot.id)}
                            className="flex-1 py-1.5 bg-sky-950/30 hover:bg-sky-900/50 border border-sky-900 hover:border-sky-500 text-sky-300 rounded text-xs flex items-center justify-center gap-1 transition-all"
                            title="Restore humidity"
                        >
                            <Droplets size={12} /> Water
                        </button>
                        <button 
                            onClick={() => onFertilize(slot.id)}
                            disabled={slot.hasNutrients || !hasFertilizer}
                            className={`flex-1 py-1.5 border rounded text-xs flex items-center justify-center gap-1 transition-all
                                ${slot.hasNutrients 
                                    ? 'bg-emerald-900/20 border-emerald-900/50 text-emerald-600 cursor-not-allowed' 
                                    : !hasFertilizer
                                        ? 'bg-stone-900 border-stone-800 text-stone-600 cursor-not-allowed'
                                        : 'bg-amber-950/30 hover:bg-amber-900/50 border-amber-900 hover:border-amber-500 text-amber-300'
                                }
                            `}
                            title="Accelerate growth"
                        >
                            <Sparkles size={12} /> {slot.hasNutrients ? 'Active' : 'Fertilize'}
                        </button>
                    </div>
                </>
            )}
        </div>
    </div>
  );
};
