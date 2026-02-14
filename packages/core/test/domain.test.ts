import {
  applyMidnightReset,
  getRemainingSessionsForDay,
  isThreeHourLockActive,
  mapDayToWeek,
  TRAINING_LOCK_MS,
} from '../src/domain';
import {
  createCapacitorPreferencesStore,
  createUnifiedStore,
  createWebLocalStorageStore,
} from '../src/persistence';

describe('mapDayToWeek', () => {
  it('maps day 1 and day 7 to week 1', () => {
    expect(mapDayToWeek(1)).toBe(1);
    expect(mapDayToWeek(7)).toBe(1);
  });

  it('maps day 42 to week 6', () => {
    expect(mapDayToWeek(42)).toBe(6);
  });
});

describe('getRemainingSessionsForDay', () => {
  it('returns sessions left in current day', () => {
    expect(getRemainingSessionsForDay(0)).toBe(3);
    expect(getRemainingSessionsForDay(2)).toBe(1);
  });

  it('clamps to zero after the target', () => {
    expect(getRemainingSessionsForDay(3)).toBe(0);
    expect(getRemainingSessionsForDay(9)).toBe(0);
  });
});

describe('isThreeHourLockActive', () => {
  it('is active before 3 hours elapse', () => {
    const last = Date.now();
    expect(isThreeHourLockActive(last, last + TRAINING_LOCK_MS - 1)).toBe(true);
  });

  it('is inactive at or after 3 hours', () => {
    const last = Date.now();
    expect(isThreeHourLockActive(last, last + TRAINING_LOCK_MS)).toBe(false);
    expect(isThreeHourLockActive(last, last + TRAINING_LOCK_MS + 10_000)).toBe(false);
  });
});

describe('persistence adapters + midnight reset behavior', () => {
  it('uses localStorage fallback via unified store', async () => {
    const map = new Map<string, string>();
    const localStorageMock: Storage = {
      length: 0,
      clear() { map.clear(); },
      getItem(key: string) { return map.get(key) ?? null; },
      key(index: number) { return [...map.keys()][index] ?? null; },
      removeItem(key: string) { map.delete(key); },
      setItem(key: string, value: string) { map.set(key, value); },
    };

    const store = createUnifiedStore({ localStorage: localStorageMock });
    await store.set('foo', 'bar');
    await expect(store.get('foo')).resolves.toBe('bar');
  });

  it('uses capacitor preferences when provided', async () => {
    const map = new Map<string, string>();
    const preferencesMock = {
      async get({ key }: { key: string }) {
        return { value: map.get(key) ?? null };
      },
      async set({ key, value }: { key: string; value: string }) {
        map.set(key, value);
      },
      async remove({ key }: { key: string }) {
        map.delete(key);
      },
    };

    const store = createUnifiedStore({ preferences: preferencesMock });
    await store.set('alpha', 'beta');
    await expect(store.get('alpha')).resolves.toBe('beta');
  });

  it('resets counters on day rollover (midnight reset)', () => {
    const beforeMidnight = new Date('2026-01-10T23:59:59').getTime();
    const afterMidnight = new Date('2026-01-11T00:00:01').getTime();

    const state = applyMidnightReset(
      {
        dayKey: '2026-01-10',
        completedSessions: 2,
        lastTrainingTimestamp: beforeMidnight,
      },
      afterMidnight,
    );

    expect(state.dayKey).toBe('2026-01-11');
    expect(state.completedSessions).toBe(0);
    expect(state.lastTrainingTimestamp).toBeNull();
  });

  it('keeps counters in same day', () => {
    const now = new Date('2026-01-10T10:00:00').getTime();

    const state = applyMidnightReset(
      {
        dayKey: '2026-01-10',
        completedSessions: 1,
        lastTrainingTimestamp: now,
      },
      now + 60_000,
    );

    expect(state.completedSessions).toBe(1);
    expect(state.lastTrainingTimestamp).toBe(now);
  });

  it('supports direct adapter constructors', async () => {
    const map = new Map<string, string>();
    const localStorageMock: Storage = {
      length: 0,
      clear() { map.clear(); },
      getItem(key: string) { return map.get(key) ?? null; },
      key(index: number) { return [...map.keys()][index] ?? null; },
      removeItem(key: string) { map.delete(key); },
      setItem(key: string, value: string) { map.set(key, value); },
    };

    const webStore = createWebLocalStorageStore(localStorageMock);
    await webStore.set('x', '1');
    await expect(webStore.get('x')).resolves.toBe('1');

    const capacitorStore = createCapacitorPreferencesStore({
      async get({ key }) { return { value: map.get(key) ?? null }; },
      async set({ key, value }) { map.set(key, value); },
      async remove({ key }) { map.delete(key); },
    });
    await capacitorStore.set('y', '2');
    await expect(capacitorStore.get('y')).resolves.toBe('2');
  });
});
