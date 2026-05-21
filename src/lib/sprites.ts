import { PokemonInfo } from './dex';

export function showdownAnimatedSpriteUrl(spriteId: string): string {
  return `https://play.pokemonshowdown.com/sprites/ani/${spriteId}.gif`;
}

export function pokeApiSpriteUrl(pokemonNumber: number): string | null {
  if (!pokemonNumber || pokemonNumber <= 0) return null;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonNumber}.png`;
}

export function spriteCandidates(pokemon: PokemonInfo | null): string[] {
  if (!pokemon) return [];
  const fallback = pokeApiSpriteUrl(pokemon.num);
  return [showdownAnimatedSpriteUrl(pokemon.spriteId), ...(fallback ? [fallback] : [])];
}
