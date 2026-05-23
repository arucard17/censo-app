import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import type { LocalRegistro } from '../types/registro'
import { db } from './firebase'
import {
  listPendingRegistros,
  markRegistroSynced,
  markRegistroSyncError,
} from './db'

function toFirestoreDoc(registro: LocalRegistro) {
  const serviciosPublicosOtro = registro.serviciosPublicosOtro
  const necesidadesOtro = registro.necesidadesOtro
  const serviciosPublicos = registro.serviciosPublicos
  const necesidades = registro.necesidades
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
  } = registro
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

  return {
    ...rest,
    serviciosPublicos: servicios,
    necesidades: necesidadesList,
    localId: registro.id,
    source: 'pwa-sonsito',
    createdAt: serverTimestamp(),
  }
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
