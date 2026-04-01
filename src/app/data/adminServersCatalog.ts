export type AdminServerStatus = "online" | "maintenance" | "degraded";

export interface AdminServerRow {
  id: string;
  name: string;
  role: string;
  zone: string;
  ip: string;
  cpuPct: number;
  ramPct: number;
  status: AdminServerStatus;
  uptime: string;
}

export const adminServersSeed: AdminServerRow[] = [
  {
    id: "srv-api-1",
    name: "eso-api-01",
    role: "API Gateway",
    zone: "Зона A · prod",
    ip: "10.42.1.11",
    cpuPct: 14,
    ramPct: 38,
    status: "online",
    uptime: "42 дн.",
  },
  {
    id: "srv-api-2",
    name: "eso-api-02",
    role: "API Gateway",
    zone: "Зона B · prod",
    ip: "10.42.2.11",
    cpuPct: 22,
    ramPct: 41,
    status: "online",
    uptime: "42 дн.",
  },
  {
    id: "srv-worker",
    name: "eso-worker-01",
    role: "Фоновые задания",
    zone: "Зона A · prod",
    ip: "10.42.1.20",
    cpuPct: 8,
    ramPct: 52,
    status: "online",
    uptime: "18 дн.",
  },
  {
    id: "srv-ai",
    name: "eso-ai-gw-01",
    role: "Прокси Яндекс Алиса",
    zone: "Зона A · prod",
    ip: "10.42.1.30",
    cpuPct: 31,
    ramPct: 67,
    status: "degraded",
    uptime: "42 дн.",
  },
  {
    id: "srv-stg",
    name: "eso-stg-app",
    role: "Стенд интеграции",
    zone: "Зона C · staging",
    ip: "10.48.0.5",
    cpuPct: 3,
    ramPct: 24,
    status: "maintenance",
    uptime: "—",
  },
];

export const ADMIN_SERVERS_TOTAL = adminServersSeed.length;
