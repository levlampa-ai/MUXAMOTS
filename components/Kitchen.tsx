
import React from 'react';
import { GameState, ItemType, MushroomType } from '../types';
import { MUSHROOMS } from '../constants';
import { Fan, Wind, Atom, RotateCcw, Zap, Archive, Power } from 'lucide-react';
import { MushroomArt } from './MushroomArt';
import { MortarBaseArt, PestleArt, CentrifugeArt, SporeBagArt } from './ItemArt';

interface Props {
  state: GameState;
  onDry: (type: MushroomType) => void;
  onCollectDry: () => void;
  onToggleDryer: () => void;
  onGrind: (type: MushroomType) => void;
  onCollectPowder: () => void;
  onAddToMixer: (type: MushroomType) => void;
  onMix: () => void;
  onCollectMix: () => void;
  onClearMixer: () => void;
}

export const Kitchen: React.FC<Props> = ({ 
    state, onDry, onCollectDry, onToggleDryer, onGrind, onCollectPowder,
    onAddToMixer, onMix, onCollectMix, onClearMixer
}) => {
  const fresh = state.inventory.filter(i => i.type === ItemType.Fresh && i.count > 0);
  const dried = state.inventory.filter(i => i.type === ItemType.Dried && i.count > 0);
  const powders = state.inventory.filter(i => i.type === ItemType.Powder && i.count > 0);

  const currentLoad = state.dryer.contents.reduce((acc, b) => acc + b.count, 0);
  const isFull = currentLoad >= state.dryer.capacity;
  const hasFinishedItems = state.dryer.contents.some(b => b.status === 'dried' || b.status === 'burnt');

  return (
    <div className="h-full p-4 flex flex-col gap-6 overflow-y-auto pb-32">
       <div className="w-full max-w-5xl mx-auto flex justify-between items-end border-b-2 border-stone-800 pb-2">
         <h2 className="text-3xl text-stone-500 stamp transform rotate-1">DIRTY KITCHEN</h2>
       </div>
       
       {/* GRID LAYOUT */}
       <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
           {/* 1. DRYING UNIT (Manual Control) */}
           <div className="concrete-panel p-0 relative flex flex-col overflow-hidden col-span-1 lg:col-span-1 h-[500px]">
               <div className="bg-[#1c1917] p-3 border-b border-stone-700 flex justify-between items-center z-10">
                   <h3 className="text-sm text-stone-300 font-bold font-mono tracking-widest flex items-center gap-2">
                       <Wind size={16} className="text-amber-700" /> DEHYDRATOR
                   </h3>
                   <div className="flex items-center gap-2">
                       <span className="text-[10px] text-stone-500 font-mono">LOAD: {currentLoad}/{state.dryer.capacity}</span>
                       <button 
                            onClick={onToggleDryer}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${state.dryer.isOn ? 'bg-amber-900 border-amber-500 text-amber-500 animate-pulse' : 'bg-stone-800 border-stone-600 text-stone-600'}`}
                       >
                           <Power size={14} />
                       </button>
                   </div>
               </div>
               
               <div className="flex-1 bg-[#0c0a09] relative p-4 flex flex-col gap-2 shadow-inner">
                   
                   {/* Shelves Visualization */}
                   <div className="flex-1 border-2 border-stone-800 bg-[#151413] flex flex-col justify-end p-2 relative overflow-hidden">
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
                           <Fan size={120} className={state.dryer.isOn ? "animate-spin-fast" : ""} />
                       </div>

                       {state.dryer.contents.length === 0 ? (
                           <div className="text-stone-700 text-xs text-center self-center my-auto font-mono">UNIT EMPTY</div>
                       ) : (
                           <div className="flex flex-wrap gap-1 content-end">
                               {state.dryer.contents.map((batch, idx) => (
                                   <div key={idx} className={`relative w-12 h-12 border flex items-center justify-center transition-colors ${batch.status === 'burnt' ? 'bg-stone-900 border-stone-900 opacity-50' : 'bg-stone-900 border-stone-700'}`} title={`${batch.type}: ${Math.floor(batch.progress)}%`}>
                                       <div className={`transform scale-[0.4] ${batch.status === 'burnt' ? 'grayscale brightness-0' : ''}`}>
                                           <MushroomArt type={batch.type} stage={100} />
                                       </div>
                                       
                                       {/* Progress Indication */}
                                       <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-800">
                                           <div 
                                                className={`h-full ${batch.status === 'burnt' ? 'bg-stone-500' : batch.status === 'dried' ? 'bg-green-500' : 'bg-amber-500'}`} 
                                                style={{width: `${Math.min(100, batch.progress)}%`}}
                                           ></div>
                                       </div>
                                       
                                       {batch.status === 'burnt' && <span className="absolute text-[8px] text-red-500 font-bold transform -rotate-45">ASH</span>}
                                       <span className="absolute top-0 right-0 bg-black text-white text-[8px] px-1">{batch.count}</span>
                                   </div>
                               ))}
                           </div>
                       )}
                   </div>

                   {/* Controls */}
                   <div className="h-32 border-t border-stone-800 pt-2 flex flex-col gap-2">
                       {state.dryer.isOn && (
                           <div className="text-[10px] text-amber-500 animate-pulse text-center font-mono uppercase">
                               SYSTEM ACTIVE - DO NOT OVERHEAT
                           </div>
                       )}
                       
                       {hasFinishedItems && !state.dryer.isOn && (
                           <button onClick={onCollectDry} className="w-full py-2 bg-amber-900 text-amber-100 font-bold text-xs uppercase animate-bounce border border-amber-600">
                               EMPTY TRAY
                           </button>
                       )}
                       
                       {!isFull && !state.dryer.isOn && (
                           <div className="flex-1 overflow-y-auto">
                               <p className="text-[9px] text-stone-500 uppercase mb-1">Add to Rack:</p>
                               <div className="flex flex-wrap gap-1">
                                   {fresh.map(f => (
                                       <button 
                                            key={f.subType}
                                            onClick={() => onDry(f.subType as MushroomType)}
                                            className="px-2 py-1 bg-stone-800 border border-stone-600 hover:border-amber-600 text-[9px] text-stone-300 rounded-sm"
                                       >
                                           {f.subType.substring(0,3)} ({f.count})
                                       </button>
                                   ))}
                                   {fresh.length === 0 && <span className="text-[9px] text-stone-700 italic">No fresh fungi</span>}
                               </div>
                           </div>
                       )}
                       {state.dryer.isOn && (
                           <div className="text-center text-[10px] text-stone-500 font-mono py-2">Turn off to load/unload</div>
                       )}
                   </div>
               </div>
           </div>

           {/* 2. MORTAR (Center) */}
           <div className="concrete-panel p-4 relative flex flex-col h-[500px]">
               <h3 className="text-sm text-stone-300 font-bold font-mono border-b border-stone-700 pb-2 mb-4 flex justify-between items-center">
                   <span>GRINDER <span className="text-[9px] text-stone-600">LVL {state.mortar.speedLevel}</span></span>
                   <span className="text-[9px] text-stone-500">CAP: {state.mortar.quantity}/{state.mortar.maxCapacity}</span>
               </h3>
               <div className="flex-1 flex flex-col items-center justify-center gap-6">
                   <div className="relative w-48 h-48">
                        {/* Drawn Mortar Base */}
                        <div className="absolute inset-0 z-0">
                            <MortarBaseArt />
                        </div>

                        {/* Contents: Mushroom & Powder */}
                        <div className="absolute inset-4 rounded-full flex items-center justify-center overflow-hidden z-10">
                             {state.mortar.input ? (
                                 <div className={`w-full h-full flex items-center justify-center`}>
                                     
                                     {/* Solid Mushroom: Shrinks and Shakes when grinding */}
                                     <div 
                                        className={`absolute transition-all duration-300
                                            ${state.mortar.isGrinding ? 'animate-shake-hard' : ''}
                                        `}
                                        style={{ 
                                            opacity: Math.max(0, 1 - (state.mortar.progress / 80)), // Disappear by 80%
                                            transform: `scale(${Math.max(0, 1 - (state.mortar.progress / 100))})`
                                        }}
                                     >
                                        <div className="transform scale-75 opacity-80 filter sepia brightness-50 flex flex-col items-center">
                                            <div className="relative">
                                                <MushroomArt type={state.mortar.input} stage={100} />
                                                {state.mortar.quantity > 1 && (
                                                    <span className="absolute -top-4 -right-4 bg-stone-900 text-white text-xs px-2 py-1 rounded-full border border-stone-600">
                                                        x{state.mortar.quantity}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                     </div>

                                     {/* Powder overlay: Grows from 0 */}
                                     <div 
                                        className="absolute inset-0 flex items-center justify-center transition-all duration-300" 
                                        style={{ 
                                            opacity: state.mortar.progress / 100,
                                            transform: `scale(${0.5 + (state.mortar.progress / 200)})` // Grow slightly
                                        }}
                                     >
                                         <MushroomArt type={state.mortar.input} stage={100} form="powder" className="scale-150" />
                                     </div>
                                 </div>
                             ) : <div className="text-stone-700 text-xs font-mono">EMPTY</div>}
                        </div>
                        
                        {/* Drawn Pestle Animation: Centered and rotates */}
                        <div 
                            className={`absolute inset-0 pointer-events-none z-20 transition-all duration-100 flex items-center justify-center ${state.mortar.isGrinding ? 'animate-grind-motion' : ''}`}
                        >
                             <div className="w-full h-full transform origin-center">
                                <PestleArt />
                             </div>
                        </div>

                   </div>
                   
                   {/* Controls */}
                   <div className="w-full">
                       {state.mortar.input ? (
                           state.mortar.progress >= 100 ? (
                               <button onClick={onCollectPowder} className="w-full paper-note py-2 font-bold text-black border-2 border-stone-500 animate-bounce">
                                   COLLECT {state.mortar.quantity}x POWDER
                               </button>
                           ) : state.mortar.isGrinding ? (
                               <div className="flex flex-col gap-1">
                                   <div className="text-[10px] text-stone-500 text-center">GRINDING...</div>
                                   <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-stone-400" style={{width: `${state.mortar.progress}%`}}></div>
                                   </div>
                               </div>
                           ) : (
                               // Not fully ground, maybe adding more?
                               <div className="flex flex-col gap-2">
                                   <div className="text-[10px] text-stone-500 text-center">Ready to Grind</div>
                                   {state.mortar.quantity < state.mortar.maxCapacity && (
                                       <div className="flex justify-center gap-1">
                                            {dried.filter(d => d.subType === state.mortar.input).map(d => (
                                                 <button 
                                                    key={d.id} // use item id to be safe
                                                    onClick={() => onGrind(d.subType as MushroomType)}
                                                    className="px-2 py-1 bg-green-900/30 text-green-400 border border-green-800 text-[10px] hover:bg-green-800/50"
                                                 >
                                                     + Add Another
                                                 </button>
                                            ))}
                                       </div>
                                   )}
                                   <button 
                                      className="w-full py-2 bg-stone-800 text-stone-400 text-xs cursor-wait"
                                      disabled
                                   >
                                      Processing...
                                   </button>
                               </div>
                           )
                       ) : (
                           <div className="flex flex-wrap gap-2 justify-center max-h-32 overflow-y-auto">
                               {dried.map(d => (
                                   <button key={d.subType} onClick={() => onGrind(d.subType as MushroomType)} className="px-2 py-1 bg-stone-800 border border-stone-600 hover:border-white text-[10px] text-stone-300">
                                       {d.subType} ({d.count})
                                   </button>
                               ))}
                           </div>
                       )}
                   </div>
               </div>
           </div>

           {/* 3. MYCO-SYNTHESIZER */}
           <div className="concrete-panel p-4 relative flex flex-col h-[500px]">
                <h3 className="text-sm text-purple-300 font-bold font-mono border-b border-purple-900/50 pb-2 mb-4 flex items-center gap-2">
                    <Atom size={16} /> SYNTHESIZER
                </h3>
                
                <div className="flex-1 flex flex-col gap-4">
                    {/* Visual Interface */}
                    <div className="bg-black/80 border border-purple-900/30 rounded p-4 flex flex-col items-center gap-4 flex-1 relative overflow-hidden">
                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        {state.mixer.isMixing && (
                             <div className="absolute inset-0 bg-purple-500/10 animate-pulse"></div>
                        )}

                        <div className="flex items-center gap-2 w-full justify-center z-10">
                            {/* Slot 1 */}
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 border-2 border-dashed border-stone-700 rounded-full flex items-center justify-center bg-stone-900">
                                    {state.mixer.slot1 ? (
                                         <div className="transform scale-50"><MushroomArt type={state.mixer.slot1} stage={100} form="powder" /></div>
                                    ) : <span className="text-[10px] text-stone-600">A</span>}
                                </div>
                                <span className="text-[9px] text-stone-500 mt-1">{state.mixer.slot1 || "EMPTY"}</span>
                            </div>

                            <Zap size={16} className={`text-stone-600 ${state.mixer.isMixing ? 'text-purple-400 animate-ping' : ''}`} />

                            {/* Slot 2 */}
                             <div className="flex flex-col items-center">
                                <div className="w-14 h-14 border-2 border-dashed border-stone-700 rounded-full flex items-center justify-center bg-stone-900">
                                    {state.mixer.slot2 ? (
                                         <div className="transform scale-50"><MushroomArt type={state.mixer.slot2} stage={100} form="powder" /></div>
                                    ) : <span className="text-[10px] text-stone-600">B</span>}
                                </div>
                                <span className="text-[9px] text-stone-500 mt-1">{state.mixer.slot2 || "EMPTY"}</span>
                            </div>
                        </div>

                        {/* Centrifuge / Output */}
                        <div className="mt-4 relative w-32 h-32 flex items-center justify-center">
                             <CentrifugeArt isRunning={state.mixer.isMixing} />
                             
                             <div className="absolute inset-0 flex items-center justify-center">
                                 {state.mixer.output ? (
                                      <div className="transform scale-75 animate-in zoom-in duration-500">
                                          {/* It produces a SPORE BAG (Seed), not a mushroom */}
                                          <SporeBagArt color={MUSHROOMS[state.mixer.output].color} className="w-16 h-16" />
                                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-purple-900 text-purple-100 text-[8px] px-2 py-0.5 rounded whitespace-nowrap">
                                              HYBRID SPORE
                                          </span>
                                      </div>
                                 ) : state.mixer.isMixing ? (
                                      <div className="text-[10px] text-purple-400 font-mono animate-pulse">SYNTHESIZING...</div>
                                 ) : null}
                             </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-2">
                        {state.mixer.output ? (
                            <button onClick={onCollectMix} className="w-full py-2 bg-purple-900 text-purple-100 border border-purple-500 hover:bg-purple-800 text-xs font-bold font-mono">
                                EXTRACT HYBRID SPORE
                            </button>
                        ) : state.mixer.isMixing ? (
                            <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-600" style={{width: `${state.mixer.progress}%`}}></div>
                            </div>
                        ) : (
                            <>
                                <div className="flex gap-2">
                                    <button onClick={onClearMixer} className="p-2 border border-stone-700 hover:text-white text-stone-500"><RotateCcw size={14} /></button>
                                    <button 
                                        onClick={onMix} 
                                        disabled={!state.mixer.slot1 || !state.mixer.slot2}
                                        className="flex-1 bg-stone-800 border border-stone-600 text-stone-300 text-xs hover:border-purple-500 hover:text-purple-300 disabled:opacity-50"
                                    >
                                        INITIATE FUSION
                                    </button>
                                </div>
                                {/* Powder Selector */}
                                <div className="mt-2">
                                    <p className="text-[9px] text-stone-500 uppercase mb-1">Select Powder Reagent:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {powders.map(p => (
                                            <button 
                                                key={p.subType} 
                                                onClick={() => onAddToMixer(p.subType as MushroomType)}
                                                disabled={!!state.mixer.slot1 && !!state.mixer.slot2}
                                                className="px-2 py-1 bg-stone-900 border border-stone-700 text-[9px] text-stone-400 hover:border-purple-500"
                                            >
                                                {p.subType.substring(0,3)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
           </div>

       </div>
       <style>{`
         @keyframes grind-motion {
             0% { transform: rotate(0deg) translate(2px, 2px); }
             25% { transform: rotate(10deg) translate(-2px, 2px); }
             50% { transform: rotate(0deg) translate(-2px, -2px); }
             75% { transform: rotate(-10deg) translate(2px, -2px); }
             100% { transform: rotate(0deg) translate(2px, 2px); }
         }
         .animate-grind-motion {
             animation: grind-motion 0.3s infinite linear;
         }
         .animate-spin-fast {
             animation: spin 0.5s linear infinite;
         }
       `}</style>
    </div>
  );
};
