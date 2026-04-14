import React, { useState } from 'react';
import StatDiamond from '../stats/StatDiamond';

const ARMA_FIELDS = [
  ['NOMBRE',       'nombre'],
  ['TAMAÑO',       'tamano'],
  ['DIFICULTAD',   'dificultad'],
  ['ALCANCE',      'alcance'],
  ['EXITOS',       'exitos'],
  ['DMG',          'dmg'],
  ['DMG (A)',      'dmgA'],
  ['BLOQUEO',      'bloqueo'],
  ['RESISTENCIA',  'resistencia'],
  ['CALIBRE',      'calibre'],
  ['PRECISIÓN',    'precision'],
  ['RETROCESO',    'retroceso'],
  ['OCULTACIÓN',   'ocultacion'],
  ['MUNICIÓN',     'municion'],
  ['CAPACIDADES',  'capacidades'],
  ['EXTRAS',       'extras'],
];

const ARMADURA_FIELDS = [
  ['NOMBRE',   'nombre'],
  ['P. DAÑO',  'pDano'],
  ['P. ATUR',  'pAtur'],
  ['P. ELEM',  'pElem'],
  ['P. CORTE', 'pCorte'],
  ['P. PERF',  'pPerf'],
  ['P. SUPR',  'pSupr'],
  ['P. CLIMA', 'pClima'],
  ['TAMAÑO',   'tamano'],
  ['COBERTURA','cobertura'],
];

const DEFAULT_ARMA     = () => Object.fromEntries(ARMA_FIELDS.map(([, k]) => [k, '']));
const DEFAULT_ARMADURA = () => Object.fromEntries(ARMADURA_FIELDS.map(([, k]) => [k, '']));
const DEFAULT_ALTA_TECH = () => ({ nombre: '', metapsicosis: '', efecto: { nv1: '', nv2: '', nv3: '' }, extras: '', restriccion: '', bestializacion: '', signo: '', falla: '' });
const DEFAULT_MEJORA   = () => ({ pieza: '', nivel: 0, objetivo: '', valor: '' });

export default function TabArmamento({ data, update }) {
  const [subTab, setSubTab] = useState('armas');
  const { armas, armaduras, altaTech, mejoras } = data;

  const SUB_TABS = [
    ['armas',     'ARMAMENTO'],
    ['armaduras', 'PROTEC_DÉRMICA'],
    ['altaTech',  'PROTOTIPOS_AT'],
    ['mejoras',   'OPTIMIZACIONES'],
  ];

  return (
    <div className="form-section">
      <div className="tab-bar-secondary no-print" style={{ marginBottom: '2rem' }}>
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
                  <span className="hud-label" style={{ marginBottom: 0 }}>REG_ARM_0{idx + 1}</span>
                  <button className="dynamic-list__remove" onClick={() => update('armas', null, armas.filter((_, i) => i !== idx))}>×</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  {ARMA_FIELDS.map(([label, key]) => (
                    <div key={key} className="field-group">
                      <label className="hud-label" style={{ fontSize: '0.45rem', opacity: 0.6 }}>{label}</label>
                      <input className="cyber-input cyber-input--sm" value={arma[key]}
                        placeholder="---"
                        onChange={e => { const next = [...armas]; next[idx] = { ...next[idx], [key]: e.target.value }; update('armas', null, next); }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="cyber-button cyber-button--add cyber-button--add-cyan"
            onClick={() => update('armas', null, [...armas, DEFAULT_ARMA()])}>
            + VINCULAR_NUEVA_UNIDAD_DE_FUEGO
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
                  <span className="hud-label" style={{ marginBottom: 0 }}>REG_PRO_0{idx + 1}</span>
                  <button className="dynamic-list__remove" onClick={() => update('armaduras', null, armaduras.filter((_, i) => i !== idx))}>×</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  {ARMADURA_FIELDS.map(([label, key]) => (
                    <div key={key} className="field-group">
                      <label className="hud-label" style={{ fontSize: '0.45rem', opacity: 0.6 }}>{label}</label>
                      <input className="cyber-input cyber-input--sm" value={arm[key]}
                        placeholder="---"
                        onChange={e => { const next = [...armaduras]; next[idx] = { ...next[idx], [key]: e.target.value }; update('armaduras', null, next); }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="cyber-button cyber-button--add cyber-button--add-magenta"
            onClick={() => update('armaduras', null, [...armaduras, DEFAULT_ARMADURA()])}>
            + VINCULAR_MÓDULO_DE_DEFENSA
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
                  <span className="hud-label" style={{ marginBottom: 0 }}>PROTOTIPO_AT_0{idx + 1}</span>
                  <button className="dynamic-list__remove" onClick={() => update('altaTech', null, altaTech.filter((_, i) => i !== idx))}>×</button>
                </div>

                <div className="field-row field-row--2" style={{ marginBottom: '1rem' }}>
                  <div className="field-group">
                    <label className="hud-label">DENOMINACIÓN</label>
                    <input className="cyber-input" value={item.nombre}
                      onChange={e => { const n = [...altaTech]; n[idx] = { ...n[idx], nombre: e.target.value }; update('altaTech', null, n); }} />
                  </div>
                  <div className="field-group">
                    <label className="hud-label">SYNC_METAPSICOSIS</label>
                    <input className="cyber-input" value={item.metapsicosis}
                      placeholder="0.0"
                      onChange={e => { const n = [...altaTech]; n[idx] = { ...n[idx], metapsicosis: e.target.value }; update('altaTech', null, n); }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                  {['nv1', 'nv2', 'nv3'].map((nv, ni) => (
                    <div key={nv} className="field-group">
                      <label className="hud-label" style={{ fontSize: '0.5rem', opacity: 0.5 }}>PROTOCOLO_FUNCIONAL_NV{ni + 1}</label>
                      <input className="cyber-input cyber-input--sm" value={item.efecto[nv]}
                        placeholder="..."
                        onChange={e => { const n = [...altaTech]; n[idx] = { ...n[idx], efecto: { ...n[idx].efecto, [nv]: e.target.value } }; update('altaTech', null, n); }} />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  {[
                    ['EXTRAS', 'extras'],
                    ['RESTRICCIONES', 'restriccion'],
                    ['BESTIALIZACIÓN', 'bestializacion'],
                    ['SIGNO_VITAL', 'signo'],
                    ['MODO_FALLA', 'falla']
                  ].map(([label, key]) => (
                    <div key={key} className="field-group">
                      <label className="hud-label" style={{ fontSize: '0.45rem' }}>{label}</label>
                      <input className="cyber-input cyber-input--sm" value={item[key]}
                        onChange={e => { const n = [...altaTech]; n[idx] = { ...n[idx], [key]: e.target.value }; update('altaTech', null, n); }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="cyber-button cyber-button--add cyber-button--add-cyan"
            onClick={() => update('altaTech', null, [...altaTech, DEFAULT_ALTA_TECH()])}>
            + INICIALIZAR_PROTOTIPO_ALTA_TECH
          </button>
        </div>
      )}

      {/* ── MEJORAS ────────────────────────────────────────── */}
      {subTab === 'mejoras' && (
        <div className="form-section" style={{ animation: 'fade-up 0.4s ease both' }}>
          <div className="form-grid--2">
            {mejoras.map((m, idx) => (
              <div key={idx} className="glass-panel" style={{ borderLeft: '2px solid var(--neon-cyan)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span className="hud-label" style={{ marginBottom: 0 }}>OPTIMIZACIÓN_0{idx + 1}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <StatDiamond value={m.nivel} max={5}
                      onChange={v => { const n = [...mejoras]; n[idx] = { ...n[idx], nivel: v }; update('mejoras', null, n); }} />
                    <button className="dynamic-list__remove" onClick={() => update('mejoras', null, mejoras.filter((_, i) => i !== idx))}>×</button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {[
                    ['NÚCLEO_PIEZA / MANIPULACIÓN', 'pieza'],
                    ['OBJETIVO_SISTEMA', 'objetivo'],
                    ['VALOR_AJUSTE', 'valor']
                  ].map(([label, key]) => (
                    <div key={key} className="field-group">
                      <label className="hud-label" style={{ fontSize: '0.5rem' }}>{label}</label>
                      <input className="cyber-input" value={m[key]}
                        placeholder="---"
                        onChange={e => { const n = [...mejoras]; n[idx] = { ...n[idx], [key]: e.target.value }; update('mejoras', null, n); }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="cyber-button cyber-button--add cyber-button--add-cyan"
            onClick={() => update('mejoras', null, [...mejoras, DEFAULT_MEJORA()])}>
            + APLICAR_NUEVA_OPTIMIZACIÓN
          </button>
        </div>
      )}
    </div>
  );
}
