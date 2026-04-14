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

  const navigate = (newView, newId = selectedId) => {
    setView(newView);
    setSelectedId(newId);
    sessionStorage.setItem('nav_view', newView);
    if (newId != null) sessionStorage.setItem('nav_id', String(newId));
    else sessionStorage.removeItem('nav_id');
  };

  useEffect(() => { if (token) fetchCharacters(); }, [token]);

  const fetchCharacters = async () => {
    try {
      const res = await fetch('/api/characters', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setCharacters(await res.json());
    } catch (e) { console.error(e); }
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
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este personaje?')) return;
    await fetch(`/api/characters/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    await fetchCharacters();
  };

  if (!token) return <Login onLogin={setToken} />;

  if (view === 'edit') {
    const char = characters.find(c => c.id === selectedId);
    return (
      <CharacterForm
        characterId={selectedId}
        initialData={char?.data || null}
        onSave={handleSave}
        onClose={() => { navigate('list', null); fetchCharacters(); }}
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
    <div className="hud-shell">
      {/* Dos líneas de scan en direcciones opuestas */}
      <div className="scan-line scan-line--primary" />
      <div className="scan-line scan-line--secondary" />

      <header className="hud-header no-print">
        <div
          className="hud-title hud-title--glitch"
          data-text="THE DEVIANT'S CHRONICLE"
        >
          THE DEVIANT'S CHRONICLE
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span className="status-badge">ENLAZADO</span>
          <button className="cyber-button cyber-button--magenta" onClick={handleLogout}>
            DESCONECTAR
          </button>
        </div>
      </header>

      <div className="home-layout">
        {/* ── Sidebar ─── */}
        <aside className="home-sidebar">
          <div className="hud-label hud-label--cyan hud-label--lg" style={{ marginBottom: '0.8rem' }}>
            EXPEDIENTES_ACTIVOS
          </div>

          {characters.length === 0 ? (
            <div style={{
              color: 'var(--text-dimmer)',
              fontSize: '0.72rem',
              padding: '1.2rem',
              border: '1px dashed rgba(0,243,255,0.1)',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '1px',
              animation: 'fade-up 0.4s ease both',
            }}>
              // NO_PERFILES_DETECTADOS
            </div>
          ) : (
            characters.map((char, i) => (
              <div
                key={char.id}
                className="char-card"
                style={{ animationDelay: `${i * 80}ms` }}
                onClick={() => navigate('view', char.id)}
              >
                <div className="char-card__name">{char.name}</div>
                <div className="char-card__id">
                  SID:{String(char.id).padStart(4, '0')} · {char.updated_at?.slice(0, 10)}
                </div>
              </div>
            ))
          )}

          <button
            className="cyber-button cyber-button--green cyber-button--full"
            style={{ marginTop: '1.2rem', animation: 'fade-up 0.4s ease both', animationDelay: `${characters.length * 80 + 100}ms` }}
            onClick={() => navigate('edit', null)}
          >
            + NUEVO_SUJETO
          </button>
        </aside>

        {/* ── Welcome panel ─── */}
        <div className="home-welcome glass-panel">
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Watermark */}
            <div style={{
              fontSize: 'clamp(3rem, 9vw, 6.5rem)',
              color: 'rgba(0,243,255,0.03)',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              letterSpacing: '10px',
              userSelect: 'none',
              lineHeight: 1,
              animation: 'pulse-opacity 6s ease-in-out infinite',
            }}>
              SENTINEL
            </div>

            {/* Tagline con typewriter */}
            <WelcomeTagline />

            {/* Data readout animado */}
            <div style={{
              marginTop: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              alignItems: 'center',
            }}>
              <DataRow label="NODE"      value="STABLE"                  color="var(--neon-green)"   delay={200}  />
              <DataRow label="PROTOCOL"  value="ACTIVE"                  color="var(--neon-cyan)"    delay={500}  />
              <DataRow label="SUJETOS"   value={`${characters.length} EN REGISTRO`} color="var(--neon-amber)"   delay={800}  />
              <DataRow label="CIPHER"    value="AES-256-GCM"             color="var(--text-dim)"     delay={1100} />
            </div>

            <div style={{
              marginTop: '1.5rem',
              width: '60px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--neon-cyan), transparent)',
              margin: '1.5rem auto 0',
              opacity: 0.5,
              animation: 'pulse-opacity 3s ease-in-out infinite',
            }} />

            <div style={{
              marginTop: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              color: 'var(--text-dimmer)',
              letterSpacing: '2px',
            }}>
              SISTEMA_CRÓNICA v2.0.0 // 2026
            </div>
          </div>
        </div>
      </div>

      <footer className="no-print" style={{
        padding: '0.6rem 1.5rem',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-between',
        background: 'rgba(3,5,10,0.7)',
        animation: 'fade-in 0.6s ease both',
        animationDelay: '0.4s',
      }}>
        <span style={{ fontSize: '0.55rem', color: 'var(--text-dimmer)', fontFamily: 'var(--font-mono)' }}>
          NODE_STATUS: STABLE
        </span>
        <span style={{ fontSize: '0.55rem', color: 'var(--text-dimmer)', fontFamily: 'var(--font-mono)' }}>
          THE_DEVIANTS_CHRONICLE // <AnimatedCount value={characters.length} /> SUJETO{characters.length !== 1 ? 'S' : ''}_EN_REGISTRO
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
