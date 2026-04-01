export type AdminAiModuleStatus = "active" | "limited" | "disabled";

export type AdminAiModuleCategory = "chat" | "embeddings" | "rag" | "recommend" | "moderation" | "other";

export interface AdminAiModuleRow {
  id: string;
  name: string;
  category: AdminAiModuleCategory;
  purpose: string;
  modelLabel: string;
  latencyMs: number;
  requestsToday: number;
  quotaPct: number;
  status: AdminAiModuleStatus;
  note: string;
}

export const adminAiModulesSeed: AdminAiModuleRow[] = [
  {
    id: "ai-curator",
    name: "ИИ-Куратор (чат сотрудника)",
    category: "chat",
    purpose: "Ответы по траектории, курсам, политикам ЕСО",
    modelLabel: "Яндекс Алиса Pro · enterprise",
    latencyMs: 780,
    requestsToday: 1840,
    quotaPct: 42,
    status: "active",
    note: "Основной сценарий ЛК; лимит токенов по политике ИБ.",
  },
  {
    id: "ai-hr-mentor",
    name: "ИИ-Наставник HR (кадры)",
    category: "chat",
    purpose: "Чат куратора L&D (обучение и развитие), подсказки по заявкам",
    modelLabel: "Яндекс Алиса Pro · enterprise",
    latencyMs: 920,
    requestsToday: 612,
    quotaPct: 38,
    status: "active",
    note: "Общий пул токенов с ИИ-Куратором.",
  },
  {
    id: "ai-embed-catalog",
    name: "Векторный индекс каталога",
    category: "embeddings",
    purpose: "Поиск и подбор курсов по смыслу запроса",
    modelLabel: "Embeddings v2 · on-prem",
    latencyMs: 45,
    requestsToday: 12400,
    quotaPct: 71,
    status: "limited",
    note: "При 85% включается очередь и деградация качества.",
  },
  {
    id: "ai-rag-idp",
    name: "RAG по заявкам и ИДП",
    category: "rag",
    purpose: "Контекст из заявок, согласований, регламентов",
    modelLabel: "Яндекс Алиса + pgvector",
    latencyMs: 1100,
    requestsToday: 890,
    quotaPct: 55,
    status: "active",
    note: "Индекс обновляется ночью; дневной дельта-индекс каждые 2 ч.",
  },
  {
    id: "ai-reco",
    name: "Рекомендации траектории",
    category: "recommend",
    purpose: "Персональные подборки модулей и навыков",
    modelLabel: "Коллаборативная модель + Яндекс Алиса",
    latencyMs: 210,
    requestsToday: 3400,
    quotaPct: 33,
    status: "active",
    note: "A/B с правилом «топ-3 из каталога».",
  },
  {
    id: "ai-mod",
    name: "Модерация пользовательских промптов",
    category: "moderation",
    purpose: "Фильтр ПДн и запрещённых тем перед LLM",
    modelLabel: "Лёгкая классификация · CPU",
    latencyMs: 18,
    requestsToday: 28000,
    quotaPct: 12,
    status: "disabled",
    note: "Выключено в песочнице; в prod — обязательный префильтр.",
  },
  {
    id: "ai-sum",
    name: "Суммаризация отчётов",
    category: "other",
    purpose: "Краткие выжимки для руководителей и ИБ",
    modelLabel: "Яндекс Алиса Lite",
    latencyMs: 1500,
    requestsToday: 96,
    quotaPct: 8,
    status: "active",
    note: "Доступ только ролям с отчётами.",
  },
];

export const ADMIN_AI_MODULES_TOTAL = adminAiModulesSeed.length;
