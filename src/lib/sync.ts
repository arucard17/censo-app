import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import type { LocalRegistro } from '../types/registro'
import { emptyRegistroPayload } from '../types/registro'
import { db } from './firebase'
import {
  listPendingRegistros,
  markRegistroSynced,
  markRegistroSyncError,
} from './db'

function toFirestoreDoc(registro: LocalRegistro) {
  const merged = { ...emptyRegistroPayload(), ...registro }
  const serviciosPublicosOtro = merged.serviciosPublicosOtro
  const necesidadesOtro = merged.necesidadesOtro
  const serviciosPublicos = merged.serviciosPublicos
  const necesidades = merged.necesidades
  const {
    nombre,
    email,
    celular,
    sector,
    estrato,
    tipoVivienda,
    dominioVivienda,
    arraigo,
    etnia,
    numPersonas,
    hombres1859,
    mujeres1859,
    hombres60,
    mujeres60,
    ninos,
    ninas,
    discapacitados,
    desplazados,
    reinsertados,
    lgtbi,
    estudianEscuela,
    estudianColegio,
    estudianUniversidad,
    trabajanVereda,
    trabajanBuga,
    trabajanOtro,
    desplazamiento,
  } = merged
  const rest = {
    nombre,
    email,
    celular,
    sector,
    estrato,
    tipoVivienda,
    dominioVivienda,
    arraigo,
    etnia,
    numPersonas,
    hombres1859,
    mujeres1859,
    hombres60,
    mujeres60,
    ninos,
    ninas,
    discapacitados,
    desplazados,
    reinsertados,
    lgtbi,
    estudianEscuela,
    estudianColegio,
    estudianUniversidad,
    trabajanVereda,
    trabajanBuga,
    trabajanOtro,
    desplazamiento,
  }

  const servicios = [...serviciosPublicos]
  if (serviciosPublicosOtro.trim()) {
    servicios.push(`Otro: ${serviciosPublicosOtro.trim()}`)
  }

  const necesidadesList = [...necesidades]
  if (necesidadesOtro.trim()) {
    necesidadesList.push(`Otro: ${necesidadesOtro.trim()}`)
  }

  const acueductoAspectos = [...merged.acueductoAspectosMejorar]
  if (merged.acueductoAspectosMejorarOtro.trim()) {
    acueductoAspectos.push(`Otro: ${merged.acueductoAspectosMejorarOtro.trim()}`)
  }

  const doc: Record<string, unknown> = {
    ...rest,
    serviciosPublicos: servicios,
    necesidades: necesidadesList,
    acueductoSatisfaccionServicio: merged.acueductoSatisfaccionServicio,
    acueductoCalidadAgua: merged.acueductoCalidadAgua,
    acueductoAtencion: merged.acueductoAtencion,
    acueductoInformacionComunidad: merged.acueductoInformacionComunidad,
    acueductoGestionesInfraestructura: merged.acueductoGestionesInfraestructura,
    acueductoImportanciaModernizacion: merged.acueductoImportanciaModernizacion,
    acueductoGestionAlcantarillado: merged.acueductoGestionAlcantarillado,
    acueductoTransparenciaRecursos: merged.acueductoTransparenciaRecursos,
    acueductoAspectosMejorar: acueductoAspectos,
    acueductoParticipacion: merged.acueductoParticipacion,
    acueductoCalificacionJunta: merged.acueductoCalificacionJunta,
    acueductoSugerencias: merged.acueductoSugerencias.trim(),
    localId: merged.id,
    source: 'pwa-sonsito',
    createdAt: serverTimestamp(),
  }

  if (
    merged.gpsLatitude != null &&
    merged.gpsLongitude != null &&
    Number.isFinite(merged.gpsLatitude) &&
    Number.isFinite(merged.gpsLongitude)
  ) {
    doc.gpsLatitude = merged.gpsLatitude
    doc.gpsLongitude = merged.gpsLongitude
    if (merged.gpsAccuracy != null && Number.isFinite(merged.gpsAccuracy)) {
      doc.gpsAccuracy = merged.gpsAccuracy
    }
    if (merged.gpsCapturedAt) {
      doc.gpsCapturedAt = merged.gpsCapturedAt
    }
  }

  return doc
}

export async function syncOneRegistro(registro: LocalRegistro): Promise<boolean> {
  try {
    const ref = await addDoc(collection(db, 'registros'), toFirestoreDoc(registro))
    await markRegistroSynced(registro.id, ref.id)
    return true
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Error desconocido al sincronizar'
    await markRegistroSyncError(registro.id, message)
    return false
  }
}

export async function syncPendingRegistros(): Promise<{
  synced: number
  failed: number
}> {
  if (!navigator.onLine) {
    return { synced: 0, failed: 0 }
  }

  const pending = await listPendingRegistros()
  let synced = 0
  let failed = 0

  for (const registro of pending) {
    const ok = await syncOneRegistro(registro)
    if (ok) synced++
    else failed++
  }

  return { synced, failed }
}
