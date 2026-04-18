# CLAUDE.md — The Deviant's Chronicle v3

Guía completa del proyecto para Claude Code. Leer antes de tocar cualquier archivo.

---

## Visión del proyecto

Sistema de gestión de fichas de personaje para un juego de rol llamado **"The Deviant's Chronicle"**. Dirigido a un grupo de jugadores con estética **post-modernista cyber** — el diseño debe transmitir poder, precisión y élite transhumanista. No es una app genérica; cada decisión visual refuerza la identidad del juego.

---

## Stack

| Capa       | Tecnología                            |
|------------|---------------------------------------|
| Frontend   | React 18 + Vite                       |
| Estilos    | CSS puro (sin framework)              |
| Backend    | FastAPI (Python 3.11) + SQLite        |
| ORM        | SQLite directo vía `sqlite3`          |
| Auth       | JWT (`python-jose`) + bcrypt          |
| Deploy     | Docker multi-stage (1 solo contenedor)|
| Puerto     | `8090` → `http://192.168.100.99:8090` |

---

## Arquitectura — 1 contenedor

```
Browser :8090
    └── FastAPI (uvicorn)
         ├── /auth/*   → endpoints de autenticación
         ├── /api/*    → endpoints de personajes
         └── /*        → archivos estáticos React (./static/)
```

El `Dockerfile` en la raíz es **multi-stage**:
1. **Stage 1 (node:20-alpine)** — hace `npm run build` del frontend → `dist/`
2. **Stage 2 (python:3.11-slim)** — instala backend + copia `dist/` como `static/`

FastAPI monta `StaticFiles(directory="static", html=True)` al final de `main.py` para que las rutas de API tengan prioridad y React Router funcione (fallback a `index.html`).

---

## Base de datos

- SQLite en `/app/data/cronica.db` dentro del contenedor
- **Volumen persistente**: `./data:/app/data` — sobrevive rebuilds y `docker compose down`
- Variable de entorno: `DB_PATH=/app/data/cronica.db`
- Tablas: `users` (id, username, password) + `characters` (id, user_id, name, data JSON, created_at, updated_at)
- Cada usuario solo ve sus propios personajes (JWT auth)

```bash
# Inspeccionar DB desde host
docker exec cronica-v2-app-1 python3 -c "
import sqlite3; conn = sqlite3.connect('/app/data/cronica.db')
conn.row_factory = sqlite3.Row
for r in conn.execute('SELECT id, name, updated_at FROM characters'): print(dict(r))
"
```

---

## Deploy

```bash
# Siempre que haya cambios:
docker compose up --build -d

# Ver logs en vivo
docker compose logs -f app

# Health check
curl http://localhost:8090/api/health

# Ver contenedor corriendo
docker ps --filter name=cronica
```

> **Regla**: Siempre deployar al terminar cambios y enviar la URL al usuario.

---

## Estructura de archivos

```
cronica-v2/
├── Dockerfile                  # Multi-stage: node build + python serve
├── docker-compose.yml          # 1 servicio: app → puerto 8090, volumen ./data
├── data/                       # Volumen persistente — cronica.db aquí
├── backend/
│   ├── main.py                 # FastAPI: auth, characters, static mount
│   ├── database.py             # SQLite init y conexiones
│   └── requirements.txt
└── frontend/
    ├── index.html              # Importa Orbitron + Share Tech Mono (Google Fonts)
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx             # Home screen, routing, typewriter, AnimatedCount
        ├── styles/
        │   ├── base.css        # Variables CSS, keyframes globales, grid drift
        │   ├── components.css  # Panels, buttons, inputs, select, tabs, scan lines
        │   ├── layout.css      # Layouts + RESPONSIVE (768px + 480px breakpoints)
        │   ├── login.css       # Pantalla de login
        │   └── stats.css       # StatDiamond, SquareStat
        ├── data/
        │   ├── defaultCharacter.js     # Esquema completo de un personaje vacío
        │   └── manipulationsCatalog.js # Catálogo de clanes y esferas
        └── components/
            ├── Login.jsx
            ├── CharacterForm.jsx       # Form con auto-save (2.5s debounce) + Ctrl+S
            ├── CharacterSheet.jsx      # Vista de solo lectura / impresión
            ├── SentinelAscii.jsx
            ├── stats/
            │   ├── StatDiamond.jsx     # Rombos bitmask — acepta prop `color` (hex)
            │   └── SquareStat.jsx      # Cuadros bitmask — CELL_SIZE=26px fijo
            └── tabs/
                ├── TabPerfil.jsx
                ├── TabEstado.jsx
                ├── TabManipulaciones.jsx
                ├── TabRasgos.jsx
                ├── TabArmamento.jsx
                ├── TabInventario.jsx
                └── TabNaturaleza.jsx
```

---

## Sistema de diseño

### Tipografía
- **`var(--font-display)`** → `Orbitron` — headers, títulos, labels, botones, tabs
- **`var(--font-mono)`** → `Share Tech Mono` — código, inputs, datos numéricos

### Paleta de neons
| Variable           | Hex       | Uso                        |
|--------------------|-----------|----------------------------|
| `--neon-cyan`      | `#00f3ff` | Primario, atributos        |
| `--neon-magenta`   | `#ff0055` | Secundario, peligro, dones |
| `--neon-green`     | `#39ff14` | Éxito, economía            |
| `--neon-amber`     | `#ffb300` | Advertencia, formación     |

### Colores por clan (TabManipulaciones)
| Clan         | Color    | Hex       |
|--------------|----------|-----------|
| QUIMERA      | Azul     | `#4da6ff` |
| ACRACIA      | Amarillo | `#ffcc00` |
| FIST         | Plomo    | `#9aaabf` |
| CORPORACIÓN  | Rojo     | `#ff3333` |
| ABISMAL      | Verde    | `#39ff14` |
| PARTICULARES | Blanco   | `#e8eaf0` |

Definidos en `CLAN_COLORS` dentro de `TabManipulaciones.jsx`. Se aplican a: botón activo, borde del panel, header de categoría y rombos `StatDiamond` (via prop `color`).

### Clases clave (no crear alternativas)
```css
.glass-panel          /* Panel base con breathing animation + corner accent */
.glass-panel--cyan / --magenta / --amber / --green   /* Borde izquierdo */
.glass-panel--top-cyan / --top-magenta               /* Borde superior */

.cyber-button         /* Botón angulado con clip-path + sweep hover */
.cyber-button--magenta / --green / --amber / --full

.cyber-input          /* Input con borde inferior animado */
.cyber-select / .cyber-select--amber

.hud-label            /* Label pequeño en mayúsculas */
.hud-label--cyan / --magenta / --amber / --green / --lg / --xl

.section-header       /* Header de sección con borde inferior */
.tab-btn              /* Botón de tab con clip-path + sweep */
.stat-row             /* Fila label + stat widget */
.status-badge         /* Badge verde pulsante */
.scan-line--primary / --secondary
.type-cursor          /* Cursor parpadeante typewriter */
.hint-text            /* Se oculta en móvil ≤768px */
.hud-actions          /* Grupo de botones del header */
```

### Layouts responsive
```css
.form-grid--2  /* 2 col → 1 col en 480px */
.form-grid--3  /* 3 col → 2 col en 768px → 1 col en 480px */
.form-grid--auto /* auto-fit minmax(280px) */
.equip-grid    /* auto-fit minmax(260px) — armas/armaduras */
```

---

## CharacterForm — comportamiento

- **Auto-save**: 2.5s de debounce → `onSave(data)` → `PUT /api/characters/{id}`
- **Ctrl+S / Cmd+S**: guarda inmediatamente
- **Estados**: `idle` → `dirty` (amber) → `saving` (cyan) → `saved` (verde 2.5s) / `error` (magenta)
- **Transición de tabs**: `key={activeTab}` fuerza re-animación `fade-up`
- Tabs con scroll horizontal en móvil (no wrap)

---

## TabEstado — RESISTENCIA

Grid **`1.2fr 1fr`** con headers de sección en la misma fila (ESTADOS VITALES & RESISTENCIA | VIRTUDES):

- **Izquierda**: VIGOR (20 casillas, 2 filas, `scalar`, color cyan), CONSTITUCIÓN (10 casillas, `scalar`, color cyan), CORDURA (bloques libres, bitmask sin scalar), VOLUNTAD (10 casillas, `scalar`, color cyan) — sin `minLevel`
- **Derecha**: VIRTUDES — AUTOCONTROL / ALERTA / VALENTÍA con lista dinámica `habilidades[{habilidad,cd,costo}]` + botón `+ HABILIDAD`
- `SquareStat` acepta prop `color` (hex/var) para sobreescribir color de relleno
- Tab activo persiste en `sessionStorage` con clave `active_tab_{characterId}`

## TabEstado — CAPACIDAD DE CARGA

- Calculado en **frontend en tiempo real** desde `atributos` (sin esperar guardado)
- Fórmula: `n = atributos con popCount(val) ≥ 3`; `boxes = min(1+n, 10)`; `bitmask = (1<<boxes)-1`; display = `10 + boxes*10`
- StatDiamond de solo lectura (max=10), label "TAMAÑO"
- Backend aplica misma fórmula al guardar (`bin(val).count('1') >= 3`)

## TabEstado — METAPSICOSIS

- Input numérico entero; los rombos (max=7, read-only) se calculan como `floor(valor/10)` cajas encendidas

---

## TabEstado — COMBATE

Tabla 4 columnas × 5 filas:

```
ARTE DE COMBATE | SUBTIPO | NV (□□) | MAESTRÍAS [___] [___] [___]
```

- `maestrias[]` — array flat de 15 strings. Arte[i] usa índices `i*3`, `i*3+1`, `i*3+2`
- `artesDeCombate[i].nv` → SquareStat max=2

---

## TabManipulaciones — estructura

### Sub-tabs principales (centrados)
- **CLAN**: selector de clan coloreado + grid de categorías; 3 rombos por poder (`scalar`); rombos alineados a la derecha (`justifyContent: space-between`)
- **ESFERAS**: sub-selector interno ESFERAS / COMBINADAS

### Sub-tabs de esferas
- **ESFERAS**: 4 paneles (LUZ / OSCURIDAD / CAOS / ORDEN), max=4, rombos derecha
- **COMBINADAS**: 6 grupos combinados, max=3, rombos derecha

### Círculos de esferas
- 4 cuadros magenta marcables encima de cada panel de esfera
- Bitmask en `manipulaciones.esferas.circulos.{LUZ|OSCURIDAD|CAOS|ORDEN}`

### StatRow helper
Componente interno `StatRow` en TabManipulaciones: `justifyContent: space-between` para alinear rombos a la derecha. Font-size del label: `0.7rem` (aplica a CLAN, ESFERAS y COMBINADAS).

---

## TabPerfil — secciones colapsables

Componente interno `Section`: botón en header, flecha rota 90°, contenido con `fade-up`.
IDs: `'ident'`, `'afil'`, `'form'`, `'con'`, `'eco'`

Campo `formaciones`: `perfil.formaciones = [{ nombre, tipo }]` — tabla 2 cols (NOMBRE + CATEGORÍA select).

### Campos de perfil
- EDAD / EDAD APARENTE: `type="text" inputMode="numeric"` (sin flechas spin), label con `(AÑOS)`
- ESTATURA: numérico, label `(CM)` — PESO: numérico, label `(KG)`
- FECHA NACIMIENTO: componente `CyberDatePicker` (custom, cyber-aesthetic), almacena `YYYY-MM-DD`
- OFICIO eliminado de IDENTIFICACIÓN (existe en otros contextos)

### Red de Contactos
- Columnas: NOMBRE / FACCIÓN (select) / CLAN (select cascading desde `CLAN_MANIPULATIONS`) / VÍNCULO
- Conexión default: `{ nombre:'', faccion:'', clan:'', tipo:'' }`

### Registro Financiero
- Columnas: NOMBRE / CATEGORÍA (texto libre) / INGRESO / EGRESO
- Moneda: `CLP`; footer muestra TOTAL INGRESOS y TOTAL EGRESOS

---

## Datos — esquema `defaultCharacter.js`

```
perfil: { nombre, alias, claseCentinela, edad, edadAparenta, fechaNacimiento,
          estatura, peso, contextura, nacionalidad, residencia, estadoCivil,
          oficio, descripcion, estudios[], idiomas[], hobbies[],
          formaciones[{ nombre, tipo }] }
afiliacion: { faccionPrevia, clanPrevio, faccionActual, clanActual }
atributos:  9 stats → { val, blocked }
dones:      9 stats → { val, blocked }
virtudes:   { autocontrol, alerta, valentia } → { val, blocked, habilidades[{ habilidad, cd, costo }] }
estados_vitales: { vigor, constitucion, cordura{nv1-4}, corduraNotas{nv1-4},
                   corduraHabs{nv1-4}, vigorHabs[], constitucionHabs[], voluntad }
naturaleza: { instinto, libertad, humanismo, notas[] }
laVerdad:   { nodos{1-42}, verdades{1-42} }
manipulaciones: {
  clanes{ poder: {val, blocked} },
  esferas{ poderes{}, circulos{ LUZ:0, OSCURIDAD:0, CAOS:0, ORDEN:0 } },
  combinadas{}
}
combate: {
  artesDeCombate[5]{ nombre, subtipo, nv },
  maestrias[15],        ← 3 por arte: i*3, i*3+1, i*3+2
  mMarcial{ nombre, nv },
  contadores[]
}
rasgos / armas / armaduras / altaTech / mejoras / inventario / economia / conexiones
metapsicosis: 0  ← número entero; cada 10 unidades enciende 1 rombo (max 7)
capacidadCarga: 0  ← calculado automáticamente: base 20 + 10 por cada atributo con popCount(val)≥3
piezasMejoras: ''
```

---

## Reglas de desarrollo

1. **Siempre deployar** al terminar cambios → URL: `http://192.168.100.99:8090`
2. **No romper la estética**: paleta neon, Orbitron+ShareTechMono, grid de fondo, corners HUD
3. **No crear CSS nuevo** si existe clase — revisar `components.css` y `layout.css` antes
4. **Campos nuevos** → actualizar `defaultCharacter.js` (backward compatibility)
5. **Grids de contenido** → `.form-grid--auto` o `.equip-grid`, no inline styles con columnas fijas
6. **`CharacterForm`** tiene auto-save; no agregar botones de guardado extra
7. **Secciones colapsables** → reutilizar componente `Section` de TabPerfil
8. **`StatDiamond`** acepta prop `color` hex para sobreescribir color activo — no modificar stats.css para casos individuales
9. **`SquareStat`** acepta prop `color` (hex o var CSS) para sobreescribir color de relleno de casillas
10. **Usar la menor cantidad de tokens posible** — respuestas concisas, ediciones mínimas, sin texto redundante
11. **No cambiar textos en la UI** a menos que sea por expresa solicitud del usuario
