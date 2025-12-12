
export enum Location {
  Basement = 'Basement',
  Kitchen = 'Kitchen',
  Alley = 'Alley'
}

export enum MushroomType {
  // Tier 1
  Muscaria = 'Muscaria',   
  Cubensis = 'Cubensis',
  // Tier 2
  Pantherina = 'Pantherina',
  Cyanescens = 'Cyanescens',
  // Tier 3
  LionMane = 'LionMane',
  Cordyceps = 'Cordyceps',
  Reishi = 'Reishi',
  // Tier 4
  Azurescens = 'Azurescens',
  Ghost = 'Ghost',
  // Tier 5
  Enigma = 'Enigma',
  Biolume = 'Biolume'
}

export enum FloraType {
  Lumina = 'Lumina',
  Ignis = 'Ignis',
  Crystal = 'Crystal',
  Nebula = 'Nebula',
  Void = 'Void'
}

export enum SpaceWeather {
  None = 'None',
  SolarFlare = 'SolarFlare',
  NebulaStorm = 'NebulaStorm'
}

export enum ItemType {
  Spore = 'Spore',
  Fresh = 'Fresh',
  Dried = 'Dried',
  Powder = 'Powder',
  Lamp = 'Lamp',
  Serum = 'Serum',
  Fungicide = 'Fungicide',
  HybridSpore = 'HybridSpore',
  Burnt = 'Burnt', // New trash item
  // SciFi Types
  Seed = 'Seed',
  Biomass = 'Biomass',
  Refined = 'Refined',
  Mutation = 'Mutation',
  NutrientPack = 'NutrientPack',
  CompoundAlpha = 'CompoundAlpha',
  CompoundBeta = 'CompoundBeta',
  CompoundOmega = 'CompoundOmega'
}

export enum LampType {
  Incandescent = 'Incandescent', 
  Heat = 'Heat',                 
  UV = 'UV',                     
  LED = 'LED'                    
}

export enum SerumType {
  GrowthHormone = 'GrowthHormone',
  MutagenX = 'MutagenX'
}

export interface InventoryItem {
  id: string;
  type: ItemType;
  subType: string;
  count: number;
  floraType?: FloraType;
}

export interface GrowBed {
  id: number;
  isUnlocked: boolean;
  level: number; 
  capacity: number; 
  
  mushroom: MushroomType | null;
  growth: number; 
  health: number; // New: 0-100. If 0, crops die.
  moisture: number; 
  
  installedLamp: LampType | null;
  isMutated: boolean;
  isContaminated: boolean;
  
  status: 'empty' | 'growing' | 'dead' | 'ready';
}

export interface HydroSlot {
    id: number;
    isUnlocked: boolean;
    plantedFlora: FloraType | null;
    status: 'empty' | 'growing' | 'decayed' | 'ready';
    growth: number;
    hydration: number;
    hasNutrients: boolean;
    isMutated: boolean;
}

export interface DryingBatch {
  id: string;
  type: MushroomType;
  progress: number; // 0 to 100 (Dried) to 150 (Burnt)
  count: number;
  status: 'drying' | 'dried' | 'burnt';
}

export interface DryingUnit {
  level: number;
  capacity: number;
  contents: DryingBatch[];
  isOn: boolean; // Manual toggle
}

export interface Contract {
  id: string;
  item: MushroomType;
  form: 'Fresh' | 'Dried' | 'Powder';
  count: number;
  reward: number;
  timeLeft: number;
}

export interface TradeContract {
    id: string;
    description: string;
    requiredItem: ItemType;
    requiredFlora?: FloraType;
    amount: number;
    reward: number;
    expiresInTicks: number;
}

export interface EnvironmentState {
  temperature: number; 
  humidity: number;    
  heaterOn: boolean;
  humidifierOn: boolean;
  ventilationOn: boolean; // New: Lowers temp/humidity, lowers suspicion
}

export interface GameState {
  cash: number;
  suspicion: number; // 0-100. 100 = Raid.
  location: Location;
  inventory: InventoryItem[];
  
  environment: EnvironmentState;
  
  beds: GrowBed[]; 
  dryer: DryingUnit; 
  
  mortar: {
    input: MushroomType | null;
    quantity: number; 
    progress: number;
    isGrinding: boolean;
    speedLevel: number; 
    maxCapacity: number; 
  };
  mixer: {
    slot1: MushroomType | null;
    slot2: MushroomType | null;
    progress: number;
    isMixing: boolean;
    output: MushroomType | null; 
  };
  contracts: Contract[];

  // SciFi State Extensions
  credits: number;
  energy: number;
  maxEnergy: number;
  level: number;
  xp: number;
  weather: SpaceWeather;
  slots: HydroSlot[];
  processorSlots: {
      id: number;
      isUnlocked: boolean;
      contents: FloraType | null;
      progress: number;
  }[];
  synthesizer: {
      slot1: FloraType | null;
      slot2: FloraType | null;
      progress: number;
      isSynthesizing: boolean;
      output: FloraType | null;
  };
  activeContract: TradeContract | null;
}

export interface MushroomConfig {
  name: string;
  desc: string;
  growthTime: number; 
  waterRate: number;
  basePrice: number;
  sporePrice: number;
  color: string;
  tier: number;
  // Hardcore Stats
  idealTemp: number; // Optimal temperature
  idealHumid: number; // Optimal humidity
  resilience: number; // How fast health drops when conditions are bad (1-5)
}

export interface FloraConfig {
    name: string;
    codeName: string;
    seedPrice: number;
    baseValue: number;
    colorMain: string;
    colorAccent: string;
    levelReq: number;
}
