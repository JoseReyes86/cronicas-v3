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
    ['armas',     'ARMAS'],
    ['armaduras', 'ARMADURAS'],
    ['altaTech',  'ALTA TECH'],
    ['mejoras',   'MEJORAS'],
  ];

  return (
    <div className="form-section">
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {SUB_TABS.map(([id, label]) => (
          <button key={id} className={`tab-btn ${subTab === id ? 'active' : ''}`} onClick={() => setSubTab(id)}>{label}</button>
        ))}
      </div>

      {/* ── ARMAS ──────────────────────────────────────────── */}
      {subTab === 'armas' && (
        <div className="form-section">
          {armas.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
              NO_ARMAS_REGISTRADAS
            </div>
          )}
          <div className="equip-grid">
            {armas.map((arma, idx) => (
              <div key={idx} className="glass-panel glass-panel--top-cyan">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="hud-label hud-label--cyan">ARMA_{idx + 1}</span>
                  <button className="dynamic-list__remove" onClick={() => update('armas', null, armas.filter((_, i) => i !== idx))}>×</button>
                </div>
                {ARMA_FIELDS.map(([label, key]) => (
                  <div key={key} className="field-group" style={{ marginBottom: '0.6rem' }}>
                    <label className="hud-label" style={{ fontSize: '0.5rem' }}>{label}</label>
                    <input className="cyber-input cyber-input--sm" value={arma[key]}
                      onChange={e => { const next = [...armas]; next[idx] = { ...next[idx], [key]: e.target.value }; update('armas', null, next); }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button className="cyber-button cyber-button--full cyber-button--green"
            onClick={() => update('armas', null, [...armas, DEFAULT_ARMA()])}>
            + AGREGAR_ARMA
          </button>
        </div>
      )}

      {/* ── ARMADURAS ──────────────────────────────────────── */}
      {subTab === 'armaduras' && (
        <div className="form-section">
          {armaduras.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
              NO_ARMADURAS_REGISTRADAS
            </div>
          )}
          <div className="equip-grid">
            {armaduras.map((arm, idx) => (
              <div key={idx} className="glass-panel glass-panel--top-magenta">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="hud-label hud-label--magenta">ARMADURA_{idx + 1}</span>
                  <button className="dynamic-list__remove" onClick={() => update('armaduras', null, armaduras.filter((_, i) => i !== idx))}>×</button>
                </div>
                {ARMADURA_FIELDS.map(([label, key]) => (
                  <div key={key} className="field-group" style={{ marginBottom: '0.6rem' }}>
                    <label className="hud-label" style={{ fontSize: '0.5rem' }}>{label}</label>
                    <input className="cyber-input cyber-input--sm" value={arm[key]}
                      onChange={e => { const next = [...armaduras]; next[idx] = { ...next[idx], [key]: e.target.value }; update('armaduras', null, next); }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button className="cyber-button cyber-button--full cyber-button--green"
            onClick={() => update('armaduras', null, [...armaduras, DEFAULT_ARMADURA()])}>
            + AGREGAR_ARMADURA
          </button>
        </div>
      )}

      {/* ── ALTA TECH ──────────────────────────────────────── */}
      {subTab === 'altaTech' && (
        <div className="form-section">
          <div className="form-grid--2">
            {altaTech.map((item, idx) => (
              <div key={idx} className="glass-panel glass-panel--cyan">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="hud-label hud-label--cyan">ITEM_{idx + 1}</span>
                  <button className="dynamic-list__remove" onClick={() => update('altaTech', null, altaTech.filter((_, i) => i !== idx))}>×</button>
                </div>

                <div className="field-row field-row--2" style={{ marginBottom: '0.8rem' }}>
                  <div className="field-group">
                    <label className="hud-label">NOMBRE</label>
                    <input className="cyber-input cyber-input--sm" value={item.nombre}
                      onChange={e => { const n = [...altaTech]; n[idx] = { ...n[idx], nombre: e.target.value }; update('altaTech', null, n); }} />
                  </div>
                  <div className="field-group">
                    <label className="hud-label">METAPSICOSIS</label>
                    <input className="cyber-input cyber-input--sm" value={item.metapsicosis}
                      onChange={e => { const n = [...altaTech]; n[idx] = { ...n[idx], metapsicosis: e.target.value }; update('altaTech', null, n); }} />
                  </div>
                </div>

                {['nv1', 'nv2', 'nv3'].map((nv, ni) => (
                  <div key={nv} className="field-group" style={{ marginBottom: '0.5rem' }}>
                    <label className="hud-label">EFECTO_NV{ni + 1}</label>
                    <input className="cyber-input cyber-input--sm" value={item.efecto[nv]}
                      onChange={e => { const n = [...altaTech]; n[idx] = { ...n[idx], efecto: { ...n[idx].efecto, [nv]: e.target.value } }; update('altaTech', null, n); }} />
                  </div>
                ))}

                {[['EXTRAS', 'extras'], ['RESTRICCIÓN', 'restriccion'], ['BESTIALIZACIÓN', 'bestializacion'], ['SIGNO', 'signo'], ['FALLA', 'falla']].map(([label, key]) => (
                  <div key={key} className="field-group" style={{ marginBottom: '0.5rem' }}>
                    <label className="hud-label">{label}</label>
                    <input className="cyber-input cyber-input--sm" value={item[key]}
                      onChange={e => { const n = [...altaTech]; n[idx] = { ...n[idx], [key]: e.target.value }; update('altaTech', null, n); }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button className="cyber-button cyber-button--full cyber-button--green"
            onClick={() => update('altaTech', null, [...altaTech, DEFAULT_ALTA_TECH()])}>
            + AGREGAR_ALTA_TECH
          </button>
        </div>
      )}

      {/* ── MEJORAS ────────────────────────────────────────── */}
      {subTab === 'mejoras' && (
        <div className="form-section">
          <div className="form-grid--2">
            {mejoras.map((m, idx) => (
              <div key={idx} className="glass-panel glass-panel--top-cyan">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="hud-label hud-label--cyan">MEJORA_{idx + 1}</span>
                  <StatDiamond value={m.nivel} max={5}
                    onChange={v => { const n = [...mejoras]; n[idx] = { ...n[idx], nivel: v }; update('mejoras', null, n); }} />
                </div>
                {[['PIEZA / MANIPULACIÓN', 'pieza'], ['OBJETIVO', 'objetivo'], ['VALOR', 'valor']].map(([label, key]) => (
                  <div key={key} className="field-group" style={{ marginBottom: '0.8rem' }}>
                    <label className="hud-label">{label}</label>
                    <input className="cyber-input cyber-input--sm" value={m[key]}
                      onChange={e => { const n = [...mejoras]; n[idx] = { ...n[idx], [key]: e.target.value }; update('mejoras', null, n); }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button className="cyber-button cyber-button--full cyber-button--green"
            onClick={() => update('mejoras', null, [...mejoras, DEFAULT_MEJORA()])}>
            + AGREGAR_MEJORA
          </button>
        </div>
      )}
    </div>
  );
}
