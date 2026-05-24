import { usePwaInstall } from '../hooks/usePwaInstall'

export function InstallPrompt() {
  const { canInstall, promptInstall, dismiss } = usePwaInstall()

  if (!canInstall) return null

  return (
    <div
      className="install-banner"
      role="region"
      aria-labelledby="install-banner-title"
    >
      <p id="install-banner-title" className="install-banner-title">
        Instala el censo en tu teléfono
      </p>
      <p className="install-banner-text muted">
        Ábrelo como una app, accede más rápido y sigue registrando aunque no
        haya internet.
      </p>
      <div className="install-banner-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => void promptInstall()}
        >
          Instalar aplicación
        </button>
        <button type="button" className="btn btn-secondary" onClick={dismiss}>
          Ahora no
        </button>
      </div>
    </div>
  )
}
