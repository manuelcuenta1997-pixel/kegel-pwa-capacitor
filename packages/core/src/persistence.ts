export interface KeyValueStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

export interface CapacitorPreferencesLike {
  get(options: { key: string }): Promise<{ value: string | null }>;
  set(options: { key: string; value: string }): Promise<void>;
  remove(options: { key: string }): Promise<void>;
}

export function createWebLocalStorageStore(storage: Storage): KeyValueStore {
  return {
    async get(key) {
      return storage.getItem(key);
    },
    async set(key, value) {
      storage.setItem(key, value);
    },
    async remove(key) {
      storage.removeItem(key);
    },
  };
}

export function createCapacitorPreferencesStore(
  preferences: CapacitorPreferencesLike,
): KeyValueStore {
  return {
    async get(key) {
      const result = await preferences.get({ key });
      return result.value;
    },
    async set(key, value) {
      await preferences.set({ key, value });
    },
    async remove(key) {
      await preferences.remove({ key });
    },
  };
}

export function createUnifiedStore(options: {
  preferences?: CapacitorPreferencesLike;
  localStorage?: Storage;
}): KeyValueStore {
  if (options.preferences) {
    return createCapacitorPreferencesStore(options.preferences);
  }

  if (options.localStorage) {
    return createWebLocalStorageStore(options.localStorage);
  }

  throw new Error('No persistence backend available');
}
