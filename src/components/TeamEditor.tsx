import { TeamMember } from '../lib/teamTypes';
import { PokemonSlot } from './PokemonSlot';

interface TeamEditorProps {
  team: TeamMember[];
  lists: {
    pokemon: string[];
    abilities: string[];
    items: string[];
    moves: string[];
  };
  onTeamChange: (team: TeamMember[]) => void;
}

export function TeamEditor({ team, lists, onTeamChange }: TeamEditorProps) {
  const updateMember = (index: number, member: TeamMember) => {
    const nextTeam = [...team];
    nextTeam[index] = member;
    onTeamChange(nextTeam);
  };

  return (
    <section className="editor-panel" aria-label="Editor de equipo">
      <div className="section-heading">
        <h2>Equipo</h2>
        <span>6 slots sin validacion de legalidad</span>
      </div>
      <div className="slots-grid">
        {team.map((member, index) => (
          <PokemonSlot
            key={index}
            index={index}
            member={member}
            lists={lists}
            onChange={(nextMember) => updateMember(index, nextMember)}
          />
        ))}
      </div>
    </section>
  );
}
