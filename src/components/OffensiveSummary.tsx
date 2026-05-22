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

export function OffensiveSummary({ analysis }: { analysis: TeamAnalysis }) {
  return (
    <section className="analysis-panel">
      <div className="section-heading">
        <h2>Ofensivo</h2>
        <span>Cobertura superefectiva por movimientos</span>
      </div>

      <div className="alert-grid">
        <div>
          <h3>Cubre superefectivo</h3>
          <div className="type-row wrap">
            {analysis.offensiveCoverage.length ? (
              analysis.offensiveCoverage.map((type) => <TypeBadge key={type} type={type} />)
            ) : (
              <span className="muted">Ninguno</span>
            )}
          </div>
        </div>
        <div>
          <h3>No cubre superefectivo</h3>
          <div className="type-row wrap">
            {analysis.missingOffensiveCoverage.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>
        </div>
      </div>

      <div className="matrix-legend" aria-label="Leyenda ofensiva">
        <span className="legend-chip m-weak">2x</span>
        <span>superefectivo</span>
        <span className="legend-chip m-resist">1/2x</span>
        <span>poco eficaz</span>
        <span className="legend-chip m-immune">0x</span>
        <span>sin efecto</span>
      </div>

      <div className="move-list">
        {analysis.moves.length ? (
          analysis.moves.map((entry, index) => (
            <div className="move-analysis" key={`${entry.slot}-${entry.inputName}-${index}`}>
              <div>
                <strong>{entry.move?.name ?? entry.inputName}</strong>
                <span>
                  {entry.move
                    ? `${entry.move.category}${entry.move.category !== 'Status' ? ` · ${entry.move.type} · ${entry.move.basePower || '-'}` : ' / no ofensivo'}`
                    : 'Movimiento no reconocido'}
                </span>
              </div>
              {entry.notes.length > 0 && <small>{entry.notes.join(' · ')}</small>}
            </div>
          ))
        ) : (
          <p className="muted">Anade movimientos para ver cobertura.</p>
        )}
      </div>

      <div className="table-scroll wide-table type-chart-scroll">
        <table className="type-matrix">
          <thead>
            <tr>
              <th>Movimiento</th>
              {TYPE_NAMES.map((type) => (
                <th className="type-axis-heading" key={type} style={typeHeaderStyle(type)}>
                  <span>{type}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {analysis.moves.map((entry, index) => (
              <tr key={`${entry.slot}-${entry.inputName}-row-${index}`}>
                <td>
                  <strong>{entry.move?.name ?? entry.inputName}</strong>
                  <small>{entry.pokemonName || `Slot ${entry.slot + 1}`}</small>
                </td>
                {TYPE_NAMES.map((type) => {
                  const value = entry.multipliers[type];
                  const cellClass = entry.move?.category === 'Status' ? 'm-status' : multiplierClass(value);
                  return (
                    <td key={type} className={`multiplier-cell ${cellClass}`}>
                      {entry.move?.category === 'Status' ? '-' : formatMultiplier(value)}
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
