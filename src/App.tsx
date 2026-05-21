import { useEffect, useMemo, useState } from 'react';
import { DefensiveSummary } from './components/DefensiveSummary';
import { ImportExportPanel } from './components/ImportExportPanel';
import { OffensiveSummary } from './components/OffensiveSummary';
import { TeamEditor } from './components/TeamEditor';
import { getDexLists } from './lib/dex';
import { analyzeTeam } from './lib/teamAnalysis';
import { createEmptyTeam, normalizeTeam, TeamMember } from './lib/teamTypes';

const STORAGE_KEY = 'randomlocke-team-analyzer:v1';

function loadStoredTeam(): TeamMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyTeam();
    return normalizeTeam(JSON.parse(raw) as TeamMember[]);
  } catch {
    return createEmptyTeam();
  }
}

export default function App() {
  const [team, setTeam] = useState<TeamMember[]>(loadStoredTeam);
  const lists = useMemo(() => getDexLists(), []);
  const analysis = useMemo(() => analyzeTeam(team), [team]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
  }, [team]);

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <h1>Randomlocke Team Analyzer</h1>
          <p>
            Analisis de tipos para equipos Pokemon randomizados: defensas, inmunidades, resistencias y cobertura
            ofensiva sin validar legalidad ni calcular dano.
          </p>
        </div>
      </header>

      <main className="workspace">
        <aside className="side-column">
          <ImportExportPanel team={team} onImport={setTeam} onClear={() => setTeam(createEmptyTeam())} />
        </aside>

        <TeamEditor team={team} lists={lists} onTeamChange={setTeam} />

        <aside className="analysis-column">
          <DefensiveSummary analysis={analysis} />
          <OffensiveSummary analysis={analysis} />
        </aside>
      </main>
    </div>
  );
}
