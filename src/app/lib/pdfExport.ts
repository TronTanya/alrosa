/**
 * Экспорт «PDF» через окно печати: в диалоге выбирается «Сохранить как PDF».
 * Без сторонних библиотек, корректная кириллица (UTF-8).
 */

import { getHrDashboardMetrics } from "./hrDashboardMetrics";

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const PRINT_STYLES = `
  @page { margin: 14mm; size: A4; }
  * { box-sizing: border-box; }
  body {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #111;
    font-size: 10.5pt;
    line-height: 1.45;
    margin: 0;
    padding: 0;
  }
  h1 { font-size: 16pt; margin: 0 0 6px; font-weight: 800; }
  h2 { font-size: 11.5pt; margin: 18px 0 8px; font-weight: 700; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
  .meta { color: #555; font-size: 9.5pt; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 9.5pt; }
  th, td { border: 1px solid #ccc; padding: 7px 8px; text-align: left; vertical-align: top; }
  th { background: #f0f0f0; font-weight: 700; }
  tr:nth-child(even) td { background: #fafafa; }
  .hint {
    margin-top: 20px;
    padding: 10px 12px;
    background: #f5f5f5;
    border-radius: 8px;
    font-size: 9pt;
    color: #444;
  }
  ul { margin: 6px 0 0; padding-left: 20px; }
  li { margin: 4px 0; }
  .small { font-size: 9pt; color: #555; }
`;

function buildPrintDocumentHtml(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html><html lang="ru"><head>
<meta charset="UTF-8"/>
<title>${escapeHtml(title)}</title>
<style>${PRINT_STYLES}</style>
</head><body>
${bodyHtml}
<p class="hint">В окне печати выберите принтер <strong>Сохранить как PDF</strong> (или «Microsoft Print to PDF») и нажмите «Сохранить».</p>
<script>
window.addEventListener("load", function () {
  setTimeout(function () { window.focus(); window.print(); }, 120);
});
</script>
</body></html>`;
}

/**
 * Печать / «Сохранить как PDF». Сначала новое окно; если браузер блокирует pop-up — скрытый iframe.
 */
export function openPrintableReport(title: string, bodyHtml: string): void {
  const html = buildPrintDocumentHtml(title, bodyHtml);
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (w) {
    w.document.open();
    w.document.write(html);
    w.document.close();
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-label", `Печать: ${title}`);
  iframe.style.cssText =
    "position:fixed;left:0;top:0;width:0;height:0;opacity:0;pointer-events:none;border:0;";
  document.body.appendChild(iframe);
  const idoc = iframe.contentDocument;
  if (!idoc) {
    document.body.removeChild(iframe);
    window.alert("Не удалось открыть окно печати. Разрешите всплывающие окна или обновите страницу.");
    return;
  }
  idoc.open();
  idoc.write(html);
  idoc.close();
  const cleanup = () => {
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
  };
  iframe.contentWindow?.addEventListener("afterprint", cleanup);
  setTimeout(cleanup, 120_000);
}

export function buildTrainingApplicationsPdfHtml(
  rows: Array<{
    employee: string;
    dept: string;
    course: string;
    type: string;
    status: string;
    deadline: string;
    budget: string;
    roi: string;
  }>,
  filterNote: string,
): string {
  const head = `<h1>Заявки на обучение</h1>
<p class="meta">Дата формирования: ${escapeHtml(new Date().toLocaleString("ru"))}<br/>${escapeHtml(filterNote)}</p>`;
  if (rows.length === 0) {
    return `${head}<p>Нет строк для выгрузки (проверьте фильтр или поиск).</p>`;
  }
  const tableRows = rows
    .map(
      (r) => `<tr>
<td>${escapeHtml(r.employee)}<div class="small">${escapeHtml(r.dept)}</div></td>
<td>${escapeHtml(r.course)}</td>
<td>${escapeHtml(r.type)}</td>
<td>${escapeHtml(r.status)}</td>
<td>${escapeHtml(r.deadline)}</td>
<td>${escapeHtml(r.budget)}</td>
<td>${escapeHtml(r.roi)}</td>
</tr>`,
    )
    .join("");
  return `${head}
<h2>Таблица заявок</h2>
<table>
<thead><tr>
<th>Сотрудник</th><th>Курс / программа</th><th>Тип</th><th>Статус</th><th>Дедлайн</th><th>Бюджет</th><th>Окупаемость</th>
</tr></thead>
<tbody>${tableRows}</tbody>
</table>`;
}

/** Сводка для кнопки PDF в верхней панели HR — цифры из актуального среза справочника и заявок. */
export function buildHrDashboardSummaryPdfHtml(): string {
  const m = getHrDashboardMetrics();
  const date = m.generatedAt;
  const trendBudget = m.budgetRemainPct >= 15 ? `остаток ~${m.budgetRemainPct}%` : "контроль лимита";
  return `<h1>Дашборд HR / L&amp;D — сводный отчёт</h1>
<p class="meta">Сформировано: ${escapeHtml(date)}<br/>
Корпоративный университет · ${m.totalEmployees} сотрудников в справочнике · заявок в очереди: ${m.pendingApplications}.</p>
<h2>Ключевые показатели</h2>
<table>
<thead><tr><th>Показатель</th><th>Значение</th><th>Комментарий</th><th>Примечание</th></tr></thead>
<tbody>
<tr><td>Сотрудников в обучении</td><td>${m.inLearning}</td><td>из ${m.totalEmployees} в штате</td><td>в плане: ${m.inPlan}, не в плане: ${m.notInPlan}</td></tr>
<tr><td>Средний % плана по компании</td><td>${escapeHtml(m.avgPlanPctDisplay)}</td><td>по сотрудникам с заданной метрикой</td><td>агрегат справочника</td></tr>
<tr><td>Бюджет L&amp;D (оценка)</td><td>${escapeHtml(m.budgetSpentLabel)}</td><td>из ${(m.budgetPlanRub / 1_000_000).toFixed(1)} млн ₽ плана</td><td>${escapeHtml(trendBudget)}</td></tr>
<tr><td>Автообработано заявок</td><td>${m.autoProcessPct}%</td><td>модель по загрузке очереди</td><td>заявок: ${m.pendingApplications}</td></tr>
<tr><td>Экономия времени HR</td><td>${m.hrHoursSaved} ч / мес</td><td>оценка по активности</td><td>срез портала</td></tr>
</tbody>
</table>
<h2>Примечания</h2>
<ul>
<li>Детальная разбивка по заявкам — таблица на дашборде и экспорт PDF по заявкам.</li>
<li>Бюджет — расчётная оценка для демо; для боевых цифр подключите финансовый контур.</li>
</ul>`;
}

export type IdpTimelinePdfStep = {
  period: string;
  dates: string;
  title: string;
  description: string;
  statusLabel: string;
  modules: string[];
  hours: number;
};

export function buildIprTimelinePdfHtml(
  employeeName: string,
  steps: IdpTimelinePdfStep[],
  totalHours: number,
  progressLabel: string,
): string {
  const date = new Date().toLocaleString("ru");
  const stepBlocks = steps
    .map(
      (s, i) => `
<h2>Этап ${i + 1}. ${escapeHtml(s.title)}</h2>
<p class="meta"><strong>Период:</strong> ${escapeHtml(s.period)} (${escapeHtml(s.dates)}) · <strong>Статус:</strong> ${escapeHtml(s.statusLabel)} · <strong>Часы:</strong> ${s.hours}</p>
<p>${escapeHtml(s.description)}</p>
<p class="small"><strong>Модули:</strong> ${escapeHtml(s.modules.join(", "))}</p>`,
    )
    .join("");
  return `<h1>Индивидуальный план развития</h1>
<p class="meta">
Сотрудник: <strong>${escapeHtml(employeeName)}</strong><br/>
Период плана: апрель — сентябрь 2026 · Всего часов обучения: <strong>${totalHours}</strong><br/>
Прогресс: ${escapeHtml(progressLabel)}<br/>
Сформировано: ${escapeHtml(date)}
</p>
${stepBlocks}
<p class="small">Документ сформирован в личном кабинете ИИ-Куратора (демо).</p>`;
}
