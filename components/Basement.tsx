
import React, { useState, useEffect } from 'react';
import { GameState, ItemType, LampType, MushroomType, SerumType } from '../types';
import { MUSHROOMS } from '../constants';
import { Droplets, Lightbulb, Syringe, AlertTriangle, Cat, X, Sprout, Skull, Fan, Thermometer } from 'lucide-react';
import { MushroomArt } from './MushroomArt';
import { LampArt, SerumArt, SporeBagArt, AnalogGaugeArt, SprayBottleArt } from './ItemArt';

interface Props {
  state: GameState;
  onPlant: (bedId: number, itemId: string) => void;
  onWater: (id: number) => void;
  onHarvest: (id: number) => void;
  onInstallLamp: (id: number, lamp: LampType) => void;
  onInjectSerum: (id: number, serum: SerumType) => void;
  onTreat: (id: number) => void;
  onClear: (id: number) => void;
  onToggleHeater: () => void;
  onToggleHumidifier: () => void;
  onToggleVent: () => void;
}

export const Basement: React.FC<Props> = ({ 
    state, onPlant, onWater, onHarvest, onInstallLamp, onInjectSerum, onTreat, onClear,
    onToggleHeater, onToggleHumidifier, onToggleVent
}) => {
  const spores = state.inventory.filter(i => (i.type === ItemType.Spore || i.type === ItemType.HybridSpore) && i.count > 0);
  const lamps = state.inventory.filter(i => i.type === ItemType.Lamp && i.count > 0);
  const serums = state.inventory.filter(i => i.type === ItemType.Serum && i.count > 0);
  const fungicide = state.inventory.find(i => i.type === ItemType.Fungicide);

  const [openMenu, setOpenMenu] = useState<{ bedId: number; type: 'lamp' | 'serum' } | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;
      setOpenMenu(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (bedId: number, type: 'lamp' | 'serum') => {
    if (openMenu?.bedId === bedId && openMenu?.type === type) {
      setOpenMenu(null);
    } else {
      setOpenMenu({ bedId, type });
    }
  };

  // Calculate Average Target Climate for Gauges
  const activeMushrooms = state.beds
    .filter(b => b.status === 'growing' && b.mushroom)
    .map(b => MUSHROOMS[b.mushroom!]);
  
  let targetTempRange: [number, number] | undefined = undefined;
  let targetHumidRange: [number, number] | undefined = undefined;

  if (activeMushrooms.length > 0) {
      // Find the overlap if possible, or just the average ideal
      const avgTemp = activeMushrooms.reduce((a, b) => a + b.idealTemp, 0) / activeMushrooms.length;
      const avgHumid = activeMushrooms.reduce((a, b) => a + b.idealHumid, 0) / activeMushrooms.length;
      targetTempRange = [avgTemp, avgTemp]; // Range logic handled by overlap in gauge art now
      targetHumidRange = [avgHumid, avgHumid];
  }

  return (
    <div className="h-full p-4 flex flex-col items-center overflow-y-auto pb-32 relative" onClick={() => setOpenMenu(null)}>
      
      {state.environment.humidifierOn && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <div className="w-[200%] h-full bg-[url('https://www.transparenttextures.com/patterns/foggy-birds.png')] opacity-30 animate-fog-flow"></div>
          </div>
      )}
      {state.environment.heaterOn && (
          <div className="absolute inset-0 pointer-events-none bg-red-900/10 z-0 animate-pulse-slow"></div>
      )}

      {/* CONTROLS HEADER */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b-2 border-stone-800 pb-4 z-10 relative gap-4">
         <div>
             <h2 className="text-3xl text-stone-500 stamp transform -rotate-1">THE BASEMENT</h2>
             <div className="text-stone-600 text-xs font-mono flex items-center gap-2 mt-1">
                <Cat size={16} /> 
                <span>Suspicion: {Math.floor(state.suspicion)}%</span>
             </div>
         </div>

         <div className="bg-[#1c1917] p-2 border-2 border-stone-700 shadow-2xl flex gap-4 rounded-sm items-end">
             <div className="flex flex-col items-center gap-1">
                 <div className="w-16 h-16">
                     <AnalogGaugeArt 
                        value={state.environment.temperature} 
                        label="TEMP" 
                        color="#ef4444" 
                        targetRange={targetTempRange} 
                     />
                 </div>
                 <button onClick={onToggleHeater} className={`w-full px-2 py-1 text-[9px] font-bold border ${state.environment.heaterOn ? 'bg-red-900 text-red-100 border-red-500 animate-pulse' : 'bg-stone-800 text-stone-500 border-stone-600'}`}>
                     {state.environment.heaterOn ? 'HEAT ON' : 'HEAT OFF'}
                 </button>
             </div>
             <div className="flex flex-col items-center gap-1">
                 <div className="w-16 h-16">
                     <AnalogGaugeArt 
                        value={state.environment.humidity} 
                        label="HUMID" 
                        color="#3b82f6" 
                        targetRange={targetHumidRange} 
                     />
                 </div>
                 <button onClick={onToggleHumidifier} className={`w-full px-2 py-1 text-[9px] font-bold border ${state.environment.humidifierOn ? 'bg-blue-900 text-blue-100 border-blue-500 animate-pulse' : 'bg-stone-800 text-stone-500 border-stone-600'}`}>
                     {state.environment.humidifierOn ? 'MIST ON' : 'MIST OFF'}
                 </button>
             </div>
             <div className="flex flex-col items-center gap-1 justify-end h-full pb-1">
                 <button onClick={onToggleVent} className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${state.environment.ventilationOn ? 'bg-stone-800 border-green-500 animate-spin-slow text-green-500' : 'bg-black border-stone-700 text-stone-700'}`}>
                     <Fan size={32} />
                 </button>
                 <span className="text-[9px] text-stone-500 font-mono">VENT</span>
             </div>
         </div>
      </div>

      {/* GROW BEDS LAYOUT */}
      <div className="flex flex-col gap-12 w-full max-w-4xl px-4 mt-8">
        {state.beds.map(bed => {
          if (!bed.isUnlocked) return null;

          const isLampMenuOpen = openMenu?.bedId === bed.id && openMenu?.type === 'lamp';
          const isSerumMenuOpen = openMenu?.bedId === bed.id && openMenu?.type === 'serum';
          const canModify = bed.status === 'empty';
          
          const config = bed.mushroom ? MUSHROOMS[bed.mushroom] : null;
          
          // Climate Check Visuals
          const tempDiff = config ? Math.abs(state.environment.temperature - config.idealTemp) : 0;
          const humDiff = config ? Math.abs(state.environment.humidity - config.idealHumid) : 0;
          const isStressed = (tempDiff > 15 || humDiff > 15) && bed.status === 'growing';

          // Visuals
          let lampColor = 'bg-stone-800';
          let glowClass = '';
          if (bed.installedLamp === LampType.Heat) { lampColor = 'bg-red-950'; glowClass = 'shadow-[0_20px_80px_rgba(220,38,38,0.4)]'; }
          if (bed.installedLamp === LampType.UV) { lampColor = 'bg-purple-950'; glowClass = 'shadow-[0_20px_80px_rgba(147,51,234,0.4)]'; }
          if (bed.installedLamp === LampType.Incandescent) { lampColor = 'bg-yellow-950'; glowClass = 'shadow-[0_20px_80px_rgba(234,179,8,0.2)]'; }
          if (bed.installedLamp === LampType.LED) { lampColor = 'bg-blue-950'; glowClass = 'shadow-[0_20px_80px_rgba(59,130,246,0.3)]'; }

          const batchVisuals = Array.from({length: bed.capacity}, (_, i) => i);

          return (
            <div key={bed.id} className="relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              
              {/* Hanging Lamp */}
              <div className="absolute -top-16 z-30 flex flex-col items-center">
                 <div className="w-1 h-8 bg-[#1c1917]"></div>
                 <button 
                    onClick={() => { if (canModify) toggleMenu(bed.id, 'lamp'); }}
                    disabled={!canModify}
                    className={`w-24 h-10 rounded-full ${lampColor} border-2 ${isLampMenuOpen ? 'border-stone-200' : 'border-[#0c0a09]'} flex items-center justify-center relative ${glowClass} transition-colors z-20`}
                 >
                    {bed.installedLamp ? <div className="w-6 h-6"><LampArt type={bed.installedLamp} /></div> : <Lightbulb size={20} className="text-white/30" />}
                 </button>
                 {bed.installedLamp && (
                     <div className={`absolute top-8 w-64 h-40 bg-gradient-to-b from-white/10 to-transparent clip-path-cone pointer-events-none z-10`}></div>
                 )}

                 {isLampMenuOpen && (
                    <div className="absolute top-full mt-2 flex flex-col bg-stone-900 border border-stone-500 p-2 rounded shadow-2xl min-w-[200px] z-50">
                        {lamps.map(l => (
                            <button key={l.subType} onClick={() => { onInstallLamp(bed.id, l.subType as LampType); setOpenMenu(null); }} className="flex items-center gap-3 text-left text-stone-300 hover:text-white hover:bg-stone-800 py-2 border-b border-stone-800 px-2">
                                <div className="w-6 h-8"><LampArt type={l.subType as LampType} /></div>
                                <span className="text-xs font-bold">{l.subType} x{l.count}</span>
                            </button>
                        ))}
                        {lamps.length === 0 && <span className="text-[10px] text-stone-600 p-2">No bulbs.</span>}
                    </div>
                 )}
              </div>

              {/* THE PLANTER BOX */}
              <div className={`w-full max-w-3xl bg-[#292524] border-x-4 border-b-8 border-[#1c1917] relative shadow-2xl mt-4 rounded-sm z-10 transition-colors duration-500 
                  ${bed.isContaminated ? 'border-green-900/50 shadow-[0_0_30px_rgba(20,83,45,0.4)]' : ''}
              `}>
                
                {/* Soil Surface */}
                <div className="h-40 bg-[#0c0a09] border-t-4 border-[#3f2e26] relative flex items-end justify-center shadow-inner overflow-hidden mx-2 mt-[-10px] perspective-soil">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-40"></div>
                    
                    {/* Batch Rendering */}
                    <div className="flex justify-around items-end w-full px-8 pb-2">
                        {bed.status !== 'empty' && bed.mushroom ? (
                            batchVisuals.map((_, idx) => (
                                <div key={idx} className="relative transition-all duration-500" style={{ transform: `scale(${0.8 + (Math.random()*0.2)})` }}>
                                    <MushroomArt 
                                        type={bed.mushroom!}
                                        stage={bed.growth}
                                        isMutated={bed.isMutated}
                                        isDecayed={bed.status === 'dead'}
                                        isContaminated={bed.isContaminated}
                                        className="w-24 h-24"
                                    />
                                </div>
                            ))
                        ) : (
                            <span className="text-stone-700 text-sm font-mono tracking-widest uppercase">
                                BED {bed.id + 1} // CAP: {bed.capacity}
                            </span>
                        )}
                    </div>

                    {bed.isContaminated && (
                        <div className="absolute inset-0 bg-green-900/20 flex items-center justify-center pointer-events-none">
                            <Skull size={48} className="text-green-500/50 animate-pulse" />
                        </div>
                    )}
                </div>

                {/* Dashboard Controls */}
                <div className="bg-[#151413] p-3 flex flex-col gap-3">
                    
                    {/* Progress Bars */}
                    {bed.status !== 'empty' && (
                        <div className="grid grid-cols-2 gap-4 border-b border-stone-800 pb-2">
                            <div>
                                <div className="flex justify-between text-[9px] text-stone-500 uppercase">
                                    <span>Growth</span>
                                    {isStressed && <span className="text-red-500 animate-pulse">BAD CLIMATE</span>}
                                    <span>{Math.floor(bed.growth)}%</span>
                                </div>
                                <div className="h-1 bg-stone-800"><div className="h-full bg-stone-400" style={{width: `${bed.growth}%`}}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[9px] text-stone-500 uppercase">
                                    <span>Health</span>
                                    <span className={bed.health < 50 ? 'text-red-500' : 'text-green-500'}>{Math.floor(bed.health)}%</span>
                                </div>
                                <div className="h-1 bg-stone-800"><div className={`h-full ${bed.health < 50 ? 'bg-red-700' : 'bg-green-700'}`} style={{width: `${bed.health}%`}}></div></div>
                            </div>
                        </div>
                    )}
                    
                    {/* Climate Requirement Hint */}
                    {config && bed.status === 'growing' && (
                        <div className="flex justify-between text-[9px] font-mono text-stone-600 bg-black/20 p-1">
                            <span className={tempDiff > 15 ? 'text-red-500' : 'text-stone-400'}>
                                REQ: {config.idealTemp}°C
                            </span>
                            <span className={humDiff > 15 ? 'text-red-500' : 'text-stone-400'}>
                                REQ: {config.idealHumid}%
                            </span>
                        </div>
                    )}

                    {/* Interaction Buttons */}
                    {bed.status === 'empty' ? (
                        <div className="grid grid-cols-4 gap-2">
                             {spores.length > 0 ? spores.map(s => {
                                 const c = MUSHROOMS[s.subType as MushroomType];
                                 return (
                                     <button key={s.id} onClick={() => onPlant(bed.id, s.id)} className={`flex flex-col items-center justify-center p-2 border ${s.type === ItemType.HybridSpore ? 'border-purple-800 bg-purple-900/10' : 'border-stone-700 bg-stone-900'} hover:bg-stone-800`}>
                                         <div className="w-8 h-8"><SporeBagArt color={c?.color} /></div>
                                         <span className="text-[9px] mt-1">{s.subType.substring(0,6)}</span>
                                         <span className="text-[8px] text-stone-500">{c.idealTemp}°/{c.idealHumid}%</span>
                                     </button>
                                 )
                             }) : <div className="col-span-4 text-center text-xs text-stone-600 py-2">No Spores</div>}
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            {bed.isContaminated ? (
                                <button onClick={() => onTreat(bed.id)} disabled={!fungicide || fungicide.count <= 0} className="flex-1 bg-green-900/30 border border-green-600 text-green-400 text-xs py-2 flex items-center justify-center gap-2 animate-pulse">
                                    <div className="w-4 h-6"><SprayBottleArt /></div> DECONTAMINATE
                                </button>
                            ) : (
                                <>
                                    {bed.status === 'growing' && (
                                        <>
                                            <button onClick={() => onWater(bed.id)} className="bg-blue-900/20 border border-blue-800 p-2 text-blue-400 hover:bg-blue-900/40"><Droplets size={16} /></button>
                                            <div className="relative flex-1">
                                                <button onClick={() => toggleMenu(bed.id, 'serum')} className="w-full h-full bg-stone-800 border border-stone-600 text-stone-400 hover:text-white flex items-center justify-center gap-2 text-xs uppercase"><Syringe size={14} /> Inject</button>
                                                {isSerumMenuOpen && (
                                                    <div className="absolute bottom-full mb-2 bg-stone-900 border border-stone-500 p-2 w-full z-50">
                                                        {serums.map(s => (
                                                            <button key={s.subType} onClick={() => {onInjectSerum(bed.id, s.subType as SerumType); setOpenMenu(null)}} className="w-full text-left text-xs py-1 border-b border-stone-800 hover:text-green-400">{s.subType} x{s.count}</button>
                                                        ))}
                                                        {serums.length === 0 && <span className="text-xs text-stone-600">No serums</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {bed.status === 'ready' && (
                                        <button onClick={() => onHarvest(bed.id)} className="flex-1 bg-stone-200 text-black font-bold text-xs py-2 border-2 border-white hover:scale-[1.02] shadow-lg">
                                            HARVEST BATCH ({bed.capacity})
                                        </button>
                                    )}
                                    {bed.status === 'dead' && (
                                        <button onClick={() => onClear(bed.id)} className="flex-1 bg-red-900/30 text-red-500 border border-red-800 text-xs py-2">DIG OUT</button>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        .clip-path-cone {
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
        @keyframes fog-flow {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-fog-flow {
            animation: fog-flow 30s linear infinite;
        }
      `}</style>
    </div>
  );
};
