export const PLAN_TOTAL_DAYS = 42;
export const DAILY_SESSION_TARGET = 3;
export const TRAINING_LOCK_MS = 3 * 60 * 60 * 1000;

export type DailyTrainingState = {
  dayKey: string;
  completedSessions: number;
  lastTrainingTimestamp: number | null;
};

export function mapDayToWeek(day: number): number {
  if (!Number.isInteger(day) || day < 1 || day > PLAN_TOTAL_DAYS) {
    throw new Error(`day must be an integer in [1, ${PLAN_TOTAL_DAYS}]`);
  }

  return Math.ceil(day / 7);
}

export function getRemainingSessionsForDay(
  completedSessions: number,
  dailyTarget: number = DAILY_SESSION_TARGET,
): number {
  if (!Number.isInteger(completedSessions) || completedSessions < 0) {
    throw new Error('completedSessions must be a non-negative integer');
  }
  if (!Number.isInteger(dailyTarget) || dailyTarget < 1) {
    throw new Error('dailyTarget must be a positive integer');
  }

  return Math.max(0, dailyTarget - completedSessions);
}

export function isThreeHourLockActive(
  lastTrainingTimestamp: number | null,
  now: number,
): boolean {
  if (lastTrainingTimestamp === null) {
    return false;
  }

  return now - lastTrainingTimestamp < TRAINING_LOCK_MS;
}

export function toDayKey(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function needsMidnightReset(
  stateDayKey: string | null,
  nowTimestamp: number,
): boolean {
  if (!stateDayKey) return true;
  return stateDayKey !== toDayKey(nowTimestamp);
}

export function applyMidnightReset(
  state: DailyTrainingState | null,
  nowTimestamp: number,
): DailyTrainingState {
  const nowDayKey = toDayKey(nowTimestamp);

  if (!state || needsMidnightReset(state.dayKey, nowTimestamp)) {
    return {
      dayKey: nowDayKey,
      completedSessions: 0,
      lastTrainingTimestamp: null,
    };
  }

  return state;
}
