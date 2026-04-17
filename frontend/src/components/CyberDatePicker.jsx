import React, { useState, useRef, useEffect } from 'react';

const MESES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
const DIAS  = ['LU','MA','MI','JU','VI','SÁ','DO'];

export default function CyberDatePicker({ value, onChange }) {
  const today   = new Date();
  const parsed  = value ? new Date(value + 'T00:00:00') : null;

  const [open,      setOpen]      = useState(false);
  const [viewYear,  setViewYear]  = useState(parsed?.getFullYear()  ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth()     ?? today.getMonth());
  const [editYear,  setEditYear]  = useState(false);
  const [yearInput, setYearInput] = useState('');

  const ref = useRef(null);

  /* cerrar al hacer click afuera */
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* sincronizar vista cuando cambia value externamente */
  useEffect(() => {
    if (parsed) { setViewYear(parsed.getFullYear()); setViewMonth(parsed.getMonth()); }
  }, [value]);

  /* navegación */
  const prevMonth = () => viewMonth === 0  ? (setViewMonth(11), setViewYear(y => y - 1)) : setViewMonth(m => m - 1);
  const nextMonth = () => viewMonth === 11 ? (setViewMonth(0),  setViewYear(y => y + 1)) : setViewMonth(m => m + 1);
  const prevYear  = () => setViewYear(y => y - 1);
  const nextYear  = () => setViewYear(y => y + 1);

  const confirmYear = () => {
    const y = parseInt(yearInput, 10);
    if (!isNaN(y) && y > 1000 && y < 2200) setViewYear(y);
    setEditYear(false);
  };

  /* construcción del grid */
  const firstWeekday = (() => { const d = new Date(viewYear, viewMonth, 1).getDay(); return d === 0 ? 6 : d - 1; })();
  const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells        = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const selectedDay = parsed?.getFullYear() === viewYear && parsed?.getMonth() === viewMonth ? parsed.getDate() : null;

  const selectDay = day => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    onChange(`${viewYear}-${m}-${d}`);
    setOpen(false);
  };

  const displayValue = parsed
    ? `${String(parsed.getDate()).padStart(2,'0')}  ${MESES[parsed.getMonth()]}  ${parsed.getFullYear()}`
    : '';

  /* ── estilos internos ── */
  const S = {
    wrap: { position: 'relative' },

    trigger: {
      background: 'rgba(15, 25, 45, 0.75)',
      border: `1px solid ${open ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.18)'}`,
      borderRadius: 'var(--radius-sm)',
      color: displayValue ? 'var(--text-primary)' : 'rgba(255,255,255,0.25)',
      fontFamily: 'var(--font-mono)',
      fontSize: '1rem',
      padding: '0.7rem 1rem',
      width: '100%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all var(--transition)',
      userSelect: 'none',
      boxShadow: open ? 'inset 0 2px 5px rgba(0,0,0,.5), 0 0 20px rgba(0,210,255,.2)' : 'inset 0 2px 5px rgba(0,0,0,.5)',
    },

    popup: {
      position: 'absolute',
      top: 'calc(100% + 6px)',
      left: 0,
      zIndex: 9999,
      minWidth: '280px',
      background: 'rgba(5, 8, 18, 0.98)',
      border: '1px solid var(--glass-border-cyan)',
      borderRadius: 'var(--radius-md)',
      padding: '1rem',
      boxShadow: '0 8px 40px rgba(0,0,0,.7), 0 0 30px rgba(0,210,255,.12)',
      animation: 'fade-up 0.15s ease',
      backdropFilter: 'blur(16px)',
    },

    navBtn: {
      background: 'none',
      border: 'none',
      color: 'var(--neon-cyan)',
      cursor: 'pointer',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.75rem',
      padding: '0.25rem 0.5rem',
      borderRadius: 'var(--radius-sm)',
      transition: 'all var(--transition)',
      lineHeight: 1,
    },

    monthLabel: {
      fontFamily: 'var(--font-display)',
      fontSize: '0.65rem',
      letterSpacing: '3px',
      color: 'var(--neon-cyan)',
      textTransform: 'uppercase',
      cursor: 'default',
    },

    yearLabel: {
      fontFamily: 'var(--font-mono)',
      fontSize: '0.9rem',
      color: 'var(--text-primary)',
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      padding: '0.1rem 0.4rem',
      borderRadius: 'var(--radius-sm)',
      transition: 'all var(--transition)',
    },

    yearInput: {
      background: 'rgba(0,210,255,0.08)',
      border: '1px solid var(--neon-cyan)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--neon-cyan)',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.85rem',
      width: '70px',
      padding: '0.15rem 0.4rem',
      outline: 'none',
      textAlign: 'center',
    },

    dayHeader: {
      textAlign: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: '0.5rem',
      letterSpacing: '1px',
      color: 'var(--text-dimmer)',
      padding: '0.3rem 0',
    },
  };

  return (
    <div ref={ref} style={S.wrap}>
      {/* Trigger */}
      <div style={S.trigger} onClick={() => setOpen(o => !o)}>
        <span>{displayValue || '-- --- ----'}</span>
        <span style={{ color: 'var(--neon-cyan)', fontSize: '0.6rem', opacity: 0.7 }}>▼</span>
      </div>

      {/* Popup */}
      {open && (
        <div style={S.popup}>

          {/* ── Navegación de mes/año ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem', gap: '4px' }}>

            {/* ◀◀ año anterior */}
            <button style={S.navBtn} onClick={prevYear} title="Año anterior">◀◀</button>
            {/* ◀ mes anterior */}
            <button style={S.navBtn} onClick={prevMonth} title="Mes anterior">◀</button>

            {/* Mes + Año */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span style={S.monthLabel}>{MESES[viewMonth]}</span>
              {editYear ? (
                <input
                  autoFocus
                  style={S.yearInput}
                  value={yearInput}
                  onChange={e => setYearInput(e.target.value.replace(/\D/g, ''))}
                  onBlur={confirmYear}
                  onKeyDown={e => { if (e.key === 'Enter') confirmYear(); if (e.key === 'Escape') setEditYear(false); }}
                  maxLength={4}
                />
              ) : (
                <button
                  style={S.yearLabel}
                  title="Click para editar el año"
                  onClick={() => { setEditYear(true); setYearInput(String(viewYear)); }}
                >
                  {viewYear}
                </button>
              )}
            </div>

            {/* ▶ mes siguiente */}
            <button style={S.navBtn} onClick={nextMonth} title="Mes siguiente">▶</button>
            {/* ▶▶ año siguiente */}
            <button style={S.navBtn} onClick={nextYear} title="Año siguiente">▶▶</button>
          </div>

          {/* Separador */}
          <div style={{ borderTop: '1px solid var(--glass-border)', marginBottom: '0.6rem' }} />

          {/* ── Cabecera días ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', marginBottom: '4px' }}>
            {DIAS.map(d => <div key={d} style={S.dayHeader}>{d}</div>)}
          </div>

          {/* ── Grid de días ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
            {cells.map((day, i) =>
              day == null ? <div key={i} /> : (
                <button
                  key={i}
                  onClick={() => selectDay(day)}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    background: day === selectedDay ? 'rgba(0,210,255,0.18)' : 'transparent',
                    border: day === selectedDay ? '1px solid var(--neon-cyan)' : '1px solid transparent',
                    borderRadius: 'var(--radius-sm)',
                    color: day === selectedDay ? 'var(--neon-cyan)' : 'var(--text-dim)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition)',
                    textShadow: day === selectedDay ? '0 0 8px var(--neon-cyan)' : 'none',
                    fontWeight: day === selectedDay ? 700 : 400,
                  }}
                  onMouseEnter={e => {
                    if (day !== selectedDay) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (day !== selectedDay) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-dim)';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  {day}
                </button>
              )
            )}
          </div>

          {/* ── Limpiar fecha ── */}
          {value && (
            <div style={{ marginTop: '0.8rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.7rem' }}>
              <button
                onClick={() => { onChange(''); setOpen(false); }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: 'var(--neon-magenta)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.55rem',
                  letterSpacing: '2px',
                  cursor: 'pointer',
                  opacity: 0.7,
                  transition: 'opacity var(--transition)',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
              >
                ✕ &nbsp;LIMPIAR FECHA
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
