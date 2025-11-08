// Polyfill minimal process.env in the browser for legacy code that uses process.env
// Prefer Vite's import.meta.env, fall back to sensible defaults.
const env = typeof import.meta !== 'undefined' ? import.meta.env || {} : {};

if (typeof globalThis.process === 'undefined') {
  globalThis.process = { env: {} };
}

// Map common REACT_APP_* vars to Vite equivalents if present
globalThis.process.env.REACT_APP_APILINK = globalThis.process.env.REACT_APP_APILINK || env.VITE_API_URL || env.VITE_CMS_BASE_URL || 'http://localhost:4000/api';
globalThis.process.env.REACT_APP_MEDIA_LINK = globalThis.process.env.REACT_APP_MEDIA_LINK || env.VITE_MEDIA_URL || '';

export default globalThis.process;
