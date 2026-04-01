import {
  addDays,
  addMinutes,
  isAfter,
  isWeekend,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";

export type TimeInterval = { start: Date; end: Date };

function mergeIntervals(intervals: TimeInterval[]): TimeInterval[] {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a.start.getTime() - b.start.getTime());
  const out: TimeInterval[] = [{ start: sorted[0].start, end: sorted[0].end }];
  for (let i = 1; i < sorted.length; i++) {
    const cur = sorted[i];
    const last = out[out.length - 1];
    if (cur.start.getTime() <= last.end.getTime()) {
      if (cur.end.getTime() > last.end.getTime()) last.end = cur.end;
    } else {
      out.push({ start: cur.start, end: cur.end });
    }
  }
  return out;
}

function overlaps(a: TimeInterval, b: TimeInterval): boolean {
  return a.start < b.end && b.start < a.end;
}

/**
 * Подбирает свободные окна под обучение (будни, интервал дня, без пересечения с встречами).
 * Эвристика для демо; в проде можно заменить на getSchedule / findMeetingTimes Graph.
 */
export function computeFreeLearningSlots(
  busy: TimeInterval[],
  rangeStart: Date,
  rangeEnd: Date,
  opts?: { slotMinutes?: number; workStartHour?: number; workEndHour?: number; maxSlots?: number },
): TimeInterval[] {
  const slotMinutes = opts?.slotMinutes ?? 120;
  const workStartHour = opts?.workStartHour ?? 9;
  const workEndHour = opts?.workEndHour ?? 18;
  const maxSlots = opts?.maxSlots ?? 14;

  const merged = mergeIntervals(busy.filter((b) => !isNaN(b.start.getTime()) && !isNaN(b.end.getTime()) && b.end > b.start));
  const slots: TimeInterval[] = [];

  let day = startOfDay(rangeStart);
  const lastDay = startOfDay(rangeEnd);

  while (!isAfter(day, lastDay) && slots.length < maxSlots) {
    if (!isWeekend(day)) {
      let t = setMinutes(setHours(day, workStartHour), 0);
      const dayCap = setMinutes(setHours(day, workEndHour), 0);
      while (t < dayCap && slots.length < maxSlots) {
        const slotEnd = addMinutes(t, slotMinutes);
        if (slotEnd > dayCap) break;
        const candidate: TimeInterval = { start: t, end: slotEnd };
        const clash = merged.some((b) => overlaps(candidate, b));
        if (!clash) {
          slots.push(candidate);
          t = slotEnd;
        } else {
          t = addMinutes(t, 30);
        }
      }
    }
    day = addDays(day, 1);
  }

  return slots;
}
