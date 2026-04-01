/** Матрица компетенций компании (демо для HR / L&D) */

export type HrCompetencyCategory = "Технические" | "Soft skills" | "Лидерство" | "Безопасность" | "Data & AI";

export type HrCompetencyTrend = "↑" | "→" | "↓";

export interface HrCompetencyRow {
  id: string;
  name: string;
  category: HrCompetencyCategory;
  coveragePct: number;
  avgLevel: string;
  trend: HrCompetencyTrend;
  priority: "Высокий" | "Средний" | "Низкий";
}

export const hrCompetenciesMatrix: HrCompetencyRow[] = [
  { id: "1", name: "Разработка и сопровождение ПО", category: "Технические", coveragePct: 88, avgLevel: "4.1 / 5", trend: "↑", priority: "Высокий" },
  { id: "2", name: "Архитектура и проектирование систем", category: "Технические", coveragePct: 62, avgLevel: "3.6 / 5", trend: "→", priority: "Высокий" },
  { id: "3", name: "Девопс / CI/CD / облака", category: "Технические", coveragePct: 71, avgLevel: "3.8 / 5", trend: "↑", priority: "Средний" },
  { id: "4", name: "Кибербезопасность и комплаенс", category: "Безопасность", coveragePct: 54, avgLevel: "3.4 / 5", trend: "↑", priority: "Высокий" },
  { id: "5", name: "Работа с данными и аналитика", category: "Data & AI", coveragePct: 49, avgLevel: "3.2 / 5", trend: "↑", priority: "Высокий" },
  { id: "6", name: "ML / ИИ в продуктах", category: "Data & AI", coveragePct: 28, avgLevel: "2.9 / 5", trend: "→", priority: "Средний" },
  { id: "7", name: "Коммуникации и презентации", category: "Soft skills", coveragePct: 76, avgLevel: "3.9 / 5", trend: "→", priority: "Средний" },
  { id: "8", name: "Тайм-менеджмент и фокус", category: "Soft skills", coveragePct: 69, avgLevel: "3.7 / 5", trend: "↓", priority: "Низкий" },
  { id: "9", name: "Управление продуктом и стейкхолдерами", category: "Лидерство", coveragePct: 45, avgLevel: "3.1 / 5", trend: "↑", priority: "Высокий" },
  { id: "10", name: "Менторство и развитие команды", category: "Лидерство", coveragePct: 38, avgLevel: "2.8 / 5", trend: "→", priority: "Средний" },
  { id: "11", name: "UX / исследования и дизайн-системы", category: "Технические", coveragePct: 58, avgLevel: "3.5 / 5", trend: "↑", priority: "Средний" },
  { id: "12", name: "Тестирование и качество", category: "Технические", coveragePct: 64, avgLevel: "3.6 / 5", trend: "→", priority: "Низкий" },
  { id: "13", name: "Финансовая и операционная грамотность ИТ", category: "Soft skills", coveragePct: 41, avgLevel: "2.9 / 5", trend: "→", priority: "Низкий" },
  { id: "14", name: "Защита персональных данных (152-ФЗ)", category: "Безопасность", coveragePct: 82, avgLevel: "4.0 / 5", trend: "↑", priority: "Средний" },
];

export const HR_COMPETENCIES_TOTAL = hrCompetenciesMatrix.length;
