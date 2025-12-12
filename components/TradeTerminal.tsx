
import React from 'react';
import { GameState, ItemType, FloraType, TradeContract } from '../types';
import { FLORA_DATA, NUTRIENT_PRICE, SLOT_COST_BASE, PROCESSOR_UPGRADE_COST, COMPOUND_PRICES, ENERGY_RECHARGE_COST } from '../constants';
import { ShoppingCart } from 'lucide-react';

interface Props {
  state: GameState;
  onBuySeed: (type: FloraType) => void;
  onBuyNutrient: () => void;
  onBuySlot: () => void;
  onBuyProcessorSlot: () => void;
  onRechargeEnergy: () => void;
  onSellCompound: (type: ItemType) => void;
  onCompleteContract: () => void;
}

export const TradeTerminal: React.FC<Props> = ({ 
  state, 
  onBuySeed, 
  onBuyNutrient, 
  onBuySlot, 
  onBuyProcessorSlot,
  onRechargeEnergy,
  onSellCompound,
  onCompleteContract
}) => {
  
  const canContractComplete = state.activeContract && (() => {
      const needed = state.activeContract.requiredItem;
      const neededType = state.activeContract.requiredFlora;
      const item = state.inventory.find(i => i.type === needed && (neededType ? i.floraType === neededType : true));
      return item && item.count >= state.activeContract.amount;
  })();

  return (
    <div className="holo-panel p-6 rounded-sm mt-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 px-4 bg-cyan-900/40 border-l border-b border-cyan-800 text-[10px] font-mono text-cyan-300 flex items-center gap-2">
         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> NETWORK ONLINE
      </div>

      <h3 className="text-xl text-cyan-400 mb-6 flex items-center gap-3 uppercase tracking-widest font-bold">
        <ShoppingCart size={24} /> Galactic Trade Hub
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COL: Catalog */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Seeds */}
            <div>
                <h4 className="text-xs font-mono text-slate-500 uppercase mb-2 border-b border-slate-800">Biological Assets</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.values(FloraType).map(type => {
                        const config = FLORA_DATA[type];
                        const locked = state.level < config.levelReq;
                        const canAfford = state.credits >= config.seedPrice;
                        
                        return (
                            <button
                                key={type}
                                onClick={() => onBuySeed(type)}
                                disabled={locked || !canAfford}
                                className={`flex justify-between items-center p-2 rounded-sm border text-left group transition-all
                                    ${locked 
                                        ? 'bg-slate-950 border-slate-900 opacity-50 cursor-not-allowed' 
                                        : canAfford 
                                            ? 'bg-slate-900/60 border-slate-700 hover:border-cyan-500' 
                                            : 'bg-slate-900/60 border-red-900/30'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-8" style={{backgroundColor: locked ? '#334155' : config.colorMain}}></div>
                                    <div>
                                        <div className={`font-mono text-sm ${locked ? 'text-slate-600' : 'text-slate-200 group-hover:text-cyan-300'}`}>
                                            {locked ? 'LOCKED DATA' : config.codeName}
                                        </div>
                                        <div className="text-[10px] text-slate-500">{locked ? `REQ: LVL ${config.levelReq}` : config.name}</div>
                                    </div>
                                </div>
                                {!locked && (
                                    <div className={`text-sm font-mono ${canAfford ? 'text-cyan-500' : 'text-red-500'}`}>
                                        {config.seedPrice} CR
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Upgrades */}
            <div>
                 <h4 className="text-xs font-mono text-slate-500 uppercase mb-2 border-b border-slate-800">Station Upgrades</h4>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                        onClick={onBuyNutrient}
                        disabled={state.credits < NUTRIENT_PRICE}
                        className="p-2 bg-slate-900/50 border border-slate-700 hover:border-green-500 rounded-sm text-center disabled:opacity-50"
                    >
                        <div className="text-[10px] text-slate-400 font-mono">Nutrient Pack</div>
                        <div className="text-green-500 text-sm font-bold">{NUTRIENT_PRICE} CR</div>
                    </button>

                    <button
                        onClick={onRechargeEnergy}
                        disabled={state.credits < ENERGY_RECHARGE_COST || state.energy >= state.maxEnergy}
                        className="p-2 bg-slate-900/50 border border-slate-700 hover:border-yellow-500 rounded-sm text-center disabled:opacity-50"
                    >
                        <div className="text-[10px] text-slate-400 font-mono">Core Recharge</div>
                        <div className="text-yellow-500 text-sm font-bold">{ENERGY_RECHARGE_COST} CR</div>
                    </button>
                    
                    <button
                        onClick={onBuySlot}
                        disabled={state.slots.length >= 8 || state.credits < SLOT_COST_BASE}
                        className="p-2 bg-slate-900/50 border border-slate-700 hover:border-blue-500 rounded-sm text-center disabled:opacity-50"
                    >
                        <div className="text-[10px] text-slate-400 font-mono">Hydro Bay</div>
                        <div className="text-blue-500 text-sm font-bold">{SLOT_COST_BASE} CR</div>
                    </button>

                     <button
                        onClick={onBuyProcessorSlot}
                        disabled={state.processorSlots.filter(s=>s.isUnlocked).length >= 4 || state.credits < PROCESSOR_UPGRADE_COST}
                        className="p-2 bg-slate-900/50 border border-slate-700 hover:border-purple-500 rounded-sm text-center disabled:opacity-50"
                    >
                        <div className="text-[10px] text-slate-400 font-mono">Processor CPU</div>
                        <div className="text-purple-500 text-sm font-bold">{PROCESSOR_UPGRADE_COST} CR</div>
                    </button>
                 </div>
            </div>

        </div>

        {/* RIGHT COL: Contracts & Sales */}
        <div className="flex-1 flex flex-col gap-4">
            
            {/* Active Contract */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-1 bg-yellow-900/30 text-yellow-500 text-[9px] uppercase font-bold border-bl border-yellow-900">
                    Priority Order
                </div>
                <h4 className="text-xs font-mono text-slate-400 mb-2">Corporate Contract</h4>
                
                {state.activeContract ? (
                    <div className="space-y-3">
                        <p className="text-xs text-slate-300 italic">"{state.activeContract.description}"</p>
                        <div className="flex justify-between items-center bg-slate-950 p-2 border border-slate-800">
                            <span className="text-sm font-mono text-cyan-300">
                                {state.activeContract.amount}x {state.activeContract.requiredFlora ? FLORA_DATA[state.activeContract.requiredFlora].codeName : state.activeContract.requiredItem}
                            </span>
                            <span className="text-yellow-500 font-bold">{state.activeContract.reward} CR</span>
                        </div>
                        <button
                            onClick={onCompleteContract}
                            disabled={!canContractComplete}
                            className="w-full py-2 bg-yellow-600/20 border border-yellow-600 hover:bg-yellow-600/40 text-yellow-500 font-mono uppercase text-xs tracking-wider transition-all disabled:opacity-50 disabled:border-slate-700 disabled:text-slate-600"
                        >
                            {canContractComplete ? "Transmit Cargo" : "Insufficient Cargo"}
                        </button>
                        <div className="w-full bg-slate-800 h-1 mt-2">
                             <div className="bg-yellow-600 h-full" style={{width: `${(state.activeContract.expiresInTicks / 500) * 100}%`}}></div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6 text-slate-600 text-xs font-mono animate-pulse">
                        Searching for signals...
                    </div>
                )}
            </div>

            {/* Sell Compounds */}
            <div className="space-y-2">
                <h4 className="text-xs font-mono text-slate-500 uppercase">Liquidation</h4>
                {[ItemType.CompoundAlpha, ItemType.CompoundBeta, ItemType.CompoundOmega].map(type => {
                     const item = state.inventory.find(i => i.type === type);
                     const count = item ? item.count : 0;
                     if (count === 0) return null;

                     return (
                        <button 
                            key={type}
                            onClick={() => onSellCompound(type)}
                            className="w-full flex justify-between items-center p-2 bg-slate-900/80 border border-slate-700 hover:border-green-500 text-xs"
                        >
                            <span className="text-slate-300">Sell {type.replace('Compound', '')} ({count})</span>
                            <span className="text-green-400">{count * COMPOUND_PRICES[type]} CR</span>
                        </button>
                     );
                })}
            </div>

        </div>

      </div>
    </div>
  );
};
