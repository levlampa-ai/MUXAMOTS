
import React from 'react';
import { GameState, ItemType } from '../types';
import { Wallet, Package, Zap, Beaker, Eye } from 'lucide-react';

interface Props {
  state: GameState;
}

export const HUD: React.FC<Props> = ({ state }) => {
  const spores = state.inventory.filter(i => i.type === ItemType.Spore || i.type === ItemType.HybridSpore);
  const products = state.inventory.filter(i => i.type === ItemType.Fresh || i.type === ItemType.Dried || i.type === ItemType.Powder);
  const gear = state.inventory.filter(i => i.type === ItemType.Lamp || i.type === ItemType.Serum);

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 pointer-events-none flex justify-center">
        <div className="bg-[#1c1917] border-2 border-[#44403c] p-2 flex gap-4 shadow-[0_0_20px_rgba(0,0,0,0.8)] pointer-events-auto max-w-full overflow-x-auto custom-scrollbar items-center">
            
            {/* CASH */}
            <div className="flex items-center gap-2 px-3 border-r border-stone-700">
                <Wallet className="text-green-700" size={20} />
                <span className="font-mono text-green-500 text-xl font-bold">${state.cash.toFixed(2)}</span>
            </div>

            {/* SUSPICION */}
            <div className="flex items-center gap-2 px-3 border-r border-stone-700 w-32">
                <Eye className={state.suspicion > 50 ? "text-red-500 animate-pulse" : "text-stone-500"} size={20} />
                <div className="flex-1 flex flex-col">
                    <span className="text-[8px] text-stone-500 uppercase">Suspicion</span>
                    <div className="w-full h-2 bg-stone-800 rounded overflow-hidden">
                        <div className={`h-full ${state.suspicion > 80 ? 'bg-red-600' : 'bg-orange-500'}`} style={{width: `${state.suspicion}%`}}></div>
                    </div>
                </div>
            </div>

            {/* SPORES */}
            <div className="flex items-center gap-2 px-2">
                <Package className="text-stone-500" size={16} />
                <div className="flex gap-1">
                    {spores.length > 0 ? spores.map(s => (
                        <div key={s.id} className={`bg-stone-800 text-[10px] px-2 py-1 rounded border flex flex-col items-center ${s.type === ItemType.HybridSpore ? 'border-purple-500 text-purple-300' : 'border-stone-600 text-stone-300'}`}>
                            <span>{s.subType.substring(0,3)}</span>
                            <span className="text-stone-500">x{s.count}</span>
                        </div>
                    )) : <span className="text-[10px] text-stone-700 self-center">No Spores</span>}
                </div>
            </div>

            <div className="w-px bg-stone-700 h-8"></div>

            {/* PRODUCTS */}
            <div className="flex items-center gap-2 px-2">
                <Beaker className="text-amber-700" size={16} />
                <div className="flex gap-1">
                    {products.slice(0, 4).map(p => (
                        <div key={p.id} className="bg-stone-800 text-[10px] text-amber-200/70 px-2 py-1 rounded border border-amber-900/30 flex flex-col items-center">
                            <span>{p.subType.substring(0,3)}</span>
                            <span className="text-stone-500">x{p.count}</span>
                        </div>
                    ))}
                     {products.length === 0 && <span className="text-[10px] text-stone-700 self-center">Empty Stash</span>}
                </div>
            </div>

        </div>
    </div>
  );
};
