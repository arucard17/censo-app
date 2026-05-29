export const SECTORES = [
  'Sonsito',
  'Sonsito Alto',
  'Altos de Zanjón Hondo',
] as const

export const ESTRATOS = [1, 2, 3, 4, 5] as const

export const TIPOS_VIVIENDA = [
  'Casa',
  'Conjunto',
  'Casa lote',
  'Finca',
] as const

export const DOMINIO_VIVIENDA = ['Propia', 'Arrendo'] as const

export const SERVICIOS_PUBLICOS = [
  'Agua',
  'Energia',
  'Gas Domiciliario',
  'Alcantarillado',
  'Basuras',
] as const

export const ARRAIGO = ['Raizal', 'Migrante', 'Otro'] as const

export const ETNIA = ['Afro', 'Indígena', 'Otro'] as const

export const DESPLAZAMIENTO = [
  'A Pie',
  'En Moto',
  'En Carro',
  'Vehículo de alquiler',
] as const

export const NECESIDADES = [
  'Iluminación de la vía Zanjón Hondo-Sonsito',
  'Gas domiciliario',
  'Placa huella vía Zanjón Hondo-Sonsito',
] as const

export const ACUEDUCTO_SATISFACCION = [
  'Muy satisfecho',
  'Satisfecho',
  'Regular',
  'Insatisfecho',
  'Muy insatisfecho',
] as const

export const ACUEDUCTO_CALIFICACION = [
  'Excelente',
  'Buena',
  'Regular',
  'Deficiente',
  'Muy deficiente',
] as const

export const ACUEDUCTO_FRECUENCIA = [
  'Siempre',
  'Casi siempre',
  'Algunas veces',
  'Rara vez',
  'Nunca',
] as const

export const ACUEDUCTO_IMPORTANCIA = [
  'Muy importante',
  'Importante',
  'Medianamente importante',
  'Poco importante',
  'Nada importante',
] as const

export const ACUEDUCTO_ACUERDO = [
  'Totalmente de acuerdo',
  'De acuerdo',
  'Neutral',
  'En desacuerdo',
  'Totalmente en desacuerdo',
] as const

export const ACUEDUCTO_ASPECTOS_MEJORAR = [
  'Continuidad del servicio',
  'Calidad del agua',
  'Presión del agua',
  'Atención al usuario',
  'Comunicación con la comunidad',
  'Infraestructura del sistema',
  'Estado de las vías de acceso',
  'Gestión de proyectos',
  'Redes de alcantarillado',
] as const

export const ACUEDUCTO_PARTICIPACION = [
  'Sí',
  'No',
  'Dependiendo de la actividad',
] as const

export type AcueductoSatisfaccion = (typeof ACUEDUCTO_SATISFACCION)[number]
export type AcueductoCalificacion = (typeof ACUEDUCTO_CALIFICACION)[number]
export type AcueductoFrecuencia = (typeof ACUEDUCTO_FRECUENCIA)[number]
export type AcueductoImportancia = (typeof ACUEDUCTO_IMPORTANCIA)[number]
export type AcueductoAcuerdo = (typeof ACUEDUCTO_ACUERDO)[number]
export type AcueductoParticipacion = (typeof ACUEDUCTO_PARTICIPACION)[number]

export type Sector = (typeof SECTORES)[number]
export type Estrato = (typeof ESTRATOS)[number]
export type TipoVivienda = (typeof TIPOS_VIVIENDA)[number]
export type DominioVivienda = (typeof DOMINIO_VIVIENDA)[number]
export type Arraigo = (typeof ARRAIGO)[number]
export type Etnia = (typeof ETNIA)[number]
export type Desplazamiento = (typeof DESPLAZAMIENTO)[number]

export interface RegistroPayload {
  nombre: string
  email: string
  celular: string
  sector: Sector
  estrato: Estrato
  tipoVivienda: TipoVivienda
  dominioVivienda: DominioVivienda
  serviciosPublicos: string[]
  serviciosPublicosOtro: string
  arraigo: Arraigo
  etnia: Etnia
  numPersonas: number
  hombres1859: number
  mujeres1859: number
  hombres60: number
  mujeres60: number
  ninos: number
  ninas: number
  discapacitados: number
  discapacidadEnfermedad: string
  discapacidadTiempo: string
  discapacidadCuidadorNombre: string
  discapacidadCuidadorTelefono: string
  desplazados: number
  reinsertados: number
  lgtbi: number
  estudianEscuela: number
  estudianColegio: number
  estudianUniversidad: number
  trabajanVereda: number
  trabajanBuga: number
  trabajanOtro: number
  desplazamiento: Desplazamiento
  necesidades: string[]
  necesidadesOtro: string
  acueductoSatisfaccionServicio: AcueductoSatisfaccion | ''
  acueductoCalidadAgua: AcueductoCalificacion | ''
  acueductoAtencion: AcueductoCalificacion | ''
  acueductoInformacionComunidad: AcueductoFrecuencia | ''
  acueductoGestionesInfraestructura: AcueductoCalificacion | ''
  acueductoImportanciaModernizacion: AcueductoImportancia | ''
  acueductoGestionAlcantarillado: AcueductoCalificacion | ''
  acueductoTransparenciaRecursos: AcueductoAcuerdo | ''
  acueductoAspectosMejorar: string[]
  acueductoAspectosMejorarOtro: string
  acueductoParticipacion: AcueductoParticipacion | ''
  acueductoCalificacionJunta: number
  acueductoSugerencias: string
  gpsLatitude: number | null
  gpsLongitude: number | null
  gpsAccuracy: number | null
  gpsCapturedAt: string | null
}

export interface LocalRegistro extends RegistroPayload {
  id: string
  createdAt: string
  synced: boolean
  firestoreId?: string
  syncError?: string
}

export function emptyRegistroPayload(): RegistroPayload {
  return {
    nombre: '',
    email: '',
    celular: '',
    sector: 'Sonsito',
    estrato: 1,
    tipoVivienda: 'Casa',
    dominioVivienda: 'Propia',
    serviciosPublicos: [],
    serviciosPublicosOtro: '',
    arraigo: 'Raizal',
    etnia: 'Afro',
    numPersonas: 0,
    hombres1859: 0,
    mujeres1859: 0,
    hombres60: 0,
    mujeres60: 0,
    ninos: 0,
    ninas: 0,
    discapacitados: 0,
    discapacidadEnfermedad: '',
    discapacidadTiempo: '',
    discapacidadCuidadorNombre: '',
    discapacidadCuidadorTelefono: '',
    desplazados: 0,
    reinsertados: 0,
    lgtbi: 0,
    estudianEscuela: 0,
    estudianColegio: 0,
    estudianUniversidad: 0,
    trabajanVereda: 0,
    trabajanBuga: 0,
    trabajanOtro: 0,
    desplazamiento: 'A Pie',
    necesidades: [],
    necesidadesOtro: '',
    acueductoSatisfaccionServicio: '',
    acueductoCalidadAgua: '',
    acueductoAtencion: '',
    acueductoInformacionComunidad: '',
    acueductoGestionesInfraestructura: '',
    acueductoImportanciaModernizacion: '',
    acueductoGestionAlcantarillado: '',
    acueductoTransparenciaRecursos: '',
    acueductoAspectosMejorar: [],
    acueductoAspectosMejorarOtro: '',
    acueductoParticipacion: '',
    acueductoCalificacionJunta: 0,
    acueductoSugerencias: '',
    gpsLatitude: null,
    gpsLongitude: null,
    gpsAccuracy: null,
    gpsCapturedAt: null,
  }
}

export function validateRegistro(data: RegistroPayload): string | null {
  if (!data.nombre.trim()) return 'El nombre es obligatorio.'
  if (!data.celular.trim()) return 'El número de celular es obligatorio.'
  if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    return 'Correo electrónico no válido.'
  }
  const counts = [
    data.numPersonas,
    data.hombres1859,
    data.mujeres1859,
    data.hombres60,
    data.mujeres60,
    data.ninos,
    data.ninas,
    data.discapacitados,
    data.desplazados,
    data.reinsertados,
    data.lgtbi,
    data.estudianEscuela,
    data.estudianColegio,
    data.estudianUniversidad,
    data.trabajanVereda,
    data.trabajanBuga,
    data.trabajanOtro,
  ]
  if (counts.some((n) => n < 0 || !Number.isInteger(n))) {
    return 'Las cantidades deben ser números enteros mayores o iguales a cero.'
  }
  const cal = data.acueductoCalificacionJunta
  if (!Number.isInteger(cal) || cal < 0 || cal > 10) {
    return 'La calificación a la Junta Directiva debe estar entre 1 y 10, o dejarse en blanco.'
  }
  if (data.discapacitados > 0) {
    if (!data.discapacidadEnfermedad.trim()) {
      return 'Indique qué enfermedad o condición tiene la persona con discapacidad.'
    }
    if (!data.discapacidadTiempo.trim()) {
      return 'Indique hace cuánto tiempo.'
    }
    if (!data.discapacidadCuidadorNombre.trim()) {
      return 'Indique el nombre del cuidador.'
    }
    if (!data.discapacidadCuidadorTelefono.trim()) {
      return 'Indique el número de teléfono del cuidador.'
    }
  }
  return null
}
