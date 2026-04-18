import React from 'react';

export default function TabRasgos({ data, update }) {
  const { rasgos } = data;

  const updateRasgo = (idx, field, val) => {
    const next = [...rasgos];
    next[idx] = { ...next[idx], [field]: val };
    update('rasgos', null, next);
  };

  const addRasgo = () =>
    update('rasgos', null, [...rasgos, { id: Date.now(), nombre: '', descripcion: '', mp: '', nivel: '' }]);

  const removeRasgo = (idx) =>
    update('rasgos', null, rasgos.filter((_, i) => i !== idx));

  return (
    <div className="glass-panel" style={{ borderTop: '2px solid var(--neon-cyan)' }}>
      <div className="hud-label" style={{ marginBottom: '2rem' }}>[ RASGOS ]</div>

      <div className="table-responsive">
        <table className="cyber-table">
          <thead>
            <tr>
              <th style={{ width: '220px' }}>NOMBRE</th>
              <th>DESCRIPCIÓN</th>
              <th style={{ width: '130px', textAlign: 'center' }}>METAPSICOSIS</th>
              <th style={{ width: '100px', textAlign: 'center' }}>NIVEL</th>
              <th style={{ width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {rasgos.map((rasgo, idx) => (
              <tr key={rasgo.id}>
                <td>
                  <input className="cyber-input cyber-input--sm" value={rasgo.nombre}
                    onChange={e => updateRasgo(idx, 'nombre', e.target.value)} />
                </td>
                <td>
                  <input className="cyber-input cyber-input--sm" style={{ opacity: 0.75 }} value={rasgo.descripcion}
                    onChange={e => updateRasgo(idx, 'descripcion', e.target.value)} />
                </td>
                <td>
                  <input className="cyber-input cyber-input--sm cyber-input--magenta cyber-input--center" value={rasgo.mp}
                    onChange={e => updateRasgo(idx, 'mp', e.target.value)} />
                </td>
                <td>
                  <input className="cyber-input cyber-input--sm cyber-input--center" value={rasgo.nivel}
                    onChange={e => updateRasgo(idx, 'nivel', e.target.value)} />
                </td>
                <td>
                  <button className="dynamic-list__remove" onClick={() => removeRasgo(idx)}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="cyber-button cyber-button--add cyber-button--add-cyan" style={{ marginTop: '2rem' }} onClick={addRasgo}>
        + AGREGAR RASGO
      </button>
    </div>
  );
}
