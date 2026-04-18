import React from 'react';
import StatDiamond from './stats/StatDiamond';
import SquareStat from './stats/SquareStat';

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

const VIRT_LABELS = { autocontrol: 'AUTOCONTROL', alerta: 'ALERTA', valentia: 'VALENTÍA' };

const PYRAMID_ROWS = [
  [1,2],[3,4],[5,6,7],[8,9,10],[11,12,13,14],[15,16,17,18],
  [19,20,21,22,23],[24,25,26,27,28],[29,30,31,32,33,34],
  [35,36,37,38,39,40,41],[42]
];

export default function CharacterSheet({ characterData, onEdit, onBack }) {
  if (!characterData) return null;
  const d = characterData.data;
  const ev = d.estados_vitales || {};

  const InfoRow = ({ label, value, color }) => (
    <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(0,243,255,0.06)', paddingBottom: '3px' }}>
      <span style={{ fontSize: '0.5rem', opacity: 0.5, minWidth: '60px', fontFamily: 'var(--font-mono)', alignSelf: 'center' }}>{label}:</span>
      <span style={{ fontSize: '0.8rem', color: color || 'inherit' }}>{value || '---'}</span>
    </div>
  );

  return (
    <div className="sheet-shell">
      <div className="scan-line" />

      <header className="hud-header no-print">
        <div className="hud-title">
          EXPEDIENTE // {d.perfil?.nombre || d.perfil?.alias || 'DESCONOCIDO'}
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button className="cyber-button" onClick={onEdit}>MODIFICAR</button>
          <button className="cyber-button cyber-button--green" onClick={() => window.print()}>IMPRIMIR_PDF</button>
          <button className="cyber-button cyber-button--magenta" onClick={onBack}>SALIR</button>
        </div>
      </header>

      <div className="sheet-body">

        {/* ── COLUMNA IZQUIERDA ─────────────────────────────── */}
        <div className="sheet-col">

          {/* IDENTIFICACIÓN */}
          <div className="glass-panel glass-panel--cyan">
            <div className="section-header section-header--cyan" style={{ fontSize: '0.6rem' }}>[ IDENTIFICACIÓN ]</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <InfoRow label="NOMBRE"    value={d.perfil?.nombre} />
              <InfoRow label="ALIAS"     value={d.perfil?.alias}     color="var(--neon-magenta)" />
              <InfoRow label="CLASE"     value={d.perfil?.claseCentinela} color="var(--neon-cyan)" />
              <InfoRow label="FACCIÓN"   value={d.afiliacion?.faccionActual} color="var(--neon-cyan)" />
              <InfoRow label="CLAN"      value={d.afiliacion?.clanActual} color="var(--neon-cyan)" />
              <InfoRow label="EDAD"      value={d.perfil?.edad} />
              <InfoRow label="APARENTA"  value={d.perfil?.edadAparenta} />
              <InfoRow label="F.NAC"     value={d.perfil?.fechaNacimiento} />
              <InfoRow label="ESTATURA"  value={d.perfil?.estatura} />
              <InfoRow label="PESO"      value={d.perfil?.peso} />
              <InfoRow label="NACION."   value={d.perfil?.nacionalidad} />
              <InfoRow label="RESIDENCIA" value={d.perfil?.residencia} />
              <InfoRow label="E.CIVIL"   value={d.perfil?.estadoCivil} />
              <InfoRow label="OFICIO"    value={d.perfil?.oficio} />
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          {d.perfil?.descripcion && (
            <div className="glass-panel glass-panel--cyan">
              <div className="section-header section-header--cyan" style={{ fontSize: '0.6rem' }}>[ DESCRIPCIÓN_&amp;_HISTORIA ]</div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', lineHeight: '1.6', color: 'var(--text-dim)', whiteSpace: 'pre-wrap', margin: 0 }}>
                {d.perfil.descripcion}
              </p>
            </div>
          )}

          {/* AFILIACIÓN */}
          <div className="glass-panel glass-panel--magenta">
            <div className="section-header section-header--magenta" style={{ fontSize: '0.6rem' }}>[ AFILIACIÓN ]</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.75rem' }}>
              <div>
                <div style={{ opacity: 0.5, fontSize: '0.5rem', fontFamily: 'var(--font-mono)' }}>PREVIO</div>
                <div>{d.afiliacion?.faccionPrevia || '---'}</div>
                <div style={{ opacity: 0.6 }}>{d.afiliacion?.clanPrevio || '---'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--neon-cyan)', fontSize: '0.5rem', fontFamily: 'var(--font-mono)' }}>ACTUAL</div>
                <div style={{ color: 'var(--neon-cyan)' }}>{d.afiliacion?.faccionActual || '---'}</div>
                <div style={{ color: 'var(--neon-cyan)', opacity: 0.8 }}>{d.afiliacion?.clanActual || '---'}</div>
              </div>
            </div>
          </div>

          {/* ACADÉMICO */}
          <div className="glass-panel glass-panel--cyan">
            <div className="section-header section-header--cyan" style={{ fontSize: '0.6rem' }}>[ REGISTRO_ACADÉMICO ]</div>
            <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <InfoRow label="ESTUDIOS" value={Array.isArray(d.perfil?.estudios) ? d.perfil.estudios.filter(Boolean).join(', ') : d.perfil?.estudios} />
              <InfoRow label="IDIOMAS"  value={Array.isArray(d.perfil?.idiomas)  ? d.perfil.idiomas.filter(Boolean).join(', ')  : d.perfil?.idiomas} />
              <InfoRow label="HOBBIES"  value={Array.isArray(d.perfil?.hobbies)  ? d.perfil.hobbies.filter(Boolean).join(', ')  : d.perfil?.hobbies} />
            </div>
          </div>

          {/* NATURALEZA */}
          {d.naturaleza && (
            <div className="glass-panel glass-panel--top-cyan">
              <div className="section-header section-header--cyan" style={{ fontSize: '0.6rem' }}>[ NATURALEZA ]</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[['INSTINTO', 'instinto'], ['LIBERTAD', 'libertad'], ['HUMANISMO', 'humanismo']].map(([l, k]) => (
                  <div key={k} className="stat-row">
                    <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{l}</span>
                    <SquareStat value={d.naturaleza[k] || 0} max={5} rows={1} readOnly />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXPERIENCIA */}
          {d.experiencia && (
            <div className="glass-panel glass-panel--amber">
              <div className="section-header section-header--amber" style={{ fontSize: '0.6rem' }}>[ EXPERIENCIA ]</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                {[['GASTADA', 'gastada'], ['SALDO', 'saldo'], ['TOTAL', 'total']].map(([l, k]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ opacity: 0.6, fontSize: '0.6rem' }}>{l}:</span>
                    <span style={{ color: 'var(--neon-amber)' }}>{d.experiencia[k] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONEXIONES */}
          {d.conexiones?.length > 0 && (
            <div className="glass-panel glass-panel--amber">
              <div className="section-header section-header--amber" style={{ fontSize: '0.6rem' }}>[ CONEXIONES ]</div>
              {d.conexiones.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted rgba(255,179,0,0.1)', padding: '3px 0', fontSize: '0.75rem' }}>
                  <span>{c.nombre}</span>
                  <span style={{ opacity: 0.6 }}>{c.clan}</span>
                </div>
              ))}
            </div>
          )}

          {/* ECONOMÍA */}
          {d.economia?.registros?.length > 0 && (
            <div className="glass-panel glass-panel--green">
              <div className="section-header section-header--cyan" style={{ color: 'var(--neon-green)', borderColor: 'rgba(57,255,20,0.2)', fontSize: '0.6rem' }}>[ ECONOMÍA ]</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                <span style={{ opacity: 0.7, fontSize: '0.65rem' }}>BALANCE:</span>
                <span style={{ color: 'var(--neon-green)', fontWeight: 'bold' }}>
                  {d.economia.registros.reduce((s, r) => s + (Number(r.ingreso)||0) - (Number(r.egreso)||0), 0)} MP
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── COLUMNA DERECHA ───────────────────────────────── */}
        <div className="sheet-col">

          {/* EVALUACIÓN: ATRIBUTOS + DONES */}
          <div className="glass-panel glass-panel--top-cyan">
            <div className="section-header section-header--cyan" style={{ textAlign: 'center' }}>EVALUACIÓN DEL SUJETO</div>
            <div className="form-grid--2" style={{ maxWidth: '700px', margin: '0 auto', gap: '2rem' }}>
              <div style={{ flex: 1 }}>
                <div className="hud-label hud-label--cyan" style={{ marginBottom: '0.8rem' }}>ATRIBUTOS</div>
                {Object.entries(d.atributos || {}).map(([k, s]) => (
                  <div key={k} className="stat-row" style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>{ATTR_LABELS[k] || k}</span>
                    <StatDiamond value={s?.val || 0} blockedBits={s?.blocked || 0} max={5} readOnly />
                  </div>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <div className="hud-label hud-label--magenta" style={{ marginBottom: '0.8rem' }}>DONES</div>
                {Object.entries(d.dones || {}).map(([k, s]) => (
                  <div key={k} className="stat-row" style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>{DONES_LABELS[k] || k}</span>
                    <StatDiamond value={s?.val || 0} blockedBits={s?.blocked || 0} max={2} readOnly />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RESISTENCIA */}
          <div className="glass-panel glass-panel--top-magenta">
            <div className="section-header section-header--magenta" style={{ textAlign: 'center' }}>RESISTENCIA</div>
            <div className="form-grid--2" style={{ maxWidth: '700px', margin: '0 auto', gap: '2rem' }}>
              <div style={{ flex: 1 }}>
                {/* Vigor */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div className="hud-label" style={{ marginBottom: '4px', paddingLeft: '40px' }}>VIGOR</div>
                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <div style={{ width: '40px' }} />
                    <SquareStat value={ev.vigor || 0} max={20} rows={2} markers={[1,2,3]} readOnly />
                  </div>
                </div>
                {/* Constitución */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div className="hud-label" style={{ marginBottom: '4px', paddingLeft: '40px' }}>CONSTITUCIÓN</div>
                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <div style={{ width: '40px' }} />
                    <SquareStat value={ev.constitucion || 0} max={10} rows={1} markers={[1,2,3]} readOnly />
                  </div>
                </div>
                {/* Cordura */}
                <div className="hud-label hud-label--cyan" style={{ marginBottom: '0.8rem', paddingLeft: '40px' }}>CORDURA</div>
                {[1,2,3,4].map(nv => (
                  <div key={nv} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.6rem', width: '40px', opacity: 0.5, fontFamily: 'var(--font-mono)' }}>Nv {nv}</span>
                    <SquareStat value={ev.cordura?.[`nv${nv}`] || 0} max={5} rows={1} markers={nv===1?[1,2,3]:[]} readOnly />
                    <span style={{ fontSize: '0.65rem', width: '25px', textAlign: 'center', fontWeight: 'bold' }}>{nv * 5}</span>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', minWidth: '55px' }}>{ev.corduraNotas?.[`nv${nv}`] || '---'}</span>
                  </div>
                ))}
              </div>

              {/* Virtudes + Voluntad */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="glass-panel glass-panel--top-cyan" style={{ marginBottom: '0' }}>
                  <div className="hud-label hud-label--cyan" style={{ marginBottom: '0.8rem' }}>[ VIRTUDES ]</div>
                  {Object.entries(d.virtudes || {}).map(([k, s]) => (
                    <div key={k} className="stat-row" style={{ marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>{VIRT_LABELS[k]}</span>
                      <StatDiamond value={s?.val || 0} blockedBits={s?.blocked || 0} max={5} readOnly />
                    </div>
                  ))}
                </div>
                <div className="glass-panel glass-panel--top-cyan">
                  <div className="hud-label hud-label--cyan" style={{ marginBottom: '0.8rem' }}>[ VOLUNTAD ]</div>
                  <SquareStat value={ev.voluntad || 0} max={10} rows={1} readOnly />
                </div>
              </div>
            </div>
          </div>

          {/* MANIPULACIONES + RASGOS */}
          <div className="form-grid--3" style={{ gap: '1.5rem' }}>
            <div className="glass-panel glass-panel--top-magenta">
              <div className="hud-label hud-label--magenta" style={{ marginBottom: '0.8rem' }}>[ CLAN ]</div>
              {Object.entries(d.manipulaciones?.clanes || {})
                .filter(([, v]) => (v?.val || 0) > 0)
                .map(([k, v]) => (
                  <div key={k} className="stat-row" style={{ marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7rem' }}>{k}</span>
                    <StatDiamond value={v?.val || 0} max={4} readOnly />
                  </div>
                ))}
            </div>

            <div className="glass-panel glass-panel--top-cyan">
              <div className="hud-label hud-label--cyan" style={{ marginBottom: '0.8rem' }}>[ ESFERAS ]</div>
              {Object.entries(d.manipulaciones?.esferas?.poderes || {})
                .filter(([, v]) => (v || 0) > 0)
                .map(([k, v]) => (
                  <div key={k} className="stat-row" style={{ marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--neon-cyan)' }}>{k}</span>
                    <StatDiamond value={v || 0} max={4} readOnly />
                  </div>
                ))}
            </div>

            <div className="glass-panel">
              <div className="hud-label" style={{ marginBottom: '0.8rem' }}>[ RASGOS ]</div>
              {d.rasgos?.filter(r => r.nombre).map(r => (
                <div key={r.id} className="stat-row" style={{ marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.7rem' }}>{r.nombre}</span>
                  <span style={{ color: 'var(--neon-magenta)', fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>{r.nivel}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LA VERDAD */}
          {d.laVerdad && (
            <div className="glass-panel glass-panel--top-magenta">
              <div className="section-header section-header--magenta" style={{ fontSize: '0.6rem' }}>[ LA VERDAD ]</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {PYRAMID_ROWS.map((row, rowIdx) => (
                  <div key={rowIdx} style={{ display: 'flex', gap: '4px' }}>
                    {row.map(n => (
                      <div key={n} style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        border: `1.5px solid ${d.laVerdad.nodos[n] ? 'var(--neon-magenta)' : 'rgba(255,0,85,0.2)'}`,
                        background: d.laVerdad.nodos[n] ? 'rgba(255,0,85,0.4)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.55rem', fontFamily: 'var(--font-mono)',
                        color: d.laVerdad.nodos[n] ? 'var(--neon-magenta)' : 'var(--text-dimmer)'
                      }}>
                        {n}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <footer className="no-print" style={{ padding: '0.8rem 1.5rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dimmer)' }}>
        SISTEMA CRÓNICA v2 // PROTOCOLO SENTINEL // ACCESO NIVEL 4
      </footer>
    </div>
  );
}
