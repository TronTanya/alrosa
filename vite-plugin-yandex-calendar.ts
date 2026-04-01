/**
 * Только для dev-сервера Vite: обмен OAuth-кода и загрузка событий Яндекс.Календаря (CalDAV).
 * В production нужен свой backend с теми же эндпоинтами или прокси.
 */
import type { IncomingMessage } from "node:http";
import type { Plugin } from "vite";

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function icalUtc(ts: Date): string {
  const iso = ts.toISOString();
  return iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function icalProp(block: string, name: string): string | null {
  const re = new RegExp(`^${name}(?:;[^:]*)?:([^\\r\\n]+)`, "im");
  const mm = block.match(re);
  return mm ? mm[1].trim().replace(/\\,/g, ",").replace(/\\n/g, "\n") : null;
}

/** Минимальный разбор VEVENT из iCalendar (UTC / плавающие даты; сложные TZID — по возможности). */
function parseVeventsFromIcs(ics: string): Array<{ uid: string; title: string; start: Date; end: Date }> {
  const out: Array<{ uid: string; title: string; start: Date; end: Date }> = [];
  const veventRe = /BEGIN:VEVENT([\s\S]*?)END:VEVENT/g;
  let m: RegExpExecArray | null;
  const parseDt = (raw: string | null): Date | null => {
    if (!raw) return null;
    const v = raw.replace(/;.*$/, "");
    if (/^\d{8}$/.test(v)) {
      const y = v.slice(0, 4);
      const mo = v.slice(4, 6);
      const d = v.slice(6, 8);
      return new Date(`${y}-${mo}-${d}T00:00:00.000Z`);
    }
    if (/^\d{8}T\d{6}Z?$/.test(v)) {
      const z = v.endsWith("Z") ? v : `${v}Z`;
      const y = z.slice(0, 4);
      const mo = z.slice(4, 6);
      const d = z.slice(6, 8);
      const hh = z.slice(9, 11);
      const mm = z.slice(11, 13);
      const ss = z.slice(13, 15);
      return new Date(`${y}-${mo}-${d}T${hh}:${mm}:${ss}.000Z`);
    }
    const t = Date.parse(raw);
    return Number.isNaN(t) ? null : new Date(t);
  };
  while ((m = veventRe.exec(ics)) !== null) {
    const block = m[1];
    const uid = icalProp(block, "UID") ?? `vevent-${out.length}`;
    const summary = icalProp(block, "SUMMARY") ?? "(Без темы)";
    const ds = parseDt(icalProp(block, "DTSTART"));
    const de = parseDt(icalProp(block, "DTEND"));
    if (!ds) continue;
    const end = de && de > ds ? de : new Date(ds.getTime() + 60 * 60 * 1000);
    out.push({ uid, title: summary, start: ds, end });
  }
  return out;
}

function extractCalendarDataBlocks(xml: string): string[] {
  const blocks: string[] = [];
  const re = /<(?:[^:>]+:)?calendar-data[^>]*>([\s\S]*?)<\/(?:[^:>]+:)?calendar-data>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const inner = m[1].trim();
    const cdata = inner.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/i);
    blocks.push(cdata ? cdata[1] : inner);
  }
  return blocks;
}

export function yandexCalendarDevPlugin(env: Record<string, string>): Plugin {
  return {
    name: "yandex-calendar-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        /** Прокси API Яндекс ID (инфо о пользователе) — обход CORS в dev; Authorization: OAuth &lt;token&gt; */
        if (req.method === "GET" && (url === "/api/yandex/id/info" || url.startsWith("/api/yandex/id/info?"))) {
          try {
            const auth = req.headers.authorization?.trim();
            if (!auth || !/^OAuth\s+\S+/i.test(auth)) {
              res.statusCode = 401;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ error: "expected Authorization: OAuth <token>" }));
              return;
            }
            const r = await fetch("https://login.yandex.ru/info?format=json", {
              headers: { Authorization: auth },
            });
            const text = await r.text();
            res.statusCode = r.status;
            res.setHeader("Content-Type", r.headers.get("content-type") || "application/json; charset=utf-8");
            res.end(text);
          } catch (e) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({ error: String(e) }));
          }
          return;
        }

        if (req.method === "POST" && url.startsWith("/api/yandex/oauth/token")) {
          try {
            const raw = await readBody(req);
            const params = new URLSearchParams(raw);
            const clientId = env.VITE_YANDEX_OAUTH_CLIENT_ID || env.YANDEX_OAUTH_CLIENT_ID || "";
            const clientSecret = env.YANDEX_OAUTH_CLIENT_SECRET || "";
            if (!clientId || !clientSecret) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(
                JSON.stringify({
                  error: "invalid_env",
                  error_description:
                    "Задайте VITE_YANDEX_OAUTH_CLIENT_ID и YANDEX_OAUTH_CLIENT_SECRET в .env (приложение на oauth.yandex.ru).",
                }),
              );
              return;
            }
            params.set("client_id", clientId);
            params.set("client_secret", clientSecret);
            const r = await fetch("https://oauth.yandex.ru/token", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: params.toString(),
            });
            const text = await r.text();
            if (!r.ok && process.env.NODE_ENV !== "production") {
              try {
                const j = JSON.parse(text) as { error?: string; error_description?: string };
                if (j.error || j.error_description) {
                  console.warn(
                    "[yandex-calendar-dev] oauth/token:",
                    j.error || r.status,
                    j.error_description || text.slice(0, 200),
                  );
                }
              } catch {
                console.warn("[yandex-calendar-dev] oauth/token HTTP", r.status, text.slice(0, 300));
              }
            }
            res.statusCode = r.status;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(text);
          } catch (e) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({ error: String(e) }));
          }
          return;
        }

        if (req.method === "POST" && url.startsWith("/api/yandex/calendar/events")) {
          try {
            const raw = await readBody(req);
            const body = JSON.parse(raw) as { access_token?: string; timeMin?: string; timeMax?: string };
            const token = body.access_token?.trim();
            if (!token) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "no access_token" }));
              return;
            }
            const t0 = body.timeMin ? new Date(body.timeMin) : new Date();
            const t1 = body.timeMax ? new Date(body.timeMax) : new Date(Date.now() + 90 * 24 * 3600 * 1000);
            const infoRes = await fetch("https://login.yandex.ru/info?format=json", {
              headers: { Authorization: `OAuth ${token}` },
            });
            if (!infoRes.ok) {
              const t = await infoRes.text();
              res.statusCode = infoRes.status;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ error: "login_info", detail: t.slice(0, 400) }));
              return;
            }
            const info = (await infoRes.json()) as {
              default_email?: string;
              login?: string;
              default_email_updated?: string;
            };
            let email = (info.default_email || "").trim();
            if (!email && info.login) {
              email = `${info.login}@yandex.ru`;
            }
            if (!email) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ error: "no_email", detail: info }));
              return;
            }
            const calPath = `https://caldav.yandex.ru/calendars/${encodeURIComponent(email)}/events/`;
            const start = icalUtc(t0);
            const end = icalUtc(t1);
            const xml = `<?xml version="1.0" encoding="utf-8"?>
<C:calendar-query xmlns:C="urn:ietf:params:xml:ns:caldav" xmlns:D="DAV:">
  <D:prop>
    <D:getetag/>
    <C:calendar-data/>
  </D:prop>
  <C:filter>
    <C:comp-filter name="VCALENDAR">
      <C:comp-filter name="VEVENT">
        <C:time-range start="${start}" end="${end}"/>
      </C:comp-filter>
    </C:comp-filter>
  </C:filter>
</C:calendar-query>`;
            const calRes = await fetch(calPath, {
              method: "REPORT",
              headers: {
                Authorization: `OAuth ${token}`,
                "Content-Type": "application/xml; charset=utf-8",
                Depth: "1",
              },
              body: xml,
            });
            const xmlText = await calRes.text();
            if (!calRes.ok) {
              res.statusCode = calRes.status;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ error: "caldav", detail: xmlText.slice(0, 800) }));
              return;
            }
            const all: Array<{ id: string; start: string; end: string; title: string; hint?: string }> = [];
            for (const block of extractCalendarDataBlocks(xmlText)) {
              for (const ev of parseVeventsFromIcs(block)) {
                all.push({
                  id: `yandex:${ev.uid}:${ev.start.getTime()}`,
                  start: ev.start.toISOString(),
                  end: ev.end.toISOString(),
                  title: ev.title,
                  hint: "Яндекс.Календарь",
                });
              }
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({ events: all }));
          } catch (e) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({ error: String(e) }));
          }
          return;
        }
        next();
      });
    },
  };
}
