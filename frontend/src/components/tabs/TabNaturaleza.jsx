import React from 'react';
import SquareStat from '../stats/SquareStat';

// Pirámide de La Verdad — filas con nodos numerados
const PYRAMID_ROWS = [
  [1, 2],
  [3, 4],
  [5, 6, 7],
  [8, 9, 10],
  [11, 12, 13, 14],
  [15, 16, 17, 18],
  [19, 20, 21, 22, 23],
  [24, 25, 26, 27, 28],
  [29, 30, 31, 32, 33, 34],
  [35, 36, 37, 38, 39, 40, 41],
  [42],
];

const OMEGA_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Ω'];

export default function TabNaturaleza({ data, update }) {
  const { naturaleza, laVerdad } = data;

  const toggleNodo = (n) => {
    update('laVerdad', 'nodos', { ...laVerdad.nodos, [n]: !laVerdad.nodos[n] });
  };

  const updateVerdad = (n, val) => {
    update('laVerdad', 'verdades', { ...laVerdad.verdades, [n]: val });
  };

  return (
    <div className="form-section">

      {/* ── NATURALEZA ─────────────────────────────────────── */}
      <div className="glass-panel glass-panel--cyan">
        <div className="section-header section-header--cyan">[ NATURALEZA ]</div>

        <div className="form-grid--3" style={{ marginBottom: '2rem' }}>
          {[['INSTINTO', 'instinto'], ['LIBERTAD', 'libertad'], ['HUMANISMO', 'humanismo']].map(([label, key]) => (
            <div key={key} className="field-group" style={{ alignItems: 'center' }}>
              <label className="hud-label" style={{ textAlign: 'center' }}>{label}</label>
              <SquareStat value={naturaleza[key]} max={5} rows={1}
                onChange={v => update('naturaleza', key, v)} />
            </div>
          ))}
        </div>

        <div className="section-header section-header--cyan" style={{ fontSize: '0.65rem' }}>NOTAS</div>
        <div className="form-section" style={{ gap: '0.8rem' }}>
          {naturaleza.notas.map((nota, idx) => (
            <div key={idx} className="field-group">
              <label className="hud-label">{idx + 1}.</label>
              <input className="cyber-input" value={nota}
                onChange={e => {
                  const next = [...naturaleza.notas]; next[idx] = e.target.value;
                  update('naturaleza', 'notas', next);
                }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── LA VERDAD ──────────────────────────────────────── */}
      <div className="glass-panel glass-panel--top-magenta">
        <div className="section-header section-header--magenta">[ LA VERDAD ]</div>

        <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
          {/* Pirámide de nodos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start', flexShrink: 0 }}>
            {PYRAMID_ROWS.map((row, rowIdx) => (
              <div key={rowIdx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {row.map(n => (
                    <button
                      key={n}
                      onClick={() => toggleNodo(n)}
                      title={`Nodo ${n}`}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: `1.5px solid ${laVerdad.nodos[n] ? 'var(--neon-magenta)' : 'rgba(255,0,85,0.3)'}`,
                        background: laVerdad.nodos[n] ? 'rgba(255,0,85,0.4)' : 'transparent',
                        color: laVerdad.nodos[n] ? 'var(--neon-magenta)' : 'var(--text-dim)',
                        fontSize: '0.6rem',
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer',
                        transition: 'all var(--transition)',
                        padding: 0,
                        flexShrink: 0,
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                {/* Etiqueta Omega */}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)', marginLeft: '8px', flexShrink: 0 }}>
                  {OMEGA_LABELS[rowIdx]}
                </span>
              </div>
            ))}
          </div>

          {/* Contenido de verdades (las primeras 10 visibles en un scroll) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '400px', overflowY: 'auto' }}>
            <label className="hud-label hud-label--magenta" style={{ marginBottom: '0.4rem' }}>VERDADES</label>
            {Array.from({ length: 42 }, (_, i) => i + 1).map(n => (
              <div key={n} className="field-group">
                <label className="hud-label" style={{ fontSize: '0.5rem' }}>VERDAD {n}</label>
                <textarea
                  className="cyber-input"
                  rows={2}
                  style={{ resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }}
                  value={laVerdad.verdades[n] || ''}
                  onChange={e => updateVerdad(n, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
