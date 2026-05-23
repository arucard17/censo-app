import type { LocalRegistro } from '../types/registro'

interface RegistroListProps {
  registros: LocalRegistro[]
  loading: boolean
  onNew: () => void
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function RegistroList({ registros, loading, onNew }: RegistroListProps) {
  return (
    <section className="list-section">
      <div className="list-header">
        <h2>Registros</h2>
        <button type="button" className="btn btn-primary" onClick={onNew}>
          Nuevo registro
        </button>
      </div>

      {loading && <p className="muted">Cargando…</p>}

      {!loading && registros.length === 0 && (
        <p className="empty-state">
          No hay registros en este dispositivo. Agrega el primero con «Nuevo registro».
        </p>
      )}

      <ul className="registro-list">
        {registros.map((r) => (
          <li key={r.id} className="registro-card">
            <div className="registro-card-main">
              <strong>{r.nombre}</strong>
              <span className="muted">{r.sector}</span>
            </div>
            <div className="registro-card-meta">
              <time dateTime={r.createdAt}>{formatDate(r.createdAt)}</time>
              <span
                className={
                  r.synced ? 'badge badge-synced' : 'badge badge-pending'
                }
              >
                {r.synced ? 'Sincronizado' : 'Pendiente'}
              </span>
            </div>
            {!r.synced && r.syncError && (
              <p className="sync-error">{r.syncError}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
