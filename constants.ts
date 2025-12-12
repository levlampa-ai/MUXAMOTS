
import { MushroomType, MushroomConfig, LampType, SerumType, FloraType, FloraConfig, ItemType } from './types';

// GLOBAL BALANCE
export const TICK_MS = 1000; 
export const INITIAL_BEDS = 2; 
export const DRY_TIME = 60; 
export const GRIND_TIME = 20;
export const MIX_TIME = 30;

// Sci-Fi Times
export const PROCESS_TIME_SEC = 20;
export const SYNTHESIS_TIME_SEC = 30;

// Costs
export const BED_UNLOCK_COST = 500;
export const BED_UPGRADE_COST = 1000;
export const DRYER_UPGRADE_COST = 600;
export const MORTAR_UPGRADE_COST = 500;
export const MORTAR_CAPACITY_COST = 800; 
export const FUNGICIDE_COST = 75;
export const BRIBE_COST = 500;

// Sci-Fi Costs & Limits
export const NUTRIENT_PRICE = 100;
export const SLOT_COST_BASE = 1000;
export const MAX_SLOTS = 8;
export const PROCESSOR_UPGRADE_COST = 2000;
export const MAX_PROCESSOR_SLOTS = 4;
export const ENERGY_RECHARGE_COST = 50;

// RESILIENCE SCALING: Higher = Less damage taken
export const MUSHROOMS: Record<MushroomType, MushroomConfig> = {
  // TIER 1
  [MushroomType.Muscaria]: {
    name: "Fly Agaric",
    desc: "Likes it cool and damp.",
    growthTime: 25, // Faster start
    waterRate: 0.5, 
    basePrice: 15,
    sporePrice: 5,
    color: "#dc2626",
    tier: 1,
    idealTemp: 25, // Adjusted from 35 to 25 (Close to start temp of 20)
    idealHumid: 60, // Adjusted from 80 to 60 (Easier)
    resilience: 10
  },
  [MushroomType.Cubensis]: {
    name: "Gold Top",
    desc: "Standard warm grower.",
    growthTime: 35,
    waterRate: 0.4,
    basePrice: 25,
    sporePrice: 10,
    color: "#d97706",
    tier: 1,
    idealTemp: 30, 
    idealHumid: 50, 
    resilience: 10
  },
  // TIER 2
  [MushroomType.Pantherina]: {
    name: "Panther Cap",
    desc: "Temperate and damp.",
    growthTime: 50,
    waterRate: 0.6,
    basePrice: 40,
    sporePrice: 20,
    color: "#78350f",
    tier: 2,
    idealTemp: 45,
    idealHumid: 70,
    resilience: 6
  },
  [MushroomType.LionMane]: {
    name: "Lion's Mane",
    desc: "Needs high oxygen.",
    growthTime: 60,
    waterRate: 0.8,
    basePrice: 50,
    sporePrice: 25,
    color: "#e5e5e5",
    tier: 2,
    idealTemp: 50,
    idealHumid: 85,
    resilience: 6
  },
  // TIER 3
  [MushroomType.Cyanescens]: {
    name: "Wavy Cap",
    desc: "Cold shock required.",
    growthTime: 70,
    waterRate: 0.8,
    basePrice: 70,
    sporePrice: 40,
    color: "#a16207",
    tier: 3,
    idealTemp: 30,
    idealHumid: 90,
    resilience: 5
  },
  [MushroomType.Reishi]: {
    name: "Reishi Antler",
    desc: "Hot and steamy.",
    growthTime: 80,
    waterRate: 0.3,
    basePrice: 85,
    sporePrice: 50,
    color: "#7f1d1d",
    tier: 3,
    idealTemp: 75,
    idealHumid: 80,
    resilience: 7
  },
  // TIER 4
  [MushroomType.Azurescens]: {
    name: "Flying Saucer",
    desc: "Very picky.",
    growthTime: 100,
    waterRate: 1.0,
    basePrice: 120,
    sporePrice: 80,
    color: "#854d0e",
    tier: 4,
    idealTemp: 40,
    idealHumid: 95,
    resilience: 3
  },
  [MushroomType.Cordyceps]: {
    name: "Cordyceps",
    desc: "Tropical heat.",
    growthTime: 90,
    waterRate: 0.9,
    basePrice: 150,
    sporePrice: 100,
    color: "#f97316",
    tier: 4,
    idealTemp: 80,
    idealHumid: 70,
    resilience: 4
  },
  [MushroomType.Ghost]: {
    name: "Ghost Strain",
    desc: "Fragile mutation.",
    growthTime: 120,
    waterRate: 0.5,
    basePrice: 200,
    sporePrice: 150,
    color: "#f0f9ff",
    tier: 4,
    idealTemp: 55,
    idealHumid: 55,
    resilience: 2
  },
  // TIER 5
  [MushroomType.Enigma]: {
    name: "Enigma Blob",
    desc: "Perfect stability required.",
    growthTime: 200,
    waterRate: 0.6,
    basePrice: 500,
    sporePrice: 300, 
    color: "#0f766e",
    tier: 5,
    idealTemp: 65,
    idealHumid: 65,
    resilience: 2
  },
  [MushroomType.Biolume]: {
    name: "Night Light",
    desc: "Radioactive environment.",
    growthTime: 150,
    waterRate: 1.2,
    basePrice: 400,
    sporePrice: 250,
    color: "#84cc16",
    tier: 5,
    idealTemp: 70,
    idealHumid: 90,
    resilience: 3
  }
};

export const FLORA_DATA: Record<FloraType, FloraConfig> = {
  [FloraType.Lumina]: {
    name: "Lumina Orb",
    codeName: "LM-01",
    seedPrice: 50,
    baseValue: 100,
    colorMain: "#60a5fa",
    colorAccent: "#93c5fd",
    levelReq: 1
  },
  [FloraType.Ignis]: {
    name: "Ignis Spike",
    codeName: "IG-99",
    seedPrice: 150,
    baseValue: 300,
    colorMain: "#f87171",
    colorAccent: "#fca5a5",
    levelReq: 2
  },
  [FloraType.Crystal]: {
    name: "Crystallo",
    codeName: "CR-7X",
    seedPrice: 400,
    baseValue: 800,
    colorMain: "#e879f9",
    colorAccent: "#f0abfc",
    levelReq: 3
  },
  [FloraType.Nebula]: {
    name: "Nebula Cloud",
    codeName: "NB-00",
    seedPrice: 1000,
    baseValue: 2500,
    colorMain: "#818cf8",
    colorAccent: "#a5b4fc",
    levelReq: 5
  },
  [FloraType.Void]: {
    name: "Void Matter",
    codeName: "VD-NULL",
    seedPrice: 5000,
    baseValue: 12000,
    colorMain: "#94a3b8",
    colorAccent: "#cbd5e1",
    levelReq: 8
  }
};

export const LAMP_PRICES: Record<LampType, number> = {
  [LampType.Incandescent]: 20,
  [LampType.Heat]: 150,
  [LampType.UV]: 300,
  [LampType.LED]: 100
};

export const SERUM_PRICES: Record<SerumType, number> = {
  [SerumType.GrowthHormone]: 50,
  [SerumType.MutagenX]: 200
};

export const COMPOUND_PRICES = {
  [ItemType.CompoundAlpha]: 500,
  [ItemType.CompoundBeta]: 1500,
  [ItemType.CompoundOmega]: 5000,
};
