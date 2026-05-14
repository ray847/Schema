export interface LocalStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(namespace?: string): Promise<void>;
}

export interface StoredValue<T = unknown> {
  value: T;
  updatedAt: number;
}
