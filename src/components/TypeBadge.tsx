import type { CSSProperties } from 'react';
import { PokemonType, TYPE_COLORS } from '../data/typeChart';

interface TypeBadgeProps {
  type: PokemonType;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span className="type-badge" style={{ '--type-color': TYPE_COLORS[type] } as CSSProperties}>
      {type}
    </span>
  );
}
