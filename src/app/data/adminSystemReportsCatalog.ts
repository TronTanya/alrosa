export type AdminReportFormat = "pdf" | "xlsx" | "csv";

export type AdminReportJobStatus = "ready" | "running" | "failed" | "scheduled";

export interface AdminSystemReportRow {
  id: string;
  name: string;
  category: string;
  format: AdminReportFormat;
  schedule: string;
  status: AdminReportJobStatus;
  lastRun: string;
  sizeMb: number | null;
  detail: string;
}

export const adminSystemReportsSeed: AdminSystemReportRow[] = [
  {
    id: "rep-audit",
    name: "Журнал аудита безопасности",
    category: "Безопасность",
    format: "pdf",
    schedule: "Ежедневно · 06:00 MSK",
    status: "ready",
    lastRun: "30.03.2026 · 06:02",
    sizeMb: 2.4,
    detail: "Входы, смена ролей, экспорт данных.",
  },
  {
    id: "rep-sla",
    name: "SLA API и интеграций",
    category: "Надёжность",
    format: "xlsx",
    schedule: "По понедельникам",
    status: "scheduled",
    lastRun: "24.03.2026 · 09:00",
    sizeMb: 0.8,
    detail: "Латентность, коды ответов, инциденты.",
  },
  {
    id: "rep-lic",
    name: "Сводка по лицензиям и квотам",
    category: "Лицензии",
    format: "xlsx",
    schedule: "1-е число месяца",
    status: "running",
    lastRun: "Выполняется…",
    sizeMb: null,
    detail: "GigaChat, внешние LMS, места в хранилище.",
  },
  {
    id: "rep-backup",
    name: "Статус резервного копирования БД",
    category: "Инфраструктура",
    format: "csv",
    schedule: "После каждого бэкапа",
    status: "ready",
    lastRun: "30.03.2026 · 03:18",
    sizeMb: 0.1,
    detail: "Размер дампа, RPO/RTO, целостность.",
  },
  {
    id: "rep-users",
    name: "Активность пользователей ЕСО",
    category: "Использование",
    format: "pdf",
    schedule: "По запросу",
    status: "failed",
    lastRun: "29.03.2026 · 14:22",
    sizeMb: null,
    detail: "Таймаут соединения с витриной отчётов.",
  },
  {
    id: "rep-compliance",
    name: "Комплаенс обучения (ИТ)",
    category: "HR / L&D",
    format: "pdf",
    schedule: "Ежеквартально",
    status: "ready",
    lastRun: "15.03.2026 · 11:00",
    sizeMb: 5.1,
    detail: "Прохождение обязательных программ по подразделениям.",
  },
];

export const ADMIN_SYSTEM_REPORTS_TOTAL = adminSystemReportsSeed.length;
