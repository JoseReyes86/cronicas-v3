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
      <div className="glass-panel" style={{ borderTop: '2px solid var(--neon-cyan)', padding: '2rem' }}>
        <div className="form-grid--3" style={{ marginBottom: '3rem' }}>
          {[['Instinto', 'instinto'], ['Libertad', 'libertad'], ['Humanismo', 'humanismo']].map(([label, key]) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
              <label className="hud-label" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 0, textAlign: 'center' }}>{label.toUpperCase()}</label>
              <SquareStat value={naturaleza[key]} max={5} rows={1}
                onChange={v => update('naturaleza', key, v)} />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {naturaleza.notas.map((nota, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
              <span className="font-mono" style={{ fontSize: '1rem', color: 'var(--text-primary)', paddingTop: '0.4rem' }}>{idx + 1}.</span>
              <textarea 
                className="cyber-input" 
                rows={2} 
                style={{ 
                   flexGrow: 1, resize: 'none', overflow: 'hidden'
                }}
                value={nota}
                placeholder=""
                onChange={e => {
                  const next = [...naturaleza.notas]; next[idx] = e.target.value;
                  update('naturaleza', 'notas', next);
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── LA VERDAD ──────────────────────────────────────── */}
      <div className="glass-panel" style={{ borderTop: '2px solid var(--neon-magenta)', marginTop: '2rem', padding: '2rem' }}>
        <div className="section-header" style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '2.5rem', color: 'var(--text-primary)', borderBottom: 'none' }}>
          LA VERDAD
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', overflowX: 'auto', paddingBottom: '1rem' }}>
           {PYRAMID_ROWS.map((row, rowIdx) => (
             <div key={rowIdx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '700px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {row.map(n => {
                    const isActive = laVerdad.nodos[n];
                    return (
                      <button
                        className="font-mono"
                        key={n}
                        onClick={() => toggleNodo(n)}
                        style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          border: `1px solid ${isActive ? 'var(--neon-magenta)' : 'var(--text-primary)'}`,
                          background: isActive ? 'var(--neon-magenta)' : 'transparent',
                          color: isActive ? '#000' : 'var(--text-primary)',
                          fontSize: '0.75rem', fontWeight: 'bold',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: isActive ? '0 0 10px var(--neon-magenta)' : 'none',
                          padding: 0, flexShrink: 0
                        }}>
                          {n}
                      </button>
                    )
                  })}
                </div>

                {/* TEXTAREA REMOVIDO POR PETICIÓN DEL USUARIO */}

                <div className="font-mono" style={{
                  width: '32px', height: '32px', flexShrink: 0,
                  border: '1px solid var(--text-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-primary)',
                  marginLeft: 'auto'
                }}>
                  {OMEGA_LABELS[rowIdx]}
                </div>
             </div>
           ))}
        </div>
      </div>

    </div>
  );
}
