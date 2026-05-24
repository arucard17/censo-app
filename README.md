# Censo Vereda Sonsito (PWA)

Aplicación web progresiva (PWA) para el censo y caracterización de la comunidad de la **Vereda Sonsito**, alineada con el formulario de la Junta de Acción Comunal. Funciona **sin conexión**, guarda registros en el dispositivo y los **sincroniza con Firestore** cuando hay internet.

URL publicada (GitHub Pages): `https://<tu-usuario>.github.io/censo-app/`

## Requisitos

- Node.js 22+
- Proyecto Firebase `vereda-sonsito` con Firestore habilitado

## Desarrollo local

```bash
cp .env.example .env
# Editar .env con la configuración de Firebase
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto incluye el prefijo `/censo-app/`).

## Build

```bash
npm run build
npm run preview
```

## Docker

```bash
cp .env.example .env
docker compose up --build
```

Abre [http://localhost:8080/censo-app/](http://localhost:8080/censo-app/).

## Firestore (reglas e índices)

```bash
npx -y firebase-tools@latest login
npx -y firebase-tools@latest use vereda-sonsito
npx -y firebase-tools@latest deploy --only firestore
```

Las reglas permiten lectura abierta y creación validada; no permiten actualizar ni borrar desde el cliente.

## GitHub Pages

1. En el repositorio: **Settings → Pages → Build and deployment**.
   - **GitHub Actions** (recomendado): el workflow publica el build desde la carpeta `docs/`.
   - O **Deploy from a branch** → rama `main` → carpeta **`/docs`** (mismo directorio que genera Vite).
2. Configura los **secrets** del repositorio con los mismos nombres que en `.env.example` (`VITE_FIREBASE_*`) si usas Actions.
3. `npm run build` escribe la salida en **`docs/`** (no en `dist/`). Con Actions, cada push a `main` ejecuta [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Instalación como PWA

En el navegador del celular, abre la URL publicada y usa «Agregar a pantalla de inicio» (o «Instalar aplicación»).

## Privacidad

Los datos personales se almacenan en Firestore con reglas de solo creación desde la app. El acceso de lectura está abierto según la configuración acordada; valora reforzar autenticación si el censo crece.

## Estructura

- `src/lib/db.ts` — IndexedDB (cola local y estado sincronizado)
- `src/lib/sync.ts` — envío a Firestore
- `src/components/RegistroForm.tsx` — formulario del censo
- `firestore.rules` — validación en servidor
