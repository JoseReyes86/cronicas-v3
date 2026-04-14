import React from 'react';

function ItemList({ items, onUpdate }) {
  const add    = () => onUpdate([...items, { nombre: '', tamano: '' }]);
  const remove = (idx) => onUpdate(items.filter((_, i) => i !== idx));
  const change = (idx, field, val) => {
    const next = [...items]; next[idx] = { ...next[idx], [field]: val }; onUpdate(next);
  };

  return (
    <div>
      <table className="cyber-table">
        <thead>
          <tr>
            <th>NOMBRE</th>
            <th style={{ width: '100px' }}>TAMAÑO</th>
            <th style={{ width: '40px' }}></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>
                <input className="cyber-input cyber-input--sm" value={item.nombre}
                  onChange={e => change(idx, 'nombre', e.target.value)} />
              </td>
              <td>
                <input className="cyber-input cyber-input--sm cyber-input--center" value={item.tamano}
                  onChange={e => change(idx, 'tamano', e.target.value)} />
              </td>
              <td>
                <button className="dynamic-list__remove" onClick={() => remove(idx)}>×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="cyber-button cyber-button--full" style={{ marginTop: '1rem' }} onClick={add}>
        + AGREGAR_ÍTEM
      </button>
    </div>
  );
}

export default function TabInventario({ data, update }) {
  const { inventario } = data;

  return (
    <div className="form-grid--2">
      <div className="glass-panel glass-panel--top-cyan">
        <div className="section-header section-header--cyan">[ MOCHILA ]</div>
        <ItemList
          items={inventario.mochila}
          onUpdate={items => update('inventario', 'mochila', items)}
        />
      </div>

      <div className="glass-panel glass-panel--top-magenta">
        <div className="section-header section-header--magenta">[ INVENTARIO_GENERAL ]</div>
        <ItemList
          items={inventario.general}
          onUpdate={items => update('inventario', 'general', items)}
        />
      </div>
    </div>
  );
}
