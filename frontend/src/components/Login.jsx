import React, { useState, useEffect } from 'react';
import SentinelAscii from './SentinelAscii';

/* Typewriter mínimo local */
function Typewriter({ text, speed = 40, delay = 0 }) {
  const [out, setOut] = useState('');
  useEffect(() => {
    setOut('');
    let i = 0;
    const t = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) clearInterval(id);
      }, speed);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);
  return <>{out}</>;
}

const STATUS_ROWS = [
  { label: 'SISTEMA',   value: 'CRÓNICA_v2.0.0',  color: 'var(--neon-cyan)',  delay: 200  },
  { label: 'ESTADO',    value: 'EN_LINEA',          color: 'var(--neon-green)', delay: 500  },
  { label: 'CIFRADO',   value: 'AES-256-GCM',       color: 'var(--text-dim)',   delay: 800  },
  { label: 'PROTOCOLO', value: 'SENTINEL_v4',        color: 'var(--neon-amber)', delay: 1100 },
  { label: 'ACCESO',    value: 'NIVEL_ALFA',         color: 'var(--neon-magenta)', delay: 1400 },
];

export default function Login({ onLogin }) {
  const [mode, setMode]       = useState('login');
  const [username, setUser]   = useState('');
  const [password, setPass]   = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || 'Error desconocido'); return; }
      localStorage.setItem('token', data.token);
      onLogin(data.token);
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="scan-line scan-line--primary" />
      <div className="scan-line scan-line--secondary" />

      {/* ── Panel izquierdo — identidad del sistema ────────── */}
      <div className="login-left">

        {/* Dot grid animado de fondo */}
        <div className="login-left__bg" />

        <div className="login-left__content">
          {/* ASCII grande */}
          <div className="login-ascii-wrap">
            <SentinelAscii />
          </div>

          {/* Título con glitch */}
          <div
            className="login-brand hud-title--glitch"
            data-text="THE DEVIANT'S CHRONICLE"
          >
            THE DEVIANT'S CHRONICLE
          </div>

          <div className="login-lore">
            SISTEMA DE GESTIÓN OPERATIVA · ACCESO RESTRINGIDO
          </div>

          {/* Separador */}
          <div className="login-sep" />

          {/* Data readouts animados */}
          <div className="login-readouts">
            {STATUS_ROWS.map(({ label, value, color, delay }) => (
              <div key={label} className="login-readout-row">
                <span className="login-readout-label">{label}</span>
                <span className="login-readout-dots" />
                <span style={{ color, fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>
                  <Typewriter text={value} delay={delay} />
                </span>
              </div>
            ))}
          </div>

          {/* Footer del panel izq */}
          <div className="login-left__footer">
            <span className="status-badge" style={{ fontSize: '0.55rem' }}>SERVIDOR EN LÍNEA</span>
          </div>
        </div>
      </div>

      {/* ── Divisor vertical ──────────────────────────────── */}
      <div className="login-divider" />

      {/* ── Panel derecho — formulario ────────────────────── */}
      <div className="login-right">
        <div className="login-form-wrap">

          <div className="login-form-header">
            <div className="login-form-title">
              {mode === 'login' ? 'AUTENTICACIÓN' : 'NUEVO_SUJETO'}
            </div>
            <div className="login-form-subtitle">
              {mode === 'login'
                ? 'Ingrese sus credenciales de acceso'
                : 'Registre un nuevo perfil centinela'}
            </div>
          </div>

          <form onSubmit={submit} className="login-form">
            <div className="field-group">
              <label className="hud-label hud-label--cyan">IDENTIFICADOR</label>
              <input
                className="cyber-input"
                type="text"
                value={username}
                onChange={e => setUser(e.target.value)}
                autoComplete="username"
                placeholder="usuario..."
                required
              />
            </div>

            <div className="field-group">
              <label className="hud-label hud-label--cyan">CLAVE_ACCESO</label>
              <input
                className="cyber-input"
                type="password"
                value={password}
                onChange={e => setPass(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button
              className="cyber-button cyber-button--full"
              type="submit"
              disabled={loading}
              style={{ marginTop: '0.5rem', padding: '0.8rem' }}
            >
              {loading
                ? '⟳ VERIFICANDO...'
                : mode === 'login'
                  ? '[ SOLICITAR_ACCESO ]'
                  : '[ REGISTRAR_SUJETO ]'}
            </button>
          </form>

          <button
            className="login-toggle"
            type="button"
            onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); }}
          >
            {mode === 'login'
              ? '¿Sin credenciales? → Registrar nuevo acceso'
              : '¿Ya registrado? → Iniciar sesión'}
          </button>

          {/* Marca de agua clasificada */}
          <div className="login-classified">
            ⬛ USO EXCLUSIVO · NIVEL ALFA · NO DISTRIBUIR ⬛
          </div>
        </div>
      </div>
    </div>
  );
}
