import React from 'react';
import { GameState, ItemType, SpaceWeather, FloraType } from '../types';
import { FLORA_DATA, NUTRIENT_PRICE, SLOT_COST_BASE, PROCESSOR_UPGRADE_COST, MAX_PROCESSOR_SLOTS, MAX_SLOTS, COMPOUND_PRICES } from '../constants';
import { ShoppingBag, Lock, TestTube, Sprout, Wind, Coins } from 'lucide-react';

interface Props {
  state: GameState;
  onBuySpore: (type: FloraType) => void;
  onBuyFertilizer: () => void;
  onBuySlot: () => void;
  onBuyDryerSlot: () => void;
  onSellEssence: (tier: ItemType) => void;
  onSellFresh: (type: FloraType) => void;
}

export const Market: React.FC<Props> = ({ 
  state, 
  onBuySpore, 
  onBuyFertilizer, 
  onBuySlot, 
  onBuyDryerSlot,
  onSellEssence,
  onSellFresh
}) => {
  // --- Modifiers Calculation ---
  const isSolarFlare = state.weather === SpaceWeather.SolarFlare;
  const isNebulaStorm = state.weather === SpaceWeather.NebulaStorm;

  // Modifiers
  const buyMultiplier = isSolarFlare ? 0.8 : 1.0;
  const sellMultiplier = isNebulaStorm ? 1.25 : 1.0;

  // --- Upgrade Costs ---
  const nextSlotPrice = Math.floor(SLOT_COST_BASE * buyMultiplier);
  const canBuySlot = state.slots.length < MAX_SLOTS;
  
  const processorCount = state.processorSlots.filter(s => s.isUnlocked).length;
  const canBuyDryer = processorCount < MAX_PROCESSOR_SLOTS;
  const nextDryerPrice = Math.floor(PROCESSOR_UPGRADE_COST * buyMultiplier);

  const nutrientPrice = Math.floor(NUTRIENT_PRICE * buyMultiplier);

  // --- Fresh Items ---
  const freshItems = state.inventory.filter(i => i.type === ItemType.Biomass);

  return (
    <div className="glass-panel p-6 rounded-lg mt-8 border-stone-800 relative overflow-hidden">
      {/* Weather Banner in Market */}
      <div className="absolute top-0 right-0 p-2 px-4 rounded-bl-xl bg-stone-900/80 border-b border-l border-stone-800 text-xs uppercase tracking-wider font-bold flex items-center gap-2">
         {isSolarFlare && <span className="text-emerald-400 animate-pulse">Solar Flare: Discounts Active</span>}
         {isNebulaStorm && <span className="text-amber-400 animate-pulse">Nebula Storm: High Sell Prices</span>}
         {!isSolarFlare && !isNebulaStorm && <span className="text-stone-500">Standard Prices</span>}
      </div>

      <h3 className="text-2xl font-serif text-emerald-600 mb-6 flex items-center gap-3">
        <ShoppingBag className="text-emerald-800" /> The Dark Market
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* SECTION: SEEDS */}
        <div className="col-span-1 md:col-span-2">
            <h4 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-3 border-b border-stone-800 pb-1">Rare Seeds</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.values(FloraType).map(type => {
                    const config = FLORA_DATA[type];
                    const price = Math.floor(config.seedPrice * buyMultiplier);
                    const canAfford = state.credits >= price;
                    return (
                        <button
                            key={type}
                            onClick={() => onBuySpore(type)}
                            disabled={!canAfford}
                            className={`flex justify-between items-center p-3 rounded border transition-all text-left group
                                ${canAfford 
                                    ? 'bg-stone-900/60 hover:bg-stone-800 border-stone-700 hover:border-emerald-700/50' 
                                    : 'bg-stone-950/60 border-stone-800 opacity-60 cursor-not-allowed'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full" style={{backgroundColor: config.colorMain}}></div>
                                <div>
                                    <div className="text-stone-200 font-serif group-hover:text-emerald-300 transition-colors">{config.name}</div>
                                    <div className="text-[10px] text-stone-500">{config.codeName}</div>
                                </div>
                            </div>
                            <div className={`text-sm font-bold ${canAfford ? 'text-emerald-500' : 'text-red-900'}`}>
                                {price} CR
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>

        {/* SECTION: SUPPLIES & UPGRADES */}
        <div className="flex flex-col gap-4">
             <h4 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-1 border-b border-stone-800 pb-1">Equipment</h4>
             
             {/* Nutrient Pack */}
             <button
                onClick={onBuyFertilizer}
                disabled={state.credits < nutrientPrice}
                className="flex justify-between items-center p-3 rounded bg-stone-900/60 hover:bg-stone-800 border border-stone-700 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                <div className="flex items-center gap-3">
                    <TestTube size={18} className="text-amber-500 group-hover:animate-pulse" />
                    <div className="text-left">
                        <div className="text-stone-200 text-sm">Nutrient Pack</div>
                    </div>
                </div>
                <div className="text-emerald-500 font-bold text-sm">{nutrientPrice} CR</div>
            </button>

            {/* Plot Expansion */}
            <button
                onClick={onBuySlot}
                disabled={!canBuySlot || state.credits < nextSlotPrice}
                className="flex justify-between items-center p-3 rounded bg-stone-900/60 hover:bg-stone-800 border border-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex items-center gap-3">
                    {canBuySlot ? <Sprout size={18} className="text-stone-400" /> : <Lock size={18} className="text-stone-600" />}
                    <div className="text-left">
                        <div className="text-stone-200 text-sm">{canBuySlot ? "Expand Garden" : "Max Size Reached"}</div>
                    </div>
                </div>
                {canBuySlot && <div className="text-emerald-500 font-bold text-sm">{nextSlotPrice} CR</div>}
            </button>

            {/* Processor Upgrade */}
             <button
                onClick={onBuyDryerSlot}
                disabled={!canBuyDryer || state.credits < nextDryerPrice}
                className="flex justify-between items-center p-3 rounded bg-stone-900/60 hover:bg-stone-800 border border-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex items-center gap-3">
                    {canBuyDryer ? <Wind size={18} className="text-stone-400" /> : <Lock size={18} className="text-stone-600" />}
                    <div className="text-left">
                        <div className="text-stone-200 text-sm">{canBuyDryer ? "Add CPU Core" : "Max Cores"}</div>
                    </div>
                </div>
                {canBuyDryer && <div className="text-emerald-500 font-bold text-sm">{nextDryerPrice} CR</div>}
            </button>
        </div>
      </div>

      {/* SELL SECTION */}
      <div className="mt-8 pt-6 border-t border-stone-800">
         <h4 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            Sell Goods <span className="text-[10px] text-stone-600 font-normal normal-case">(Weather Bonus: +25%)</span>
         </h4>
         <div className="flex flex-wrap gap-4 justify-center">

            {/* Sell Compounds */}
            {[ItemType.CompoundAlpha, ItemType.CompoundBeta, ItemType.CompoundOmega].map(tier => {
                const item = state.inventory.find(i => i.type === tier);
                const count = item ? item.count : 0;
                const price = Math.floor(COMPOUND_PRICES[tier] * sellMultiplier);
                const value = count * price;
                
                let label = "Alpha";
                let color = "text-stone-400";
                if (tier === ItemType.CompoundBeta) { label = "Beta"; color = "text-purple-400"; }
                if (tier === ItemType.CompoundOmega) { label = "Omega"; color = "text-amber-400"; }

                return (
                     <button
                        key={tier}
                        onClick={() => onSellEssence(tier)}
                        disabled={count === 0}
                        className="px-6 py-2 bg-stone-900 border border-stone-700 hover:border-emerald-500 text-stone-200 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed flex flex-col items-center min-w-[120px] shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                    >
                         <div className={`flex items-center gap-2 mb-1 font-serif ${color}`}>
                             <Coins size={14} /> {label}
                         </div>
                         <div className="text-xs text-emerald-500">{count > 0 ? `Sell All: ${value} CR` : 'Empty'}</div>
                    </button>
                )
            })}
         </div>

         {/* BIOMASS MARKET */}
         {freshItems.length > 0 && (
             <div className="mt-6 pt-4 border-t border-stone-800/50">
                 <p className="text-xs text-stone-500 uppercase mb-3 text-center">Biomass Exchange</p>
                 <div className="flex flex-wrap gap-2 justify-center">
                    {freshItems.map(item => {
                        const type = item.floraType!;
                        const count = item.count;
                        const basePrice = FLORA_DATA[type].baseValue;
                        const finalPrice = Math.floor(basePrice * sellMultiplier);
                        const totalValue = count * finalPrice;

                        return (
                            <button
                                key={type}
                                onClick={() => onSellFresh(type)}
                                className="px-4 py-2 bg-stone-900/80 border border-stone-700 hover:bg-stone-800 hover:border-emerald-600 rounded flex items-center gap-3 transition-colors"
                            >
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: FLORA_DATA[type].colorMain}}></div>
                                <div className="text-left">
                                    <div className="text-stone-300 text-xs font-serif">{FLORA_DATA[type].name}</div>
                                    <div className="text-[10px] text-stone-500">x{count}</div>
                                </div>
                                <div className="text-emerald-500 font-bold text-sm ml-2">+{totalValue} CR</div>
                            </button>
                        );
                    })}
                 </div>
             </div>
         )}

      </div>

    </div>
  );
};
