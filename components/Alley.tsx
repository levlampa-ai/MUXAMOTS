
import React from 'react';
import { GameState, ItemType, MushroomType, LampType, SerumType } from '../types';
import { MUSHROOMS, LAMP_PRICES, SERUM_PRICES, BED_UNLOCK_COST, MORTAR_UPGRADE_COST, MORTAR_CAPACITY_COST, FUNGICIDE_COST, BED_UPGRADE_COST, DRYER_UPGRADE_COST, BRIBE_COST } from '../constants';
import { Laptop, Wifi, ArrowRight, Zap, Briefcase, Clock, Hammer, Database, Archive, HandCoins } from 'lucide-react';
import { MushroomArt } from './MushroomArt';
import { LampArt, SerumArt, SporeBagArt, EmptyBoxArt, SprayBottleArt } from './ItemArt';

interface Props {
  state: GameState;
  onBuy: (item: ItemType, subType: string, price: number) => void;
  onSell: (id: string, price: number) => void;
  onBuyRack: (price: number) => void; 
  onUpgradeMortar: (price: number) => void; 
  onUpgradeMortarCapacity: (price: number) => void; 
  onFulfillContract: (id: string) => void;
  onBribe: () => void;
}

export const Alley: React.FC<Props> = ({ state, onBuy, onSell, onBuyRack, onUpgradeMortar, onUpgradeMortarCapacity, onFulfillContract, onBribe }) => {
  // Allow selling Fresh, Dried, Powder AND Hybrid Spores
  const sellable = state.inventory.filter(i => 
      (i.type === ItemType.Fresh || i.type === ItemType.Dried || i.type === ItemType.Powder || i.type === ItemType.HybridSpore) 
      && i.count > 0
  );

  const getSellPrice = (item: typeof sellable[0]) => {
      const config = MUSHROOMS[item.subType as MushroomType];
      if (!config) return 0;
      let m = 1;
      if (item.type === ItemType.Dried) m = 1.5;
      if (item.type === ItemType.Powder) m = 2.5;
      if (item.type === ItemType.HybridSpore) m = 5.0; // Rare seeds sell for a lot
      return Math.floor(config.basePrice * m);
  };

  const unlockedBeds = state.beds.filter(r => r.isUnlocked).length;
  const maxBeds = state.beds.length;
  const nextBedLevel = state.beds.find(b => b.isUnlocked && b.level < 3)?.level || 3;

  return (
    <div className="h-full p-4 flex flex-col lg:flex-row gap-6 overflow-y-auto pb-32">
      
      {/* LAPTOP / BUY */}
      <div className="flex-1 flex flex-col">
          <div className="crt-screen p-4 rounded-t-md min-h-[500px] flex-1 flex flex-col shadow-[0_0_20px_rgba(74,222,128,0.1)]">
              <div className="flex justify-between items-center border-b border-green-900 pb-2 mb-4 font-mono text-xs">
                  <span className="flex items-center gap-2 text-green-600"><Laptop size={14} /> TOR_CONN: <span className="text-green-400">ESTABLISHED</span></span>
                  <span className="flex items-center gap-2 animate-pulse text-red-500"><Wifi size={14} /> PROXY: UNSTABLE</span>
              </div>
              
              <div className="space-y-8 overflow-y-auto max-h-[70vh] pb-10 flex-1 custom-scrollbar pr-2">
                  
                  {/* SUSPICION MANAGEMENT */}
                  {state.suspicion > 20 && (
                      <div className="border border-red-500 bg-red-900/20 p-2 flex justify-between items-center animate-pulse">
                          <div className="text-red-500 font-bold text-xs uppercase">HEAT LEVEL CRITICAL</div>
                          <button 
                            onClick={onBribe}
                            disabled={state.cash < BRIBE_COST}
                            className="bg-red-900 text-white px-3 py-1 text-xs border border-red-500 hover:bg-red-700 disabled:opacity-50"
                          >
                              BRIBE (${BRIBE_COST})
                          </button>
                      </div>
                  )}

                  {/* CONTRACTS */}
                  <div>
                      <h4 className="bg-red-900/20 text-red-400 mb-3 px-2 py-1 text-sm font-bold border-l-2 border-red-500 flex items-center gap-2">
                          <Briefcase size={14} /> > DARK_WEB_CONTRACTS
                      </h4>
                      <div className="flex flex-col gap-2">
                          {state.contracts.length > 0 ? state.contracts.map(c => {
                              let type: ItemType = ItemType.Fresh;
                              if (c.form === 'Dried') type = ItemType.Dried;
                              if (c.form === 'Powder') type = ItemType.Powder;
                              
                              const owned = state.inventory.find(i => i.type === type && i.subType === c.item);
                              const count = owned ? owned.count : 0;
                              const isReady = count >= c.count;

                              return (
                                  <div key={c.id} className="border border-red-900/30 bg-red-950/10 p-2 flex justify-between items-center">
                                      <div className="flex flex-col">
                                          <span className="text-xs text-red-200 font-mono font-bold">WANTED: {c.count}x {c.item} ({c.form})</span>
                                          <span className="text-[10px] text-red-400 flex items-center gap-1"><Clock size={10} /> {Math.floor(c.timeLeft / 5)}s remaining</span>
                                      </div>
                                      <button 
                                          onClick={() => onFulfillContract(c.id)}
                                          disabled={!isReady}
                                          className={`px-3 py-1 text-xs border ${isReady ? 'border-red-500 bg-red-900 text-white animate-pulse' : 'border-stone-800 text-stone-600'}`}
                                      >
                                          {isReady ? `SEND ($${c.reward})` : `${count}/${c.count}`}
                                      </button>
                                  </div>
                              )
                          }) : (
                              <div className="text-[10px] text-stone-600 italic">No active contracts...</div>
                          )}
                      </div>
                  </div>

                  {/* EQUIPMENT */}
                  <div>
                      <h4 className="bg-green-900/20 text-green-400 mb-3 px-2 py-1 text-sm font-bold border-l-2 border-green-500 flex items-center gap-2">
                          <Hammer size={14} /> > LAB_EQUIPMENT
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {/* New Bed Slot */}
                          <button 
                              onClick={() => onBuyRack(BED_UNLOCK_COST)}
                              disabled={state.cash < BED_UNLOCK_COST || unlockedBeds >= maxBeds}
                              className={`p-2 border flex flex-col gap-2 relative bg-stone-900/40 ${state.cash >= BED_UNLOCK_COST && unlockedBeds < maxBeds ? 'border-green-500/50 hover:bg-green-900/20' : 'opacity-50 border-stone-800'}`}
                          >
                              <div className="flex items-center gap-2">
                                  <div className="bg-black p-1 rounded border border-green-900/50"><Database size={12} className="text-green-500"/></div>
                                  <div className="flex flex-col items-start">
                                      <span className="text-xs text-green-200 font-bold">New Planter Box</span>
                                      <span className="text-[10px] text-green-500">${BED_UNLOCK_COST}</span>
                                  </div>
                              </div>
                              <div className="text-[8px] text-green-700 text-left w-full border-t border-green-900/30 pt-1">
                                  Installed: {unlockedBeds}/{maxBeds}
                              </div>
                          </button>

                          {/* Upgrade Bed Level */}
                          <button 
                              onClick={() => onUpgradeMortar(BED_UPGRADE_COST)}
                              disabled={state.cash < BED_UPGRADE_COST || nextBedLevel >= 3}
                              className={`p-2 border flex flex-col gap-2 relative bg-stone-900/40 ${state.cash >= BED_UPGRADE_COST && nextBedLevel < 3 ? 'border-green-500/50 hover:bg-green-900/20' : 'opacity-50 border-stone-800'}`}
                          >
                               <div className="flex items-center gap-2">
                                  <div className="bg-black p-1 rounded border border-green-900/50"><Zap size={12} className="text-yellow-500"/></div>
                                  <div className="flex flex-col items-start">
                                      <span className="text-xs text-green-200 font-bold">Expand Bed Size</span>
                                      <span className="text-[10px] text-green-500">${BED_UPGRADE_COST}</span>
                                  </div>
                              </div>
                              <div className="text-[8px] text-green-700 text-left w-full border-t border-green-900/30 pt-1">
                                  {nextBedLevel < 3 ? `Upgrade to Tier ${nextBedLevel + 1}` : 'Max Tier Reached'}
                              </div>
                          </button>
                          
                          {/* Dryer Capacity */}
                          <button 
                              onClick={() => onUpgradeMortarCapacity(DRYER_UPGRADE_COST)}
                              disabled={state.cash < DRYER_UPGRADE_COST}
                              className={`p-2 border flex flex-col gap-2 relative bg-stone-900/40 ${state.cash >= DRYER_UPGRADE_COST ? 'border-green-500/50 hover:bg-green-900/20' : 'opacity-50 border-stone-800'}`}
                          >
                               <div className="flex items-center gap-2">
                                  <div className="bg-black p-1 rounded border border-green-900/50"><Archive size={12} className="text-blue-500"/></div>
                                  <div className="flex flex-col items-start">
                                      <span className="text-xs text-green-200 font-bold">Dryer Shelves</span>
                                      <span className="text-[10px] text-green-500">${DRYER_UPGRADE_COST}</span>
                                  </div>
                              </div>
                              <div className="text-[8px] text-green-700 text-left w-full border-t border-green-900/30 pt-1">
                                  Capacity: {state.dryer.capacity} -> {state.dryer.capacity + 5}
                              </div>
                          </button>
                      </div>
                  </div>

                  {/* Spores */}
                  <div>
                      <h4 className="bg-green-900/20 text-green-400 mb-3 px-2 py-1 text-sm font-bold border-l-2 border-green-500">> SPORE_CATALOG</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {Object.values(MushroomType).map(m => {
                              const conf = MUSHROOMS[m];
                              const price = conf.sporePrice;
                              const canAfford = state.cash >= price;
                              
                              let tierColor = "text-green-500";
                              if(conf.tier > 2) tierColor = "text-amber-500";
                              if(conf.tier > 4) tierColor = "text-purple-500";

                              return (
                                  <button 
                                    key={m}
                                    onClick={() => onBuy(ItemType.Spore, m, price)}
                                    disabled={!canAfford}
                                    className={`relative flex flex-col border transition-all group overflow-hidden
                                        ${canAfford ? 'border-green-900/30 bg-green-950/10 hover:bg-green-900/30 hover:border-green-500' : 'border-stone-800 bg-stone-900/50 opacity-50 cursor-not-allowed'}
                                    `}
                                  >
                                      {/* Image Area - Distinct from text */}
                                      <div className="h-20 w-full bg-black/40 border-b border-stone-800 flex items-center justify-center relative overflow-hidden">
                                           <div className="transform scale-50 translate-y-2 group-hover:scale-75 transition-transform">
                                              <MushroomArt type={m} stage={100} />
                                          </div>
                                      </div>
                                      
                                      {/* Text Area */}
                                      <div className="p-2 text-left w-full">
                                          <div className="text-[10px] text-green-200 font-mono truncate">{conf.name}</div>
                                          <div className="flex justify-between w-full mt-1 items-center">
                                              <span className={`text-[8px] border border-stone-700 px-1 rounded ${tierColor}`}>T{conf.tier}</span>
                                              <span className="text-xs font-bold text-green-500">${price}</span>
                                          </div>
                                      </div>
                                  </button>
                              )
                          })}
                      </div>
                  </div>

                  {/* Hardware */}
                  <div>
                      <h4 className="bg-green-900/20 text-green-400 mb-3 px-2 py-1 text-sm font-bold border-l-2 border-green-500">> HARDWARE_UPGRADES</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                          {Object.values(LampType).map(l => {
                              const price = LAMP_PRICES[l];
                              const canAfford = state.cash >= price;
                              
                              return (
                                  <button 
                                    key={l}
                                    onClick={() => onBuy(ItemType.Lamp, l, price)}
                                    disabled={!canAfford}
                                    className={`flex items-center gap-2 p-2 border transition-all text-left group
                                         ${canAfford ? 'border-green-900/30 bg-green-950/10 hover:bg-green-900/30 hover:border-green-500' : 'border-stone-800 bg-stone-900/50 opacity-50 cursor-not-allowed'}
                                    `}
                                  >
                                      <div className="w-10 h-10 min-w-[40px] bg-black/50 border border-green-900/30 flex items-center justify-center rounded overflow-hidden">
                                          <div className="w-6 h-8"><LampArt type={l} /></div>
                                      </div>
                                      <div className="flex flex-col">
                                          <span className="block text-[10px] text-green-100 font-mono leading-tight">{l} Bulb</span>
                                          <span className="text-xs font-bold text-green-500">${price}</span>
                                      </div>
                                  </button>
                              );
                          })}
                      </div>
                  </div>

                  {/* Chemistry */}
                  <div>
                      <h4 className="bg-green-900/20 text-green-400 mb-3 px-2 py-1 text-sm font-bold border-l-2 border-green-500">> EXPERIMENTAL_CHEM</h4>
                      <div className="grid grid-cols-2 gap-2">
                          
                          {/* FUNGICIDE */}
                          <button 
                            onClick={() => onBuy(ItemType.Fungicide, "Fungicide", FUNGICIDE_COST)}
                            disabled={state.cash < FUNGICIDE_COST}
                            className={`flex items-center gap-2 p-2 border transition-all text-left group
                                    ${state.cash >= FUNGICIDE_COST ? 'border-green-900/30 bg-green-950/10 hover:bg-green-900/30 hover:border-green-500' : 'border-stone-800 bg-stone-900/50 opacity-50 cursor-not-allowed'}
                            `}
                          >
                              <div className="w-10 h-10 min-w-[40px] bg-black/50 border border-green-900/30 flex items-center justify-center rounded overflow-hidden">
                                  <div className="w-4 h-6"><SprayBottleArt /></div>
                              </div>
                              <div className="flex flex-col">
                                  <span className="text-[10px] text-green-200 font-mono leading-tight">MOLD SPRAY</span>
                                  <span className="text-xs font-bold text-green-500">${FUNGICIDE_COST}</span>
                              </div>
                          </button>

                          {Object.values(SerumType).map(s => {
                              const price = SERUM_PRICES[s];
                              const canAfford = state.cash >= price;
                              return (
                                  <button 
                                    key={s}
                                    onClick={() => onBuy(ItemType.Serum, s, price)}
                                    disabled={!canAfford}
                                    className={`flex items-center gap-2 p-2 border transition-all text-left group
                                         ${canAfford ? 'border-green-900/30 bg-green-950/10 hover:bg-green-900/30 hover:border-green-500' : 'border-stone-800 bg-stone-900/50 opacity-50 cursor-not-allowed'}
                                    `}
                                  >
                                      <div className="w-10 h-10 min-w-[40px] bg-black/50 border border-green-900/30 flex items-center justify-center rounded overflow-hidden">
                                          <div className="w-6 h-8"><SerumArt type={s} /></div>
                                      </div>
                                      <div className="flex flex-col">
                                          <span className="text-[10px] text-green-200 font-mono leading-tight">{s}</span>
                                          <span className="text-xs font-bold text-green-500">${price}</span>
                                      </div>
                                  </button>
                              )
                          })}
                      </div>
                  </div>

              </div>
          </div>
          <div className="bg-stone-800 p-2 rounded-b-md border-t-4 border-stone-900 flex justify-center">
              <div className="text-stone-500 text-[10px] font-mono">DELL LATITUDE // D630 // SERVICE TAG: 8X992</div>
          </div>
      </div>

      {/* THE FENCE / SELL */}
      <div className="lg:w-1/3 concrete-panel p-6 flex flex-col">
          <h2 className="text-3xl text-stone-300 mb-6 stamp -rotate-2 text-center bg-red-900 px-2 text-white shadow-lg">THE FENCE</h2>
          
          <div className="flex-1 bg-black/40 p-4 border border-stone-800 overflow-y-auto">
              {sellable.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-stone-600 text-xs text-center font-mono flex-col gap-4">
                      <EmptyBoxArt className="w-24 h-24" />
                      "You got nothing for me?<br/>Get out of here."
                  </div>
              ) : (
                  <div className="space-y-3">
                      {sellable.map(item => {
                          const price = getSellPrice(item);
                          const total = price * item.count;
                          
                          let label = "🍄 Fresh";
                          if (item.type === ItemType.Dried) label = "🍂 Dried";
                          if (item.type === ItemType.Powder) label = "🧂 Powder";
                          if (item.type === ItemType.HybridSpore) label = "🧬 Hybrid Seed";

                          return (
                              <div key={item.id} className="flex justify-between items-center border-b border-stone-800 pb-2 group">
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-black/30 rounded border border-stone-700 flex items-center justify-center overflow-hidden">
                                          {item.type === ItemType.HybridSpore ? (
                                              <div className="transform scale-75">
                                                  <SporeBagArt color={MUSHROOMS[item.subType as MushroomType]?.color} />
                                              </div>
                                          ) : (
                                              <div className="transform scale-50 translate-y-1">
                                                  <MushroomArt 
                                                    type={item.subType as MushroomType} 
                                                    stage={100} 
                                                    form={item.type === ItemType.Powder ? 'powder' : 'growing'} 
                                                  />
                                              </div>
                                          )}
                                      </div>
                                      <div>
                                          <div className={`text-sm font-bold font-serif ${item.type === ItemType.Powder ? 'text-white' : 'text-stone-400'}`}>
                                              {item.subType}
                                          </div>
                                          <div className="text-[10px] text-stone-500 uppercase tracking-wide">{label} x{item.count}</div>
                                      </div>
                                  </div>
                                  <button 
                                    onClick={() => onSell(item.id, total)}
                                    className="bg-stone-800 hover:bg-green-900 text-green-600 hover:text-green-200 px-3 py-1 text-xs font-mono border border-stone-600 flex items-center gap-1 transition-colors"
                                  >
                                      ${total} <ArrowRight size={10} />
                                  </button>
                              </div>
                          )
                      })}
                  </div>
              )}
          </div>
          
          <div className="mt-4 paper-note p-3 text-sm font-handwriting transform rotate-1 text-center shadow-lg text-black">
              "Selling fast raises heat.<br/>Keep a low profile."
          </div>
      </div>

    </div>
  );
};
