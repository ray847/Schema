import { createIdbStore } from './idbStore';
import { createMemoryStore } from './memoryStore';

export type { LocalStore, StoredValue } from './LocalStore';
export { createIdbStore } from './idbStore';
export { createMemoryStore } from './memoryStore';

export const localStore =
  typeof globalThis.indexedDB === 'undefined'
    ? createMemoryStore()
    : createIdbStore();
