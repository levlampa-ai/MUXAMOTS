import React from 'react';
import { GameState, ItemType, FloraType } from '../types';
import { FLORA_DATA } from '../constants';
import { Beaker, Sprout, Leaf, Atom, BriefcaseMedical } from 'lucide-react';

interface Props {
  state: GameState;
}

export const InventoryBar: React.FC<Props> = ({ state }) => {
  const getCount = (type: ItemType, floraType?: FloraType) => {
    const item = state.inventory.find(i => 
      i.type === type && (floraType ? i.floraType === floraType : true)
    );
    return item ? item.count : 0;
  };

  const nutrientCount = getCount(ItemType.NutrientPack);
  
  // Compound Counts
  const alphaCount = getCount(ItemType.CompoundAlpha);
  const betaCount = getCount(ItemType.CompoundBeta);
  const omegaCount = getCount(ItemType.CompoundOmega);

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-stone-800 p-4 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between overflow-x-auto gap-6 hide-scrollbar">
        
        {/* Currency Display */}
        <div className="flex items-center gap-3 pr-6 border-r border-stone-700/50 min-w-max">
            <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center border border-emerald-500/20">
                <span className="text-xl">⚗️</span>
            </div>
            <div>
                <div className="text-xs text-stone-400 uppercase tracking-widest">Credits</div>
                <div className="text-xl font-bold text-emerald-400 font-serif">{state.credits.toLocaleString()} <span className="text-sm text-stone-500">CR</span></div>
            </div>
        </div>

        {/* Resources Grid */}
        <div className="flex gap-8 flex-1 justify-center">
            
            {/* Seeds */}
            <div className="flex flex-col gap-1 min-w-[60px]">
                <div className="flex items-center gap-2 text-stone-500 text-xs uppercase tracking-wider mb-1">
                    <Sprout size={12} /> Seeds
                </div>
                <div className="flex gap-3">
                    {Object.values(FloraType).map(t => {
                        const count = getCount(ItemType.Seed, t);
                        if (count === 0) return null;
                        return (
                           <div key={t} className="relative group cursor-help">
                                <div className="w-8 h-8 rounded bg-stone-900/80 border border-stone-700 flex items-center justify-center text-xs text-stone-300 font-serif">
                                    {FLORA_DATA[t].codeName.substring(0,2)}
                                </div>
                                <span className="absolute -top-2 -right-2 bg-stone-800 text-white text-[10px] px-1 rounded-full border border-stone-600">{count}</span>
                           </div> 
                        )
                    })}
                    {state.inventory.filter(i => i.type === ItemType.Seed).length === 0 && <span className="text-stone-700 text-sm italic">Empty</span>}
                </div>
            </div>

            {/* Biomass */}
            <div className="flex flex-col gap-1 min-w-[60px]">
                <div className="flex items-center gap-2 text-stone-500 text-xs uppercase tracking-wider mb-1">
                    <Leaf size={12} /> Biomass
                </div>
                <div className="flex gap-3">
                    {Object.values(FloraType).map(t => {
                        const count = getCount(ItemType.Biomass, t);
                        if (count === 0) return null;
                        return (
                           <div key={t} className="relative group">
                                <div className="w-8 h-8 rounded bg-stone-900/80 border border-stone-700 flex items-center justify-center text-xs text-stone-300 font-serif">
                                    {FLORA_DATA[t].codeName.substring(0,2)}
                                </div>
                                <span className="absolute -top-2 -right-2 bg-emerald-900 text-emerald-100 text-[10px] px-1 rounded-full border border-emerald-700">{count}</span>
                           </div> 
                        )
                    })}
                     {state.inventory.filter(i => i.type === ItemType.Biomass).length === 0 && <span className="text-stone-700 text-sm italic">Empty</span>}
                </div>
            </div>

            {/* Refined */}
            <div className="flex flex-col gap-1 min-w-[60px]">
                <div className="flex items-center gap-2 text-stone-500 text-xs uppercase tracking-wider mb-1">
                    <Beaker size={12} /> Refined
                </div>
                <div className="flex gap-3">
                     {Object.values(FloraType).map(t => {
                        const count = getCount(ItemType.Refined, t);
                        if (count === 0) return null;
                        return (
                           <div key={t} className="relative group">
                                <div className="w-8 h-8 rounded bg-amber-900/20 border border-amber-900/50 flex items-center justify-center text-xs text-amber-500 font-serif">
                                    {FLORA_DATA[t].codeName.substring(0,2)}
                                </div>
                                <span className="absolute -top-2 -right-2 bg-stone-800 text-white text-[10px] px-1 rounded-full border border-stone-600">{count}</span>
                           </div> 
                        )
                    })}
                     {state.inventory.filter(i => i.type === ItemType.Refined).length === 0 && <span className="text-stone-700 text-sm italic">Empty</span>}
                </div>
            </div>

             {/* Compounds */}
             <div className="flex flex-col gap-1 min-w-[60px]">
                <div className="flex items-center gap-2 text-stone-500 text-xs uppercase tracking-wider mb-1">
                    <Atom size={12} /> Compounds
                </div>
                <div className="flex gap-2">
                    {alphaCount > 0 && (
                         <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-600 flex items-center justify-center text-xs text-stone-400 font-serif relative">
                             α <span className="absolute -top-2 -right-2 bg-stone-900 text-white px-1 rounded-full text-[9px] border border-stone-700">{alphaCount}</span>
                         </div>
                    )}
                    {betaCount > 0 && (
                         <div className="w-8 h-8 rounded-full bg-purple-900/30 border border-purple-500/50 flex items-center justify-center text-xs text-purple-300 font-serif shadow-[0_0_10px_rgba(168,85,247,0.4)] relative">
                             β <span className="absolute -top-2 -right-2 bg-purple-950 text-white px-1 rounded-full text-[9px] border border-purple-700">{betaCount}</span>
                         </div>
                    )}
                    {omegaCount > 0 && (
                         <div className="w-8 h-8 rounded-full bg-amber-900/30 border border-amber-500/80 flex items-center justify-center text-xs text-amber-300 font-serif shadow-[0_0_15px_rgba(251,191,36,0.6)] relative animate-pulse">
                             Ω <span className="absolute -top-2 -right-2 bg-amber-950 text-white px-1 rounded-full text-[9px] border border-amber-700">{omegaCount}</span>
                         </div>
                    )}
                    
                    {alphaCount === 0 && betaCount === 0 && omegaCount === 0 && <span className="text-stone-700 text-sm italic">None</span>}
                </div>
            </div>
            
        </div>

        {/* Consumables */}
        <div className="pl-6 border-l border-stone-700/50 flex gap-4">
             <div className="flex items-center gap-2 group relative">
                <BriefcaseMedical className="text-emerald-800" size={20} />
                <div className="flex flex-col">
                    <span className="text-[10px] text-stone-500 uppercase">Nutrients</span>
                    <span className="text-sm text-stone-300 font-serif">{nutrientCount}</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
