
import React, { useState, useEffect } from 'react';
import { 
  GameState, Location, ItemType, MushroomType, LampType, SerumType, DryingBatch, SpaceWeather
} from './types';
import { 
  TICK_MS, MUSHROOMS, DRY_TIME, GRIND_TIME, INITIAL_BEDS, MIX_TIME, BRIBE_COST
} from './constants';
import { Basement } from './components/Basement';
import { Kitchen } from './components/Kitchen';
import { Alley } from './components/Alley';
import { HUD } from './components/HUD';
import { Sprout, FlaskConical, ShoppingCart, Siren } from 'lucide-react';

const GlobalSVGDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
    <defs>
        <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
                <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feComposite operator="in" in2="SourceGraphic" result="grain" />
            <feComposite operator="over" in="grain" in2="SourceGraphic" />
        </filter>
        
        <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
        
        <filter id="mold-texture">
            <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" result="noise"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.4  0 0 0 0 0.1  0 0 0 1 0" in="noise" result="coloredNoise"/>
            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="mold"/>
        </filter>

        <linearGradient id="stem-gradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#e7e5e4" />
            <stop offset="20%" stopColor="#f5f5f4" />
            <stop offset="80%" stopColor="#d6d3d1" />
            <stop offset="100%" stopColor="#a8a29e" />
        </linearGradient>

        <radialGradient id="grad-muscaria" cx="30%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
        </radialGradient>
        
        <radialGradient id="grad-cubensis" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="40%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#f5f5f4" />
        </radialGradient>

        <radialGradient id="grad-biolume" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#bef264" />
            <stop offset="100%" stopColor="#3f6212" />
        </radialGradient>

        <linearGradient id="grad-reishi" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#450a0a" />
                <stop offset="60%" stopColor="#b91c1c" />
                <stop offset="100%" stopColor="#fca5a5" />
        </linearGradient>
    </defs>
  </svg>
);

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    cash: 200,
    credits: 200, // Sync with cash initially
    suspicion: 0,
    location: Location.Basement,
    inventory: [
        { id: '1', type: ItemType.Spore, subType: MushroomType.Muscaria, count: 2 },
        { id: '2', type: ItemType.Lamp, subType: LampType.Incandescent, count: 1 }
    ],
    environment: {
        temperature: 20, // Starting room temp
        humidity: 40,
        heaterOn: false,
        humidifierOn: false,
        ventilationOn: false
    },
    beds: Array.from({ length: 4 }, (_, i) => ({
        id: i,
        isUnlocked: i < INITIAL_BEDS,
        level: 1,
        capacity: 3, 
        mushroom: null,
        growth: 0,
        health: 100, // New Stat
        moisture: 0,
        installedLamp: null,
        isMutated: false,
        isContaminated: false,
        status: 'empty'
    })),
    dryer: {
        level: 1,
        capacity: 5,
        contents: [],
        isOn: false // New Manual Control
    },
    mortar: {
        input: null,
        quantity: 0,
        progress: 0,
        isGrinding: false,
        speedLevel: 1,
        maxCapacity: 1
    },
    mixer: {
        slot1: null,
        slot2: null,
        progress: 0,
        isMixing: false,
        output: null
    },
    contracts: [],
    // New SciFi Fields
    energy: 100,
    maxEnergy: 100,
    level: 1,
    xp: 0,
    weather: SpaceWeather.None,
    slots: [], // Initialize empty as we use beds for the main game loop
    processorSlots: Array.from({ length: 4 }, (_, i) => ({
        id: i,
        isUnlocked: i < 2,
        contents: null,
        progress: 0
    })),
    synthesizer: {
        slot1: null,
        slot2: null,
        progress: 0,
        isSynthesizing: false,
        output: null
    },
    activeContract: null
  });

  // GAME LOOP
  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => {
        let { cash, suspicion, environment } = prev;
        let newTemp = environment.temperature;
        let newHum = environment.humidity;

        // --- 1. ENVIRONMENT & ELECTRICITY ---
        let energyUsage = 0;
        if (environment.heaterOn) {
            newTemp += 2.5;
            newHum -= 0.5;
            energyUsage += 2;
        } else {
            // Natural cooling/warming to ambient (20C)
            if (newTemp > 20) newTemp -= 0.2; 
            if (newTemp < 20) newTemp += 0.2; 
        }

        if (environment.humidifierOn) {
            newHum += 2.0;
            newTemp -= 0.1;
            energyUsage += 1.5;
        } else {
            if (newHum > 30) newHum -= 0.5; 
        }

        if (environment.ventilationOn) {
            if (newTemp > 20) newTemp -= 1.0;
            if (newHum > 30) newHum -= 1.0;
            energyUsage += 1;
            if (suspicion > 0) suspicion -= 0.1;
        }

        newTemp = Math.max(10, Math.min(100, newTemp));
        newHum = Math.max(10, Math.min(100, newHum));

        if (energyUsage > 2) suspicion += 0.05;
        if (prev.dryer.isOn) suspicion += 0.05;
        
        if (energyUsage === 0 && !prev.dryer.isOn) suspicion = Math.max(0, suspicion - 0.2);
        
        if (Math.random() < 0.05 && energyUsage > 0) cash -= 1;

        if (suspicion >= 100) {
            return {
                ...prev,
                cash: Math.floor(cash * 0.1),
                suspicion: 0,
                inventory: [],
                beds: prev.beds.map(b => ({ ...b, status: 'empty', mushroom: null })),
                dryer: { ...prev.dryer, contents: [] },
                mortar: { ...prev.mortar, input: null, quantity: 0 },
                environment: { ...environment, heaterOn: false, humidifierOn: false, ventilationOn: false },
                credits: Math.floor(prev.credits * 0.1)
            };
        }

        // --- 3. CROP SIMULATION (FORGIVING) ---
        const newBeds = prev.beds.map(bed => {
            if (bed.status !== 'growing' || !bed.mushroom) return bed;
            
            const config = MUSHROOMS[bed.mushroom];
            let newGrowth = bed.growth;
            let newHealth = bed.health;
            let newStatus = bed.status;
            let newMoisture = bed.moisture;

            const tempDiff = Math.abs(newTemp - config.idealTemp);
            const humDiff = Math.abs(newHum - config.idealHumid);
            
            const stress = (Math.max(0, tempDiff - 15) + Math.max(0, humDiff - 15)) / config.resilience;

            // NEW LOGIC: Growth happens even with stress, just slower.
            let growthSpeed = 1;
            if (stress > 0) {
                newHealth -= stress * 0.05; 
                growthSpeed = 0.5; // Penalty: 50% growth speed
            } else {
                if (newHealth < 100) newHealth += 0.5;
                if (tempDiff < 5 && humDiff < 5) growthSpeed = 1.5;
            }

            // Lamp Bonuses
            if (bed.installedLamp === LampType.Heat && newTemp < config.idealTemp) growthSpeed *= 1.2;
            if (bed.installedLamp === LampType.LED) growthSpeed *= 1.2;

            newGrowth += (100 / config.growthTime) * growthSpeed;

            newMoisture -= (config.waterRate * 0.2);
            if (newMoisture <= 0) {
                newMoisture = 0;
                newHealth -= 0.5;
            }

            if (newHealth <= 0) {
                newStatus = 'dead';
                newHealth = 0;
            }

            if (newGrowth >= 100) {
                newGrowth = 100;
                newStatus = 'ready';
            }

            let isContaminated = bed.isContaminated;
            if (!isContaminated && (newHum > 95) && Math.random() < 0.001) isContaminated = true;
            if (isContaminated) newHealth -= 0.2;

            return { 
                ...bed, 
                growth: newGrowth, 
                health: newHealth,
                moisture: newMoisture, 
                status: newStatus,
                isContaminated
            };
        });

        // --- 4. DRYER LOGIC ---
        let newDryer = { ...prev.dryer };
        if (newDryer.isOn) {
            cash -= 0.5;
            newDryer.contents = newDryer.contents.map(batch => {
                if (batch.status === 'burnt') return batch;
                const speed = 1 + (newDryer.level * 0.2);
                const newProgress = batch.progress + ((100 / DRY_TIME) * speed);
                let status = batch.status;
                if (newProgress >= 100 && status === 'drying') status = 'dried';
                if (newProgress >= 200) status = 'burnt';
                return { ...batch, progress: newProgress, status };
            });
        }

        // --- 5. MORTAR & MIXER ---
        let newMortar = { ...prev.mortar };
        if (newMortar.isGrinding) {
            const speedMult = 1 + (newMortar.speedLevel * 0.5); 
            newMortar.progress += ((100 / GRIND_TIME) * speedMult);
            if (newMortar.progress >= 100) {
                newMortar.progress = 100;
                newMortar.isGrinding = false;
            }
        }

        let newMixer = { ...prev.mixer };
        if (newMixer.isMixing) {
            newMixer.progress += (100 / MIX_TIME);
            if (newMixer.progress >= 100) {
                newMixer.progress = 100;
                newMixer.isMixing = false;
                const t1 = MUSHROOMS[newMixer.slot1!].tier;
                const t2 = MUSHROOMS[newMixer.slot2!].tier;
                const avgTier = Math.ceil((t1 + t2) / 2);
                const targetTier = Math.min(5, avgTier); // Simplified
                const candidates = Object.values(MushroomType).filter(m => MUSHROOMS[m].tier === targetTier);
                newMixer.output = candidates[Math.floor(Math.random() * candidates.length)];
            }
        }

        // Contracts
        const newContracts = prev.contracts.map(c => ({...c, timeLeft: c.timeLeft - 1})).filter(c => c.timeLeft > 0);
        if (newContracts.length < 3 && Math.random() < 0.005) {
             const types = Object.values(MushroomType);
             const target = types[Math.floor(Math.random() * types.length)];
             const forms: ('Fresh'|'Dried'|'Powder')[] = ['Fresh', 'Dried', 'Powder'];
             const form = forms[Math.floor(Math.random() * forms.length)];
             const count = Math.floor(Math.random() * 5) + 2;
             const base = MUSHROOMS[target].basePrice;
             let mult = 1.5;
             if(form === 'Dried') mult = 2.5;
             if(form === 'Powder') mult = 4.0;
             newContracts.push({
                 id: Date.now().toString(),
                 item: target, form, count,
                 reward: Math.floor(base * mult * count * 1.5),
                 timeLeft: 500
             });
        }

        return {
            ...prev,
            cash,
            credits: cash,
            suspicion,
            environment: { ...prev.environment, temperature: newTemp, humidity: newHum },
            beds: newBeds,
            dryer: newDryer,
            mortar: newMortar,
            mixer: newMixer,
            contracts: newContracts
        };
      });
    }, TICK_MS);
    return () => clearInterval(timer);
  }, []);

  // --- ACTIONS ---

  const switchLoc = (loc: Location) => setState(p => ({ ...p, location: loc }));

  const toggleHeater = () => setState(p => ({...p, environment: { ...p.environment, heaterOn: !p.environment.heaterOn, ventilationOn: false }}));
  const toggleHumidifier = () => setState(p => ({...p, environment: { ...p.environment, humidifierOn: !p.environment.humidifierOn, ventilationOn: false }}));
  const toggleVent = () => setState(p => ({...p, environment: { ...p.environment, ventilationOn: !p.environment.ventilationOn, heaterOn: false, humidifierOn: false }}));

  // FIXED PLANTBED: Uses itemId to ensure we plant exactly what was clicked
  const plantBed = (bedId: number, itemId: string) => setState(p => {
      const item = p.inventory.find(i => i.id === itemId);
      
      if (!item || item.count <= 0) return p;
      
      const inv = p.inventory.map(i => i.id === itemId ? { ...i, count: i.count - 1 } : i);
      const isHybrid = item.type === ItemType.HybridSpore;
      const mushroomType = item.subType as MushroomType;

      return {
          ...p,
          inventory: inv,
          beds: p.beds.map(bed => bed.id === bedId ? { 
              ...bed, 
              status: 'growing', 
              mushroom: mushroomType, 
              growth: 0, 
              health: 100, 
              moisture: 100, 
              isMutated: isHybrid, // Correctly set mutation for hybrids
              isContaminated: false 
          } : bed)
      };
  });

  const waterBed = (id: number) => setState(p => ({ ...p, beds: p.beds.map(b => b.id === id ? { ...b, moisture: 100 } : b) }));
  
  const installLamp = (id: number, lamp: LampType) => setState(p => {
      const item = p.inventory.find(i => i.type === ItemType.Lamp && i.subType === lamp);
      if (!item || item.count <= 0) return p;
      let newInv = p.inventory.map(i => i === item ? { ...i, count: i.count - 1 } : i);
      const target = p.beds.find(b => b.id === id);
      if (target?.installedLamp) {
          const oldLamp = target.installedLamp;
          const exist = newInv.find(i => i.type === ItemType.Lamp && i.subType === oldLamp);
          if (exist) exist.count++;
          else newInv.push({ id: Date.now().toString(), type: ItemType.Lamp, subType: oldLamp, count: 1 });
      }
      return { ...p, inventory: newInv, beds: p.beds.map(b => b.id === id ? { ...b, installedLamp: lamp } : b) };
  });

  const injectSerum = (id: number, serum: SerumType) => setState(p => {
      const item = p.inventory.find(i => i.type === ItemType.Serum && i.subType === serum);
      if (!item || item.count <= 0) return p;
      const newInv = p.inventory.map(i => i === item ? { ...i, count: i.count - 1 } : i);
      return {
          ...p,
          inventory: newInv,
          beds: p.beds.map(b => {
              if (b.id !== id) return b;
              if (serum === SerumType.GrowthHormone) return { ...b, growth: Math.min(100, b.growth + 50) };
              if (serum === SerumType.MutagenX) return { ...b, isMutated: true };
              return b;
          })
      };
  });

  const treatContamination = (id: number) => setState(p => {
      const item = p.inventory.find(i => i.type === ItemType.Fungicide);
      if (!item || item.count <= 0) return p;
      const newInv = p.inventory.map(i => i === item ? { ...i, count: i.count - 1 } : i);
      return { ...p, inventory: newInv, beds: p.beds.map(b => b.id === id ? { ...b, isContaminated: false } : b) };
  });

  const harvestBed = (id: number) => setState(p => {
      const bed = p.beds.find(x => x.id === id);
      if (!bed || !bed.mushroom) return p;
      const inv = [...p.inventory];
      const exist = inv.find(i => i.type === ItemType.Fresh && i.subType === bed.mushroom); 
      let yieldAmount = Math.floor(bed.capacity * (bed.health / 100));
      if (bed.isMutated) yieldAmount *= 2;
      yieldAmount = Math.max(1, yieldAmount); 

      if (exist) exist.count += yieldAmount; 
      else inv.push({ id: Date.now().toString(), type: ItemType.Fresh, subType: bed.mushroom, count: yieldAmount });

      return {
          ...p,
          inventory: inv,
          beds: p.beds.map(x => x.id === id ? { 
              ...x, status: 'empty', mushroom: null, growth: 0, health: 100, moisture: 0, isMutated: false, installedLamp: null, isContaminated: false
          } : x)
      };
  });
  
  const clearBed = (id: number) => setState(p => ({
      ...p,
      beds: p.beds.map(x => x.id === id ? { ...x, status: 'empty', mushroom: null, growth: 0, health: 100, moisture: 0, isMutated: false, isContaminated: false } : x)
  }));

  const toggleDryer = () => setState(p => ({ ...p, dryer: { ...p.dryer, isOn: !p.dryer.isOn } }));

  const addToDryer = (type: MushroomType) => setState(p => {
      const item = p.inventory.find(i => i.type === ItemType.Fresh && i.subType === type);
      if (!item || item.count <= 0) return p;
      const currentLoad = p.dryer.contents.reduce((acc, b) => acc + b.count, 0);
      const spaceLeft = p.dryer.capacity - currentLoad;
      if (spaceLeft <= 0) return p;
      const toAdd = Math.min(item.count, spaceLeft);
      const newInv = p.inventory.map(i => i === item ? { ...i, count: i.count - toAdd } : i);
      const newContents = [...p.dryer.contents, { id: Date.now().toString(), type, progress: 0, count: toAdd, status: 'drying' as const }];
      return { ...p, inventory: newInv, dryer: { ...p.dryer, contents: newContents } };
  });

  const collectDryer = () => setState(p => {
      const finishedBatches = p.dryer.contents.filter(b => b.status === 'dried');
      const burntBatches = p.dryer.contents.filter(b => b.status === 'burnt');
      const remainingBatches = p.dryer.contents.filter(b => b.status === 'drying');
      
      if (finishedBatches.length === 0 && burntBatches.length === 0) return p;

      const inv = [...p.inventory];
      finishedBatches.forEach(batch => {
          const exist = inv.find(i => i.type === ItemType.Dried && i.subType === batch.type);
          if (exist) exist.count += batch.count;
          else inv.push({ id: Date.now().toString(), type: ItemType.Dried, subType: batch.type, count: batch.count });
      });
      if (burntBatches.length > 0) {
          const trashCount = burntBatches.reduce((acc, b) => acc + b.count, 0);
          const exist = inv.find(i => i.type === ItemType.Burnt);
          if (exist) exist.count += trashCount;
          else inv.push({ id: Date.now().toString(), type: ItemType.Burnt, subType: 'Ash', count: trashCount });
      }

      return {
          ...p,
          inventory: inv,
          dryer: { ...p.dryer, contents: remainingBatches }
      };
  });

  const fillMortar = (type: MushroomType) => setState(p => {
      if (p.mortar.input && p.mortar.input !== type) return p;
      if (p.mortar.quantity >= p.mortar.maxCapacity) return p;
      if (p.mortar.progress > 0 && p.mortar.progress < 100) return p;
      const item = p.inventory.find(i => i.type === ItemType.Dried && i.subType === type);
      if (!item || item.count <= 0) return p;
      const newInv = p.inventory.map(i => i === item ? { ...i, count: i.count - 1 } : i);
      return { ...p, inventory: newInv, mortar: { ...p.mortar, input: type, quantity: p.mortar.quantity + 1, progress: 0, isGrinding: true } };
  });

  const collectPowder = () => setState(p => {
      if (!p.mortar.input || p.mortar.progress < 100) return p;
      const inv = [...p.inventory];
      const exist = inv.find(i => i.type === ItemType.Powder && i.subType === p.mortar.input);
      if (exist) exist.count += p.mortar.quantity; 
      else inv.push({ id: Date.now().toString(), type: ItemType.Powder, subType: p.mortar.input!, count: p.mortar.quantity });
      return { ...p, inventory: inv, mortar: { ...p.mortar, input: null, quantity: 0, progress: 0, isGrinding: false } };
  });

  const addToMixer = (type: MushroomType) => setState(p => {
      const item = p.inventory.find(i => i.type === ItemType.Powder && i.subType === type);
      if (!item || item.count <= 0) return p;
      if (p.mixer.slot1 && p.mixer.slot2) return p;
      const newInv = p.inventory.map(i => i === item ? { ...i, count: i.count - 1 } : i);
      let newMixer = { ...p.mixer };
      if (!newMixer.slot1) newMixer.slot1 = type; else newMixer.slot2 = type;
      return { ...p, inventory: newInv, mixer: newMixer };
  });

  const startMix = () => setState(p => ({ ...p, mixer: { ...p.mixer, isMixing: true, progress: 0 } }));

  const collectMix = () => setState(p => {
      if (!p.mixer.output) return p;
      const inv = [...p.inventory];
      const exist = inv.find(i => i.type === ItemType.HybridSpore && i.subType === p.mixer.output);
      if (exist) exist.count++; else inv.push({ id: Date.now().toString(), type: ItemType.HybridSpore, subType: p.mixer.output, count: 1 });
      return { ...p, inventory: inv, mixer: { slot1: null, slot2: null, progress: 0, isMixing: false, output: null } };
  });

  const clearMixer = () => setState(p => {
      const inv = [...p.inventory];
      if (p.mixer.slot1) {
          const i = inv.find(x => x.type === ItemType.Powder && x.subType === p.mixer.slot1);
          if (i) i.count++; else inv.push({ id: Date.now().toString(), type: ItemType.Powder, subType: p.mixer.slot1!, count: 1 });
      }
      if (p.mixer.slot2) {
          const i = inv.find(x => x.type === ItemType.Powder && x.subType === p.mixer.slot2);
          if (i) i.count++; else inv.push({ id: Date.now().toString(), type: ItemType.Powder, subType: p.mixer.slot2!, count: 1 });
      }
      return { ...p, inventory: inv, mixer: { slot1: null, slot2: null, progress: 0, isMixing: false, output: null } };
  });

  const buy = (type: ItemType, subType: string, price: number) => setState(p => {
      if (p.cash < price) return p;
      const inv = [...p.inventory];
      const exist = inv.find(i => i.type === type && i.subType === subType);
      if (exist) exist.count++; else inv.push({ id: Date.now().toString(), type, subType, count: 1 });
      return { ...p, cash: p.cash - price, credits: p.cash - price, inventory: inv, suspicion: p.suspicion + 2 };
  });

  const sell = (itemId: string, price: number) => setState(p => {
      const item = p.inventory.find(i => i.id === itemId);
      if (!item || item.count <= 0) return p;
      const suspicionGain = Math.min(20, item.count * 2);
      return {
          ...p,
          cash: p.cash + price,
          credits: p.cash + price,
          suspicion: p.suspicion + suspicionGain,
          inventory: p.inventory.filter(i => i.id !== itemId)
      };
  });

  const bribePolice = () => setState(p => {
      if (p.cash < BRIBE_COST) return p;
      return { ...p, cash: p.cash - BRIBE_COST, credits: p.cash - BRIBE_COST, suspicion: Math.max(0, p.suspicion - 30) };
  });

  const buyRack = (price: number) => setState(p => {
      if (p.cash < price) return p;
      const lockedBedIndex = p.beds.findIndex(b => !b.isUnlocked);
      if (lockedBedIndex === -1) return p;
      const newBeds = [...p.beds];
      newBeds[lockedBedIndex].isUnlocked = true;
      return { ...p, cash: p.cash - price, credits: p.cash - price, beds: newBeds };
  });

  const upgradeMortar = (price: number) => setState(p => {
      if (p.cash < price) return p;
      const targetBed = p.beds.find(b => b.isUnlocked && b.level < 3);
      if (!targetBed) return p;
      const newBeds = p.beds.map(b => {
          if (b.id === targetBed.id) {
              const newLevel = b.level + 1;
              let newCap = b.capacity;
              if (newLevel === 2) newCap = 5;
              if (newLevel === 3) newCap = 8;
              return { ...b, level: newLevel, capacity: newCap };
          }
          return b;
      });
      return { ...p, cash: p.cash - price, credits: p.cash - price, beds: newBeds };
  });
  
  const upgradeMortarCapacity = (price: number) => setState(p => {
      if (p.cash < price) return p;
      return { ...p, cash: p.cash - price, credits: p.cash - price, dryer: { ...p.dryer, level: p.dryer.level + 1, capacity: p.dryer.capacity + 5 } };
  });

  const fulfillContract = (contractId: string) => setState(p => {
      const contract = p.contracts.find(c => c.id === contractId);
      if (!contract) return p;
      let type: ItemType = ItemType.Fresh;
      if (contract.form === 'Dried') type = ItemType.Dried;
      if (contract.form === 'Powder') type = ItemType.Powder;
      const item = p.inventory.find(i => i.type === type && i.subType === contract.item);
      if (!item || item.count < contract.count) return p;
      const inv = p.inventory.map(i => i === item ? { ...i, count: i.count - contract.count } : i);
      return { ...p, cash: p.cash + contract.reward, credits: p.cash + contract.reward, inventory: inv, contracts: p.contracts.filter(c => c.id !== contractId) };
  });

  if (state.suspicion >= 100) {
      return (
          <div className="h-screen w-full bg-red-900 flex items-center justify-center flex-col text-white font-mono p-8 text-center animate-pulse">
              <Siren size={128} className="mb-8" />
              <h1 className="text-6xl font-bold mb-4">RAID!</h1>
              <p className="text-xl mb-8">Authorities have seized your assets.</p>
              <button onClick={() => window.location.reload()} className="bg-black border-2 border-white px-8 py-4 text-xl hover:bg-white hover:text-black">
                  RESTART OPERATION
              </button>
          </div>
      )
  }

  return (
    <div className="h-full flex flex-col relative text-stone-200">
      <GlobalSVGDefs />
      <div className="bg-[#1c1917] p-3 border-b-2 border-[#44403c] flex justify-between items-center z-50 shadow-md">
           <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold tracking-widest text-stone-400 font-mono">BM_OS <span className="text-xs text-red-500">v2.3 HOTFIX</span></h1>
           </div>
      </div>

      <main className="flex-1 overflow-hidden relative bg-[#0c0a09]">
          {state.location === Location.Basement && (
              <Basement 
                state={state} 
                onPlant={plantBed} 
                onWater={waterBed} 
                onHarvest={harvestBed}
                onInstallLamp={installLamp}
                onInjectSerum={injectSerum}
                onTreat={treatContamination}
                onClear={clearBed}
                onToggleHeater={toggleHeater}
                onToggleHumidifier={toggleHumidifier}
                onToggleVent={toggleVent}
              />
          )}
          {state.location === Location.Kitchen && (
              <Kitchen 
                state={state} 
                onDry={addToDryer} 
                onCollectDry={collectDryer} 
                onToggleDryer={toggleDryer}
                onGrind={fillMortar}
                onCollectPowder={collectPowder}
                onAddToMixer={addToMixer}
                onMix={startMix}
                onCollectMix={collectMix}
                onClearMixer={clearMixer}
              />
          )}
          {state.location === Location.Alley && (
              <Alley 
                  state={state} 
                  onBuy={buy} 
                  onSell={sell} 
                  onBuyRack={buyRack}
                  onUpgradeMortar={upgradeMortar}
                  onUpgradeMortarCapacity={upgradeMortarCapacity}
                  onFulfillContract={fulfillContract}
                  onBribe={bribePolice}
              />
          )}
      </main>

      <nav className="h-20 bg-[#292524] border-t-4 border-[#1c1917] flex justify-center items-center gap-2 p-2 shadow-[0_-5px_10px_rgba(0,0,0,0.5)] z-50">
           <button onClick={() => switchLoc(Location.Basement)} className={`h-full flex-1 max-w-[120px] rounded flex flex-col items-center justify-center gap-1 transition-all ${state.location === Location.Basement ? 'bg-[#44403c] border-b-4 border-red-900 text-red-100 mt-2 shadow-inner' : 'bg-[#1c1917] hover:bg-[#292524] text-stone-500 border-b-4 border-[#0c0a09]'}`}><Sprout size={20} /><span className="text-[10px] font-bold tracking-wider">BASEMENT</span></button>
           <button onClick={() => switchLoc(Location.Kitchen)} className={`h-full flex-1 max-w-[120px] rounded flex flex-col items-center justify-center gap-1 transition-all ${state.location === Location.Kitchen ? 'bg-[#44403c] border-b-4 border-amber-900 text-amber-100 mt-2 shadow-inner' : 'bg-[#1c1917] hover:bg-[#292524] text-stone-500 border-b-4 border-[#0c0a09]'}`}><FlaskConical size={20} /><span className="text-[10px] font-bold tracking-wider">KITCHEN</span></button>
           <button onClick={() => switchLoc(Location.Alley)} className={`h-full flex-1 max-w-[120px] rounded flex flex-col items-center justify-center gap-1 transition-all ${state.location === Location.Alley ? 'bg-[#44403c] border-b-4 border-green-900 text-green-100 mt-2 shadow-inner' : 'bg-[#1c1917] hover:bg-[#292524] text-stone-500 border-b-4 border-[#0c0a09]'}`}><ShoppingCart size={20} /><span className="text-[10px] font-bold tracking-wider">ALLEY</span></button>
      </nav>

      <HUD state={state} />
    </div>
  );
};

export default App;
