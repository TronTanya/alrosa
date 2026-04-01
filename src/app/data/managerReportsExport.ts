/**
 * Выгрузки отчётов руководителя: таблицы из актуальной демо-команды (MANAGER_TEAM_MEMBERS).
 */

import { MANAGER_TEAM_MEMBERS } from "./managerTeamCatalog";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatDateRu(d: Date): string {
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
}

export function stampYyyymmdd(d: Date = new Date()): string {
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
}

export function currentQuarterLabel(d: Date): string {
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `Q${q} ${d.getFullYear()}`;
}

export function currentYearLabel(d: Date): string {
  return `${d.getFullYear()} год`;
}

export function monthYearRu(d: Date): string {
  const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

export type ManagerReportExport = {
  filenameBase: string;
  title: string;
  subtitle: string;
  headers: string[];
  rows: string[][];
};

/** Примерные «часы обучения» в месяц из прогресса (демо-метрика). */
function demoMonthlyHours(progress: number): string {
  return String(Math.max(4, Math.round(progress * 0.35)));
}

export function getManagerReportExport(reportId: string): ManagerReportExport | null {
  const team = MANAGER_TEAM_MEMBERS;
  const today = formatDateRu(new Date());

  switch (reportId) {
    case "1":
      return {
        filenameBase: "svodka-po-obucheniyu-komandy",
        title: "Сводка по обучению команды",
        subtitle: `Актуально на ${today} · по данным карточек сотрудников`,
        headers: ["Сотрудник", "Подразделение", "Прогресс %", "Текущий курс", "Статус курса", "Прогресс курса %"],
        rows: team.map((m) => [
          m.shortName,
          m.dept,
          String(m.progress),
          m.activeCourse,
          m.courseStatus,
          String(m.courseProgress),
        ]),
      };
    case "2":
      return {
        filenameBase: "statusy-zayavok-na-obuchenie",
        title: "Статусы заявок на обучение (команда)",
        subtitle: `Конвейер обучения · ${today}`,
        headers: ["Сотрудник", "Подразделение", "Курс", "Статус", "Дедлайн"],
        rows: team.map((m) => [m.shortName, m.dept, m.activeCourse, m.courseStatus, m.courseDeadline]),
      };
    case "3":
      return {
        filenameBase: "progress-korporativnyh-programm",
        title: "Прогресс по корпоративным программам",
        subtitle: `По активным курсам · ${today}`,
        headers: ["Сотрудник", "Подразделение", "Программа (курс)", "Прогресс %", "Статус"],
        rows: team.map((m) => [m.shortName, m.dept, m.activeCourse, String(m.courseProgress), m.courseStatus]),
      };
    case "4":
      return {
        filenameBase: "matrica-kompetenciy-komanda",
        title: "Матрица компетенций — срез по команде",
        subtitle: `Прогресс как интегральная оценка · ${today}`,
        headers: ["Сотрудник", "Подразделение", "Роль", "Прогресс %", "Рекомендация ИИ"],
        rows: team.map((m) => [m.shortName, m.dept, m.role, String(m.progress), m.aiRec]),
      };
    case "5":
      return {
        filenameBase: "ipr-celi-i-deadline",
        title: "ИПР: цели и дедлайны (прямые подчинённые)",
        subtitle: `Цели из рекомендаций и сроков курсов · ${today}`,
        headers: ["Сотрудник", "Подразделение", "Фокус (рекомендация)", "Срок курса", "Прогресс %"],
        rows: team.map((m) => [m.shortName, m.dept, m.aiRec, m.courseDeadline, String(m.progress)]),
      };
    case "6":
      return {
        filenameBase: "chasy-obucheniya-i-byudzhet",
        title: "Часы обучения и бюджет (направление)",
        subtitle: `Оценочные часы в месяц (демо) · ${today}`,
        headers: ["Сотрудник", "Подразделение", "Оценка часов / мес.", "Прогресс %", "Статус курса"],
        rows: team.map((m) => [m.shortName, m.dept, demoMonthlyHours(m.progress), String(m.progress), m.courseStatus]),
      };
    default:
      return null;
  }
}
