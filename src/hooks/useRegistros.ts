import { useCallback, useEffect, useState } from 'react'
import { listRegistrosDesc } from '../lib/db'
import { syncPendingRegistros } from '../lib/sync'
import type { LocalRegistro } from '../types/registro'

export function useRegistros() {
  const [registros, setRegistros] = useState<LocalRegistro[]>([])
  const [loading, setLoading] = useState(true)
  const [online, setOnline] = useState(navigator.onLine)
  const [syncing, setSyncing] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const list = await listRegistrosDesc()
      setRegistros(list)
    } finally {
      setLoading(false)
    }
  }, [])

  const runSync = useCallback(async () => {
    if (!navigator.onLine) return
    setSyncing(true)
    try {
      await syncPendingRegistros()
      await refresh()
    } finally {
      setSyncing(false)
    }
  }, [refresh])

  useEffect(() => {
    let active = true
    ;(async () => {
      const list = await listRegistrosDesc()
      if (!active) return
      setRegistros(list)
      setLoading(false)
      if (navigator.onLine) {
        setSyncing(true)
        try {
          await syncPendingRegistros()
          if (!active) return
          const updated = await listRegistrosDesc()
          setRegistros(updated)
        } finally {
          if (active) setSyncing(false)
        }
      }
    })()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const onOnline = () => {
      setOnline(true)
      void runSync()
    }
    const onOffline = () => setOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [runSync])

  return {
    registros,
    loading,
    online,
    syncing,
    refresh,
    runSync,
  }
}
