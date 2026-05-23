import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { LocalRegistro, RegistroPayload } from '../types/registro'

interface censoDB extends DBSchema {
  registros: {
    key: string
    value: LocalRegistro
    indexes: { 'by-createdAt': string }
  }
}

const DB_NAME = 'censo-sonsito'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<censoDB>> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<censoDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore('registros', { keyPath: 'id' })
        store.createIndex('by-createdAt', 'createdAt')
      },
    })
  }
  return dbPromise
}

export async function insertRegistro(payload: RegistroPayload): Promise<LocalRegistro> {
  const db = await getDb()
  const registro: LocalRegistro = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    synced: false,
  }
  await db.add('registros', registro)
  return registro
}

export async function listRegistrosDesc(): Promise<LocalRegistro[]> {
  const db = await getDb()
  const all = await db.getAllFromIndex('registros', 'by-createdAt')
  return all.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function listPendingRegistros(): Promise<LocalRegistro[]> {
  const list = await listRegistrosDesc()
  return list.filter((r) => !r.synced)
}

export async function markRegistroSynced(
  id: string,
  firestoreId: string,
): Promise<void> {
  const db = await getDb()
  const existing = await db.get('registros', id)
  if (!existing) return
  await db.put('registros', {
    ...existing,
    synced: true,
    firestoreId,
    syncError: undefined,
  })
}

export async function markRegistroSyncError(
  id: string,
  message: string,
): Promise<void> {
  const db = await getDb()
  const existing = await db.get('registros', id)
  if (!existing) return
  await db.put('registros', { ...existing, syncError: message })
}
