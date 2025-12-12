import React from 'react';
import { GameState, ItemType, FloraType } from '../types';
import { FLORA_DATA } from '../constants';
import { Wind, FlaskConical, RotateCcw } from 'lucide-react';

interface Props {
  state: GameState;
  onPlaceInDryer: (slotId: number, floraType: FloraType) => void;
  onRetrieveDryer: (slotId: number) => void;
  onAddToMortar: (floraType: FloraType) => void;
  onMix: () => void;
  onClearMortar: () => void;
}

export const Laboratory: React.FC<Props> = ({ 
  state, 
  onPlaceInDryer, 
  onRetrieveDryer,
  onAddToMortar,
  onMix,
  onClearMortar
}) => {
  const freshItems = state.inventory.filter(i => i.type === ItemType.Biomass && i.count > 0);
  const driedItems = state.inventory.filter(i => i.type === ItemType.Refined && i.count > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      
      {/* --- PROCESSOR (Was Desiccator) --- */}
      <div className="glass-panel p-6 rounded-lg relative overflow-hidden flex flex-col h-full">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wind size={64} />
        </div>
        <div className="flex justify-between items-center mb-4 border-b border-stone-700 pb-2">
             <h3 className="text-xl text-amber-100/80 flex items-center gap-2">
                <Wind size={20} /> The Processor
            </h3>
            <span className="text-xs text-stone-500 uppercase">Capacity: {state.processorSlots.filter(s => s.isUnlocked).length}</span>
        </div>
       
        <div className="flex flex-col gap-4 flex-1">
            {/* Racks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {state.processorSlots.filter(s => s.isUnlocked).map(slot => (
                    <div key={slot.id} className="bg-stone-950/50 rounded border border-dashed border-stone-700 p-3 relative flex flex-col justify-between min-h-[140px]">
                        
                        {slot.contents ? (
                            <>
                                <div className="flex flex-col items-center gap-2 z-10 flex-1 justify-center">
                                    <span className="text-stone-300 font-serif text-md">{FLORA_DATA[slot.contents].name}</span>
                                    {slot.progress >= 100 ? (
                                        <button 
                                            onClick={() => onRetrieveDryer(slot.id)}
                                            className="px-3 py-1 bg-amber-900/40 hover:bg-amber-800 text-amber-200 border border-amber-600 rounded text-xs animate-bounce"
                                        >
                                            Collect Refined
                                        </button>
                                    ) : (
                                        <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden mt-2">
                                            <div className="h-full bg-orange-600 transition-all duration-200" style={{width: `${slot.progress}%`}}></div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-2">
                                <span className="text-stone-600 italic text-xs">Rack Empty</span>
                                <div className="flex flex-wrap gap-1 justify-center">
                                     {freshItems.slice(0, 3).map(item => (
                                        <button
                                            key={item.floraType}
                                            onClick={() => onPlaceInDryer(slot.id, item.floraType!)}
                                            className="px-2 py-1 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded text-[10px] text-stone-300 transition-colors"
                                        >
                                            {item.floraType?.substring(0, 3)}
                                        </button>
                                    ))}
                                    {freshItems.length > 3 && <span className="text-[10px] text-stone-600">...</span>}
                                </div>
                            </div>
                        )}
                        <div className="absolute top-1 right-2 text-[10px] text-stone-700">#{slot.id + 1}</div>
                    </div>
                ))}
            </div>

            {state.processorSlots.length > state.processorSlots.filter(s => s.isUnlocked).length && (
                <div className="p-3 bg-stone-900/30 border border-stone-800 rounded text-center text-xs text-stone-500 italic">
                    Upgrade available in Market
                </div>
            )}
        </div>
      </div>

      {/* --- SYNTHESIZER (Was Mortar) --- */}
      <div className="glass-panel p-6 rounded-lg relative overflow-hidden flex flex-col h-full">
         <div className="absolute top-0 right-0 p-4 opacity-10">
            <FlaskConical size={64} />
        </div>
        <h3 className="text-xl text-purple-200/80 mb-4 border-b border-stone-700 pb-2 flex items-center gap-2">
            <FlaskConical size={20} /> Transmutation
        </h3>

        <div className="flex flex-col gap-4 flex-1">
             {/* Mixer Visuals */}
            <div className="flex items-center justify-between bg-stone-950/50 p-4 rounded border border-stone-800 flex-1">
                {/* Slot 1 */}
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center text-[10px] md:text-xs text-center p-1 overflow-hidden
                    ${state.synthesizer.slot1 ? 'border-purple-500 bg-purple-900/20 text-purple-200' : 'border-stone-700 border-dashed text-stone-600'}
                `}>
                    {state.synthesizer.slot1 ? FLORA_DATA[state.synthesizer.slot1].name : "Empty"}
                </div>

                <div className="text-stone-500">+</div>

                {/* Slot 2 */}
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center text-[10px] md:text-xs text-center p-1 overflow-hidden
                    ${state.synthesizer.slot2 ? 'border-purple-500 bg-purple-900/20 text-purple-200' : 'border-stone-700 border-dashed text-stone-600'}
                `}>
                    {state.synthesizer.slot2 ? FLORA_DATA[state.synthesizer.slot2].name : "Empty"}
                </div>

                <div className="text-stone-500">=</div>

                {/* Result */}
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 flex items-center justify-center shadow-inner
                    ${state.synthesizer.isSynthesizing 
                        ? 'border-purple-400 animate-pulse bg-purple-500/10' 
                        : 'border-stone-700 bg-stone-900'
                    }
                `}>
                    {state.synthesizer.isSynthesizing ? (
                        <div className="text-[10px] text-purple-400">Mixing...</div>
                    ) : (
                         <div className="text-2xl">🧪</div>
                    )}
                </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col gap-3">
                 {state.synthesizer.isSynthesizing ? (
                    <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden mt-2">
                         <div className="h-full bg-purple-600 transition-all duration-200" style={{width: `${state.synthesizer.progress}%`}}></div>
                    </div>
                 ) : (
                     <>
                        <div className="flex gap-2 justify-end">
                            <button 
                                onClick={onClearMortar}
                                disabled={!state.synthesizer.slot1 && !state.synthesizer.slot2}
                                className="px-3 py-1 text-xs text-stone-500 hover:text-stone-300 flex items-center gap-1"
                            >
                                <RotateCcw size={12} /> Clear
                            </button>
                            <button 
                                onClick={onMix}
                                disabled={!state.synthesizer.slot1 || !state.synthesizer.slot2}
                                className="flex-1 py-2 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-800 hover:border-purple-500 text-purple-300 rounded text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                            >
                                Transmute
                            </button>
                        </div>
                        
                        {/* Inventory Selection */}
                        <div className="border-t border-stone-800 pt-2">
                             <p className="text-xs text-stone-500 uppercase mb-2">Refined Ingredients:</p>
                             <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                                {driedItems.length > 0 ? driedItems.map(item => (
                                    <button
                                        key={item.floraType}
                                        onClick={() => onAddToMortar(item.floraType!)}
                                        disabled={!!state.synthesizer.slot1 && !!state.synthesizer.slot2}
                                        className="px-3 py-1 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded text-xs text-stone-300 disabled:opacity-30 flex items-center gap-1"
                                    >
                                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: FLORA_DATA[item.floraType!].colorMain}}></div>
                                        {FLORA_DATA[item.floraType!].name} ({item.count})
                                    </button>
                                )) : (
                                    <span className="text-xs text-stone-600 italic">No refined ingredients available.</span>
                                )}
                             </div>
                        </div>
                     </>
                 )}
            </div>

        </div>
      </div>
    </div>
  );
};
