// Load Zone for Node first
import 'zone.js/node';

// Minimal in-memory localStorage for SSR so accidental reads don't crash
if (typeof (globalThis as any).localStorage === 'undefined') {
  const store = new Map<string, string>();
  const ls: any = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => { store.set(k, String(v)); ls.length = store.size; },
    removeItem: (k: string) => { store.delete(k); ls.length = store.size; },
    clear: () => { store.clear(); ls.length = 0; },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    length: 0
  };
  (globalThis as any).localStorage = ls;
}
