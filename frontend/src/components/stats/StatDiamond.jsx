import React from 'react';

/**
 * StatDiamond — fila de rombos tipo bitmask.
 *
 * Props:
 *   value       {number}  bitmask de rombos activos
 *   blockedBits {number}  bitmask de rombos bloqueados (X roja)
 *   max         {number}  total de rombos a renderizar
 *   onChange        {fn}  (newVal) => void   — click normal
 *   onToggleBlock   {fn}  (newBlocked) => void — shift+click
 *   readOnly    {bool}    sin interacción
 *   firstLocked {bool}    primer rombo siempre activo, no interactuable
 *   lastDashed  {bool}    último rombo con borde punteado
 */
export default function StatDiamond({ value = 0, blockedBits = 0, max = 5, rows = 1, onChange, onToggleBlock, readOnly = false, firstLocked = false, lastDashed = false, color, scalar = false }) {
  const [lastValue, setLastValue] = React.useState(value);
  const [changedIdx, setChangedIdx] = React.useState(null);

  React.useEffect(() => {
    if (value !== lastValue) {
      for (let i = 0; i < max; i++) {
        if ((value & (1 << i)) !== (lastValue & (1 << i))) {
          setChangedIdx(i);
          break;
        }
      }
      setLastValue(value);
      const timer = setTimeout(() => setChangedIdx(null), 400);
      return () => clearTimeout(timer);
    }
  }, [value, lastValue, max]);

  const handleClick = (e, idx) => {
    if (readOnly) return;
    if (firstLocked && idx === 0) return;
    const bit = 1 << idx;
    if (e.shiftKey && onToggleBlock) {
      onToggleBlock(blockedBits ^ bit);
    } else if (onChange) {
      if (scalar) {
        // En modo escalar, activamos todos hasta el índice clickeado
        const mask = (1 << (idx + 1)) - 1;
        if (value === mask) {
           // Si ya es el mismo nivel, bajamos al anterior
           // (Nota: si firstLocked es true e idx es 0, el return al inicio de la función ya lo ignora)
           onChange((1 << idx) - 1);
        } else {
           onChange(mask);
        }
      } else {
        onChange(value ^ bit);
      }
    }
  };

  const diamonds = Array.from({ length: max }, (_, i) => {
    const bit = 1 << i;
    const isFirstLocked = firstLocked && i === 0;
    const isLastDashed  = lastDashed && i === max - 1;
    const filled  = isFirstLocked ? true : (value & bit) !== 0;
    const blocked = !isFirstLocked && (blockedBits & bit) !== 0;

    let cls = 'stat-diamond';
    if (isFirstLocked)  cls += ' stat-diamond--locked';
    else if (blocked)   cls += ' stat-diamond--blocked';
    else if (filled)    cls += ' stat-diamond--filled';
    if (isLastDashed)   cls += ' stat-diamond--dashed';
    if (changedIdx === i) cls += ' just-changed';

    const colorStyle = color && (filled || isFirstLocked) && !blocked ? {
      background: color,
      borderColor: color,
      boxShadow: `0 0 10px ${color}b3, 0 0 20px ${color}4d`,
      ...(isFirstLocked ? { cursor: 'default' } : {}),
    } : isFirstLocked ? { cursor: 'default' } : undefined;

    return (
      <button
        key={i}
        className={cls}
        onClick={(e) => handleClick(e, i)}
        title={isFirstLocked ? 'Siempre activo' : blocked ? 'Bloqueado (shift+click para desbloquear)' : 'Click para activar / shift+click para bloquear'}
        type="button"
        style={colorStyle}
      >
        {blocked && <span className="stat-diamond__x">×</span>}
      </button>
    );
  });

  if (rows > 1) {
    const perRow = Math.ceil(max / rows);
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${perRow}, max-content)`, gap: '6px' }} aria-label="stat diamonds grid">
        {diamonds}
      </div>
    );
  }

  return (
    <div className="stat-diamond-row" aria-label="stat diamonds">
      {diamonds}
    </div>
  );
}
