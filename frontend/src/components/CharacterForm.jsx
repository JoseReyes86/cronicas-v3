import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_CHARACTER } from '../data/defaultCharacter';
import TabPerfil from './tabs/TabPerfil';
import TabEstado from './tabs/TabEstado';
import TabManipulaciones from './tabs/TabManipulaciones';
import TabRasgos from './tabs/TabRasgos';
import TabArmamento from './tabs/TabArmamento';
import TabInventario from './tabs/TabInventario';
import TabNaturaleza from './tabs/TabNaturaleza';

const TABS = [
  { id: 'perfil',         label: 'PERFIL' },
  { id: 'estado',         label: 'ESTADO' },
  { id: 'manipulaciones', label: 'MANIPULACIONES' },
  { id: 'rasgos',         label: 'RASGOS' },
  { id: 'armamento',      label: 'ARMAMENTO' },
  { id: 'inventario',     label: 'INVENTARIO' },
  { id: 'naturaleza',     label: 'NATURALEZA' },
];

/* Estados del guardado */
const STATUS = {
  idle:   null,
  dirty:  { label: '● SIN_GUARDAR',  color: 'var(--neon-amber)',   anim: 'pulse-opacity 1.5s ease-in-out infinite' },
  saving: { label: '⟳ SINCRONIZANDO', color: 'var(--neon-cyan)',    anim: 'pulse-opacity 0.6s ease-in-out infinite' },
  saved:  { label: '✓ GUARDADO',      color: 'var(--neon-green)',   anim: 'none' },
  error:  { label: '✕ ERROR',         color: 'var(--neon-magenta)', anim: 'none' },
};

export default function CharacterForm({ characterId, initialData, onSave, onClose }) {
  const [data, setData]         = useState(() => mergeWithDefaults(initialData));
  const [activeTab, setActiveTab] = useState('perfil');
  const [isDirty, setIsDirty]   = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');

  const dataRef = useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]);

  useEffect(() => {
    if (initialData) setData(mergeWithDefaults(initialData));
  }, [initialData]);

  /* ── Auto-guardado con debounce de 2.5s ───────────────────── */
  useEffect(() => {
    if (!isDirty) return;
    setSaveStatus('dirty');
    const id = setTimeout(async () => {
      setSaveStatus('saving');
      const ok = await onSave(dataRef.current);
      if (ok) {
        setIsDirty(false);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2500);
      } else {
        setSaveStatus('error');
      }
    }, 2500);
    return () => clearTimeout(id);
  }, [data, isDirty]);

  /* ── Ctrl+S / Cmd+S ────────────────────────────────────────── */
  useEffect(() => {
    const handler = async (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (saveStatus === 'saving') return;
        setSaveStatus('saving');
        const ok = await onSave(dataRef.current);
        if (ok) {
          setIsDirty(false);
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2500);
        } else {
          setSaveStatus('error');
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [saveStatus]);

  /* ── Actualiza cualquier campo ──────────────────────────────── */
  const update = useCallback((section, field, value) => {
    setIsDirty(true);
    setData(prev => {
      if (!field) return { ...prev, [section]: value };
      if (field.includes('.')) {
        const [f1, f2] = field.split('.');
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [f1]: { ...prev[section][f1], [f2]: value }
          }
        };
      }
      return { ...prev, [section]: { ...prev[section], [field]: value } };
    });
  }, []);

  /* ── Guardado manual ───────────────────────────────────────── */
  const handleSaveNow = async () => {
    if (saveStatus === 'saving') return;
    setSaveStatus('saving');
    const ok = await onSave(dataRef.current);
    if (ok) {
      setIsDirty(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } else {
      setSaveStatus('error');
    }
  };

  const status = STATUS[saveStatus];
  const ident  = data.perfil?.nombre || data.perfil?.alias || 'IDENT_PENDING';

  return (
    <div className="form-shell">
      <div className="scan-line scan-line--primary" />
      <div className="scan-line scan-line--secondary" />

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="hud-header no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div className="hud-title" style={{ fontSize: '0.8rem' }}>
            EXPEDIENTE // {ident}
          </div>
          {status && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: status.color,
              animation: status.anim,
              letterSpacing: '1px',
            }}>
              {status.label}
            </span>
          )}
        </div>
        <div className="hud-actions">
          <span className="hint-text">CTRL+S para guardar</span>
          <button className="cyber-button" onClick={handleSaveNow} disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving' ? '⟳' : '[ GUARDAR ]'}
          </button>
          <button className="cyber-button" onClick={() => window.print()}>PDF</button>
          <button className="cyber-button cyber-button--magenta" onClick={onClose}>CERRAR</button>
        </div>
      </header>

      {/* ── Tab bar ────────────────────────────────────────────── */}
      <div className="tab-bar no-print" style={{ padding: '0 1.5rem' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab content — key fuerza re-animación al cambiar tab ─ */}
      <div className="form-body">
        <div key={activeTab} className="tab-content">
          {activeTab === 'perfil'         && <TabPerfil         data={data} update={update} />}
          {activeTab === 'estado'         && <TabEstado         data={data} update={update} />}
          {activeTab === 'manipulaciones' && <TabManipulaciones data={data} update={update} />}
          {activeTab === 'rasgos'         && <TabRasgos         data={data} update={update} />}
          {activeTab === 'armamento'      && <TabArmamento      data={data} update={update} />}
          {activeTab === 'inventario'     && <TabInventario     data={data} update={update} />}
          {activeTab === 'naturaleza'     && <TabNaturaleza     data={data} update={update} />}
        </div>
      </div>
    </div>
  );
}

function mergeWithDefaults(saved) {
  if (!saved) return structuredClone(DEFAULT_CHARACTER);
  return deepMerge(structuredClone(DEFAULT_CHARACTER), saved);
}

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
