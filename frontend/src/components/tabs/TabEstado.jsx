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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
            <label className="hud-label">CD</label>
            <input className="cyber-input cyber-input--sm" value={stat.cd}
              onChange={e => update('virtudes', key, { ...stat, cd: e.target.value })} />
          </div>
          <div className="field-group">
            <label className="hud-label">COSTO</label>
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
        <div className="glass-panel glass-panel--cyan">
          <div className="section-header section-header--cyan">[ METAPSICOSIS ]</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
            <StatDiamond value={metapsicosis} max={7} onChange={v => update('metapsicosis', null, v)} />
            <div className="field-group">
              <label className="hud-label">CANTIDAD</label>
              <input
                className="cyber-input cyber-input--sm"
                style={{ width: '52px' }}
                readOnly
                value={popCount(metapsicosis)}
              />
            </div>
          </div>
        </div>
        <div className="glass-panel glass-panel--cyan">
          <div className="section-header section-header--cyan">[ CAPACIDAD_DE_CARGA ]</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
            <StatDiamond value={capacidadCarga} max={8} onChange={v => update('capacidadCarga', null, v)} />
            <div className="field-group">
              <label className="hud-label">CANTIDAD</label>
              <input
                className="cyber-input cyber-input--sm"
                style={{ width: '52px' }}
                readOnly
                value={popCount(capacidadCarga)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── ATRIBUTOS + DONES ───────────────────────────────── */}
      <div className="form-grid--2">
        <div className="glass-panel glass-panel--top-cyan">
          <div className="section-header section-header--cyan">[ ATRIBUTOS ]</div>
          <div className="form-section" style={{ gap: '0.8rem' }}>
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

        <div className="glass-panel glass-panel--top-magenta">
          <div className="section-header section-header--magenta">[ DONES ]</div>
          <div className="form-section" style={{ gap: '0.8rem' }}>
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
      <div className="glass-panel glass-panel--top-magenta">
        <div className="section-header section-header--magenta">[ RESISTENCIA ]</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '2rem', rowGap: '2rem', alignItems: 'stretch' }}>

          {/* Row 1: VIGOR | AUTOCONTROL */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <label className="hud-label" style={{ flexShrink: 0, paddingTop: '4px', minWidth: '110px' }}>VIGOR</label>
            <SquareStat value={ev.vigor} max={20} rows={2} markers={[1, 2, 3]}
              onChange={v => update('estados_vitales', 'vigor', v)} />
          </div>
          <div style={{ paddingLeft: '1.5rem', borderLeft: '1px solid rgba(0,243,255,0.12)', display: 'flex', alignItems: 'center' }}>
            {renderVirtud('autocontrol')}
          </div>

          {/* Row 2: CONSTITUCIÓN | ALERTA */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <label className="hud-label" style={{ flexShrink: 0, paddingTop: '4px', minWidth: '110px' }}>CONSTITUCIÓN</label>
            <SquareStat value={ev.constitucion} max={10} rows={1} markers={[1, 2, 3]}
              onChange={v => update('estados_vitales', 'constitucion', v)} />
          </div>
          <div style={{ paddingLeft: '1.5rem', borderLeft: '1px solid rgba(0,243,255,0.12)', display: 'flex', alignItems: 'center' }}>
            {renderVirtud('alerta')}
          </div>

          {/* Row 3: CORDURA | VALENTÍA */}
          <div>
            {/* Grid de 4 cols: label | casillas | umbral | notas — header + filas alineadas */}
            <div style={{ display: 'grid', gridTemplateColumns: '110px auto 40px auto', columnGap: '1rem', rowGap: '10px', alignItems: 'center' }}>
              <label className="hud-label hud-label--cyan">CORDURA</label>
              <div />
              <div />
              <label className="hud-label hud-label--magenta">DAÑO_ESTRÉS</label>

              {[1, 2, 3, 4].map(nv => (
                <React.Fragment key={nv}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                    NV_{nv}
                  </span>
                  <div style={{ flexShrink: 0 }}>
                    <SquareStat
                      value={ev.cordura[`nv${nv}`]} max={5} rows={1}
                      markers={nv === 1 ? [1, 2, 3] : []}
                      onChange={v => update('estados_vitales', `cordura.nv${nv}`, v)}
                    />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}>
                    {nv * 5}
                  </span>
                  <input
                    className="cyber-input cyber-input--sm cyber-input--magenta cyber-input--center"
                    style={{ width: '100%' }}
                    placeholder="---"
                    value={ev.corduraNotas[`nv${nv}`]}
                    onChange={e => update('estados_vitales', `corduraNotas.nv${nv}`, e.target.value)}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
          <div style={{ paddingLeft: '1.5rem', borderLeft: '1px solid rgba(0,243,255,0.12)', display: 'flex', alignItems: 'center' }}>
            {renderVirtud('valentia')}
          </div>

        </div>

        {/* VOLUNTAD — fuera del grid para evitar celda vacía en columna derecha */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '2rem' }}>
          <label className="hud-label" style={{ minWidth: '110px' }}>VOLUNTAD</label>
          <SquareStat value={ev.voluntad} max={10} rows={1}
            onChange={v => update('estados_vitales', 'voluntad', v)} />
        </div>
      </div>

      {/* ── COMBATE ────────────────────────────────────────── */}
      <div className="glass-panel glass-panel--cyan">
        <div className="section-header section-header--cyan">[ COMBATE ]</div>

        {/* Tabla: ARTE | SUBTIPO | NV | MAESTRÍAS(×3) */}
        <table className="cyber-table" style={{ marginBottom: '1.5rem' }}>
          <thead>
            <tr>
              <th>ARTE DE COMBATE</th>
              <th style={{ width: '140px' }}>SUBTIPO</th>
              <th style={{ width: '60px' }}>NV</th>
              <th>MAESTRÍAS</th>
            </tr>
          </thead>
          <tbody>
            {combate.artesDeCombate.map((arte, idx) => (
              <tr key={idx}>
                <td>
                  <input className="cyber-input cyber-input--sm" placeholder="Arte..." value={arte.nombre}
                    onChange={e => { const next = [...combate.artesDeCombate]; next[idx] = { ...next[idx], nombre: e.target.value }; update('combate', 'artesDeCombate', next); }} />
                </td>
                <td>
                  <select className="cyber-select" value={arte.subtipo}
                    onChange={e => { const next = [...combate.artesDeCombate]; next[idx] = { ...next[idx], subtipo: e.target.value }; update('combate', 'artesDeCombate', next); }}>
                    <option value="">---</option>
                    {Object.entries(DONES_LABELS).map(([k, label]) => (
                      <option key={k} value={k}>{label}</option>
                    ))}
                  </select>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <SquareStat value={arte.nv} max={2} rows={1}
                    onChange={v => { const next = [...combate.artesDeCombate]; next[idx] = { ...next[idx], nv: v }; update('combate', 'artesDeCombate', next); }} />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[0, 1, 2].map(m => (
                      <input key={m} className="cyber-input cyber-input--sm" style={{ flex: 1 }} placeholder="Maestría..."
                        value={combate.maestrias[idx * 3 + m] || ''}
                        onChange={e => { const next = [...combate.maestrias]; next[idx * 3 + m] = e.target.value; update('combate', 'maestrias', next); }} />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* M. MARCIAL */}
        <div>
          <label className="hud-label hud-label--cyan" style={{ marginBottom: '0.8rem' }}>M. MARCIAL</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input className="cyber-input cyber-input--sm" style={{ flex: 1 }} placeholder="Nombre..."
              value={combate.mMarcial.nombre}
              onChange={e => update('combate', 'mMarcial', { ...combate.mMarcial, nombre: e.target.value })} />
            <div>
              <label className="hud-label">NV</label>
              <SquareStat value={combate.mMarcial.nv} max={4} rows={1}
                onChange={v => update('combate', 'mMarcial', { ...combate.mMarcial, nv: v })} />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
