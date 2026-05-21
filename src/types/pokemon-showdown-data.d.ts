declare module 'pokemon-showdown/dist/data/abilities' {
  export const Abilities: Record<string, { name: string; isNonstandard?: string }>;
}

declare module 'pokemon-showdown/dist/data/items' {
  export const Items: Record<string, { name: string; isNonstandard?: string }>;
}

declare module 'pokemon-showdown/dist/data/moves' {
  export const Moves: Record<
    string,
    {
      name: string;
      type?: string;
      category?: string;
      basePower?: number;
      isNonstandard?: string;
    }
  >;
}

declare module 'pokemon-showdown/dist/data/pokedex' {
  export const Pokedex: Record<
    string,
    {
      num?: number;
      name: string;
      types?: string[];
      forme?: string;
      baseSpecies?: string;
      isNonstandard?: string;
    }
  >;
}
