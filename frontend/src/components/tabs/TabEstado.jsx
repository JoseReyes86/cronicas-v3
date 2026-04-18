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
  const { atributos, dones, virtudes, estados_vitales: ev, metapsicosis, combate } = data;

  const updateStat = (section, key, val, blocked) =>
    update(section, key, { val, blocked });

  const atrsGe3 = Object.values(atributos).filter(s => popCount(s?.val || 0) >= 3).length;
  const cargaBoxes = Math.min(1 + atrsGe3, 10);
  const capacidadCarga = (1 << cargaBoxes) - 1;
  const cargaKg = 10 + cargaBoxes * 10;

  const renderVirtud = (key) => {
    const stat = virtudes[key];
    const habs = stat.habilidades || [];
    const addHab = () => update('virtudes', key, { ...stat, habilidades: [...habs, { habilidad: '', cd: '', costo: '' }] });
    const updateHab = (i, field, val) => {
      const next = habs.map((h, idx) => idx === i ? { ...h, [field]: val } : h);
      update('virtudes', key, { ...stat, habilidades: next });
    };
    const removeHab = (i) => update('virtudes', key, { ...stat, habilidades: habs.filter((_, idx) => idx !== i) });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div className="stat-row">
          <span className="stat-row__label">{VIRT_LABELS[key]}</span>
          <StatDiamond
            value={stat.val} blockedBits={stat.blocked} max={5}
            onChange={v => update('virtudes', key, { ...stat, val: v })}
            onToggleBlock={b => update('virtudes', key, { ...stat, blocked: b })}
          />
        </div>
        {habs.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 60px 18px', gap: '4px', alignItems: 'center' }}>
            <span className="hud-label" style={{ fontSize: '0.45rem', marginBottom: 0 }}>HABILIDAD</span>
            <span className="hud-label" style={{ fontSize: '0.45rem', marginBottom: 0 }}>CD</span>
            <span className="hud-label" style={{ fontSize: '0.45rem', marginBottom: 0 }}>COSTO</span>
            <span />
            {habs.map((h, i) => (
              <React.Fragment key={i}>
                <input className="cyber-input cyber-input--sm" value={h.habilidad} placeholder="Habilidad..."
                  onChange={e => updateHab(i, 'habilidad', e.target.value)} style={{ fontSize: '0.7rem', padding: '0.3rem 0.5rem' }} />
                <input className="cyber-input cyber-input--sm" value={h.cd} placeholder="CD"
                  onChange={e => updateHab(i, 'cd', e.target.value)} style={{ fontSize: '0.7rem', padding: '0.3rem 0.4rem' }} />
                <input className="cyber-input cyber-input--sm" value={h.costo} placeholder="0"
                  onChange={e => updateHab(i, 'costo', e.target.value)} style={{ fontSize: '0.7rem', padding: '0.3rem 0.4rem' }} />
                <button className="dynamic-list__remove" onClick={() => removeHab(i)} style={{ fontSize: '0.7rem', lineHeight: 1 }}>×</button>
              </React.Fragment>
            ))}
          </div>
        )}
        <button className="cyber-button cyber-button--add cyber-button--add-cyan"
          onClick={addHab} style={{ fontSize: '0.55rem', padding: '0.3rem 0.8rem' }}>
          + HABILIDAD
        </button>
      </div>
    );
  };

  return (
    <div className="form-section">

      {/* ── CAPACIDAD DE CARGA + METAPSICOSIS ──────────────── */}
      <div className="form-grid--2">
        <div className="glass-panel">
          <div className="hud-label" style={{ marginBottom: '1.2rem', color: 'var(--neon-cyan)' }}>[ CAPACIDAD DE CARGA ]</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <StatDiamond value={capacidadCarga} max={10} scalar onChange={() => {}} />
            <div className="field-group" style={{
              borderLeft: '2px solid rgba(0, 255, 255, 0.2)',
              paddingLeft: '1.5rem',
              background: 'linear-gradient(90deg, rgba(0, 255, 255, 0.05) 0%, transparent 100%)'
            }}>
              <label className="hud-label" style={{ fontSize: '0.5rem', opacity: 0.7 }}>TAMAÑO</label>
              <div className="cyber-input cyber-input--sm" style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.3rem',
                color: 'var(--neon-cyan)',
                textShadow: '0 0 10px var(--neon-cyan)',
                width: '70px',
                textAlign: 'center',
                padding: '4px 0',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(0, 255, 255, 0.1)',
                cursor: 'default'
              }}>
                {cargaKg}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel">
          <div className="hud-label" style={{ marginBottom: '1.2rem', color: 'var(--neon-cyan)' }}>[ METAPSICOSIS ]</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <StatDiamond value={(1 << Math.min(Math.floor(metapsicosis / 10), 7)) - 1} max={7} readOnly />
            <div className="field-group" style={{
              borderLeft: '2px solid rgba(0, 255, 255, 0.2)',
              paddingLeft: '1.5rem',
              background: 'linear-gradient(90deg, rgba(0, 255, 255, 0.05) 0%, transparent 100%)'
            }}>
              <label className="hud-label" style={{ fontSize: '0.5rem', opacity: 0.7 }}>VALOR</label>
              <input className="cyber-input cyber-input--sm" type="text" inputMode="numeric" pattern="[0-9]*"
                value={metapsicosis}
                onChange={e => update('metapsicosis', null, Number(e.target.value.replace(/\D/g, '')) || 0)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--neon-cyan)', width: '70px', textAlign: 'center' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── ATRIBUTOS + DONES ───────────────────────────────── */}
      <div className="form-grid--2">
        <div className="glass-panel" style={{ borderTop: '2px solid var(--neon-cyan)' }}>
          <div className="hud-label" style={{ marginBottom: '1.5rem' }}>ATRIBUTOS</div>
          <div className="form-section" style={{ gap: '1rem' }}>
            {Object.entries(atributos).map(([key, stat]) => (
              <div key={key} className="stat-row">
                <span className="stat-row__label">{ATTR_LABELS[key]}</span>
                <StatDiamond
                  value={stat.val} blockedBits={stat.blocked} max={5}
                  scalar color="#ff0044"
                  onChange={v => updateStat('atributos', key, v, stat.blocked)}
                  onToggleBlock={b => updateStat('atributos', key, stat.val, b)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ borderTop: '2px solid var(--neon-magenta)' }}>
          <div className="hud-label" style={{ marginBottom: '1.5rem' }}>DONES</div>
          <div className="form-section" style={{ gap: '1rem' }}>
            {Object.entries(dones).map(([key, stat]) => (
              <div key={key} className="stat-row">
                <span className="stat-row__label">{DONES_LABELS[key]}</span>
                <StatDiamond
                  value={stat.val} blockedBits={stat.blocked} max={2}
                  scalar color="#ff0044"
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
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', columnGap: '3rem', marginBottom: '2rem' }}>
          <div className="hud-label">ESTADOS VITALES &amp; RESISTENCIA</div>
          <div className="hud-label" style={{ paddingLeft: '2rem', borderLeft: '1px solid var(--glass-border)' }}>VIRTUDES</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', columnGap: '3rem', rowGap: '3rem' }}>

          {/* VIGOR | AUTOCONTROL */}
          <div className="stat-row" style={{ alignItems: 'flex-start' }}>
            <span className="stat-row__label" style={{ paddingTop: '6px' }}>VIGOR</span>
            <SquareStat value={ev.vigor} max={20} rows={2} markers={[1, 2, 3]}
              scalar color="var(--neon-cyan)"
              onChange={v => update('estados_vitales', 'vigor', v)} />
          </div>
          <div style={{ paddingLeft: '2rem', borderLeft: '1px solid var(--glass-border)' }}>
            {renderVirtud('autocontrol')}
          </div>

          {/* CONSTITUCIÓN | ALERTA */}
          <div className="stat-row" style={{ alignItems: 'flex-start' }}>
            <span className="stat-row__label" style={{ paddingTop: '6px' }}>CONSTITUCIÓN</span>
            <SquareStat value={ev.constitucion} max={10} rows={1} markers={[1, 2, 3]}
              scalar color="var(--neon-cyan)"
              onChange={v => update('estados_vitales', 'constitucion', v)} />
          </div>
          <div style={{ paddingLeft: '2rem', borderLeft: '1px solid var(--glass-border)' }}>
            {renderVirtud('alerta')}
          </div>

          {/* CORDURA | VALENTÍA */}
          <div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '120px max-content 40px', 
              columnGap: '1.5rem', 
              rowGap: '2px', // Espacio mínimo entre marcadores y cuadros
              alignItems: 'center' 
            }}>
              {/* Header */}
              <label className="hud-label" style={{ color: 'var(--neon-cyan)', marginBottom: '1rem', gridColumn: 'span 3' }}>CORDURA</label>

              {[1, 2, 3, 4].map(nv => (
                <React.Fragment key={nv}>
                  {/* FILA A: Marcadores (Solo si nv === 1) */}
                  <div />
                  <div style={{ paddingLeft: '2px', height: '26px', display: 'flex', alignItems: 'flex-start' }}>
                    {nv === 1 && (
                      <div style={{ 
                        display: 'flex', 
                        gap: '4px', 
                        paddingLeft: '78px', 
                        paddingTop: '2px'
                      }}>
                        {[0, 1, 2].map(mIdx => {
                          const isActive = (ev.cordura.nv1 & (1 << (10 + mIdx))) !== 0;
                          return (
                            <button 
                              key={mIdx} 
                              type="button"
                              onClick={() => {
                                const current = ev.cordura.nv1;
                                update('estados_vitales', 'cordura.nv1', current ^ (1 << (10 + mIdx)));
                              }}
                              className={`square-stat__marker ${isActive ? 'square-stat__marker--active' : ''}`} 
                              style={{ width: '22px', height: '22px', fontSize: '0.6rem' }}
                            >
                              {mIdx + 1}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div />

                  {/* FILA B: Datos principales (Etiqueta | Cuadros | Valor) */}
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.75rem', 
                    color: 'var(--text-dim)', 
                    fontWeight: 600,
                    letterSpacing: '1px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    NV 0{nv}
                  </span>
                  
                  <div style={{ height: '32px', display: 'flex', alignItems: 'center' }}>
                    <SquareStat
                      value={ev.cordura[`nv${nv}`]} max={5} rows={1}
                      onChange={v => update('estados_vitales', `cordura.nv${nv}`, v)}
                    />
                  </div>

                  <div style={{ height: '32px', display: 'flex', alignItems: 'center', paddingLeft: '0.5rem' }}>
                    <span style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '0.9rem', 
                      color: 'var(--neon-cyan)',
                      fontWeight: 'bold'
                    }}>
                      {nv * 5}
                    </span>
                  </div>

                  {/* Espacio entre niveles */}
                  <div style={{ height: '8px', gridColumn: 'span 3' }} />
                </React.Fragment>
              ))}
            </div>
          </div>
          <div style={{ paddingLeft: '2rem', borderLeft: '1px solid var(--glass-border)' }}>
            {renderVirtud('valentia')}
          </div>

        </div>

        <div className="stat-row" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <span className="stat-row__label">VOLUNTAD</span>
          <SquareStat value={ev.voluntad} max={10} rows={1}
            scalar color="var(--neon-cyan)"
            onChange={v => update('estados_vitales', 'voluntad', v)} />
        </div>
      </div>

      {/* ── COMBATE ────────────────────────────────────────── */}
      <div className="glass-panel">
        <div className="hud-label" style={{ marginBottom: '1.5rem' }}>ARTES DE COMBATE</div>

        <table className="cyber-table">
          <thead>
            <tr>
              <th>ARTE DE COMBATE</th>
              <th style={{ width: '150px' }}>DON</th>
              <th style={{ width: '80px' }}>NIVEL</th>
              <th>M 01</th>
              <th>M 02</th>
              <th>M 03</th>
              <th style={{ width: '40px' }}>V</th>
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
                    <option value="">SIN PROCESADOR</option>
                    {Object.entries(DONES_LABELS).map(([k, label]) => (
                      <option key={k} value={k}>{label}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <SquareStat value={arte.nv} max={2} rows={1}
                    onChange={v => { const next = [...combate.artesDeCombate]; next[idx] = { ...next[idx], nv: v }; update('combate', 'artesDeCombate', next); }} />
                </td>
                {/* Maestria 1, 2, 3 */}
                {[0, 1, 2].map(m => (
                  <td key={m}>
                    <input className="cyber-input cyber-input--sm" placeholder={`M 0${m+1}`}
                      value={combate.maestrias[idx * 4 + m] || ''}
                      onChange={e => { const next = [...combate.maestrias]; next[idx * 4 + m] = e.target.value; update('combate', 'maestrias', next); }} />
                  </td>
                ))}
                {/* Validador */}
                <td>
                  <SquareStat 
                    value={Number(combate.maestrias[idx * 4 + 3]) || 0} 
                    max={1} rows={1}
                    onChange={v => { const next = [...combate.maestrias]; next[idx * 4 + 3] = v; update('combate', 'maestrias', next); }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}
