// Use Vite env (import.meta.env) in the browser. Provide sensible fallbacks.
const BASE_URL = typeof process !== 'undefined' && process.env && process.env.REACT_APP_APILINK
	? process.env.REACT_APP_APILINK
	: import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const MEDIA_URL = typeof process !== 'undefined' && process.env && process.env.REACT_APP_MEDIA_LINK
	? process.env.REACT_APP_MEDIA_LINK
	: import.meta.env.VITE_MEDIA_URL || '';

// Backwards-compatible named constants used around the app
export const CMS_BASE_URL = import.meta.env.VITE_CMS_BASE_URL || BASE_URL;
export const HMS_BASE_URL = import.meta.env.VITE_HMS_BASE_URL || 'http://localhost:5000/api';

export { BASE_URL, MEDIA_URL };
