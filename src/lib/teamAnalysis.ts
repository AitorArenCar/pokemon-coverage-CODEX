import { TYPE_NAMES, PokemonType } from '../data/typeChart';
import { getAbility, getItem, getMove, getPokemon, MoveInfo, PokemonInfo } from './dex';
import { defensiveMultiplier, offensiveMultiplierAgainstSingleType } from './typeEffectiveness';
import { TeamMember } from './teamTypes';

export interface MemberDefense {
  slot: number;
  member: TeamMember;
  pokemon: PokemonInfo | null;
  abilityExists: boolean;
  itemExists: boolean;
  multipliers: Record<PokemonType, number | null>;
  notes: string[];
}

export interface DefenseTypeSummary {
  type: PokemonType;
  weak: number;
  resist: number;
  immune: number;
}

export interface MoveAnalysis {
  slot: number;
  pokemonName: string;
  inputName: string;
  move: MoveInfo | null;
  multipliers: Record<PokemonType, number | null>;
  notes: string[];
}

export interface TeamAnalysis {
  defenses: MemberDefense[];
  defenseSummary: DefenseTypeSummary[];
  overloadedWeaknesses: PokemonType[];
  uncoveredDefensiveTypes: PokemonType[];
  moves: MoveAnalysis[];
  offensiveCoverage: PokemonType[];
  missingOffensiveCoverage: PokemonType[];
}

function emptyMultiplierRecord(value: number | null): Record<PokemonType, number | null> {
  return Object.fromEntries(TYPE_NAMES.map((type) => [type, value])) as Record<PokemonType, number | null>;
}

function analyzeDefense(member: TeamMember, slot: number): MemberDefense {
  const pokemon = getPokemon(member.pokemon);
  const ability = member.ability ? getAbility(member.ability) : { exists: true };
  const item = member.item ? getItem(member.item) : { exists: true };
  const multipliers = emptyMultiplierRecord(null);
  const notes: string[] = [];

  if (pokemon) {
    TYPE_NAMES.forEach((type) => {
      const result = defensiveMultiplier(type, pokemon.types, member.ability);
      multipliers[type] = result.multiplier;
      notes.push(...result.notes);
    });
  }

  return {
    slot,
    member,
    pokemon,
    abilityExists: ability.exists,
    itemExists: item.exists,
    multipliers,
    notes: [...new Set(notes)],
  };
}

function analyzeMove(member: TeamMember, slot: number, moveName: string): MoveAnalysis {
  const pokemon = getPokemon(member.pokemon);
  const move = getMove(moveName);
  const multipliers = emptyMultiplierRecord(null);
  const notes: string[] = [];

  if (move) {
    TYPE_NAMES.forEach((type) => {
      const result = offensiveMultiplierAgainstSingleType(move, type);
      multipliers[type] = result.multiplier;
      notes.push(...result.notes);
    });
  }

  return {
    slot,
    pokemonName: pokemon?.name ?? member.pokemon,
    inputName: moveName,
    move,
    multipliers,
    notes: [...new Set(notes)],
  };
}

export function analyzeTeam(team: TeamMember[]): TeamAnalysis {
  const defenses = team.map(analyzeDefense);
  const defenseSummary = TYPE_NAMES.map((type) => {
    const values = defenses
      .map((defense) => defense.multipliers[type])
      .filter((value): value is number => value !== null);

    return {
      type,
      weak: values.filter((value) => value > 1).length,
      resist: values.filter((value) => value > 0 && value < 1).length,
      immune: values.filter((value) => value === 0).length,
    };
  });

  const moves = team.flatMap((member, slot) =>
    member.moves.filter(Boolean).map((moveName) => analyzeMove(member, slot, moveName)),
  );

  const offensiveCoverage = TYPE_NAMES.filter((type) =>
    moves.some((move) => move.move?.category !== 'Status' && (move.multipliers[type] ?? 0) > 1),
  );

  return {
    defenses,
    defenseSummary,
    overloadedWeaknesses: defenseSummary.filter((summary) => summary.weak >= 3).map((summary) => summary.type),
    uncoveredDefensiveTypes: defenseSummary
      .filter((summary) => summary.resist === 0 && summary.immune === 0)
      .map((summary) => summary.type),
    moves,
    offensiveCoverage,
    missingOffensiveCoverage: TYPE_NAMES.filter((type) => !offensiveCoverage.includes(type)),
  };
}
