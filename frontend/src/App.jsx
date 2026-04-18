import React, { useState, useEffect, useRef } from 'react';
import Login from './components/Login';
import CharacterForm from './components/CharacterForm';
import CharacterSheet from './components/CharacterSheet';
import './styles/login.css';
import './styles/stats.css';

/* ── Typewriter hook ─────────────────────────────────────────── */
function useTypewriter(text, speed = 45, delay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(id);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(start);
  }, [text, speed, delay]);

  return { displayed, done };
}

/* ── Contador animado ────────────────────────────────────────── */
function AnimatedCount({ value }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 20;
    const inc = value / steps;
    const id = setInterval(() => {
      start += inc;
      if (start >= value) { setCount(value); clearInterval(id); }
      else setCount(Math.floor(start));
    }, 40);
    return () => clearInterval(id);
  }, [value]);
  return <>{count}</>;
}

/* ── DataReadout animado ─────────────────────────────────────── */
function DataRow({ label, value, color, delay = 0 }) {
  const { displayed } = useTypewriter(value, 40, delay);
  return (
    <div style={{ display: 'flex', gap: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.6rem' }}>
      <span style={{ color: 'var(--text-dimmer)', minWidth: '70px', textAlign: 'right' }}>{label}:</span>
      <span style={{ color }}>{displayed}<span className="type-cursor" style={{ display: displayed.length < value.length ? 'inline-block' : 'none' }} /></span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */

function App() {
  const [token, setToken]           = useState(localStorage.getItem('token'));
  const [view, setView]             = useState(() => sessionStorage.getItem('nav_view') || 'list');
  const [selectedId, setSelectedId] = useState(() => {
    const id = sessionStorage.getItem('nav_id');
    return id ? Number(id) : null;
  });
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading]       = useState(false);

  const navigate = (newView, newId = selectedId) => {
    setView(newView);
    setSelectedId(newId);
    sessionStorage.setItem('nav_view', newView);
    if (newId != null) sessionStorage.setItem('nav_id', String(newId));
    else sessionStorage.removeItem('nav_id');
  };

  useEffect(() => { if (token) fetchCharacters(); }, [token]);

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/characters', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setCharacters(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('nav_view');
    sessionStorage.removeItem('nav_id');
    setToken(null);
    setView('list');
    setSelectedId(null);
  };

  const handleSave = async (formData) => {
    setLoading(true);
    const name    = formData.perfil?.nombre || formData.perfil?.alias || 'SUJETO_SIN_IDENTIFICAR';
    const payload = { name, data: formData };
    try {
      let res;
      if (selectedId) {
        res = await fetch(`/api/characters/${selectedId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/characters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          navigate('edit', created.id);
        }
      }
      if (res.ok) await fetchCharacters();
      return res.ok;
    } catch (e) {
      console.error(e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este personaje?')) return;
    setLoading(true);
    try {
      await fetch(`/api/characters/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCharacters();
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <Login onLogin={setToken} />;

  if (view === 'edit') {
    const char = characters.find(c => c.id === selectedId);
    return (
      <CharacterForm
        characterId={selectedId}
        initialData={char?.data || null}
        onSave={handleSave}
        onClose={() => {
          if (selectedId) navigate('view', selectedId);
          else navigate('list', null);
          fetchCharacters();
        }}
      />
    );
  }

  if (view === 'view' && selectedId) {
    const char = characters.find(c => c.id === selectedId);
    return (
      <CharacterSheet
        characterData={char}
        onEdit={() => navigate('edit')}
        onBack={() => navigate('list', null)}
      />
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────────────
  return (
    <div className={`hud-shell ${loading ? 'hud-shell--loading' : ''}`}>
      {/* Global Loading Bar */}
      <div className="net-progress-bar" style={{ opacity: loading ? 1 : 0 }} />
      <header className="hud-header no-print" style={{ animation: 'fade-in 0.8s ease' }}>
        <div
          className="hud-title"
          style={{ animation: 'glitch-soft 10s infinite' }}
        >
          CRÓNICA_OS v3.0 // SENTINEL
        </div>
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
          <span className="status-badge">ENLACE ESTABLE</span>
          <button className="cyber-button cyber-button--magenta" onClick={handleLogout}>
            DESCONECTAR
          </button>
        </div>
      </header>

      <div className="home-layout">
        {/* ── Sidebar ─── */}
        <aside className="home-sidebar" style={{ animation: 'slide-in-left 0.5s ease both' }}>
          <div className="hud-label" style={{ marginBottom: '1rem', opacity: 0.8 }}>
            EXPEDIENTES ACTIVOS
          </div>

          <div className="char-list-scroll">
            {characters.length === 0 ? (
              <div style={{
                color: 'var(--text-dimmer)',
                fontSize: '0.75rem',
                padding: '2rem',
                border: '1px dashed var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
              }}>
                // SIN REGISTROS
              </div>
            ) : (
              characters.map((char, i) => (
                <div
                  key={char.id}
                  className="char-card"
                  style={{ animationDelay: `${i * 50}ms`, animation: 'fade-up 0.4s ease both' }}
                  onClick={() => navigate('view', char.id)}
                >
                  <div className="char-card__name">{char.name}</div>
                  <div className="char-card__id">
                    SID:{String(char.id).padStart(4, '0')} · {char.updated_at?.slice(0, 10)}
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            className="cyber-button cyber-button--add cyber-button--add-green"
            style={{ animation: 'fade-up 0.5s ease both', animationDelay: '0.3s' }}
            onClick={() => navigate('edit', null)}
          >
            + NUEVO EXPEDIENTE
          </button>
        </aside>

        {/* ── Welcome panel ─── */}
        <div className="home-welcome glass-panel" style={{ animation: 'fade-up 0.6s ease both', animationDelay: '0.1s' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Watermark */}
            <div style={{
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              color: 'rgba(255,255,255,0.015)',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              letterSpacing: '20px',
              userSelect: 'none',
              lineHeight: 1,
              marginBottom: '2rem'
            }}>
              SENTINEL
            </div>

            {/* Tagline con typewriter */}
            <WelcomeTagline />

            {/* Data readout animado */}
            <div style={{
              marginTop: '3rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
              alignItems: 'center',
            }}>
              <DataRow label="ESTADO"      value="SISTEMA OPERATIVO"       color="var(--neon-green)"   delay={400}  />
              <DataRow label="NIVEL"       value="AUTORIZACIÓN MÁXIMA"    color="var(--neon-cyan)"    delay={800}  />
              <DataRow label="REGISTROS"   value={`${characters.length} ARCHIVOS CARGADOS`} color="var(--neon-amber)"   delay={1200}  />
            </div>

            <div style={{
              marginTop: '2rem',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--glass-border), transparent)',
              width: '100px',
              margin: '2rem auto'
            }} />

            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--text-dimmer)',
              letterSpacing: '4px',
              opacity: 0.5
            }}>
              SISTEMA CRÓNICA // VER:3.1.0 STABLE // SECURE ACCESS
            </div>
          </div>
        </div>
      </div>

      <footer className="no-print" style={{
        padding: '0.8rem 2rem',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-between',
        background: 'rgba(5,8,15,0.8)',
        backdropFilter: 'blur(10px)',
        fontSize: '0.6rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-dimmer)'
      }}>
        <span>CORE STABILITY: 98.2%</span>
        <span>
          THE DEVIANTS CHRONICLE // <AnimatedCount value={characters.length} /> REGISTROS DETECTADOS
        </span>
      </footer>
    </div>
  );
}

/* Tagline con typewriter separado para re-render limpio */
function WelcomeTagline() {
  const { displayed, done } = useTypewriter('SELECCIONE UN PERFIL PARA INICIAR', 55, 300);
  return (
    <div style={{
      fontFamily: 'var(--font-display)',
      letterSpacing: '4px',
      color: 'var(--text-dim)',
      fontSize: 'clamp(0.5rem, 1.5vw, 0.75rem)',
      marginTop: '-0.2rem',
      textTransform: 'uppercase',
      minHeight: '1.5em',
    }}>
      {displayed}
      {!done && <span className="type-cursor" />}
    </div>
  );
}

export default App;
