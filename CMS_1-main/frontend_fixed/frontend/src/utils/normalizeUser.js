// Normalize user objects coming from the backend so the frontend can rely
// on a consistent shape. This is intentionally conservative and only fills
// missing keys used across the UI.
export default function normalizeUser(me, selectedType = null, hms = null, token = null) {
  if (!me) return me;

  const selected = typeof selectedType === 'string' ? selectedType : null;

  const normalized = {
    ...me,
    // role should be a lowercase string like 'student'|'faculty'|'admin'
    role: (me.role && String(me.role).toLowerCase()) || (selected && selected.toLowerCase()) || undefined,
    // designation: keep existing or provide a safe default for faculty
    designation: me.designation || (selected === 'Faculty' ? 'Faculty' : me.designation),
  };

  // debug: show incoming and normalized shapes in dev
  try {
    if (import.meta?.env?.DEV || localStorage.getItem('AXIOS_DEBUG') === '1') {
      // eslint-disable-next-line no-console
      console.debug('[normalizeUser] incoming:', me, 'selectedType:', selectedType, 'hms:', hms);
      // eslint-disable-next-line no-console
      console.debug('[normalizeUser] normalized:', normalized);
    }
  } catch (e) {
    // ignore
  }

  // Ensure branchId is an object with optional name to avoid profile crashes
  if (normalized.branchId && typeof normalized.branchId === 'string') {
    normalized.branchId = { _id: normalized.branchId, name: normalized.branchName || '' };
  }

  // If HMS data contains hostelStudentId, attach it for Student layout checks
  if (hms && hms.hostelStudentId && !normalized.hostelStudentId) {
    normalized.hostelStudentId = hms.hostelStudentId;
  }

  // Store legacy token key for compatibility if caller provided it
  if (token) {
    try { localStorage.setItem('token', token); } catch (e) { /* ignore in SSR/test envs */ }
  }

  return normalized;
}
