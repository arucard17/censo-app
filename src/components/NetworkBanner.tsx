interface NetworkBannerProps {
  online: boolean
}

export function NetworkBanner({ online }: NetworkBannerProps) {
  if (online) return null
  return (
    <div className="network-banner" role="status">
      Sin conexión — los datos se guardarán y sincronizarán cuando vuelva internet.
    </div>
  )
}
