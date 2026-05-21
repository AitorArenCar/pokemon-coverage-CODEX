export interface TeamMember {
  pokemon: string;
  ability: string;
  item: string;
  moves: [string, string, string, string];
}

export const EMPTY_MEMBER: TeamMember = {
  pokemon: '',
  ability: '',
  item: '',
  moves: ['', '', '', ''],
};

export function createEmptyTeam(): TeamMember[] {
  return Array.from({ length: 6 }, () => ({ ...EMPTY_MEMBER, moves: [...EMPTY_MEMBER.moves] }));
}

export function normalizeTeam(team: TeamMember[]): TeamMember[] {
  const normalized = createEmptyTeam();
  team.slice(0, 6).forEach((member, index) => {
    normalized[index] = {
      pokemon: member.pokemon ?? '',
      ability: member.ability ?? '',
      item: member.item ?? '',
      moves: [
        member.moves?.[0] ?? '',
        member.moves?.[1] ?? '',
        member.moves?.[2] ?? '',
        member.moves?.[3] ?? '',
      ],
    };
  });
  return normalized;
}
