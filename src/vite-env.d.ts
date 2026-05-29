/// <reference types="vite/client" />

declare const __APP_VERSION__: string

declare module 'virtual:pwa-register' {
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

  export function registerSW(
    options?: RegisterSWOptions,
  ): (reloadPage?: boolean) => Promise<void>
}

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** Chromium install prompt; see MDN BeforeInstallPromptEvent */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
