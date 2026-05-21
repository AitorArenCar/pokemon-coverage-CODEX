import { canonicalName, getDexLists } from './dex';
import { createEmptyTeam, TeamMember } from './teamTypes';

const IGNORED_PREFIXES = [
  'EVs:',
  'IVs:',
  'Tera Type:',
  'Level:',
  'Shiny:',
  'Happiness:',
  'Gigantamax:',
];

function cleanPokemonName(raw: string): string {
  const withoutGender = raw.replace(/\s+\([MF]\)$/i, '').trim();
  const nicknameMatch = withoutGender.match(/\(([^()]+)\)$/);
  return (nicknameMatch?.[1] ?? withoutGender).trim();
}

function parseHeader(line: string): Pick<TeamMember, 'pokemon' | 'item'> {
  const [pokemonPart, itemPart] = line.split('@').map((part) => part.trim());
  const lists = getDexLists();

  return {
    pokemon: canonicalName(cleanPokemonName(pokemonPart), lists.pokemon),
    item: itemPart ? canonicalName(itemPart, lists.items) : '',
  };
}

export function parseShowdownTeam(input: string): TeamMember[] {
  const team = createEmptyTeam();
  const blocks = input
    .split(/\n\s*\n/g)
    .map((block) => block.trim())
    .filter(Boolean)
    .slice(0, 6);
  const lists = getDexLists();

  blocks.forEach((block, index) => {
    const member: TeamMember = { pokemon: '', ability: '', item: '', moves: ['', '', '', ''] };
    let moveIndex = 0;

    block
      .split(/\r?\n/g)
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line, lineIndex) => {
        if (lineIndex === 0) {
          Object.assign(member, parseHeader(line));
          return;
        }

        if (line.startsWith('Ability:')) {
          member.ability = canonicalName(line.replace(/^Ability:\s*/i, ''), lists.abilities);
          return;
        }

        if (line.startsWith('-') && moveIndex < 4) {
          const move = line.replace(/^-\s*/, '').trim();
          member.moves[moveIndex] = canonicalName(move, lists.moves);
          moveIndex += 1;
          return;
        }

        if (IGNORED_PREFIXES.some((prefix) => line.toLowerCase().startsWith(prefix.toLowerCase()))) {
          return;
        }
      });

    team[index] = member;
  });

  return team;
}

export function exportShowdownTeam(team: TeamMember[]): string {
  return team
    .filter((member) => member.pokemon || member.ability || member.item || member.moves.some(Boolean))
    .map((member) => {
      const lines: string[] = [];
      const pokemon = member.pokemon || 'Unknown';
      lines.push(member.item ? `${pokemon} @ ${member.item}` : pokemon);
      if (member.ability) lines.push(`Ability: ${member.ability}`);
      member.moves.filter(Boolean).forEach((move) => lines.push(`- ${move}`));
      return lines.join('\n');
    })
    .join('\n\n');
}
