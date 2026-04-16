import React, { useState } from 'react';
import { CLAN_MANIPULATIONS } from '../../data/manipulationsCatalog';

const FACCIONES_VALIDAS = Object.keys(CLAN_MANIPULATIONS).filter(f => f !== 'PARTICULARES');

/* ── Panel colapsable ────────────────────────────────────────── */
function Section({ id, title, color = 'cyan', collapsed, onToggle, children }) {
  const colorMap = {
    cyan:    { panel: 'glass-panel--cyan',    header: 'section-header--cyan',    arrow: 'var(--neon-cyan)' },
    magenta: { panel: 'glass-panel--magenta', header: 'section-header--magenta', arrow: 'var(--neon-magenta)' },
    amber:   { panel: 'glass-panel--amber',   header: 'section-header--amber',   arrow: 'var(--neon-amber)' },
    green:   { panel: 'glass-panel--green',   header: 'section-header--cyan',    arrow: 'var(--neon-green)' },
  };
  const c = colorMap[color];

  return (
    <div className={`glass-panel ${c.panel}`}>
      <button
        onClick={() => onToggle(id)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          marginBottom: collapsed ? 0 : undefined,
        }}
      >
        <div className={`section-header ${c.header}`} style={{ margin: 0, border: 'none', paddingBottom: 0, flex: 1, textAlign: 'left' }}>
          {title}
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: c.arrow,
          marginLeft: '1rem',
          transition: 'transform 0.25s ease',
          transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
          display: 'inline-block',
        }}>
          ▼
        </span>
      </button>

      {!collapsed && (
        <div style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: `1px solid rgba(255,255,255,0.06)`,
          animation: 'fade-up 0.2s ease',
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */

export default function TabPerfil({ data, update }) {
  const { perfil, afiliacion, conexiones, economia } = data;

  const [collapsed, setCollapsed] = useState(new Set());
  const toggle = (id) => setCollapsed(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  /* helpers listas dinámicas */
  const listField = (field, arr) => ({
    onChange: (idx, val) => { const next = [...arr]; next[idx] = val; update('perfil', field, next); },
    onAdd:    ()          => update('perfil', field, [...arr, '']),
    onRemove: (idx)       => { const next = arr.filter((_, i) => i !== idx); update('perfil', field, next.length ? next : ['']); }
  });

  const estudiosCtrl = listField('estudios', perfil.estudios);
  const idiomasCtrl  = listField('idiomas',  perfil.idiomas);
  const hobbiesCtrl  = listField('hobbies',  perfil.hobbies);
  const nacionalidadCtrl = listField('nacionalidad', perfil.nacionalidad);

  const totalIngresos = economia.registros.reduce((s, r) => s + (Number(r.ingreso) || 0), 0);
  const totalEgresos  = economia.registros.reduce((s, r) => s + (Number(r.egreso)  || 0), 0);
  const balance       = totalIngresos - totalEgresos;

  return (
    <div className="form-section">

      {/* ── IDENTIFICACIÓN ─────────────────────────────────── */}
      <Section id="ident" title="[ IDENTIFICACIÓN ]" color="cyan" collapsed={collapsed.has('ident')} onToggle={toggle}>
        <div className="form-section">
          {/* Fila 1: Datos de Registro Core */}
          <div className="field-row field-row--3">
            <div className="field-group">
              <label className="hud-label">NOMBRE COMPLETO</label>
              <input className="cyber-input" value={perfil.nombre}
                onChange={e => update('perfil', 'nombre', e.target.value)} />
            </div>
            <div className="field-group">
              <label className="hud-label">ALIAS</label>
              <input className="cyber-input" value={perfil.alias}
                onChange={e => update('perfil', 'alias', e.target.value)} />
            </div>
            <div className="field-group">
              <label className="hud-label">CLASE CENTINELA</label>
              <input className="cyber-input" value={perfil.claseCentinela}
                onChange={e => update('perfil', 'claseCentinela', e.target.value)} />
            </div>
          </div>

          {/* Fila 2: Datos Temporales */}
          <div className="field-row field-row--3">
            <div className="field-group">
              <label className="hud-label">EDAD</label>
              <input className="cyber-input" value={perfil.edad}
                onChange={e => update('perfil', 'edad', e.target.value)} />
            </div>
            <div className="field-group">
              <label className="hud-label">EDAD APARENTE</label>
              <input className="cyber-input" value={perfil.edadAparenta}
                onChange={e => update('perfil', 'edadAparenta', e.target.value)} />
            </div>
            <div className="field-group">
              <label className="hud-label">FECHA NACIMIENTO</label>
              <input className="cyber-input" value={perfil.fechaNacimiento}
                onChange={e => update('perfil', 'fechaNacimiento', e.target.value)} />
            </div>
          </div>

          {/* Fila 3: Biometría */}
          <div className="field-row field-row--3">
            <div className="field-group">
              <label className="hud-label">ESTATURA</label>
              <input className="cyber-input" value={perfil.estatura}
                onChange={e => update('perfil', 'estatura', e.target.value)} />
            </div>
            <div className="field-group">
              <label className="hud-label">PESO</label>
              <input className="cyber-input" value={perfil.peso}
                onChange={e => update('perfil', 'peso', e.target.value)} />
            </div>
            <div className="field-group">
              <label className="hud-label">CONTEXTURA</label>
              <input className="cyber-input" value={perfil.contextura}
                onChange={e => update('perfil', 'contextura', e.target.value)} />
            </div>
          </div>

          {/* Fila 4: Origen y Estatus (Multinacionalidad) */}
          <div className="field-row field-row--2">
            <div className="field-group">
              <label className="hud-label">NACIONALIDADES</label>
              <div className="dynamic-list">
                {perfil.nacionalidad.map((item, idx) => (
                  <div key={idx} className="dynamic-list__item">
                    <input className="cyber-input" value={item} 
                      onChange={e => nacionalidadCtrl.onChange(idx, e.target.value)} />
                    {perfil.nacionalidad.length > 1 ? (
                      <button className="dynamic-list__remove" title="Eliminar" onClick={() => nacionalidadCtrl.onRemove(idx)}>×</button>
                    ) : (
                      <button className="cyber-button" style={{ padding: '0.6rem 1rem', flexShrink: 0 }} 
                        onClick={nacionalidadCtrl.onAdd}>+ AGREGAR</button>
                    )}
                  </div>
                ))}
                {perfil.nacionalidad.length > 1 && (
                  <button className="cyber-button cyber-button--add" onClick={nacionalidadCtrl.onAdd}>+ VINCULAR OTRA NACIONALIDAD</button>
                )}
              </div>
            </div>
            <div className="form-section">
              <div className="field-group">
                <label className="hud-label">RESIDENCIA</label>
                <input className="cyber-input" value={perfil.residencia}
                  onChange={e => update('perfil', 'residencia', e.target.value)} />
              </div>
              <div className="field-row field-row--2">
                <div className="field-group">
                  <label className="hud-label">ESTADO CIVIL</label>
                  <input className="cyber-input" value={perfil.estadoCivil}
                    onChange={e => update('perfil', 'estadoCivil', e.target.value)} />
                </div>
                <div className="field-group">
                  <label className="hud-label">OFICIO</label>
                  <input className="cyber-input" value={perfil.oficio}
                    onChange={e => update('perfil', 'oficio', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Fila 5: Narrativa */}
          <div className="field-group">
            <label className="hud-label">DESCRIPCIÓN &amp; HISTORIA</label>
            <textarea
              className="cyber-input"
              rows={4}
              style={{ resize: 'vertical' }}
              value={perfil.descripcion || ''}
              onChange={e => update('perfil', 'descripcion', e.target.value)}
              placeholder="Antecedentes, apariencia, motivaciones..."
            />
          </div>
        </div>
      </Section>

      {/* ── AFILIACIÓN ─────────────────────────────────────── */}
      <Section id="afil" title="[ AFILIACIÓN ]" color="magenta" collapsed={collapsed.has('afil')} onToggle={toggle}>
        <div className="field-row field-row--2">
          {/* IDENTIDAD PREVIA */}
          <div className="form-section" style={{ gap: '1rem' }}>
            <div className="hud-label" style={{ opacity: 0.5 }}>IDENTIDAD PREVIA</div>
            
            <div className="field-group">
              <label className="hud-label">FACCIÓN</label>
              <select className="cyber-select" value={afiliacion.faccionPrevia}
                onChange={e => {
                  update('afiliacion', 'faccionPrevia', e.target.value);
                  update('afiliacion', 'clanPrevio', ''); // Reset clan when faction changes
                }}>
                <option value="">[ SELECCIONAR FACCIÓN ]</option>
                {FACCIONES_VALIDAS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="field-group">
              <label className="hud-label">CLAN</label>
              <select className="cyber-select" value={afiliacion.clanPrevio}
                onChange={e => update('afiliacion', 'clanPrevio', e.target.value)}
                disabled={!afiliacion.faccionPrevia}>
                <option value="">[ SELECCIONAR CLAN ]</option>
                {afiliacion.faccionPrevia && (CLAN_MANIPULATIONS[afiliacion.faccionPrevia] || []).map(c => (
                  <option key={c.category} value={c.category}>{c.category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* IDENTIDAD ACTUAL */}
          <div className="form-section" style={{ gap: '1rem' }}>
            <div className="hud-label">IDENTIDAD ACTUAL</div>
            
            <div className="field-group">
              <label className="hud-label" style={{ color: 'var(--neon-cyan)' }}>FACCIÓN</label>
              <select className="cyber-select" value={afiliacion.faccionActual}
                onChange={e => {
                  update('afiliacion', 'faccionActual', e.target.value);
                  update('afiliacion', 'clanActual', ''); // Reset clan
                }}>
                <option value="">[ SELECCIONAR FACCIÓN ]</option>
                {FACCIONES_VALIDAS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="field-group">
              <label className="hud-label" style={{ color: 'var(--neon-cyan)' }}>CLAN</label>
              <select className="cyber-select" value={afiliacion.clanActual}
                onChange={e => update('afiliacion', 'clanActual', e.target.value)}
                disabled={!afiliacion.faccionActual}>
                <option value="">[ SELECCIONAR CLAN ]</option>
                {afiliacion.faccionActual && (CLAN_MANIPULATIONS[afiliacion.faccionActual] || []).map(c => (
                  <option key={c.category} value={c.category}>{c.category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FORMACIÓN ──────────────────────────────────────── */}
      <Section id="form" title="[ FORMACIÓN ACADÉMICA ]" color="amber" collapsed={collapsed.has('form')} onToggle={toggle}>
        <div className="form-section" style={{ gap: '1.5rem' }}>
          <div>
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>NOMBRE</th>
                  <th style={{ width: '220px' }}>CATEGORÍA</th>
                  <th style={{ width: '32px' }}></th>
                </tr>
              </thead>
              <tbody>
                {(perfil.formaciones || []).map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <input className="cyber-input cyber-input--sm" value={item.nombre}
                        onChange={e => { const next = [...perfil.formaciones]; next[idx] = { ...next[idx], nombre: e.target.value }; update('perfil', 'formaciones', next); }} />
                    </td>
                    <td>
                      <select className="cyber-select" value={item.tipo}
                        onChange={e => { const next = [...perfil.formaciones]; next[idx] = { ...next[idx], tipo: e.target.value }; update('perfil', 'formaciones', next); }}>
                        <option value="OFICIO">OFICIO</option>
                        <option value="FORMACIÓN ACADÉMICA">FORMACIÓN ACADÉMICA</option>
                      </select>
                    </td>
                    <td>
                      <button className="dynamic-list__remove" onClick={() => update('perfil', 'formaciones', perfil.formaciones.filter((_, i) => i !== idx))}>×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="cyber-button cyber-button--add cyber-button--add-amber"
              onClick={() => update('perfil', 'formaciones', [...(perfil.formaciones || []), { nombre: '', tipo: 'FORMACIÓN ACADÉMICA' }])}>
              + REGISTRAR FORMACIÓN
            </button>
          </div>

          <div className="field-group">
            <label className="hud-label">IDIOMAS</label>
            <div className="dynamic-list">
              {perfil.idiomas.map((item, idx) => (
                <div key={idx} className="dynamic-list__item">
                  <input className="cyber-input" value={item} onChange={e => idiomasCtrl.onChange(idx, e.target.value)} />
                  <button className="dynamic-list__remove" onClick={() => idiomasCtrl.onRemove(idx)}>×</button>
                </div>
              ))}
              <button className="cyber-button cyber-button--add cyber-button--add-amber" onClick={idiomasCtrl.onAdd}>+ VINCULAR IDIOMA</button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── CONEXIONES ─────────────────────────────────────── */}
      <Section id="con" title="[ RED DE CONTACTOS ]" color="amber" collapsed={collapsed.has('con')} onToggle={toggle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {conexiones.map((con, idx) => (
            <div key={idx} className="glass-panel" style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 28px', gap: '1rem', alignItems: 'end',
              padding: '1rem', background: 'rgba(255,159,67,0.02)', borderLeft: '2px solid var(--neon-amber)'
            }}>
              {[ ['NOMBRE', 'nombre'], ['CLAN', 'clan'], ['VÍNCULO', 'tipo'], ['FACCIÓN', 'faccion'] ].map(([label, k]) => (
                <div key={k} className="field-group">
                  <label className="hud-label" style={{ fontSize: '0.5rem' }}>{label}</label>
                  <input className="cyber-input cyber-input--sm" value={con[k]}
                    onChange={e => { const next = [...conexiones]; next[idx] = { ...next[idx], [k]: e.target.value }; update('conexiones', null, next); }} />
                </div>
              ))}
              <button className="dynamic-list__remove" style={{ paddingBottom: '8px' }}
                onClick={() => update('conexiones', null, conexiones.filter((_, i) => i !== idx))}>×</button>
            </div>
          ))}
        </div>
        <button className="cyber-button cyber-button--add cyber-button--add-amber"
          onClick={() => update('conexiones', null, [...conexiones, { nombre: '', clan: '', tipo: '', faccion: '' }])}>
          + ESTABLECER CONEXIÓN
        </button>
      </Section>

      {/* ── ECONOMÍA ───────────────────────────────────────── */}
      <Section id="eco" title="[ REGISTRO FINANCIERO ]" color="green" collapsed={collapsed.has('eco')} onToggle={toggle}>
        <table className="cyber-table">
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th style={{ width: '180px' }}>TIPO DE BIEN</th>
              <th style={{ width: '130px' }}>ENTRADA</th>
              <th style={{ width: '130px' }}>SALIDA</th>
              <th style={{ width: '32px' }}></th>
            </tr>
          </thead>
          <tbody>
            {(economia.registros || []).map((reg, idx) => (
              <tr key={idx}>
                <td>
                  <input className="cyber-input cyber-input--sm" value={reg.descripcion} placeholder="Nombre..."
                    onChange={e => { const next = [...economia.registros]; next[idx] = { ...next[idx], descripcion: e.target.value }; update('economia', 'registros', next); }} />
                </td>
                <td>
                  <select className="cyber-select" value={reg.tipo || ''}
                    onChange={e => { const next = [...economia.registros]; next[idx] = { ...next[idx], tipo: e.target.value }; update('economia', 'registros', next); }}>
                    <option value="">SELECCIONAR...</option>
                    <option value="SUELDO">SUELDO</option>
                    <option value="EFECTIVO">EFECTIVO</option>
                    <option value="BIEN">BIEN</option>
                    <option value="OTRO">OTRO</option>
                  </select>
                </td>
                <td>
                  <input className="cyber-input cyber-input--sm" placeholder="0" value={reg.ingreso}
                    onChange={e => { const next = [...economia.registros]; next[idx] = { ...next[idx], ingreso: e.target.value }; update('economia', 'registros', next); }} />
                </td>
                <td>
                  <input className="cyber-input cyber-input--sm" style={{ color: 'var(--neon-magenta)' }} placeholder="0" value={reg.egreso}
                    onChange={e => { const next = [...economia.registros]; next[idx] = { ...next[idx], egreso: e.target.value }; update('economia', 'registros', next); }} />
                </td>
                <td>
                  <button className="dynamic-list__remove" onClick={() => update('economia', 'registros', economia.registros.filter((_, i) => i !== idx))}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="cyber-button cyber-button--add cyber-button--add-green"
          onClick={() => update('economia', 'registros', [...(economia.registros || []), { descripcion: '', tipo: '', ingreso: '', egreso: '' }])}>
          + REGISTRAR MOVIMIENTO
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
          <div className="glass-panel" style={{ padding: '0.8rem 1.5rem', border: '1px solid rgba(8, 247, 206, 0.3)', background: 'rgba(8,247,206,0.05)', maxWidth: 'fit-content' }}>
            <span className="hud-label" style={{ display: 'inline', marginRight: '1rem', marginBottom: 0 }}>BALANCE:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: balance >= 0 ? 'var(--neon-green)' : 'var(--neon-magenta)', fontSize: '1.2rem' }}>
              {balance} MP
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)', paddingLeft: '4px' }}>
            FLUJO ENTRADA: <span style={{ color: 'var(--neon-green)' }}>{totalIngresos} MP</span>
            &nbsp;&nbsp;·&nbsp;&nbsp;
            FLUJO SALIDA: <span style={{ color: 'var(--neon-magenta)' }}>{totalEgresos} MP</span>
          </div>
        </div>
      </Section>

    </div>
  );
}
