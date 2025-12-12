import React from 'react';
import { GameState, ItemType, FloraType } from '../types';
import { PROCESS_TIME_SEC, FLORA_DATA, SYNTHESIS_TIME_SEC } from '../constants';
import { Cog, Atom, Archive, Activity } from 'lucide-react';

interface Props {
  state: GameState;
  onProcess: (slotId: number, floraType: FloraType) => void;
  onRetrieveProcessed: (slotId: number) => void;
  onAddToSynth: (floraType: FloraType) => void;
  onSynthesize: () => void;
  onClearSynth: () => void;
}

export const TechLab: React.FC<Props> = ({ 
  state, 
  onProcess, 
  onRetrieveProcessed,
  onAddToSynth,
  onSynthesize,
  onClearSynth
}) => {
  const biomassItems = state.inventory.filter(i => (i.type === ItemType.Biomass || i.type === ItemType.Mutation) && i.count > 0);
  const refinedItems = state.inventory.filter(i => i.type === ItemType.Refined && i.count > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      
      {/* --- REFINERY --- */}
      <div className="holo-panel p-6 rounded-sm flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
             <h3 className="text-lg text-cyan-100 flex items-center gap-2 uppercase tracking-wider">
                <Cog size={18} className="text-cyan-400" /> Refinery
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
                SLOTS: {state.processorSlots.filter(s => s.isUnlocked).length}
            </span>
        </div>
       
        <div className="flex flex-col gap-4 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {state.processorSlots.filter(s => s.isUnlocked).map(slot => (
                    <div key={slot.id} className="bg-slate-950/80 rounded-sm border border-slate-700 p-3 relative flex flex-col justify-between min-h-[120px]">
                        
                        {slot.contents ? (
                            <div className="flex flex-col items-center gap-2 z-10 flex-1 justify-center">
                                <span className="text-cyan-200 font-mono text-sm">{FLORA_DATA[slot.contents].codeName}</span>
                                {slot.progress >= 100 ? (
                                    <button 
                                        onClick={() => onRetrieveProcessed(slot.id)}
                                        className="px-3 py-1 bg-cyan-900/40 hover:bg-cyan-800 text-cyan-200 border border-cyan-500 rounded-sm text-xs font-mono animate-pulse"
                                    >
                                        EXTRACT
                                    </button>
                                ) : (
                                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
                                        <div className="h-full bg-orange-500 transition-all duration-200" style={{width: `${slot.progress}%`}}></div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-2">
                                <span className="text-slate-600 text-[10px] font-mono uppercase">Idle</span>
                                <div className="flex flex-wrap gap-1 justify-center">
                                     {biomassItems.slice(0, 3).map(item => (
                                        <button
                                            key={item.floraType}
                                            onClick={() => onProcess(slot.id, item.floraType!)}
                                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-sm text-[10px] text-slate-300 transition-colors"
                                        >
                                            {item.floraType?.substring(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="absolute top-1 right-2 text-[8px] text-slate-700 font-mono">BAY-{slot.id + 1}</div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* --- MOLECULAR SYNTHESIZER --- */}
      <div className="holo-panel p-6 rounded-sm flex flex-col h-full">
        <h3 className="text-lg text-purple-200 flex items-center gap-2 mb-4 border-b border-slate-700 pb-2 uppercase tracking-wider">
            <Atom size={18} className="text-purple-400" /> Molecular Synth
        </h3>

        <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between bg-slate-950/50 p-4 rounded-sm border border-slate-800 flex-1 relative">
                {/* Animation Overlay */}
                {state.synthesizer.isSynthesizing && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-0.5 bg-purple-500 shadow-[0_0_15px_#a855f7] animate-pulse"></div>
                    </div>
                )}

                {/* Slot 1 */}
                <div className={`w-14 h-14 rounded-full border flex items-center justify-center text-[10px] text-center p-1 font-mono
                    ${state.synthesizer.slot1 ? 'border-purple-500 bg-purple-900/20 text-purple-200' : 'border-slate-700 border-dashed text-slate-600'}
                `}>
                    {state.synthesizer.slot1 ? FLORA_DATA[state.synthesizer.slot1].codeName : "INPUT"}
                </div>

                <div className="text-slate-600">+</div>

                {/* Slot 2 */}
                <div className={`w-14 h-14 rounded-full border flex items-center justify-center text-[10px] text-center p-1 font-mono
                    ${state.synthesizer.slot2 ? 'border-purple-500 bg-purple-900/20 text-purple-200' : 'border-slate-700 border-dashed text-slate-600'}
                `}>
                    {state.synthesizer.slot2 ? FLORA_DATA[state.synthesizer.slot2].codeName : "INPUT"}
                </div>

                <div className="text-slate-600">=</div>

                {/* Result */}
                <div className={`w-16 h-16 rounded border flex items-center justify-center
                    ${state.synthesizer.isSynthesizing 
                        ? 'border-purple-400 animate-pulse bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]' 
                        : 'border-slate-700 bg-slate-900'
                    }
                `}>
                    <Activity className={state.synthesizer.isSynthesizing ? "text-purple-400 animate-spin" : "text-slate-700"} />
                </div>
            </div>
            
            <div className="flex flex-col gap-3">
                 {state.synthesizer.isSynthesizing ? (
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
                         <div className="h-full bg-purple-500" style={{width: `${state.synthesizer.progress}%`}}></div>
                    </div>
                 ) : (
                     <>
                        <div className="flex gap-2 justify-end">
                            <button 
                                onClick={onClearSynth}
                                className="px-3 py-1 text-xs text-slate-500 hover:text-slate-300 font-mono uppercase"
                            >
                                Eject
                            </button>
                            <button 
                                onClick={onSynthesize}
                                disabled={!state.synthesizer.slot1 || !state.synthesizer.slot2}
                                className="flex-1 py-2 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-800 hover:border-purple-500 text-purple-300 rounded-sm text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase font-bold tracking-wider"
                            >
                                Initialize
                            </button>
                        </div>
                        
                        <div className="border-t border-slate-800 pt-2">
                             <p className="text-[10px] text-slate-500 uppercase font-mono mb-2">Refined Material:</p>
                             <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                                {refinedItems.length > 0 ? refinedItems.map(item => (
                                    <button
                                        key={item.floraType}
                                        onClick={() => onAddToSynth(item.floraType!)}
                                        disabled={!!state.synthesizer.slot1 && !!state.synthesizer.slot2}
                                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-sm text-[10px] text-slate-300 disabled:opacity-30 font-mono"
                                    >
                                        {FLORA_DATA[item.floraType!].codeName} [{item.count}]
                                    </button>
                                )) : (
                                    <span className="text-[10px] text-slate-600 italic">No material.</span>
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