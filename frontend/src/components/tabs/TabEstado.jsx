import React from 'react';
import StatDiamond from '../stats/StatDiamond';
import SquareStat from '../stats/SquareStat';

const ATTR_LABELS = {
  fuerza: 'FUERZA', fortaleza: 'FORTALEZA', destreza: 'DESTREZA',
  atletismo: 'ATLETISMO', persuacion: 'PERSUACIÓN', presencia: 'PRESENCIA',
  carisma: 'CARISMA', astucia: 'ASTUCIA', percepcion: 'PERCEPCIÓN'
};

const DONES_LABELS = {
  entropia: 'ENTROPÍA', reaccion: 'REACCIÓN', vibracionM: 'VIBRACIÓN M.',
  agilidad: 'AGILIDAD', celula: 'CÉLULA', macrofago: 'MACRÓFAGO',
  empatia: 'EMPATÍA', neutrofilo: 'NEUTRÓFILO', predictor: 'PREDICTOR'
};

const VIRT_LABELS = {
  autocontrol: 'AUTOCONTROL', alerta: 'ALERTA', valentia: 'VALENTÍA'
};

const popCount = n => { let c = 0, v = n >>> 0; while (v) { c += v & 1; v >>>= 1; } return c; };

export default function TabEstado({ data, update }) {
  const { atributos, dones, virtudes, estados_vitales: ev, metapsicosis, capacidadCarga, combate } = data;

  const updateStat = (section, key, val, blocked) =>
    update(section, key, { val, blocked });

  const renderVirtud = (key) => {
    const stat = virtudes[key];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div className="stat-row">
          <span className="stat-row__label">{VIRT_LABELS[key]}</span>
          <StatDiamond
            value={stat.val} blockedBits={stat.blocked} max={5}
            onChange={v => update('virtudes', key, { ...stat, val: v })}
            onToggleBlock={b => update('virtudes', key, { ...stat, blocked: b })}
          />
        </div>
        <div className="field-row field-row--2">
          <div className="field-group">
            <label className="hud-label" style={{ fontSize: '0.55rem' }}>DIFICULTAD_CD</label>
            <input className="cyber-input cyber-input--sm" value={stat.cd}
              onChange={e => update('virtudes', key, { ...stat, cd: e.target.value })} />
          </div>
          <div className="field-group">
            <label className="hud-label" style={{ fontSize: '0.55rem' }}>COSTE_SINCRO</label>
            <input className="cyber-input cyber-input--sm" value={stat.costo}
              onChange={e => update('virtudes', key, { ...stat, costo: e.target.value })} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="form-section">

      {/* ── METAPSICOSIS + CAPACIDAD DE CARGA ──────────────── */}
      <div className="form-grid--2">
        <div className="glass-panel">
          <div className="hud-label" style={{ marginBottom: '1.2rem', color: 'var(--neon-cyan)' }}>[ NÚCLEO_METAPSICOSIS ]</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <StatDiamond value={metapsicosis} max={7} onChange={v => update('metapsicosis', null, v)} />
            <div className="field-group" style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.5rem' }}>
              <label className="hud-label" style={{ fontSize: '0.5rem' }}>ÍNDICE_ACTIVO</label>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: 'var(--neon-cyan)' }}>
                {popCount(metapsicosis)} / 7
              </div>
            </div>
          </div>
        </div>
        <div className="glass-panel">
          <div className="hud-label" style={{ marginBottom: '1.2rem', color: 'var(--neon-cyan)' }}>[ CAPACIDAD_DE_CARGA ]</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <StatDiamond value={capacidadCarga} max={8} onChange={v => update('capacidadCarga', null, v)} />
            <div className="field-group" style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.5rem' }}>
              <label className="hud-label" style={{ fontSize: '0.5rem' }}>CARGA_MÁXIMA</label>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: 'var(--neon-cyan)' }}>
                {popCount(capacidadCarga)} / 8
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ATRIBUTOS + DONES ───────────────────────────────── */}
      <div className="form-grid--2">
        <div className="glass-panel" style={{ borderTop: '2px solid var(--neon-cyan)' }}>
          <div className="hud-label" style={{ marginBottom: '1.5rem' }}>MATRIZ_ATRIBUTOS</div>
          <div className="form-section" style={{ gap: '1rem' }}>
            {Object.entries(atributos).map(([key, stat]) => (
              <div key={key} className="stat-row">
                <span className="stat-row__label">{ATTR_LABELS[key]}</span>
                <StatDiamond
                  value={stat.val} blockedBits={stat.blocked} max={5}
                  firstLocked lastDashed
                  onChange={v => updateStat('atributos', key, v, stat.blocked)}
                  onToggleBlock={b => updateStat('atributos', key, stat.val, b)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ borderTop: '2px solid var(--neon-magenta)' }}>
          <div className="hud-label" style={{ marginBottom: '1.5rem' }}>SINTAXIS_DE_DONES</div>
          <div className="form-section" style={{ gap: '1rem' }}>
            {Object.entries(dones).map(([key, stat]) => (
              <div key={key} className="stat-row">
                <span className="stat-row__label">{DONES_LABELS[key]}</span>
                <StatDiamond
                  value={stat.val} blockedBits={stat.blocked} max={2}
                  onChange={v => updateStat('dones', key, v, stat.blocked)}
                  onToggleBlock={b => updateStat('dones', key, stat.val, b)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RESISTENCIA ────────────────────────────────────── */}
      <div className="glass-panel" style={{ borderTop: '2px solid var(--neon-magenta)' }}>
        <div className="hud-label" style={{ marginBottom: '2rem' }}>ESTADOS_VITALES_&amp;_RESISTENCIA</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', columnGap: '3rem', rowGap: '3rem' }}>

          {/* VIGOR | AUTOCONTROL */}
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <label className="hud-label" style={{ minWidth: '120px', paddingTop: '6px' }}>VIGOR</label>
            <SquareStat value={ev.vigor} max={20} rows={2} markers={[1, 2, 3]}
              onChange={v => update('estados_vitales', 'vigor', v)} />
          </div>
          <div style={{ paddingLeft: '2rem', borderLeft: '1px solid var(--glass-border)' }}>
            {renderVirtud('autocontrol')}
          </div>

          {/* CONSTITUCIÓN | ALERTA */}
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <label className="hud-label" style={{ minWidth: '120px', paddingTop: '6px' }}>CONSTITUCIÓN</label>
            <SquareStat value={ev.constitucion} max={10} rows={1} markers={[1, 2, 3]}
              onChange={v => update('estados_vitales', 'constitucion', v)} />
          </div>
          <div style={{ paddingLeft: '2rem', borderLeft: '1px solid var(--glass-border)' }}>
            {renderVirtud('alerta')}
          </div>

          {/* CORDURA | VALENTÍA */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px auto 40px 1fr', columnGap: '1rem', rowGap: '12px', alignItems: 'center' }}>
              <label className="hud-label" style={{ color: 'var(--neon-cyan)' }}>CORDURA</label>
              <div />
              <div />
              <label className="hud-label" style={{ fontSize: '0.6rem', opacity: 0.6 }}>DAÑO_PSÍQUICO</label>

              {[1, 2, 3, 4].map(nv => (
                <React.Fragment key={nv}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                    NV_0{nv}
                  </span>
                  <SquareStat
                    value={ev.cordura[`nv${nv}`]} max={5} rows={1}
                    markers={nv === 1 ? [1, 2, 3] : []}
                    onChange={v => update('estados_vitales', `cordura.nv${nv}`, v)}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textAlign: 'center', opacity: 0.5 }}>
                    {nv * 5}
                  </span>
                  <input
                    className="cyber-input cyber-input--sm"
                    style={{ color: 'var(--neon-magenta)' }}
                    placeholder="Diagnóstico..."
                    value={ev.corduraNotas[`nv${nv}`]}
                    onChange={e => update('estados_vitales', `corduraNotas.nv${nv}`, e.target.value)}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
          <div style={{ paddingLeft: '2rem', borderLeft: '1px solid var(--glass-border)' }}>
            {renderVirtud('valentia')}
          </div>

        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <label className="hud-label" style={{ minWidth: '120px' }}>VOLUNTAD</label>
          <SquareStat value={ev.voluntad} max={10} rows={1}
            onChange={v => update('estados_vitales', 'voluntad', v)} />
        </div>
      </div>

      {/* ── COMBATE ────────────────────────────────────────── */}
      <div className="glass-panel">
        <div className="hud-label" style={{ marginBottom: '1.5rem' }}>SOFTWARE_DE_COMBATE</div>

        <table className="cyber-table">
          <thead>
            <tr>
              <th>ARTE_MILITAR</th>
              <th style={{ width: '180px' }}>PROCESADOR_ASOCIADO</th>
              <th style={{ width: '80px' }}>NIVEL</th>
              <th>MAESTRÍAS_VINCULADAS</th>
            </tr>
          </thead>
          <tbody>
            {combate.artesDeCombate.map((arte, idx) => (
              <tr key={idx}>
                <td>
                  <input className="cyber-input cyber-input--sm" placeholder="Definir arte..." value={arte.nombre}
                    onChange={e => { const next = [...combate.artesDeCombate]; next[idx] = { ...next[idx], nombre: e.target.value }; update('combate', 'artesDeCombate', next); }} />
                </td>
                <td>
                  <select className="cyber-select" value={arte.subtipo}
                    onChange={e => { const next = [...combate.artesDeCombate]; next[idx] = { ...next[idx], subtipo: e.target.value }; update('combate', 'artesDeCombate', next); }}>
                    <option value="">SIN_PROCESADOR</option>
                    {Object.entries(DONES_LABELS).map(([k, label]) => (
                      <option key={k} value={k}>{label}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <SquareStat value={arte.nv} max={2} rows={1}
                    onChange={v => { const next = [...combate.artesDeCombate]; next[idx] = { ...next[idx], nv: v }; update('combate', 'artesDeCombate', next); }} />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    {[0, 1, 2].map(m => (
                      <input key={m} className="cyber-input cyber-input--sm" style={{ flex: 1 }} placeholder={`M_0${m+1}`}
                        value={combate.maestrias[idx * 3 + m] || ''}
                        onChange={e => { const next = [...combate.maestrias]; next[idx * 3 + m] = e.target.value; update('combate', 'maestrias', next); }} />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
          <label className="hud-label" style={{ marginBottom: '1rem', display: 'block' }}>MÉTODO_MARCIAL_AVANZADO</label>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <input className="cyber-input" style={{ flex: 1 }} placeholder="Identificar método..."
              value={combate.mMarcial.nombre}
              onChange={e => update('combate', 'mMarcial', { ...combate.mMarcial, nombre: e.target.value })} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="hud-label" style={{ marginBottom: 0 }}>RANGO</span>
              <SquareStat value={combate.mMarcial.nv} max={4} rows={1}
                onChange={v => update('combate', 'mMarcial', { ...combate.mMarcial, nv: v })} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
