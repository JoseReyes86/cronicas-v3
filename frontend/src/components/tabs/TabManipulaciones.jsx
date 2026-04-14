import React, { useState } from 'react';
import StatDiamond from '../stats/StatDiamond';
import { CLAN_MANIPULATIONS, SPHERE_MANIPULATIONS } from '../../data/manipulationsCatalog';

const CLAN_COLORS = {
  QUIMERA:      { primary: '#4da6ff', glow: 'rgba(77,166,255,0.35)' },
  ACRACIA:      { primary: '#ffcc00', glow: 'rgba(255,204,0,0.35)'  },
  FIST:         { primary: '#9aaabf', glow: 'rgba(154,170,191,0.35)'},
  CORPORACIÓN:  { primary: '#ff3333', glow: 'rgba(255,51,51,0.35)'  },
  ABISMAL:      { primary: '#39ff14', glow: 'rgba(57,255,20,0.35)'  },
  PARTICULARES: { primary: '#e8eaf0', glow: 'rgba(232,234,240,0.3)' },
};

export default function TabManipulaciones({ data, update }) {
  const [subTab, setSubTab]     = useState('clanes');
  const [activeClan, setActiveClan] = useState(Object.keys(CLAN_MANIPULATIONS)[0]);
  const { manipulaciones } = data;

  const updateClanPower = (power, val) => {
    const next = { ...manipulaciones.clanes, [power]: { val, blocked: manipulaciones.clanes[power]?.blocked || 0 } };
    update('manipulaciones', 'clanes', next);
  };

  const updateSpherePower = (power, val) => {
    const next = { ...manipulaciones.esferas.poderes, [power]: val };
    update('manipulaciones', 'esferas', { ...manipulaciones.esferas, poderes: next });
  };

  const updateSphereCircle = (sphere, bit) => {
    const current = manipulaciones.esferas.circulos?.[sphere] || 0;
    update('manipulaciones', 'esferas', {
      ...manipulaciones.esferas,
      circulos: { ...(manipulaciones.esferas.circulos || {}), [sphere]: current ^ (1 << bit) }
    });
  };

  return (
    <div className="form-section">
      {/* HUD-style Sub-tabs */}
      <div className="tab-bar-secondary no-print" style={{ marginBottom: '2rem' }}>
        {[['clanes', 'UNIDADES_CLAN'], ['esferas', 'ESFERAS_DE_DATOS']].map(([id, label]) => (
          <button
            key={id}
            className={`tab-btn ${subTab === id ? 'active' : ''}`}
            onClick={() => setSubTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── CLANES ─────────────────────────────────────────── */}
      {subTab === 'clanes' && (
        <div className="form-section" style={{ animation: 'fade-up 0.4s ease both' }}>
          {/* Selector de clan - HUD Navigation */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.8rem', 
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)'
          }}>
            {Object.keys(CLAN_MANIPULATIONS).map(clan => {
              const cc = CLAN_COLORS[clan] || CLAN_COLORS.PARTICULARES;
              const isActive = activeClan === clan;
              return (
                <button
                  key={clan}
                  onClick={() => setActiveClan(clan)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    background: isActive ? `${cc.primary}15` : 'transparent',
                    border: `1px solid ${isActive ? cc.primary : 'transparent'}`,
                    color: isActive ? cc.primary : 'var(--text-dim)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: isActive ? `0 0 15px ${cc.glow}` : 'none',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  {clan}
                </button>
              );
            })}
          </div>

          {/* Poderes del clan */}
          {(() => {
            const cc = CLAN_COLORS[activeClan] || CLAN_COLORS.PARTICULARES;
            return (
              <div className="form-grid--auto" style={{ marginTop: '1rem' }}>
                {(CLAN_MANIPULATIONS[activeClan] || []).map((cat, i) => (
                  <div key={i} className="glass-panel" style={{ borderTop: `2px solid ${cc.primary}` }}>
                    <div className="hud-label" style={{ marginBottom: '1.2rem', color: cc.primary }}>
                      {cat.category.toUpperCase()}
                    </div>
                    <div className="form-section" style={{ gap: '0.8rem' }}>
                      {cat.powers.map(p => (
                        <div key={p} className="stat-row">
                          <span className="stat-row__label" style={{ fontSize: '0.75rem' }}>{p}</span>
                          <StatDiamond
                            value={manipulaciones.clanes[p]?.val || 0}
                            max={cat.max}
                            color={cc.primary}
                            onChange={v => updateClanPower(p, v)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── ESFERAS ────────────────────────────────────────── */}
      {subTab === 'esferas' && (
        <div className="form-section" style={{ animation: 'fade-up 0.4s ease both' }}>
          <div className="form-grid--auto">
            {Object.entries(SPHERE_MANIPULATIONS.LISTS).map(([sphere, powers]) => {
              const circuloVal = manipulaciones.esferas.circulos?.[sphere] || 0;
              return (
                <div key={sphere} className="glass-panel" style={{ borderTop: '2px solid var(--neon-magenta)' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '1.2rem', justifyContent: 'center' }}>
                    {[0, 1, 2, 3].map(bit => {
                      const filled = (circuloVal & (1 << bit)) !== 0;
                      return (
                        <button
                          key={bit}
                          type="button"
                          onClick={() => updateSphereCircle(sphere, bit)}
                          style={{
                            width: '16px', height: '16px',
                            border: `1px solid var(--neon-magenta)`,
                            background: filled ? 'var(--neon-magenta)' : 'transparent',
                            boxShadow: filled ? '0 0 10px var(--neon-magenta)' : 'none',
                            cursor: 'pointer',
                            padding: 0,
                            borderRadius: '2px',
                            transition: 'all 0.2s ease',
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="hud-label" style={{ marginBottom: '1.2rem', color: 'var(--neon-magenta)', textAlign: 'center' }}>
                    {sphere}
                  </div>
                  <div className="form-section" style={{ gap: '0.8rem' }}>
                    {powers.map(p => (
                      <div key={p} className="stat-row">
                        <span className="stat-row__label" style={{ fontSize: '0.75rem' }}>{p}</span>
                        <StatDiamond
                          value={manipulaciones.esferas.poderes[p] || 0}
                          max={4}
                          onChange={v => updateSpherePower(p, v)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '3rem' }}>
            <div className="hud-label" style={{ textAlign: 'center', marginBottom: '1.5rem', opacity: 0.6 }}>[ REDES_COMBINADAS ]</div>
            <div className="form-grid--auto">
              {SPHERE_MANIPULATIONS.COMBINED.map(group => (
                <div key={group.category} className="glass-panel" style={{ borderTop: '2px solid var(--neon-cyan)' }}>
                  <div className="hud-label" style={{ marginBottom: '1.2rem' }}>{group.category}</div>
                  <div className="form-section" style={{ gap: '0.8rem' }}>
                    {group.powers.map(p => (
                      <div key={p} className="stat-row">
                        <span className="stat-row__label" style={{ fontSize: '0.75rem' }}>{p}</span>
                        <StatDiamond
                          value={manipulaciones.esferas.poderes[p] || 0}
                          max={group.max}
                          onChange={v => updateSpherePower(p, v)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
