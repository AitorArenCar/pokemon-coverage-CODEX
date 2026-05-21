export const SPANISH_ALIASES: Record<string, string> = {
  levitacion: 'Levitate',
  'absorbe fuego': 'Flash Fire',
  'absorbe agua': 'Water Absorb',
  herbivoro: 'Sap Sipper',
  'absorbe electricidad': 'Volt Absorb',
  pararrayos: 'Lightning Rod',
  sebo: 'Thick Fat',
  superguarda: 'Wonder Guard',
  'plancha voladora': 'Flying Press',
  liofilizacion: 'Freeze-Dry',
  'mil flechas': 'Thousand Arrows',
};

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[._-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function resolveAlias(value: string): string {
  const normalized = normalizeText(value);
  return SPANISH_ALIASES[normalized] ?? value.trim();
}
