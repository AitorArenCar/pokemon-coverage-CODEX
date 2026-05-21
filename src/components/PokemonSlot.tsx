import { useEffect, useMemo, useState } from 'react';
import { getAbility, getItem, getMove, getPokemon } from '../lib/dex';
import { spriteCandidates } from '../lib/sprites';
import { TeamMember } from '../lib/teamTypes';
import { AutocompleteInput } from './AutocompleteInput';
import { TypeBadge } from './TypeBadge';

interface PokemonSlotProps {
  index: number;
  member: TeamMember;
  lists: {
    pokemon: string[];
    abilities: string[];
    items: string[];
    moves: string[];
  };
  onChange: (member: TeamMember) => void;
}

function PokemonSprite({ member }: { member: TeamMember }) {
  const pokemon = useMemo(() => getPokemon(member.pokemon), [member.pokemon]);
  const candidates = useMemo(() => spriteCandidates(pokemon), [pokemon]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const current = candidates[candidateIndex];

  useEffect(() => {
    setCandidateIndex(0);
  }, [member.pokemon]);

  if (!pokemon || !current) {
    return <div className="sprite-placeholder">?</div>;
  }

  return (
    <img
      className="pokemon-sprite"
      src={current}
      alt={pokemon.name}
      onError={() => setCandidateIndex((index) => index + 1)}
    />
  );
}

export function PokemonSlot({ index, member, lists, onChange }: PokemonSlotProps) {
  const pokemon = useMemo(() => getPokemon(member.pokemon), [member.pokemon]);
  const ability = useMemo(() => (member.ability ? getAbility(member.ability) : null), [member.ability]);
  const item = useMemo(() => (member.item ? getItem(member.item) : null), [member.item]);

  const update = (patch: Partial<TeamMember>) => onChange({ ...member, ...patch });
  const updateMove = (moveIndex: number, value: string) => {
    const moves = [...member.moves] as TeamMember['moves'];
    moves[moveIndex] = value;
    update({ moves });
  };

  return (
    <article className="slot">
      <div className="slot-header">
        <div className="slot-title">
          <span>Slot {index + 1}</span>
          {pokemon && (
            <div className="type-row">
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
          )}
        </div>
        <PokemonSprite member={member} />
      </div>

      <div className="slot-fields">
        <AutocompleteInput
          label="Pokemon"
          value={member.pokemon}
          options={lists.pokemon}
          placeholder="Pikachu"
          invalid={Boolean(member.pokemon && !pokemon)}
          onChange={(pokemonName) => update({ pokemon: pokemonName })}
        />
        <AutocompleteInput
          label="Habilidad"
          value={member.ability}
          options={lists.abilities}
          placeholder="Levitate"
          invalid={Boolean(member.ability && ability && !ability.exists)}
          onChange={(abilityName) => update({ ability: abilityName })}
        />
        <AutocompleteInput
          label="Objeto"
          value={member.item}
          options={lists.items}
          placeholder="Leftovers"
          invalid={Boolean(member.item && item && !item.exists)}
          onChange={(itemName) => update({ item: itemName })}
        />
      </div>

      <div className="move-grid">
        {member.moves.map((moveName, moveIndex) => {
          const move = moveName ? getMove(moveName) : null;
          return (
            <div className="move-field" key={moveIndex}>
              <AutocompleteInput
                label={`Movimiento ${moveIndex + 1}`}
                value={moveName}
                options={lists.moves}
                placeholder={moveIndex === 0 ? 'Earthquake' : ''}
                invalid={Boolean(moveName && !move)}
                onChange={(nextMove) => updateMove(moveIndex, nextMove)}
              />
              {move && (
                <div className="move-meta">
                  <TypeBadge type={move.type} />
                  <span>{move.category}</span>
                  {move.category !== 'Status' && <span>{move.basePower || '-'}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(member.pokemon && !pokemon) || (ability && !ability.exists) || (item && !item.exists) ? (
        <p className="field-warning">Hay datos no reconocidos. Se conservan, pero no entran en todos los calculos.</p>
      ) : null}
    </article>
  );
}
