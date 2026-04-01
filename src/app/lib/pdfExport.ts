/**
 * Экспорт «PDF» через окно печати: в диалоге выбирается «Сохранить как PDF».
 * Без сторонних библиотек, корректная кириллица (UTF-8).
 */

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

export function openPrintableReport(title: string, bodyHtml: string): void {
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) {
    window.alert("Разрешите всплывающие окна для этого сайта, чтобы сформировать PDF.");
    return;
  }
  w.document.open();
  w.document.write(`<!DOCTYPE html><html lang="ru"><head>
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
</body></html>`);
  w.document.close();
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
<th>Сотрудник</th><th>Курс / программа</th><th>Тип</th><th>Статус</th><th>Дедлайн</th><th>Бюджет</th><th>ROI</th>
</tr></thead>
<tbody>${tableRows}</tbody>
</table>`;
}

/** Сводка для кнопки PDF в верхней панели HR (цифры совпадают с демо KPI). */
export function buildHrDashboardSummaryPdfHtml(): string {
  const date = new Date().toLocaleString("ru");
  return `<h1>Дашборд HR / L&amp;D — сводный отчёт</h1>
<p class="meta">Дата: ${escapeHtml(date)}<br/>
Корпоративный университет · 312 сотрудников · демонстрационные показатели портала ИИ-Куратор.</p>
<h2>Ключевые показатели</h2>
<table>
<thead><tr><th>Показатель</th><th>Значение</th><th>Комментарий</th><th>Динамика</th></tr></thead>
<tbody>
<tr><td>Сотрудников в обучении</td><td>248</td><td>из 312 активных</td><td>↑ +18 за неделю</td></tr>
<tr><td>Общий % завершения курсов</td><td>92%</td><td>курсов выполнено</td><td>↑ +3% к прошлому кварталу</td></tr>
<tr><td>Бюджет обучения</td><td>4,8 млн ₽</td><td>из 6 млн ₽ плана</td><td>→ 20% остаток</td></tr>
<tr><td>Автообработано заявок</td><td>87%</td><td>без участия HR</td><td>↑ +12% vs ручной процесс</td></tr>
<tr><td>Экономия времени HR</td><td>124 ч / мес</td><td>≈ 15,5 рабочих дней</td><td>↑ рост автоматизации</td></tr>
</tbody>
</table>
<h2>Примечания</h2>
<ul>
<li>Детальная разбивка по заявкам — в разделе «Все заявки на обучение» на дашборде (кнопка PDF в таблице).</li>
<li>Отчёт носит демонстрационный характер.</li>
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
