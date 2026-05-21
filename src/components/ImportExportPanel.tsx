import { useState } from 'react';
import { exportShowdownTeam, parseShowdownTeam } from '../lib/parser';
import { TeamMember } from '../lib/teamTypes';

interface ImportExportPanelProps {
  team: TeamMember[];
  onImport: (team: TeamMember[]) => void;
  onClear: () => void;
}

const EXAMPLE = `Pikachu @ Leftovers
Ability: Levitate
Tera Type: Electric
EVs: 252 HP / 252 Atk / 4 Spe
Adamant Nature
- Earthquake
- Flying Press
- Thunderbolt
- Ice Beam

Charizard-Mega-X
Ability: Water Absorb
- Flamethrower
- Dragon Claw
- Roost
- Solar Beam`;

export function ImportExportPanel({ team, onImport, onClear }: ImportExportPanelProps) {
  const [text, setText] = useState(EXAMPLE);
  const [status, setStatus] = useState('');

  const importTeam = () => {
    onImport(parseShowdownTeam(text));
    setStatus('Equipo importado.');
  };

  const exportTeam = async () => {
    const output = exportShowdownTeam(team);
    setText(output);
    try {
      await navigator.clipboard.writeText(output);
      setStatus('Equipo exportado y copiado.');
    } catch {
      setStatus('Equipo exportado en el cuadro de texto.');
    }
  };

  return (
    <section className="tools-panel" aria-label="Importar y exportar">
      <div className="section-heading">
        <h2>Importar / exportar</h2>
        <span>Formato Showdown parcial</span>
      </div>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        spellCheck={false}
        aria-label="Texto de equipo Showdown"
      />
      <div className="button-row">
        <button type="button" onClick={importTeam}>
          Importar
        </button>
        <button type="button" onClick={exportTeam}>
          Exportar
        </button>
        <button type="button" className="danger-button" onClick={onClear}>
          Limpiar equipo
        </button>
      </div>
      {status && <p className="status-line">{status}</p>}
    </section>
  );
}
