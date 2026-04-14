import React, { useState } from 'react';

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

  const totalIngresos = economia.registros.reduce((s, r) => s + (Number(r.ingreso) || 0), 0);
  const totalEgresos  = economia.registros.reduce((s, r) => s + (Number(r.egreso)  || 0), 0);
  const balance       = totalIngresos - totalEgresos;

  return (
    <div className="form-section">

      {/* ── IDENTIFICACIÓN ─────────────────────────────────── */}
      <Section id="ident" title="[ IDENTIFICACIÓN ]" color="cyan" collapsed={collapsed.has('ident')} onToggle={toggle}>
        <div className="form-section" style={{ gap: '1rem' }}>

          {/* Nombre completo ocupa todo el ancho */}
          <div className="field-group">
            <label className="hud-label">NOMBRE_COMPLETO</label>
            <input className="cyber-input" value={perfil.nombre}
              onChange={e => update('perfil', 'nombre', e.target.value)} />
          </div>

          <div className="field-row field-row--2">
            <div className="field-group">
              <label className="hud-label hud-label--magenta">ALIAS</label>
              <input className="cyber-input cyber-input--magenta" value={perfil.alias}
                onChange={e => update('perfil', 'alias', e.target.value)} />
            </div>
            <div className="field-group">
              <label className="hud-label hud-label--cyan">CLASE_CENTINELA</label>
              <input className="cyber-input" value={perfil.claseCentinela}
                onChange={e => update('perfil', 'claseCentinela', e.target.value)} />
            </div>
          </div>

          <div className="field-row field-row--3">
            <div className="field-group">
              <label className="hud-label">EDAD</label>
              <input className="cyber-input" value={perfil.edad}
                onChange={e => update('perfil', 'edad', e.target.value)} />
            </div>
            <div className="field-group">
              <label className="hud-label">EDAD_APARENTE</label>
              <input className="cyber-input" value={perfil.edadAparenta}
                onChange={e => update('perfil', 'edadAparenta', e.target.value)} />
            </div>
            <div className="field-group">
              <label className="hud-label">FECHA_NACIMIENTO</label>
              <input className="cyber-input" value={perfil.fechaNacimiento}
                onChange={e => update('perfil', 'fechaNacimiento', e.target.value)} />
            </div>
          </div>

          <div className="field-row field-row--3">
            {[['ESTATURA', 'estatura'], ['PESO', 'peso'], ['CONTEXTURA', 'contextura']].map(([l, k]) => (
              <div key={k} className="field-group">
                <label className="hud-label">{l}</label>
                <input className="cyber-input" value={perfil[k]}
                  onChange={e => update('perfil', k, e.target.value)} />
              </div>
            ))}
          </div>

          <div className="field-row field-row--4">
            {[
              ['NACIONALIDAD', 'nacionalidad'],
              ['RESIDENCIA', 'residencia'],
              ['ESTADO_CIVIL', 'estadoCivil'],
              ['OFICIO', 'oficio'],
            ].map(([l, k]) => (
              <div key={k} className="field-group">
                <label className="hud-label">{l}</label>
                <input className="cyber-input" value={perfil[k]}
                  onChange={e => update('perfil', k, e.target.value)} />
              </div>
            ))}
          </div>

          {/* Descripción / backstory */}
          <div className="field-group">
            <label className="hud-label hud-label--cyan">DESCRIPCIÓN_&amp;_HISTORIA</label>
            <textarea
              className="cyber-input"
              rows={4}
              style={{ resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '0.82rem', lineHeight: 1.6 }}
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
          <div className="form-section" style={{ gap: '0.8rem' }}>
            <div className="hud-label" style={{ opacity: 0.5 }}>PREVIA</div>
            {[['FACCIÓN', 'faccionPrevia'], ['CLAN', 'clanPrevio']].map(([l, k]) => (
              <div key={k} className="field-group">
                <label className="hud-label">{l}</label>
                <input className="cyber-input" value={afiliacion[k]}
                  onChange={e => update('afiliacion', k, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="form-section" style={{ gap: '0.8rem' }}>
            <div className="hud-label hud-label--cyan">ACTUAL</div>
            {[['FACCIÓN', 'faccionActual'], ['CLAN', 'clanActual']].map(([l, k]) => (
              <div key={k} className="field-group">
                <label className="hud-label hud-label--cyan">{l}</label>
                <input className="cyber-input" value={afiliacion[k]}
                  onChange={e => update('afiliacion', k, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FORMACIÓN ──────────────────────────────────────── */}
      <Section id="form" title="[ FORMACIÓN_ACADÉMICA ]" color="amber" collapsed={collapsed.has('form')} onToggle={toggle}>
        <div className="form-section" style={{ gap: '1.4rem' }}>

          {/* ── Tabla NOMBRE / TIPO ─────────────────────────── */}
          <div>
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>NOMBRE</th>
                  <th style={{ width: '200px' }}>CATEGORÍA</th>
                  <th style={{ width: '32px' }}></th>
                </tr>
              </thead>
              <tbody>
                {(perfil.formaciones || []).map((item, idx) => (
                  <tr key={idx} style={{ animation: 'slide-in-left 0.2s ease both', animationDelay: `${idx * 30}ms` }}>
                    <td>
                      <input
                        className="cyber-input cyber-input--sm cyber-input--amber"
                        placeholder="Nombre..."
                        value={item.nombre}
                        onChange={e => {
                          const next = [...perfil.formaciones];
                          next[idx] = { ...next[idx], nombre: e.target.value };
                          update('perfil', 'formaciones', next);
                        }}
                      />
                    </td>
                    <td>
                      <select
                        className="cyber-select cyber-select--amber"
                        value={item.tipo}
                        onChange={e => {
                          const next = [...perfil.formaciones];
                          next[idx] = { ...next[idx], tipo: e.target.value };
                          update('perfil', 'formaciones', next);
                        }}
                      >
                        <option value="OFICIO">OFICIO</option>
                        <option value="FORMACIÓN_ACADÉMICA">FORMACIÓN_ACADÉMICA</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="dynamic-list__remove"
                        onClick={() => update('perfil', 'formaciones', perfil.formaciones.filter((_, i) => i !== idx))}
                      >×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="cyber-button cyber-button--amber cyber-button--full"
              style={{ marginTop: '0.6rem' }}
              onClick={() => update('perfil', 'formaciones', [...(perfil.formaciones || []), { nombre: '', tipo: 'FORMACIÓN_ACADÉMICA' }])}
            >
              + AGREGAR_ENTRADA
            </button>
          </div>

          {/* ── IDIOMAS ─────────────────────────────────────── */}
          <div className="field-group">
            <label className="hud-label">IDIOMAS</label>
            <div className="dynamic-list">
              {perfil.idiomas.map((item, idx) => (
                <div key={idx} className="dynamic-list__item">
                  <input className="cyber-input cyber-input--amber" value={item}
                    onChange={e => idiomasCtrl.onChange(idx, e.target.value)} />
                  <button className="dynamic-list__remove" onClick={() => idiomasCtrl.onRemove(idx)}>×</button>
                </div>
              ))}
              <button className="dynamic-list__add dynamic-list__add--amber" onClick={idiomasCtrl.onAdd}>+ AGREGAR</button>
            </div>
          </div>

          {/* ── HOBBIES ─────────────────────────────────────── */}
          <div className="field-group">
            <label className="hud-label">HOBBIES</label>
            <div className="dynamic-list">
              {perfil.hobbies.map((item, idx) => (
                <div key={idx} className="dynamic-list__item">
                  <input className="cyber-input cyber-input--amber" value={item}
                    onChange={e => hobbiesCtrl.onChange(idx, e.target.value)} />
                  <button className="dynamic-list__remove" onClick={() => hobbiesCtrl.onRemove(idx)}>×</button>
                </div>
              ))}
              <button className="dynamic-list__add dynamic-list__add--amber" onClick={hobbiesCtrl.onAdd}>+ AGREGAR</button>
            </div>
          </div>

        </div>
      </Section>

      {/* ── CONEXIONES ─────────────────────────────────────── */}
      <Section id="con" title="[ CONEXIONES ]" color="amber" collapsed={collapsed.has('con')} onToggle={toggle}>
        {/* Cards de conexión en lugar de tabla */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {conexiones.map((con, idx) => (
            <div key={idx} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 28px',
              gap: '0.6rem',
              alignItems: 'center',
              padding: '0.6rem 0.8rem',
              border: '1px solid rgba(255,179,0,0.1)',
              borderLeft: '3px solid rgba(255,179,0,0.3)',
              background: 'rgba(255,179,0,0.02)',
              animation: 'slide-in-left 0.25s ease both',
              animationDelay: `${idx * 40}ms`,
            }}>
              {[
                ['NOMBRE_OPERATIVO', 'nombre'],
                ['CLAN / ORIGEN', 'clan'],
                ['TIPO_VÍNCULO', 'tipo'],
                ['FACCIÓN_AFÍN', 'faccion'],
              ].map(([placeholder, k]) => (
                <div key={k} className="field-group" style={{ gap: '2px' }}>
                  <label className="hud-label" style={{ fontSize: '0.48rem' }}>{placeholder}</label>
                  <input
                    className="cyber-input cyber-input--sm cyber-input--amber"
                    value={con[k]}
                    onChange={e => {
                      const next = [...conexiones];
                      next[idx] = { ...next[idx], [k]: e.target.value };
                      update('conexiones', null, next);
                    }}
                  />
                </div>
              ))}
              <button
                className="dynamic-list__remove"
                style={{ alignSelf: 'flex-end', paddingBottom: '4px' }}
                onClick={() => update('conexiones', null, conexiones.filter((_, i) => i !== idx))}
              >×</button>
            </div>
          ))}
        </div>
        <button
          className="cyber-button cyber-button--amber cyber-button--full"
          style={{ marginTop: '0.8rem' }}
          onClick={() => update('conexiones', null, [...conexiones, { nombre: '', clan: '', tipo: '', faccion: '' }])}
        >
          + ESTABLECER_NUEVA_CONEXIÓN
        </button>
      </Section>

      {/* ── ECONOMÍA ───────────────────────────────────────── */}
      <Section id="eco" title="[ ECONOMÍA ]" color="green" collapsed={collapsed.has('eco')} onToggle={toggle}>
        {/* Campos base */}
        <div className="field-row field-row--2" style={{ marginBottom: '1.5rem' }}>
          {[
            ['INGRESO_MENSUAL', 'ingresoMensual'],
            ['OTROS_INGRESOS',  'otrosIngresos'],
            ['TERRITORIOS',     'territorios'],
            ['OTROS_BIENES',    'otrosBienes'],
          ].map(([l, k]) => (
            <div key={k} className="field-group">
              <label className="hud-label">{l}</label>
              <input className="cyber-input cyber-input--green" value={economia[k]}
                onChange={e => update('economia', k, e.target.value)} />
            </div>
          ))}
        </div>

        {/* Tabla de transacciones */}
        <table className="cyber-table">
          <thead>
            <tr>
              <th>DESCRIPTOR</th>
              <th style={{ width: '110px' }}>INGRESO</th>
              <th style={{ width: '110px' }}>EGRESO</th>
              <th style={{ width: '32px' }}></th>
            </tr>
          </thead>
          <tbody>
            {economia.registros.map((reg, idx) => (
              <tr key={idx}>
                <td>
                  <input className="cyber-input cyber-input--sm cyber-input--green" value={reg.descripcion}
                    onChange={e => { const next = [...economia.registros]; next[idx] = { ...next[idx], descripcion: e.target.value }; update('economia', 'registros', next); }} />
                </td>
                <td>
                  <input className="cyber-input cyber-input--sm cyber-input--green cyber-input--center" placeholder="0" value={reg.ingreso}
                    onChange={e => { const next = [...economia.registros]; next[idx] = { ...next[idx], ingreso: e.target.value }; update('economia', 'registros', next); }} />
                </td>
                <td>
                  <input className="cyber-input cyber-input--sm cyber-input--magenta cyber-input--center" placeholder="0" value={reg.egreso}
                    onChange={e => { const next = [...economia.registros]; next[idx] = { ...next[idx], egreso: e.target.value }; update('economia', 'registros', next); }} />
                </td>
                <td>
                  <button className="dynamic-list__remove"
                    onClick={() => update('economia', 'registros', economia.registros.filter((_, i) => i !== idx))}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="cyber-button cyber-button--green cyber-button--full"
          style={{ marginTop: '0.8rem' }}
          onClick={() => update('economia', 'registros', [...economia.registros, { descripcion: '', ingreso: '', egreso: '' }])}
        >
          + REGISTRAR_TRANSACCIÓN
        </button>

        {/* Balance */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(57,255,20,0.15)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dimmer)' }}>
            Ingresos: <span style={{ color: 'var(--neon-green)' }}>{totalIngresos} MP</span>
            &nbsp;&nbsp;·&nbsp;&nbsp;
            Egresos: <span style={{ color: 'var(--neon-magenta)' }}>{totalEgresos} MP</span>
          </div>
          <div style={{ background: 'rgba(57,255,20,0.08)', padding: '0.4rem 1.2rem', border: '1px solid var(--neon-green)', borderRadius: 'var(--radius-sm)' }}>
            <span className="hud-label hud-label--green" style={{ display: 'inline', marginRight: '0.5rem' }}>BALANCE_NETO:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: balance >= 0 ? 'var(--neon-green)' : 'var(--neon-magenta)', fontSize: '1rem' }}>
              {balance} MP
            </span>
          </div>
        </div>
      </Section>

    </div>
  );
}
