/**
 * Тела HTML для печати/PDF отчётов HR (данные из hrReportsData).
 */

import { escapeHtml } from "./pdfExport";
import type { HrReportRow } from "../data/hrReportsCatalog";
import {
  aggregateByDepartment,
  formatRuDateTime,
  getOrgLearningSummary,
  currentMonthYearRu,
  currentQuarterLabel,
} from "./hrReportsData";
import { hrEventsCatalog } from "../data/hrEventsCatalog";
import { hrEmployeesDirectory } from "../data/hrEmployeesDirectory";

function tableHtml(headers: string[], rows: string[][]): string {
  const th = headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
  const tr = rows
    .map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`)
    .join("");
  return `<table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
}

export function buildHrReportDetailHtml(reportId: string): string {
  const summary = getOrgLearningSummary();
  const depts = aggregateByDepartment();
  const meta = `<p class="meta">Сформировано: ${escapeHtml(formatRuDateTime())} · Период: ${escapeHtml(currentQuarterLabel())} / ${escapeHtml(currentMonthYearRu())}</p>`;

  switch (reportId) {
    case "1": {
      const rows = depts.map((d) => [
        d.department,
        String(d.total),
        String(d.inLearning),
        String(d.inPlan),
        d.avgPlanPct,
      ]);
      return `<h1>Охват обучения по подразделениям</h1>${meta}
<h2>Срез по справочнику сотрудников</h2>
${tableHtml(["Подразделение", "Всего", "В обучении", "В плане", "Средний % плана"], rows)}
<p class="small">Источник: актуальный реестр HR (${summary.total} записей).</p>`;
    }
    case "2": {
      const withPlan = hrEmployeesDirectory.filter((e) => e.planPct != null);
      const avg =
        withPlan.length > 0
          ? Math.round(withPlan.reduce((s, e) => s + (e.planPct ?? 0), 0) / withPlan.length)
          : null;
      let high = 0,
        mid = 0,
        low = 0,
        none = 0;
      for (const e of hrEmployeesDirectory) {
        if (e.planPct == null) none += 1;
        else if (e.planPct >= 70) high += 1;
        else if (e.planPct >= 40) mid += 1;
        else low += 1;
      }
      const statRows: string[][] = [
        ["Всего сотрудников", String(summary.total)],
        ["В обучении", String(summary.inLearning)],
        ["В плане обучения", String(summary.inPlan)],
        ["Не в плане", String(summary.notInPlan)],
        ["Средний % выполнения плана (по тем, у кого задан)", summary.avgPlanPct != null ? `${summary.avgPlanPct}%` : "—"],
        ["Среднее по сотрудникам с метрикой %", avg != null ? `${avg}%` : "—"],
        ["Доля с планом ≥70%", `${high} чел.`],
        ["Доля с планом 40–69%", `${mid} чел.`],
        ["Доля с планом <40%", `${low} чел.`],
        ["Без метрики плана", `${none} чел.`],
      ];
      return `<h1>Завершение курсов и средний прогресс</h1>${meta}
<h2>Агрегаты</h2>
${tableHtml(["Показатель", "Значение"], statRows)}`;
    }
    case "3": {
      const apps = summary.applications;
      if (apps.length === 0) {
        return `<h1>Заявки на обучение: статусы и сроки</h1>${meta}
<p>Нет заявок в локальном хранилище браузера. Добавьте заявки в разделе «Заявки на обучение» — они попадут в этот отчёт.</p>`;
      }
      const rows = apps.map((a) => [
        a.listTitle ?? a.title,
        a.provider,
        a.typeLabel,
        a.submittedAt,
        a.budgetRub != null ? `${a.budgetRub.toLocaleString("ru-RU")} ₽` : "—",
        a.roiPercent != null ? `${a.roiPercent}%` : "—",
      ]);
      return `<h1>Заявки на обучение</h1>${meta}
<h2>Текущая очередь (localStorage)</h2>
${tableHtml(["Курс / программа", "Провайдер", "Тип", "Подано", "Бюджет", "ROI"], rows)}`;
    }
    case "4":
      return `<h1>Исполнение бюджета L&amp;D</h1>${meta}
<h2>Связка с операционными данными</h2>
${tableHtml(
        ["Показатель", "Значение"],
        [
          ["Сотрудников в штате", String(summary.total)],
          ["В активном обучении", String(summary.inLearning)],
          ["Средний % плана по компании", summary.avgPlanPct != null ? `${summary.avgPlanPct}%` : "—"],
          ["Заявок в очереди", String(summary.pendingApplications)],
          [
            "Демо-бюджет квартала (как на дашборде KPI)",
            "4,8 млн ₽ из 6 млн ₽ (иллюстративно; полная интеграция с финансами — отдельное подключение)",
          ],
        ],
      )}`;
    case "5":
      return `<h1>Окупаемость программ (внутренние / внешние)</h1>${meta}
<h2>Распределение по статусам обучения</h2>
${tableHtml(
        ["Сегмент", "Человек", "Доля"],
        [
          [
            "В обучении",
            String(summary.inLearning),
            `${((summary.inLearning / summary.total) * 100).toFixed(1)}%`,
          ],
          ["В плане", String(summary.inPlan), `${((summary.inPlan / summary.total) * 100).toFixed(1)}%`],
          [
            "Не в плане",
            String(summary.notInPlan),
            `${((summary.notInPlan / summary.total) * 100).toFixed(1)}%`,
          ],
        ],
      )}
<p class="small">Детальный ROI по курсам — в заявках на обучение (столбцы бюджет и окупаемость).</p>`;
    case "6": {
      const rows = depts.map((d) => [d.department, d.avgPlanPct, String(d.inLearning), String(d.total)]);
      return `<h1>Матрица компетенций: срез по компании</h1>${meta}
<h2>Средний прогресс плана по подразделениям</h2>
${tableHtml(["Подразделение", "Средний % плана", "В обучении", "Всего"], rows)}`;
    }
    case "7": {
      const digital = hrEmployeesDirectory.filter(
        (e) =>
          /данн|разработ|инженер|devops|инфобез|архитект/i.test(e.role) || /данн|разработ|инфра|инфобез/i.test(e.department),
      );
      const rows = digital.slice(0, 60).map((e) => [
        e.name,
        e.department,
        e.role,
        e.planPct != null ? `${e.planPct}%` : "—",
        e.learningStatus,
      ]);
      return `<h1>Разрывы по цифровым навыкам</h1>${meta}
<h2>Выборка ИТ/данных/инфраструктуры (до 60 строк)</h2>
${tableHtml(["Сотрудник", "Подразделение", "Роль", "% плана", "Статус"], rows)}
<p class="small">Отбор по ключевым словам в роли и отделе; полный реестр — выгрузка «Таблица».</p>`;
    }
    case "8":
      return `<h1>Единый отчёт для руководства (one-pager)</h1>${meta}
<h2>Ключевые цифры</h2>
${tableHtml(
        ["Показатель", "Значение"],
        [
          ["Штат", String(summary.total)],
          ["В обучении", String(summary.inLearning)],
          ["Средний % выполнения учебных планов", summary.avgPlanPct != null ? `${summary.avgPlanPct}%` : "—"],
          ["Заявок на обучение в очереди", String(summary.pendingApplications)],
        ],
      )}
<ul>
<li>Детализация по подразделениям — отчёт «Охват обучения по подразделениям».</li>
<li>Заявки — отчёт «Заявки на обучение».</li>
</ul>`;
    case "9": {
      const rows = hrEventsCatalog.map((ev) => {
        const fill = ev.capacity ? Math.round((ev.registered / ev.capacity) * 100) : 0;
        return [ev.title, ev.kind, ev.date, ev.status, `${ev.registered} / ${ev.capacity}`, `${fill}%`];
      });
      return `<h1>Мероприятия: посещаемость и заполнение</h1>${meta}
<h2>Календарь L&amp;D (демо-каталог)</h2>
${tableHtml(["Мероприятие", "Тип", "Дата", "Статус", "Регистрация", "Заполнение"], rows)}
<p class="small">NPS можно добавить после интеграции опросов; сейчас — фактическая заполняемость мест.</p>`;
    }
    case "10":
      return `<h1>Траектории развития: статусы ИПР</h1>${meta}
<h2>Распределение по статусам обучения</h2>
${tableHtml(
        ["Статус", "Количество"],
        [
          ["В обучении", String(summary.inLearning)],
          ["В плане", String(summary.inPlan)],
          ["Не в плане", String(summary.notInPlan)],
        ],
      )}`;
    default:
      return `<h1>Отчёт</h1>${meta}<p>Неизвестный идентификатор отчёта.</p>`;
  }
}

export function buildHrReportsIndexHtml(rows: HrReportRow[], subtitle: string): string {
  const meta = `<p class="meta">${escapeHtml(subtitle)} · ${escapeHtml(formatRuDateTime())}</p>`;
  const tableRows = rows.map((r) => [r.title, r.category, r.period, r.format, r.updatedAt, r.sizeLabel]);
  return `<h1>Реестр отчётов L&amp;D</h1>${meta}
<h2>Список шаблонов (актуальные даты и периоды)</h2>
${tableHtml(["Отчёт", "Раздел", "Период", "Формат", "Обновлён", "Оценка размера"], tableRows)}
<p class="small">Для таблиц с фактическими данными откройте PDF по строке отчёта.</p>`;
}
