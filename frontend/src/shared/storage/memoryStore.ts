import type { LocalStore, StoredValue } from './LocalStore';

export function createMemoryStore(): LocalStore {
  const entries = new Map<string, StoredValue>();

  return {
    async get<T>(key: string): Promise<T | null> {
      return (entries.get(key)?.value as T | undefined) ?? null;
    },

    async set<T>(key: string, value: T): Promise<void> {
      entries.set(key, { value, updatedAt: Date.now() });
    },

    async remove(key: string): Promise<void> {
      entries.delete(key);
    },

    async clear(namespace?: string): Promise<void> {
      if (!namespace) {
        entries.clear();
        return;
      }

      for (const key of entries.keys()) {
        if (key === namespace || key.startsWith(namespace)) {
          entries.delete(key);
        }
      }
    },
  };
}
