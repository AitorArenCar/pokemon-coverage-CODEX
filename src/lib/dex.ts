import { Abilities } from 'pokemon-showdown/dist/data/abilities';
import { Items } from 'pokemon-showdown/dist/data/items';
import { Moves } from 'pokemon-showdown/dist/data/moves';
import { Pokedex } from 'pokemon-showdown/dist/data/pokedex';
import { resolveAlias } from '../data/aliases';
import { PokemonType, TYPE_NAMES } from '../data/typeChart';

const validTypes = new Set<string>(TYPE_NAMES);

type SpeciesEntry = {
  num?: number;
  name: string;
  types?: string[];
  forme?: string;
  baseSpecies?: string;
};

type NamedEntry = {
  name: string;
  isNonstandard?: string;
};

type MoveEntry = NamedEntry & {
  type?: string;
  category?: string;
  basePower?: number;
};

const speciesData = Pokedex as Record<string, SpeciesEntry>;
const abilitiesData = Abilities as Record<string, NamedEntry>;
const itemsData = Items as Record<string, NamedEntry>;
const movesData = Moves as Record<string, MoveEntry>;

export interface PokemonInfo {
  id: string;
  name: string;
  types: PokemonType[];
  spriteId: string;
  num: number;
}

export interface AbilityInfo {
  id: string;
  name: string;
  exists: boolean;
}

export interface ItemInfo {
  id: string;
  name: string;
  exists: boolean;
}

export interface MoveInfo {
  id: string;
  name: string;
  type: PokemonType;
  category: 'Physical' | 'Special' | 'Status';
  basePower: number;
  exists: boolean;
}

export interface DexLists {
  pokemon: string[];
  abilities: string[];
  items: string[];
  moves: string[];
}

let listsCache: DexLists | null = null;

export function toId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function asType(value: unknown): PokemonType {
  return typeof value === 'string' && validTypes.has(value) ? (value as PokemonType) : 'Normal';
}

function asMoveCategory(value: unknown): MoveInfo['category'] {
  return value === 'Physical' || value === 'Special' || value === 'Status' ? value : 'Status';
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function findEntry<T extends NamedEntry>(data: Record<string, T>, value: string): [string, T] | null {
  const id = toId(resolveAlias(value));
  const direct = data[id];
  if (direct) return [id, direct];

  const found = Object.entries(data).find(([, entry]) => toId(entry.name) === id);
  return found ?? null;
}

function spriteIdFromName(name: string, id: string): string {
  if (!name) return id;
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-mega-x$/, '-megax')
    .replace(/-mega-y$/, '-megay')
    .replace(/^-|-$/g, '');
}

export function getDexLists(): DexLists {
  if (listsCache) return listsCache;

  listsCache = {
    pokemon: uniqueSorted(Object.values(speciesData).map((entry) => entry.name)),
    abilities: uniqueSorted(Object.values(abilitiesData).map((entry) => entry.name)),
    items: uniqueSorted(Object.values(itemsData).map((entry) => entry.name)),
    moves: uniqueSorted(Object.values(movesData).map((entry) => entry.name)),
  };

  return listsCache;
}

export function canonicalName(value: string, options: string[]): string {
  const aliased = resolveAlias(value);
  const id = toId(aliased);
  return options.find((option) => toId(option) === id) ?? aliased;
}

export function getPokemon(value: string): PokemonInfo | null {
  const id = toId(resolveAlias(value));
  const species = speciesData[id] ?? Object.values(speciesData).find((entry) => toId(entry.name) === id);
  if (!species) return null;

  const resolvedId = Object.entries(speciesData).find(([, entry]) => entry === species)?.[0] ?? id;

  return {
    id: resolvedId,
    name: species.name,
    types: (species.types ?? ['Normal']).map(asType),
    spriteId: spriteIdFromName(species.name, resolvedId),
    num: species.num ?? 0,
  };
}

export function getAbility(value: string): AbilityInfo {
  const found = findEntry(abilitiesData, value);
  return {
    id: found?.[0] ?? toId(value),
    name: found?.[1].name ?? value.trim(),
    exists: Boolean(found),
  };
}

export function getItem(value: string): ItemInfo {
  const found = findEntry(itemsData, value);
  return {
    id: found?.[0] ?? toId(value),
    name: found?.[1].name ?? value.trim(),
    exists: Boolean(found),
  };
}

export function getMove(value: string): MoveInfo | null {
  const found = findEntry(movesData, value);
  if (!found) return null;

  const [id, move] = found;
  return {
    id,
    name: move.name,
    type: asType(move.type),
    category: asMoveCategory(move.category),
    basePower: Number(move.basePower) || 0,
    exists: true,
  };
}
