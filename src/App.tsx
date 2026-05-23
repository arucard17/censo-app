import { useEffect, useState } from 'react'
import { insertRegistro } from './lib/db'
import { syncOneRegistro } from './lib/sync'
import { NetworkBanner } from './components/NetworkBanner'
import { RegistroForm } from './components/RegistroForm'
import { RegistroList } from './components/RegistroList'
import { useRegistros } from './hooks/useRegistros'
import type { RegistroPayload } from './types/registro'
import './App.css'

type View = 'list' | 'form'

const FORM_HASH = '#nuevo'

function viewFromHistory(): View {
  return history.state?.view === 'form' ? 'form' : 'list'
}

function App() {
  const [view, setView] = useState<View>(() =>
    window.location.hash === FORM_HASH ? 'form' : 'list',
  )
  const { registros, loading, online, syncing, refresh, runSync } =
    useRegistros()

  useEffect(() => {
    const onPopState = () => setView(viewFromHistory())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (window.location.hash === FORM_HASH && history.state?.view !== 'form') {
      history.replaceState({ view: 'form' }, '', FORM_HASH)
      setView('form')
    }
  }, [])

  const openForm = () => {
    history.pushState({ view: 'form' }, '', FORM_HASH)
    setView('form')
  }

  const goToList = () => {
    if (view !== 'form') {
      setView('list')
      return
    }
    if (window.location.hash === FORM_HASH || history.state?.view === 'form') {
      history.back()
      return
    }
    setView('list')
  }

  const handleSubmit = async (payload: RegistroPayload) => {
    const local = await insertRegistro(payload)
    if (navigator.onLine) {
      await syncOneRegistro(local)
    }
    await refresh()
    goToList()
  }

  return (
    <div className="app">
      <header className="app-header">
        <p className="eyebrow">Junta Acción Comunal</p>
        <h1>Vereda Sonsito</h1>
        <p className="subtitle">
          Caracterización de la comunidad y estudio de necesidades
        </p>
        {syncing && <p className="sync-status muted">Sincronizando…</p>}
      </header>

      <NetworkBanner online={online} />

      <main>
        {view === 'list' ? (
          <RegistroList
            registros={registros}
            loading={loading}
            onNew={openForm}
          />
        ) : (
          <RegistroForm
            onSubmit={handleSubmit}
            onCancel={goToList}
          />
        )}
      </main>

      {view === 'list' && registros.some((r) => !r.synced) && (
        <footer className="app-footer">
          <button
            type="button"
            className="btn btn-secondary btn-block"
            disabled={!online || syncing}
            onClick={() => void runSync()}
          >
            {online ? 'Sincronizar pendientes' : 'Sin conexión — pendientes en cola'}
          </button>
        </footer>
      )}
    </div>
  )
}

export default App
