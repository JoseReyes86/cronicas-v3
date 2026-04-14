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
    <div className="glass-panel glass-panel--top-cyan">
      <div className="section-header section-header--cyan">[ REGISTRO_DE_RASGOS_OPERATIVOS ]</div>

      <table className="cyber-table">
        <thead>
          <tr>
            <th style={{ width: '200px' }}>DESCRIPTOR_NOMINAL</th>
            <th>ESPECIFICACIÓN_TÉCNICA</th>
            <th style={{ width: '80px' }}>COST_MP</th>
            <th style={{ width: '80px' }}>NV_ACC</th>
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

      <button className="cyber-button cyber-button--full" style={{ marginTop: '1.5rem' }} onClick={addRasgo}>
        + CARGAR_NUEVO_RASGO_EN_EL_NÚCLEO
      </button>
    </div>
  );
}
