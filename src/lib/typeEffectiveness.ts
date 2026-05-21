import { PokemonType, TYPE_CHART, TYPE_NAMES } from '../data/typeChart';
import { getAbility, getMove, MoveInfo, toId } from './dex';

export interface DefensiveResult {
  multiplier: number;
  notes: string[];
}

export interface OffensiveResult {
  multiplier: number;
  notes: string[];
}

export function baseEffectiveness(attackingType: PokemonType, defendingType: PokemonType): number {
  return TYPE_CHART[attackingType][defendingType] ?? 1;
}

export function defensiveTypeMultiplier(attackingType: PokemonType, defenderTypes: PokemonType[]): number {
  return defenderTypes.reduce((total, defenderType) => total * baseEffectiveness(attackingType, defenderType), 1);
}

export function applyDefensiveAbility(
  attackingType: PokemonType,
  baseMultiplier: number,
  abilityName: string,
): DefensiveResult {
  const ability = getAbility(abilityName);
  const abilityId = ability.exists ? ability.id : toId(abilityName);
  let multiplier = baseMultiplier;
  const notes: string[] = [];

  const immune = (type: PokemonType, note: string) => {
    if (attackingType === type) {
      multiplier = 0;
      notes.push(note);
    }
  };

  switch (abilityId) {
    case 'levitate':
      immune('Ground', 'Levitate: inmunidad a Ground');
      break;
    case 'flashfire':
      immune('Fire', 'Flash Fire: inmunidad a Fire');
      break;
    case 'waterabsorb':
      immune('Water', 'Water Absorb: inmunidad a Water');
      break;
    case 'dryskin':
      if (attackingType === 'Water') {
        multiplier = 0;
        notes.push('Dry Skin: inmunidad a Water');
      }
      if (attackingType === 'Fire') {
        multiplier *= 1.25;
        notes.push('Dry Skin: recibe mas dano de Fire');
      }
      break;
    case 'voltabsorb':
      immune('Electric', 'Volt Absorb: inmunidad a Electric');
      break;
    case 'motordrive':
      immune('Electric', 'Motor Drive: inmunidad a Electric');
      break;
    case 'lightningrod':
      immune('Electric', 'Lightning Rod: inmunidad a Electric');
      break;
    case 'sapsipper':
      immune('Grass', 'Sap Sipper: inmunidad a Grass');
      break;
    case 'thickfat':
      if (attackingType === 'Fire' || attackingType === 'Ice') {
        multiplier *= 0.5;
        notes.push('Thick Fat: Fire/Ice a la mitad');
      }
      break;
    case 'heatproof':
      if (attackingType === 'Fire') {
        multiplier *= 0.5;
        notes.push('Heatproof: Fire a la mitad');
      }
      break;
    case 'wonderguard':
      if (multiplier <= 1) {
        multiplier = 0;
        notes.push('Wonder Guard: solo entran tipos superefectivos');
      }
      break;
    case 'filter':
    case 'solidrock':
    case 'prismarmor':
      if (multiplier > 1) {
        multiplier *= 0.75;
        notes.push(`${ability.name}: reduce dano superefectivo`);
      }
      break;
  }

  return { multiplier, notes };
}

export function defensiveMultiplier(
  attackingType: PokemonType,
  defenderTypes: PokemonType[],
  abilityName: string,
): DefensiveResult {
  return applyDefensiveAbility(attackingType, defensiveTypeMultiplier(attackingType, defenderTypes), abilityName);
}

export function offensiveMultiplierAgainstSingleType(move: MoveInfo, defenderType: PokemonType): OffensiveResult {
  if (move.category === 'Status') {
    return { multiplier: 0, notes: ['Status / no ofensivo'] };
  }

  if (move.id === 'flyingpress') {
    return {
      multiplier: baseEffectiveness('Fighting', defenderType) * baseEffectiveness('Flying', defenderType),
      notes: ['Flying Press: Fighting + Flying'],
    };
  }

  if (move.id === 'freezedry' && defenderType === 'Water') {
    return { multiplier: 2, notes: ['Freeze-Dry: superefectivo contra Water'] };
  }

  if (move.id === 'thousandarrows' && defenderType === 'Flying') {
    return { multiplier: 1, notes: ['Thousand Arrows: golpea a Flying/Levitate'] };
  }

  const notes = move.id === 'thousandarrows' ? ['Thousand Arrows: golpea a Flying/Levitate'] : [];
  return { multiplier: baseEffectiveness(move.type, defenderType), notes };
}

export function isKnownType(type: string): type is PokemonType {
  return TYPE_NAMES.includes(type as PokemonType);
}

export function moveFromName(value: string): MoveInfo | null {
  return getMove(value);
}
