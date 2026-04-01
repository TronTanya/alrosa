export type AdminDbInstanceStatus = "online" | "maintenance" | "degraded";

export interface AdminDbInstanceRow {
  id: string;
  name: string;
  role: string;
  engine: string;
  endpoint: string;
  sizeGb: number;
  connections: number;
  maxConnections: number;
  replicationLagMs: number | null;
  status: AdminDbInstanceStatus;
  lastBackup: string;
}

export const adminDatabaseInstancesSeed: AdminDbInstanceRow[] = [
  {
    id: "db-primary",
    name: "eso-pg-primary",
    role: "Primary",
    engine: "PostgreSQL 15",
    endpoint: "pg-primary.internal:5432 / eso_core",
    sizeGb: 428,
    connections: 84,
    maxConnections: 200,
    replicationLagMs: null,
    status: "online",
    lastBackup: "Сегодня · 03:15 MSK",
  },
  {
    id: "db-replica",
    name: "eso-pg-replica-1",
    role: "Read replica",
    engine: "PostgreSQL 15",
    endpoint: "pg-replica-1.internal:5432 / eso_core",
    sizeGb: 426,
    connections: 32,
    maxConnections: 120,
    replicationLagMs: 18,
    status: "online",
    lastBackup: "Реплика · снимок с primary",
  },
  {
    id: "db-analytics",
    name: "eso-analytics",
    role: "OLAP / отчёты",
    engine: "PostgreSQL 15",
    endpoint: "pg-analytics.internal:5432 / eso_dw",
    sizeGb: 156,
    connections: 12,
    maxConnections: 60,
    replicationLagMs: null,
    status: "maintenance",
    lastBackup: "Плановое окно · 01:00–02:30",
  },
];

export const ADMIN_DB_INSTANCES_TOTAL = adminDatabaseInstancesSeed.length;
