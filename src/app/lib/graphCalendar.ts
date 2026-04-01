import { addHours } from "date-fns";
import type { AccountInfo } from "@azure/msal-browser";
import { acquireOutlookGraphToken } from "./outlookMsal";

export type GraphCalendarEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string;
  hint?: string;
};

type GraphApiEvent = {
  id?: string;
  subject?: string | null;
  start?: { dateTime?: string; timeZone?: string };
  end?: { dateTime?: string; timeZone?: string };
  isOnlineMeeting?: boolean;
  location?: { displayName?: string | null };
};

function parseGraphStart(start?: { dateTime?: string; timeZone?: string }): Date {
  const raw = start?.dateTime?.trim();
  if (!raw) return new Date(NaN);
  if (/[zZ]$|[+-]\d\d:?\d\d$/.test(raw)) {
    return new Date(raw);
  }
  const trimmed = raw.replace(/\.\d+$/, "");
  const tz = (start?.timeZone ?? "").toUpperCase();
  if (tz === "UTC" || tz === "") {
    return new Date(`${trimmed}Z`);
  }
  return new Date(raw);
}

function mapGraphItem(item: GraphApiEvent): GraphCalendarEvent {
  const start = parseGraphStart(item.start);
  let end = parseGraphStart(item.end ?? {});
  if (isNaN(end.getTime()) || end <= start) {
    end = addHours(start, 1);
  }
  const hint = item.isOnlineMeeting
    ? "Teams"
    : item.location?.displayName?.trim() || undefined;
  return {
    id: `graph:${item.id ?? item.start?.dateTime ?? Math.random().toString(36)}`,
    start,
    end,
    title: (item.subject && String(item.subject).trim()) || "(Без темы)",
    hint,
  };
}

/** События основного календаря через Microsoft Graph (calendarView). */
export async function fetchOutlookCalendarRange(
  account: AccountInfo,
  rangeStart: Date,
  rangeEnd: Date,
): Promise<GraphCalendarEvent[]> {
  const token = await acquireOutlookGraphToken(account);
  const s = rangeStart.toISOString();
  const e = rangeEnd.toISOString();
  const url =
    `https://graph.microsoft.com/v1.0/me/calendarview?startDateTime=${encodeURIComponent(s)}` +
    `&endDateTime=${encodeURIComponent(e)}` +
    `&$select=subject,start,end,isOnlineMeeting,location,id` +
    `&$orderby=start/dateTime` +
    `&$top=200`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Prefer: 'outlook.timezone="UTC"',
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Microsoft Graph: ${res.status} ${body.slice(0, 280)}`);
  }

  const data = (await res.json()) as { value?: GraphApiEvent[] };
  const items = data.value ?? [];
  return items.map(mapGraphItem).filter((ev) => !Number.isNaN(ev.start.getTime()));
}
