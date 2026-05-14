import type { LocalStore, StoredValue } from './LocalStore';

const DEFAULT_DATABASE_NAME = 'space-planning-local-store';
const DEFAULT_STORE_NAME = 'entries';
const DATABASE_VERSION = 1;

const requestToPromise = <T>(request: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const transactionComplete = (transaction: IDBTransaction) =>
  new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });

function openDatabase(databaseName: string, storeName: string) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(databaseName, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function createIdbStore(
  databaseName = DEFAULT_DATABASE_NAME,
  storeName = DEFAULT_STORE_NAME,
): LocalStore {
  let databasePromise: Promise<IDBDatabase> | null = null;

  const getDatabase = () => {
    databasePromise ??= openDatabase(databaseName, storeName);
    return databasePromise;
  };

  const withStore = async <T>(
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore, transaction: IDBTransaction) => Promise<T>,
  ) => {
    const database = await getDatabase();
    const transaction = database.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const result = await callback(store, transaction);
    await transactionComplete(transaction);
    return result;
  };

  return {
    async get<T>(key: string): Promise<T | null> {
      const entry = await withStore('readonly', (store) =>
        requestToPromise<StoredValue<T> | undefined>(store.get(key))
      );
      return entry?.value ?? null;
    },

    async set<T>(key: string, value: T): Promise<void> {
      await withStore('readwrite', async (store) => {
        await requestToPromise(store.put({ value, updatedAt: Date.now() }, key));
      });
    },

    async remove(key: string): Promise<void> {
      await withStore('readwrite', async (store) => {
        await requestToPromise(store.delete(key));
      });
    },

    async clear(namespace?: string): Promise<void> {
      await withStore('readwrite', async (store) => {
        if (!namespace) {
          await requestToPromise(store.clear());
          return;
        }

        const keys = await requestToPromise<IDBValidKey[]>(store.getAllKeys());
        await Promise.all(
          keys
            .filter((key) => typeof key === 'string')
            .filter((key) => key === namespace || key.startsWith(namespace))
            .map((key) => requestToPromise(store.delete(key))),
        );
      });
    },
  };
}
