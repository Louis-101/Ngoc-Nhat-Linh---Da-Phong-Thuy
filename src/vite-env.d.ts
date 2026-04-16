/// <reference types="vite/client" />

/** CSS module declarations for Vite + Tailwind/PostCSS */
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.css?raw' {
  const content: string;
  export default content;
}

/** Custom Vite env vars used in project */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // more VITE_ vars here if added later
  readonly VITE_APP_TITLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
