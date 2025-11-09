import axiosWrapper from './AxiosWrapper';

const cache = new Map();

export async function getBranchNameById(id) {
  if (!id) return null;
  if (cache.has(id)) return cache.get(id);
  try {
    // debug: log cache miss
    try {
      if (import.meta?.env?.DEV || localStorage.getItem('AXIOS_DEBUG') === '1') {
        // eslint-disable-next-line no-console
        console.debug('[branchCache] cache miss for id:', id);
      }
    } catch (e) {}

    const res = await axiosWrapper.get('/branch');
    if (res?.data?.success && Array.isArray(res.data.data)) {
      const found = res.data.data.find((b) => String(b._id) === String(id));
      const name = found ? found.name : null;
      if (name) cache.set(id, name);
      // debug: log lookup result
      try { if (import.meta?.env?.DEV || localStorage.getItem('AXIOS_DEBUG') === '1') {
        // eslint-disable-next-line no-console
        console.debug('[branchCache] lookup result for', id, '->', name);
      } } catch (e) {}
      return name;
    }
  } catch (e) {
    try { if (import.meta?.env?.DEV || localStorage.getItem('AXIOS_DEBUG') === '1') {
      // eslint-disable-next-line no-console
      console.error('[branchCache] lookup failed for', id, e);
    } } catch (er) {}
  }
  return null;
}
