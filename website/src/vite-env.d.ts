/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Firebase App Distribution tester invite link. Set it in Cloudflare Pages env vars. */
  readonly VITE_FIREBASE_INVITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
