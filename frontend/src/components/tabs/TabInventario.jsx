import React from 'react';

function ItemList({ items, onUpdate, colorClass = "" }) {
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
            <th>NOMBRE ELEMENTO</th>
            <th style={{ width: '120px' }}>CARGA</th>
            <th style={{ width: '40px' }}></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>
                <input className="cyber-input cyber-input--sm" value={item.nombre}
                  placeholder="---"
                  onChange={e => change(idx, 'nombre', e.target.value)} />
              </td>
              <td>
                <input className="cyber-input cyber-input--sm" style={{ textAlign: 'center' }} value={item.tamano}
                  placeholder="0.0"
                  onChange={e => change(idx, 'tamano', e.target.value)} />
              </td>
              <td>
                <button className="dynamic-list__remove" onClick={() => remove(idx)}>×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button 
        className={`cyber-button cyber-button--add ${colorClass}`}
        style={{ marginTop: '1rem' }} 
        onClick={add}
      >
        + VINCULAR NUEVO ÍTEM
      </button>
    </div>
  );
}

export default function TabInventario({ data, update }) {
  const { inventario } = data;

  return (
    <div className="form-grid--2">
      <div className="glass-panel" style={{ borderTop: '2px solid var(--neon-cyan)' }}>
        <div className="hud-label" style={{ marginBottom: '1.5rem' }}>[ MOCHILA ]</div>
        <ItemList
          colorClass="cyber-button--add-cyan"
          items={inventario.mochila}
          onUpdate={items => update('inventario', 'mochila', items)}
        />
      </div>

      <div className="glass-panel" style={{ borderTop: '2px solid var(--neon-magenta)' }}>
        <div className="hud-label" style={{ marginBottom: '1.5rem' }}>[ INVENTARIO ]</div>
        <ItemList
          colorClass="cyber-button--add-magenta"
          items={inventario.general}
          onUpdate={items => update('inventario', 'general', items)}
        />
      </div>
    </div>
  );
}
