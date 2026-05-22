import type { CSSProperties } from 'react';
import { TYPE_COLORS, TYPE_NAMES } from '../data/typeChart';
import { TeamAnalysis } from '../lib/teamAnalysis';
import { TypeBadge } from './TypeBadge';

function formatMultiplier(value: number | null): string {
  if (value === null) return '-';
  return `${Number.isInteger(value) ? value : Number(value.toFixed(2))}x`;
}

function multiplierClass(value: number | null): string {
  if (value === null) return 'm-neutral';
  if (value === 0) return 'm-immune';
  if (value < 1) return 'm-resist';
  if (value > 1) return 'm-weak';
  return 'm-neutral';
}

function typeHeaderStyle(type: keyof typeof TYPE_COLORS): CSSProperties {
  return { '--type-color': TYPE_COLORS[type] } as CSSProperties;
}

export function DefensiveSummary({ analysis }: { analysis: TeamAnalysis }) {
  return (
    <section className="analysis-panel">
      <div className="section-heading">
        <h2>Defensivo</h2>
        <span>Debilidades, resistencias e inmunidades</span>
      </div>

      <div className="alert-grid">
        <div>
          <h3>3+ debiles</h3>
          <div className="type-row wrap">
            {analysis.overloadedWeaknesses.length ? (
              analysis.overloadedWeaknesses.map((type) => <TypeBadge key={type} type={type} />)
            ) : (
              <span className="muted">Ninguno</span>
            )}
          </div>
        </div>
        <div>
          <h3>Sin resistencias ni inmunidades</h3>
          <div className="type-row wrap">
            {analysis.uncoveredDefensiveTypes.length ? (
              analysis.uncoveredDefensiveTypes.map((type) => <TypeBadge key={type} type={type} />)
            ) : (
              <span className="muted">Ninguno</span>
            )}
          </div>
        </div>
      </div>

      <div className="matrix-legend" aria-label="Leyenda defensiva">
        <span className="legend-chip m-weak">2x</span>
        <span>debilidad</span>
        <span className="legend-chip m-resist">1/2x</span>
        <span>resistencia</span>
        <span className="legend-chip m-immune">0x</span>
        <span>inmunidad</span>
      </div>

      <div className="table-scroll summary-scroll">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Tipo atacante</th>
              <th>Debiles</th>
              <th>Resisten</th>
              <th>Inmunes</th>
            </tr>
          </thead>
          <tbody>
            {analysis.defenseSummary.map((summary) => (
              <tr key={summary.type}>
                <td>
                  <TypeBadge type={summary.type} />
                </td>
                <td>
                  <span className={summary.weak ? 'count-pill danger' : 'count-pill'}>{summary.weak}</span>
                </td>
                <td>
                  <span className={summary.resist ? 'count-pill good' : 'count-pill'}>{summary.resist}</span>
                </td>
                <td>
                  <span className={summary.immune ? 'count-pill immune' : 'count-pill'}>{summary.immune}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-scroll wide-table type-chart-scroll">
        <table className="type-matrix">
          <thead>
            <tr>
              <th>Pokemon</th>
              {TYPE_NAMES.map((type) => (
                <th className="type-axis-heading" key={type} style={typeHeaderStyle(type)}>
                  <span>{type}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {analysis.defenses.map((defense) => (
              <tr key={defense.slot}>
                <td>
                  <strong>{defense.pokemon?.name ?? defense.member.pokemon ?? `Slot ${defense.slot + 1}`}</strong>
                  {defense.notes.length > 0 && <small>{defense.notes.join(' · ')}</small>}
                </td>
                {TYPE_NAMES.map((type) => {
                  const value = defense.multipliers[type];
                  return (
                    <td key={type} className={`multiplier-cell ${multiplierClass(value)}`}>
                      {formatMultiplier(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
