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
      <div className="glass-panel" style={{ borderTop: '2px solid var(--neon-cyan)' }}>
        <div className="hud-label" style={{ marginBottom: '2rem' }}>PULSIONES DE NATURALEZA</div>

        <div className="form-grid--3" style={{ marginBottom: '2.5rem' }}>
          {[['ESTADO INSTINTIVO', 'instinto'], ['SISTEMA LIBERTAD', 'libertad'], ['NÚCLEO HUMANISMO', 'humanismo']].map(([label, key]) => (
            <div key={key} className="field-group" style={{ alignItems: 'center' }}>
              <label className="hud-label" style={{ textAlign: 'center', fontSize: '0.6rem' }}>{label}</label>
              <SquareStat value={naturaleza[key]} max={5} rows={1}
                onChange={v => update('naturaleza', key, v)} />
            </div>
          ))}
        </div>

        <div className="hud-label" style={{ marginBottom: '1.2rem', opacity: 0.5 }}>BITÁCORA DE NATURALEZA</div>
        <div className="form-section" style={{ gap: '0.8rem' }}>
          {naturaleza.notas.map((nota, idx) => (
            <div key={idx} className="field-group">
              <label className="hud-label" style={{ fontSize: '0.5rem' }}>LOG_0{idx + 1}</label>
              <input className="cyber-input" value={nota}
                placeholder="..."
                onChange={e => {
                  const next = [...naturaleza.notas]; next[idx] = e.target.value;
                  update('naturaleza', 'notas', next);
                }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── LA VERDAD ──────────────────────────────────────── */}
      <div className="glass-panel" style={{ borderTop: '2px solid var(--neon-magenta)' }}>
        <div className="hud-label" style={{ marginBottom: '2.5rem' }}>MAPEO DE LA VERDAD</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4rem', alignItems: 'start' }}>
          {/* Pirámide de nodos - Neural Style */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            alignItems: 'center', 
            padding: '2rem',
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            position: 'relative'
          }}>
            {/* Grid background effect */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', backgroundImage: 'radial-gradient(var(--neon-magenta) 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />
            
            {PYRAMID_ROWS.map((row, rowIdx) => (
              <div key={rowIdx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--neon-magenta)', opacity: 0.4, width: '20px', textAlign: 'right' }}>
                  {OMEGA_LABELS[rowIdx]}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {row.map(n => (
                    <button
                      key={n}
                      onClick={() => toggleNodo(n)}
                      title={`Sector ${n}`}
                      style={{
                        width: '26px',
                        height: '26px',
                        border: `1px solid ${laVerdad.nodos[n] ? 'var(--neon-magenta)' : 'rgba(255,255,255,0.1)'}`,
                        background: laVerdad.nodos[n] ? 'var(--neon-magenta)' : 'transparent',
                        color: laVerdad.nodos[n] ? '#000' : 'var(--text-dim)',
                        fontSize: '0.55rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        padding: 0,
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', // Hexagonal shape
                        boxShadow: laVerdad.nodos[n] ? '0 0 10px var(--neon-magenta)' : 'none',
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Banco de Verdades */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="hud-label" style={{ marginBottom: '0.5rem', opacity: 0.6 }}>REGISTRO DE DATOS ADQUIRIDOS</div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem', 
              maxHeight: '600px', 
              overflowY: 'auto',
              paddingRight: '1rem',
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--neon-magenta) transparent'
            }}>
              {Array.from({ length: 42 }, (_, i) => i + 1).map(n => {
                const isActive = laVerdad.nodos[n];
                return (
                  <div key={n} style={{ transition: 'opacity 0.3s ease', opacity: isActive ? 1 : 0.3 }}>
                    <div className="field-group">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.3rem' }}>
                        <span style={{ 
                          width: '8px', height: '8px', 
                          background: isActive ? 'var(--neon-magenta)' : 'transparent',
                          border: '1px solid var(--neon-magenta)',
                          borderRadius: '1px'
                        }} />
                        <label className="hud-label" style={{ fontSize: '0.5rem', marginBottom: 0 }}>VERDAD_HEX_0{n}</label>
                      </div>
                      <textarea
                        className="cyber-input"
                        rows={2}
                        readOnly={!isActive}
                        style={{ 
                          resize: 'none', 
                          fontSize: '0.8rem',
                          background: isActive ? 'rgba(255,0,85,0.02)' : 'transparent',
                          borderColor: isActive ? 'var(--neon-magenta)' : 'var(--glass-border)'
                        }}
                        placeholder={isActive ? "Ingrese decodificación..." : "SECTOR_LOCKED"}
                        value={laVerdad.verdades[n] || ''}
                        onChange={e => updateVerdad(n, e.target.value)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
