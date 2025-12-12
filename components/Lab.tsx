import React from 'react';
import { GameState, ItemType, MushroomType } from '../types';
import { DRY_TIME, GRIND_TIME } from '../constants';
import { Flame, Fan, Hammer, Timer } from 'lucide-react';

interface Props {
  state: GameState;
  onDry: (rackId: number, type: MushroomType) => void;
  onCollectDry: (rackId: number) => void;
  onGrind: (type: MushroomType) => void;
  onCollectPowder: () => void;
}

export const Kitchen: React.FC<Props> = ({ state, onDry, onCollectDry, onGrind, onCollectPowder }) => {
  const fresh = state.inventory.filter(i => i.type === ItemType.Fresh);
  const dried = state.inventory.filter(i => i.type === ItemType.Dried);

  return (
    <div className="h-full p-4 flex flex-col gap-6 overflow-y-auto pb-24">
       <h2 className="text-2xl text-stone-400 mb-2 stamp bg-black/50 px-4 py-1 rotate-1 self-start">DIRTY KITCHEN</h2>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* DRYING AREA */}
           <div className="concrete-panel p-4 relative">
               <div className="absolute -top-3 -right-3">
                   <Fan className="text-stone-500 animate-spin-slow" size={48} />
               </div>
               <h3 className="text-xl text-stone-300 font-bold mb-4 flex items-center gap-2">
                   <span className="text-amber-700">///</span> Drying Racks
               </h3>

               <div className="space-y-4">
                   {state.racks.map(rack => (
                       <div key={rack.id} className="bg-stone-900 border border-stone-700 p-3 flex items-center justify-between">
                           <div className="flex flex-col">
                               <span className="text-xs text-stone-500 font-mono">RACK_0{rack.id+1}</span>
                               {rack.contents ? (
                                   <span className="text-amber-200 text-sm">{rack.contents} {rack.isMutated ? '(Mutated)' : ''}</span>
                               ) : (
                                   <span className="text-stone-700 text-sm">Empty</span>
                               )}
                           </div>
                           
                           <div className="flex items-center gap-4">
                               {rack.contents ? (
                                   rack.progress >= 100 ? (
                                       <button onClick={() => onCollectDry(rack.id)} className="paper-note px-3 py-1 text-xs font-bold hover:bg-white rotate-2">
                                           BAG IT
                                       </button>
                                   ) : (
                                       <div className="w-24 h-2 bg-stone-800 border border-stone-600">
                                           <div className="h-full bg-amber-700" style={{width: `${rack.progress}%`}}></div>
                                       </div>
                                   )
                               ) : (
                                   <div className="flex gap-1">
                                       {fresh.map(f => (
                                           <button 
                                                key={f.subType}
                                                onClick={() => onDry(rack.id, f.subType as MushroomType)}
                                                className="px-2 py-1 bg-stone-800 text-[10px] border border-stone-600 hover:bg-stone-700 text-stone-300"
                                           >
                                               Dry {f.subType.substring(0,3)}
                                           </button>
                                       ))}
                                       {fresh.length === 0 && <span className="text-[10px] text-stone-600">No fresh fungi</span>}
                                   </div>
                               )}
                           </div>
                       </div>
                   ))}
               </div>
           </div>

           {/* MORTAR AREA */}
           <div className="concrete-panel p-4 relative flex flex-col">
               <h3 className="text-xl text-stone-300 font-bold mb-4 flex items-center gap-2">
                   <span className="text-stone-500">///</span> Mortar & Pestle
               </h3>
                
               <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-stone-900/50 p-4 border border-stone-800">
                   <div className="w-32 h-32 rounded-full border-4 border-stone-600 bg-stone-800 flex items-center justify-center relative">
                       {state.mortar.isGrinding ? (
                           <div className="animate-spin text-4xl">🥣</div>
                       ) : state.mortar.progress >= 100 ? (
                           <div className="text-4xl">✨</div>
                       ) : (
                           <div className="text-4xl text-stone-600">🕳️</div>
                       )}
                   </div>

                   {state.mortar.isGrinding ? (
                        <div className="w-full h-4 bg-stone-800 border border-stone-600">
                             <div className="h-full bg-stone-400" style={{width: `${state.mortar.progress}%`}}></div>
                        </div>
                   ) : state.mortar.progress >= 100 ? (
                       <button onClick={onCollectPowder} className="paper-note px-6 py-2 font-bold text-lg -rotate-1 hover:scale-105 transition-transform">
                           COLLECT POWDER
                       </button>
                   ) : (
                       <div className="w-full">
                           <p className="text-xs text-stone-500 mb-2 text-center uppercase">Select dried ingredient:</p>
                           <div className="flex flex-wrap gap-2 justify-center">
                               {dried.map(d => (
                                   <button 
                                        key={d.subType}
                                        onClick={() => onGrind(d.subType as MushroomType)}
                                        className="px-3 py-2 bg-stone-800 border border-stone-600 hover:bg-stone-700 text-stone-300 text-xs"
                                   >
                                       {d.subType}
                                   </button>
                               ))}
                               {dried.length === 0 && <span className="text-xs text-stone-700">Need dried mushrooms</span>}
                           </div>
                       </div>
                   )}
               </div>
               
               <div className="mt-4 p-2 bg-yellow-900/20 border border-yellow-900/50 text-[10px] text-yellow-600 font-mono">
                   NOTE: Powder sells for 2.5x price. Don't breathe it in.
               </div>
           </div>

       </div>
    </div>
  );
};