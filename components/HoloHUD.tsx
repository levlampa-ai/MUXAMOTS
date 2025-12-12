import React from 'react';
import { GameState, ItemType, FloraType } from '../types';
import { FLORA_DATA } from '../constants';
import { Box, Zap, Activity, Grid } from 'lucide-react';

interface Props {
  state: GameState;
}

export const HoloHUD: React.FC<Props> = ({ state }) => {
  const getCount = (type: ItemType, floraType?: FloraType) => {
    const item = state.inventory.find(i => 
      i.type === type && (floraType ? i.floraType === floraType : true)
    );
    return item ? item.count : 0;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 border-t border-slate-800 p-2 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* STATS */}
        <div className="flex items-center gap-6 border-r border-slate-800 pr-6">
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Credits</span>
                <span className="text-xl font-bold font-mono text-cyan-400">{state.credits.toLocaleString()} <span className="text-xs text-cyan-700">CR</span></span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Reactor</span>
                <div className="flex items-center gap-2">
                    <Zap size={16} className={state.energy < 20 ? "text-red-500 animate-pulse" : "text-yellow-400"} />
                    <div className="w-20 h-2 bg-slate-800 rounded-sm">
                        <div className={`h-full ${state.energy < 20 ? 'bg-red-500' : 'bg-yellow-400'}`} style={{width: `${(state.energy / state.maxEnergy) * 100}%`}}></div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Clearance Lvl {state.level}</span>
                <div className="w-20 h-1 bg-slate-800 mt-1">
                    <div className="h-full bg-purple-500" style={{width: `${(state.xp / 100) * 10}%`}}></div> {/* Simplified visual */}
                </div>
            </div>
        </div>

        {/* INVENTORY SCROLL */}
        <div className="flex-1 overflow-x-auto hide-scrollbar flex gap-2 items-center">
            
            {/* Seeds */}
            {Object.values(FloraType).map(t => {
                const count = getCount(ItemType.Seed, t);
                if (count === 0) return null;
                return (
                    <div key={`seed-${t}`} className="bg-slate-900 border border-slate-800 px-2 py-1 rounded-sm min-w-[50px] flex flex-col items-center">
                         <span className="text-[8px] text-slate-500">SEED</span>
                         <span className="text-xs font-mono text-cyan-200">{t.substring(0,3)}</span>
                         <span className="text-[10px] text-slate-400">x{count}</span>
                    </div>
                )
            })}

            <div className="w-px h-8 bg-slate-800 mx-2"></div>

            {/* Biomass */}
            {Object.values(FloraType).map(t => {
                const count = getCount(ItemType.Biomass, t);
                if (count === 0) return null;
                return (
                    <div key={`bio-${t}`} className="bg-slate-900 border border-green-900/30 px-2 py-1 rounded-sm min-w-[50px] flex flex-col items-center">
                         <span className="text-[8px] text-slate-500">BIO</span>
                         <span className="text-xs font-mono text-green-200">{t.substring(0,3)}</span>
                         <span className="text-[10px] text-slate-400">x{count}</span>
                    </div>
                )
            })}

            <div className="w-px h-8 bg-slate-800 mx-2"></div>
            
            {/* Compounds */}
             {[ItemType.CompoundAlpha, ItemType.CompoundBeta, ItemType.CompoundOmega].map(t => {
                const count = getCount(t);
                if (count === 0) return null;
                let color = "text-white";
                if(t === ItemType.CompoundAlpha) color = "text-blue-300";
                if(t === ItemType.CompoundBeta) color = "text-purple-300";
                if(t === ItemType.CompoundOmega) color = "text-yellow-300";

                return (
                    <div key={`comp-${t}`} className="bg-slate-900 border border-purple-900/30 px-2 py-1 rounded-sm min-w-[50px] flex flex-col items-center shadow-[0_0_5px_rgba(168,85,247,0.1)]">
                         <span className="text-[8px] text-slate-500">CMP</span>
                         <span className={`text-xs font-mono ${color}`}>{t.replace('Compound','').substring(0,3)}</span>
                         <span className="text-[10px] text-slate-400">x{count}</span>
                    </div>
                )
            })}
        </div>

      </div>
    </div>
  );
};