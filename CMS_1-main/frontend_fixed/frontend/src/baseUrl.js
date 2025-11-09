// Use Vite env (import.meta.env) in the browser. Provide sensible fallbacks.
// Normalize common variants so frontend works with backends that mount under
// `/api` (the repo uses `/api`) even if the environment provides `/api/v1`.
const rawApi =
	(typeof process !== 'undefined' && process.env && process.env.REACT_APP_APILINK)
		? process.env.REACT_APP_APILINK
		: import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Normalize endings like `/api/v1`, `/api/v1/` -> `/api` and strip extra slashes
const normalizeApi = (url) => {
	try {
		// simple string fixes (keeps protocol/host intact)
		let u = String(url).trim();
		// convert /api/v1 or /api/v1/ -> /api
		u = u.replace(/\/api\/v?1\/?$/i, '/api');
		// remove trailing slashes
		u = u.replace(/\/+$/, '');
		return u;
	} catch (e) {
		return url;
	}
};

const BASE_URL = normalizeApi(rawApi);

const MEDIA_URL = typeof process !== 'undefined' && process.env && process.env.REACT_APP_MEDIA_LINK
	? process.env.REACT_APP_MEDIA_LINK
	: import.meta.env.VITE_MEDIA_URL || '';

// Backwards-compatible named constants used around the app
export const CMS_BASE_URL = import.meta.env.VITE_CMS_BASE_URL || BASE_URL;
export const HMS_BASE_URL = import.meta.env.VITE_HMS_BASE_URL || 'http://localhost:5000/api';

export { BASE_URL, MEDIA_URL };
