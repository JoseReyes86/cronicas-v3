import React, { useState } from 'react';
import StatDiamond from '../stats/StatDiamond';

const ARMA_FIELDS = [
  ['NOMBRE',       'nombre'],
  ['APUNTAR',      'apuntar'],
  ['ALCANCE',      'alcance'],
  ['EFECTIVIDAD',  'efectividad'],
  ['DAÑO',         'dano'],
  ['PRECISIÓN',    'precision'],
  ['BLOQUEAR',     'bloquear'],
  ['RESISTENCIA',  'resistencia'],
  ['RETROCESO',    'retroceso'],
  ['MUNICIÓN',     'municion'],
  ['CALIBRE',      'calibre'],
  ['TAMAÑO',       'tamano'],
  ['OCULTAR',      'ocultar'],
];

const ARMADURA_FIELDS = [
  ['NOMBRE',      'nombre'],
  ['P. DAÑO',     'pDano'],
  ['P. ATUR',     'pAtur'],
  ['P. CORT',     'pCort'],
  ['P. PERF',     'pPerf'],
  ['P. SUPR',     'pSupr'],
  ['P. ELEM',     'pElem'],
  ['P. CLIMA',    'pClima'],
  ['REVISTE',     'reviste'],
  ['RESISTENCIA', 'resistencia'],
  ['TAMAÑO',      'tamano']
];

const DEFAULT_ARMA = () => ({
  ...Object.fromEntries(ARMA_FIELDS.map(([, k]) => [k, ''])),
  capacidades: [''],
  extras: ['']
});
const DEFAULT_ARMADURA = () => ({
  ...Object.fromEntries(ARMADURA_FIELDS.map(([, k]) => [k, ''])),
  capacidades: [''],
  extras: ['']
});
const DEFAULT_ALTA_TECH = () => ({ nombre: '', metapsicosis: '', efecto: { nv1: '', nv2: '', nv3: '' }, extras: [''], restriccion: '', bestializacion: '', signo: '', falla: '' });
const DEFAULT_MEJORA   = () => ({ pieza: '', nivel: 0, objetivo: '', valor: '' });

export default function TabArmamento({ data, update }) {
  const [subTab, setSubTab] = useState('armas');
  const { armas, armaduras, altaTech, mejoras } = data;

  const SUB_TABS = [
    ['armas',     'ARMAS'],
    ['armaduras', 'ARMADURA'],
    ['altaTech',  'ALTA TECH'],
    ['mejoras',   'MEJORAS'],
  ];

  return (
    <div className="form-section">
      <div className="tab-bar-secondary no-print" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
        {SUB_TABS.map(([id, label]) => (
          <button key={id} className={`tab-btn ${subTab === id ? 'active' : ''}`} onClick={() => setSubTab(id)}>{label}</button>
        ))}
      </div>

      {/* ── ARMAS ──────────────────────────────────────────── */}
      {subTab === 'armas' && (
        <div className="form-section" style={{ animation: 'fade-up 0.4s ease both' }}>
          <div className="equip-grid">
            {armas.map((arma, idx) => (
              <div key={idx} className="glass-panel" style={{ borderLeft: '2px solid var(--neon-cyan)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', alignItems: 'center' }}>
                  <span className="hud-label" style={{ marginBottom: 0 }}>
                    {arma.nombre ? arma.nombre.toUpperCase() : `ARMA 0${idx + 1}`}
                  </span>
                  <button className="dynamic-list__remove" onClick={() => update('armas', null, armas.filter((_, i) => i !== idx))}>×</button>
                </div>
                <div className="field-row field-row--2" style={{ gap: '0.8rem' }}>
                  {ARMA_FIELDS.map(([label, key]) => (
                    <div key={key} className="field-group">
                      <label className="hud-label" style={{ fontSize: '0.45rem', opacity: 0.6 }}>{label}</label>
                      <input className="cyber-input cyber-input--sm" value={arma[key]}
                        placeholder="---"
                        onChange={e => { const next = [...armas]; next[idx] = { ...next[idx], [key]: e.target.value }; update('armas', null, next); }} />
                    </div>
                  ))}
                </div>
                {/* ── SECCIÓN DINÁMICA: CAPACIDADES Y EXTRAS ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.2rem' }}>
                  {/* CAPACIDADES */}
                  <div className="field-group">
                    <label className="hud-label" style={{ fontSize: '0.45rem', opacity: 0.6 }}>CAPACIDADES</label>
                    {(Array.isArray(arma.capacidades) ? arma.capacidades : [arma.capacidades || '']).map((c, i) => (
                      <div key={`cap-${i}`} style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                        <input className="cyber-input cyber-input--sm" value={c} placeholder="Capacidad..." onChange={e => {
                          const next = [...armas];
                          const arr = Array.isArray(arma.capacidades) ? [...arma.capacidades] : [arma.capacidades || ''];
                          arr[i] = e.target.value;
                          next[idx] = { ...next[idx], capacidades: arr };
                          update('armas', null, next);
                        }} />
                        <button className="dynamic-list__remove" onClick={() => {
                          const next = [...armas];
                          const arr = Array.isArray(arma.capacidades) ? [...arma.capacidades] : [arma.capacidades || ''];
                          next[idx] = { ...next[idx], capacidades: arr.filter((_, n) => n !== i) };
                          update('armas', null, next);
                        }}>×</button>
                      </div>
                    ))}
                    <button className="cyber-button cyber-button--sm" style={{ width: '100%', marginTop: '4px', fontSize: '0.5rem', padding: '0.4rem' }} onClick={() => {
                      const next = [...armas];
                      const arr = Array.isArray(arma.capacidades) ? [...arma.capacidades] : [arma.capacidades || ''];
                      next[idx] = { ...next[idx], capacidades: [...arr, ''] };
                      update('armas', null, next);
                    }}>+ AGREGAR CAPACIDAD</button>
                  </div>

                  {/* EXTRAS */}
                  <div className="field-group">
                    <label className="hud-label" style={{ fontSize: '0.45rem', opacity: 0.6 }}>EXTRAS</label>
                    {(Array.isArray(arma.extras) ? arma.extras : [arma.extras || '']).map((ex, i) => (
                      <div key={`ext-${i}`} style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                        <input className="cyber-input cyber-input--sm" value={ex} placeholder="Extra..." onChange={e => {
                          const next = [...armas];
                          const arr = Array.isArray(arma.extras) ? [...arma.extras] : [arma.extras || ''];
                          arr[i] = e.target.value;
                          next[idx] = { ...next[idx], extras: arr };
                          update('armas', null, next);
                        }} />
                        <button className="dynamic-list__remove" onClick={() => {
                          const next = [...armas];
                          const arr = Array.isArray(arma.extras) ? [...arma.extras] : [arma.extras || ''];
                          next[idx] = { ...next[idx], extras: arr.filter((_, n) => n !== i) };
                          update('armas', null, next);
                        }}>×</button>
                      </div>
                    ))}
                    <button className="cyber-button cyber-button--sm" style={{ width: '100%', marginTop: '4px', fontSize: '0.5rem', padding: '0.4rem' }} onClick={() => {
                      const next = [...armas];
                      const arr = Array.isArray(arma.extras) ? [...arma.extras] : [arma.extras || ''];
                      next[idx] = { ...next[idx], extras: [...arr, ''] };
                      update('armas', null, next);
                    }}>+ AGREGAR EXTRA</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="cyber-button cyber-button--add cyber-button--add-cyan"
            onClick={() => update('armas', null, [...armas, DEFAULT_ARMA()])}>
            + AGREGAR ARMA
          </button>
        </div>
      )}

      {/* ── ARMADURAS ──────────────────────────────────────── Comp. a Protec. Dérmica */}
      {subTab === 'armaduras' && (
        <div className="form-section" style={{ animation: 'fade-up 0.4s ease both' }}>
          <div className="equip-grid">
            {armaduras.map((arm, idx) => (
              <div key={idx} className="glass-panel" style={{ borderLeft: '2px solid var(--neon-magenta)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', alignItems: 'center' }}>
                  <span className="hud-label" style={{ marginBottom: 0 }}>
                    {arm.nombre ? arm.nombre.toUpperCase() : `ARMADURA 0${idx + 1}`}
                  </span>
                  <button className="dynamic-list__remove" onClick={() => update('armaduras', null, armaduras.filter((_, i) => i !== idx))}>×</button>
                </div>
                <div className="field-row field-row--2" style={{ gap: '0.8rem' }}>
                  {ARMADURA_FIELDS.map(([label, key]) => (
                    <div key={key} className="field-group">
                      <label className="hud-label" style={{ fontSize: '0.45rem', opacity: 0.6 }}>{label}</label>
                      <input className="cyber-input cyber-input--sm" value={arm[key]}
                        placeholder="---"
                        onChange={e => { const next = [...armaduras]; next[idx] = { ...next[idx], [key]: e.target.value }; update('armaduras', null, next); }} />
                    </div>
                  ))}
                </div>
                {/* ── SECCIÓN DINÁMICA: CAPACIDADES Y EXTRAS ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.2rem' }}>
                  {/* CAPACIDADES */}
                  <div className="field-group">
                    <label className="hud-label" style={{ fontSize: '0.45rem', opacity: 0.6 }}>CAPACIDADES</label>
                    {(Array.isArray(arm.capacidades) ? arm.capacidades : [arm.capacidades || '']).map((c, i) => (
                      <div key={`cap-${i}`} style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                        <input className="cyber-input cyber-input--sm" value={c} placeholder="Capacidad..." onChange={e => {
                          const next = [...armaduras];
                          const arr = Array.isArray(arm.capacidades) ? [...arm.capacidades] : [arm.capacidades || ''];
                          arr[i] = e.target.value;
                          next[idx] = { ...next[idx], capacidades: arr };
                          update('armaduras', null, next);
                        }} />
                        <button className="dynamic-list__remove" onClick={() => {
                          const next = [...armaduras];
                          const arr = Array.isArray(arm.capacidades) ? [...arm.capacidades] : [arm.capacidades || ''];
                          next[idx] = { ...next[idx], capacidades: arr.filter((_, n) => n !== i) };
                          update('armaduras', null, next);
                        }}>×</button>
                      </div>
                    ))}
                    <button className="cyber-button cyber-button--sm" style={{ width: '100%', marginTop: '4px', fontSize: '0.5rem', padding: '0.4rem' }} onClick={() => {
                      const next = [...armaduras];
                      const arr = Array.isArray(arm.capacidades) ? [...arm.capacidades] : [arm.capacidades || ''];
                      next[idx] = { ...next[idx], capacidades: [...arr, ''] };
                      update('armaduras', null, next);
                    }}>+ AGREGAR CAPACIDAD</button>
                  </div>

                  {/* EXTRAS */}
                  <div className="field-group">
                    <label className="hud-label" style={{ fontSize: '0.45rem', opacity: 0.6 }}>EXTRAS</label>
                    {(Array.isArray(arm.extras) ? arm.extras : [arm.extras || '']).map((ex, i) => (
                      <div key={`ext-${i}`} style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                        <input className="cyber-input cyber-input--sm" value={ex} placeholder="Extra..." onChange={e => {
                          const next = [...armaduras];
                          const arr = Array.isArray(arm.extras) ? [...arm.extras] : [arm.extras || ''];
                          arr[i] = e.target.value;
                          next[idx] = { ...next[idx], extras: arr };
                          update('armaduras', null, next);
                        }} />
                        <button className="dynamic-list__remove" onClick={() => {
                          const next = [...armaduras];
                          const arr = Array.isArray(arm.extras) ? [...arm.extras] : [arm.extras || ''];
                          next[idx] = { ...next[idx], extras: arr.filter((_, n) => n !== i) };
                          update('armaduras', null, next);
                        }}>×</button>
                      </div>
                    ))}
                    <button className="cyber-button cyber-button--sm" style={{ width: '100%', marginTop: '4px', fontSize: '0.5rem', padding: '0.4rem' }} onClick={() => {
                      const next = [...armaduras];
                      const arr = Array.isArray(arm.extras) ? [...arm.extras] : [arm.extras || ''];
                      next[idx] = { ...next[idx], extras: [...arr, ''] };
                      update('armaduras', null, next);
                    }}>+ AGREGAR EXTRA</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="cyber-button cyber-button--add cyber-button--add-magenta"
            onClick={() => update('armaduras', null, [...armaduras, DEFAULT_ARMADURA()])}>
            + AGREGAR ARMADURA
          </button>
        </div>
      )}

      {/* ── ALTA TECH ──────────────────────────────────────── */}
      {subTab === 'altaTech' && (
        <div className="form-section" style={{ animation: 'fade-up 0.4s ease both' }}>
          <div className="form-grid--2">
            {altaTech.map((item, idx) => (
              <div key={idx} className="glass-panel" style={{ borderLeft: '2px solid var(--neon-cyan)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                  <span className="hud-label" style={{ marginBottom: 0 }}>
                    {item.nombre ? item.nombre.toUpperCase() : `ALTA TECH 0${idx + 1}`}
                  </span>
                  <button className="dynamic-list__remove" onClick={() => update('altaTech', null, altaTech.filter((_, i) => i !== idx))}>×</button>
                </div>

                <div className="field-row field-row--2" style={{ marginBottom: '1rem' }}>
                  <div className="field-group">
                    <label className="hud-label">NOMBRE</label>
                    <input className="cyber-input" value={item.nombre}
                      onChange={e => { const n = [...altaTech]; n[idx] = { ...n[idx], nombre: e.target.value }; update('altaTech', null, n); }} />
                  </div>
                  <div className="field-group">
                    <label className="hud-label">METAPSICOSIS</label>
                    <input className="cyber-input" value={item.metapsicosis}
                      placeholder="0.0"
                      onChange={e => { const n = [...altaTech]; n[idx] = { ...n[idx], metapsicosis: e.target.value }; update('altaTech', null, n); }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                  {['nv1', 'nv2', 'nv3'].map((nv, ni) => (
                    <div key={nv} className="field-group">
                      <label className="hud-label" style={{ fontSize: '0.5rem', opacity: 0.5 }}>EFECTO NV {ni + 1}</label>
                      <textarea
                        className="cyber-input cyber-input--sm"
                        value={item.efecto[nv]}
                        placeholder="..."
                        rows={1}
                        style={{ resize: 'none', overflow: 'hidden' }}
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onChange={e => { const n = [...altaTech]; n[idx] = { ...n[idx], efecto: { ...n[idx].efecto, [nv]: e.target.value } }; update('altaTech', null, n); }}
                      />
                    </div>
                  ))}
                </div>

                <div className="field-row field-row--2" style={{ gap: '0.8rem' }}>
                  {[
                    ['RESTRICCIÓN', 'restriccion'],
                    ['BESTIALIZACIÓN', 'bestializacion'],
                    ['SIGNO', 'signo'],
                    ['FALLA', 'falla']
                  ].map(([label, key]) => (
                    <div key={key} className="field-group">
                      <label className="hud-label" style={{ fontSize: '0.45rem' }}>{label}</label>
                      <input className="cyber-input cyber-input--sm" value={item[key]}
                        onChange={e => { const n = [...altaTech]; n[idx] = { ...n[idx], [key]: e.target.value }; update('altaTech', null, n); }} />
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1.2rem' }}>
                  {/* EXTRAS */}
                  <div className="field-group">
                    <label className="hud-label" style={{ fontSize: '0.45rem', opacity: 0.6 }}>EXTRAS</label>
                    {(Array.isArray(item.extras) ? item.extras : [item.extras || '']).map((ex, i) => (
                      <div key={`ext-${i}`} style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                        <input className="cyber-input cyber-input--sm" value={ex} placeholder="Extra..." onChange={e => {
                          const next = [...altaTech];
                          const arr = Array.isArray(item.extras) ? [...item.extras] : [item.extras || ''];
                          arr[i] = e.target.value;
                          next[idx] = { ...next[idx], extras: arr };
                          update('altaTech', null, next);
                        }} />
                        <button className="dynamic-list__remove" onClick={() => {
                          const next = [...altaTech];
                          const arr = Array.isArray(item.extras) ? [...item.extras] : [item.extras || ''];
                          next[idx] = { ...next[idx], extras: arr.filter((_, n) => n !== i) };
                          update('altaTech', null, next);
                        }}>×</button>
                      </div>
                    ))}
                    <button className="cyber-button cyber-button--sm" style={{ width: '100%', marginTop: '4px', fontSize: '0.5rem', padding: '0.4rem' }} onClick={() => {
                      const next = [...altaTech];
                      const arr = Array.isArray(item.extras) ? [...item.extras] : [item.extras || ''];
                      next[idx] = { ...next[idx], extras: [...arr, ''] };
                      update('altaTech', null, next);
                    }}>+ AGREGAR EXTRA</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="cyber-button cyber-button--add cyber-button--add-cyan"
            onClick={() => update('altaTech', null, [...altaTech, DEFAULT_ALTA_TECH()])}>
            + AGREGAR ALTA TECH
          </button>
        </div>
      )}

      {/* ── MEJORAS ──────────────────────────────────────── */}
      {subTab === 'mejoras' && (
        <div className="form-section" style={{ animation: 'fade-up 0.4s ease both' }}>
          <div className="form-grid--2">
            {mejoras.map((item, idx) => (
              <div key={idx} className="glass-panel" style={{ borderLeft: '2px solid var(--neon-cyan)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                  <span className="hud-label" style={{ marginBottom: 0 }}>
                    {item.pieza ? item.pieza.toUpperCase() : `MEJORA 0${idx + 1}`}
                  </span>
                  <button className="dynamic-list__remove" onClick={() => update('mejoras', null, mejoras.filter((_, i) => i !== idx))}>×</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, auto) 1fr auto auto', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <label className="hud-label" style={{ fontSize: '0.45rem', lineHeight: '1.2' }}>Pieza /<br/>Manipulación</label>
                  <input className="cyber-input cyber-input--sm" value={item.pieza} placeholder="..."
                    onChange={e => { const n = [...mejoras]; n[idx] = { ...n[idx], pieza: e.target.value }; update('mejoras', null, n); }} />
                  
                  <label className="hud-label" style={{ fontSize: '0.45rem', marginLeft: '0.5rem' }}>Nivel</label>
                  <StatDiamond 
                    value={item.nivel} 
                    max={15} 
                    rows={3} 
                    scalar 
                    color="var(--neon-cyan)"
                    onChange={v => { const n = [...mejoras]; n[idx] = { ...n[idx], nivel: v }; update('mejoras', null, n); }} 
                  />
                </div>

                <div className="field-group" style={{ marginBottom: '1rem' }}>
                  <label className="hud-label" style={{ fontSize: '0.45rem' }}>Objetivo</label>
                  <textarea className="cyber-input cyber-input--sm" value={item.objetivo} rows={2} placeholder="..." style={{ resize: 'none' }}
                    onChange={e => { const n = [...mejoras]; n[idx] = { ...n[idx], objetivo: e.target.value }; update('mejoras', null, n); }} />
                </div>

                <div className="field-group">
                  <label className="hud-label" style={{ fontSize: '0.45rem' }}>Valor</label>
                  <textarea className="cyber-input cyber-input--sm" value={item.valor} rows={2} placeholder="..." style={{ resize: 'none' }}
                    onChange={e => { const n = [...mejoras]; n[idx] = { ...n[idx], valor: e.target.value }; update('mejoras', null, n); }} />
                </div>

              </div>
            ))}
          </div>
          <button className="cyber-button cyber-button--add cyber-button--add-cyan"
            onClick={() => update('mejoras', null, [...mejoras, DEFAULT_MEJORA()])}>
            + AGREGAR MEJORA
          </button>
        </div>
      )}

    </div>
  );
}
