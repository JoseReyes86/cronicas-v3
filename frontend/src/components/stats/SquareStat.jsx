import React from 'react';

/**
 * SquareStat — fila(s) de cuadros tipo bitmask.
 *
 * Props:
 *   value    {number}   bitmask. Bits 0..max-1 = cuadros. Bits 10/11/12 = crisis markers.
 *   max      {number}   total de cuadros principales
 *   rows     {number}   cuántas filas (divide max entre rows)
 *   markers  {number[]} ej. [1,2,3] activa círculos encima de las últimas columnas
 *   onChange {fn}       (newVal) => void
 *   readOnly {bool}
 *
 * Cada celda tiene siempre un "marker-slot" de altura fija (aunque esté vacío),
 * garantizando alineación perfecta entre filas de distintos SquareStat.
 */

const CELL_SIZE = 26;  // px — ancho fijo de cada celda (cuadro + gap)
const CELL_GAP  = 4;   // px — gap entre celdas

export default function SquareStat({
  value = 0, max = 10, rows = 1, markers = [],
  onChange, readOnly = false
}) {
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
      // También chequear markers (bits 10, 11, 12)
      for (let i = 10; i <= 12; i++) {
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

  const perRow = Math.ceil(max / rows);

  const toggleBit = (idx) => {
    if (readOnly || !onChange) return;
    onChange(value ^ (1 << idx));
  };

  const toggleMarker = (markerIdx) => {
    if (readOnly || !onChange) return;
    onChange(value ^ (1 << (10 + markerIdx)));
  };

  // Si hay markers en alguna fila, reservamos el slot en TODAS las filas
  const showMarkerRow = markers.length > 0;
  const markerOffset  = perRow - markers.length;

  const renderRow = (rowIdx) => {
    const start = rowIdx * perRow;
    const end   = Math.min(start + perRow, max);
    const count = end - start;

    const cells = [];
    for (let i = start; i < end; i++) {
      const colInRow    = i - start;
      const filled      = (value & (1 << i)) !== 0;
      const markerPos   = colInRow - markerOffset;
      const hasMarker   = rowIdx === 0 && markerPos >= 0 && markerPos < markers.length;
      const markerActive = hasMarker && (value & (1 << (10 + markerPos))) !== 0;

      cells.push(
        <div key={i} className="square-stat__cell">
          {/* Slot de marker — siempre presente para mantener alineación */}
          {showMarkerRow && (
            <div className="square-stat__marker-slot">
              {hasMarker && (
                <button
                  type="button"
                  className={`square-stat__marker ${markerActive ? 'square-stat__marker--active' : ''} ${changedIdx === (10 + markerPos) ? 'just-changed' : ''}`}
                  onClick={() => toggleMarker(markerPos)}
                  title={`Crisis ${markers[markerPos]}`}
                >
                  {markers[markerPos]}
                </button>
              )}
            </div>
          )}
          <button
            type="button"
            className={`square-stat__box ${filled ? 'square-stat__box--filled' : ''} ${changedIdx === i ? 'just-changed' : ''}`}
            onClick={() => toggleBit(i)}
          />
        </div>
      );
    }

    return (
      <div
        key={rowIdx}
        className="square-stat__row"
        style={{ gridTemplateColumns: `repeat(${count}, ${CELL_SIZE}px)` }}
      >
        {cells}
      </div>
    );
  };

  return (
    <div className="square-stat">
      {Array.from({ length: rows }, (_, r) => renderRow(r))}
    </div>
  );
}
