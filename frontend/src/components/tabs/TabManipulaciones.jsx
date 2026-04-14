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
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {[['clanes', 'CLAN'], ['esferas', 'ESFERAS']].map(([id, label]) => (
          <button
            key={id}
            className={`cyber-button ${subTab === id ? 'active' : ''}`}
            onClick={() => setSubTab(id)}
            style={{ minWidth: '200px' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── CLANES ─────────────────────────────────────────── */}
      {subTab === 'clanes' && (
        <div className="form-section">
          {/* Selector de clan */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            {Object.keys(CLAN_MANIPULATIONS).map(clan => {
              const cc = CLAN_COLORS[clan] || CLAN_COLORS.PARTICULARES;
              const isActive = activeClan === clan;
              return (
                <button
                  key={clan}
                  className="cyber-button"
                  style={{
                    fontSize: '0.7rem', padding: '0.4rem 1rem',
                    color: isActive ? cc.primary : undefined,
                    borderColor: isActive ? cc.primary : undefined,
                    boxShadow: isActive ? `0 0 12px ${cc.glow}, inset 0 0 8px ${cc.glow}` : undefined,
                  }}
                  onClick={() => setActiveClan(clan)}
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
              <div className="form-grid--auto">
                {(CLAN_MANIPULATIONS[activeClan] || []).map((cat, i) => (
                  <div key={i} className="glass-panel" style={{ borderTop: `2px solid ${cc.primary}` }}>
                    <div className="section-header" style={{ fontSize: '0.7rem', color: cc.primary, borderBottomColor: `${cc.primary}33` }}>
                      {cat.category.toUpperCase()}
                    </div>
                    <div className="form-section" style={{ gap: '0.7rem' }}>
                      {cat.powers.map(p => (
                        <div key={p} className="stat-row">
                          <span style={{ fontSize: '0.82rem' }}>{p}</span>
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
        <div className="form-section">
          <div className="form-grid--auto">
            {Object.entries(SPHERE_MANIPULATIONS.LISTS).map(([sphere, powers]) => {
              const circuloVal = manipulaciones.esferas.circulos?.[sphere] || 0;
              return (
                <div key={sphere} className="glass-panel glass-panel--top-magenta">
                  {/* 4 círculos marcables */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '0.6rem', justifyContent: 'center' }}>
                    {[0, 1, 2, 3].map(bit => {
                      const filled = (circuloVal & (1 << bit)) !== 0;
                      return (
                        <button
                          key={bit}
                          type="button"
                          onClick={() => updateSphereCircle(sphere, bit)}
                          style={{
                            width: '18px', height: '18px',
                            borderRadius: '50%',
                            border: `1px solid var(--neon-magenta)`,
                            background: filled ? 'var(--neon-magenta)' : 'transparent',
                            boxShadow: filled ? '0 0 8px var(--neon-magenta)' : 'none',
                            cursor: 'pointer',
                            padding: 0,
                            flexShrink: 0,
                            transition: 'all 0.15s ease',
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="section-header section-header--magenta" style={{ fontSize: '0.7rem' }}>{sphere}</div>
                  <div className="form-section" style={{ gap: '0.7rem' }}>
                    {powers.map(p => (
                      <div key={p} className="stat-row">
                        <span style={{ fontSize: '0.8rem' }}>{p}</span>
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

          <div>
            <div className="section-header section-header--cyan" style={{ textAlign: 'center' }}>[ COMBINADAS ]</div>
            <div className="form-grid--auto">
              {SPHERE_MANIPULATIONS.COMBINED.map(group => (
                <div key={group.category} className="glass-panel glass-panel--top-cyan">
                  <div className="section-header section-header--cyan" style={{ fontSize: '0.7rem' }}>{group.category}</div>
                  <div className="form-section" style={{ gap: '0.7rem' }}>
                    {group.powers.map(p => (
                      <div key={p} className="stat-row">
                        <span style={{ fontSize: '0.8rem' }}>{p}</span>
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
