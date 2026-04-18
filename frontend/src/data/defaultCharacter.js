export const DEFAULT_CHARACTER = {
  perfil: {
    nombre: '', alias: '', claseCentinela: '',
    edad: '', edadAparenta: '', fechaNacimiento: '',
    estatura: '', peso: '', contextura: '',
    nacionalidad: [''], residencia: '', estadoCivil: '', oficio: '',
    descripcion: '',
    estudios: [''], idiomas: [''], hobbies: [''],
    formaciones: [{ nombre: '', tipo: 'FORMACIÓN_ACADÉMICA' }]
  },

  afiliacion: {
    faccionPrevia: '', clanPrevio: '',
    faccionActual: '', clanActual: ''
  },

  atributos: {
    fuerza:     { val: 0, blocked: 0 },
    fortaleza:  { val: 0, blocked: 0 },
    destreza:   { val: 0, blocked: 0 },
    atletismo:  { val: 0, blocked: 0 },
    persuacion: { val: 0, blocked: 0 },
    presencia:  { val: 0, blocked: 0 },
    carisma:    { val: 0, blocked: 0 },
    astucia:    { val: 0, blocked: 0 },
    percepcion: { val: 0, blocked: 0 }
  },

  dones: {
    entropia:   { val: 0, blocked: 0 },
    reaccion:   { val: 0, blocked: 0 },
    vibracionM: { val: 0, blocked: 0 },
    agilidad:   { val: 0, blocked: 0 },
    celula:     { val: 0, blocked: 0 },
    macrofago:  { val: 0, blocked: 0 },
    empatia:    { val: 0, blocked: 0 },
    neutrofilo: { val: 0, blocked: 0 },
    predictor:  { val: 0, blocked: 0 }
  },

  virtudes: {
    autocontrol: { val: 0, blocked: 0, habilidades: [] },
    alerta:      { val: 0, blocked: 0, habilidades: [] },
    valentia:    { val: 0, blocked: 0, habilidades: [] }
  },

  estados_vitales: {
    vigor: 0,          vigorHabs: [],
    constitucion: 0,   constitucionHabs: [],
    cordura:       { nv1: 0, nv2: 0, nv3: 0, nv4: 0 },
    corduraNotas:  { nv1: '', nv2: '', nv3: '', nv4: '' },
    corduraHabs:   { nv1: [], nv2: [], nv3: [], nv4: [] },
    voluntad: 0
  },

  metapsicosis:    0,
  capacidadCarga:  0,
  piezasMejoras:   '',

  combate: {
    artesDeCombate: Array.from({ length: 5 }, () => ({ nombre: '', subtipo: '', nv: 0 })),
    maestrias: Array.from({ length: 20 }, () => ''),
    contadores: [{ nombre: '', val: 0 }, { nombre: '', val: 0 }],
    mMarcial: { nombre: '', nv: 0 }
  },

  manipulaciones: {
    clanes: {},
    esferas: { poderes: {}, circulos: { LUZ: 0, OSCURIDAD: 0, CAOS: 0, ORDEN: 0 } },
    combinadas: {}
  },

  mejoras: Array.from({ length: 4 }, () => ({ pieza: '', nivel: 0, objetivo: '', valor: '' })),

  naturaleza: {
    instinto: 0, libertad: 0, humanismo: 0,
    notas: ['', '', '', '', '']
  },

  laVerdad: {
    nodos:    Object.fromEntries(Array.from({ length: 42 }, (_, i) => [i + 1, false])),
    verdades: Object.fromEntries(Array.from({ length: 42 }, (_, i) => [i + 1, '']))
  },

  experiencia: { gastada: 0, saldo: 0, total: 0 },

  rasgos: [],

  armas: [],

  armaduras: [],

  altaTech: [],

  inventario: {
    mochila:  [],
    general:  []
  },

  conexiones: [],

  economia: {
    ingresoMensual: '', otrosIngresos: '',
    territorios: '',    otrosBienes: '',
    registros: [{ descripcion: '', ingreso: '', egreso: '' }]
  }
};
