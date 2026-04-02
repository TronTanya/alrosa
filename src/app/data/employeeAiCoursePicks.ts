/**
 * Каталог курсов для страницы «Мои курсы» и ИИ-подбора.
 * Ссылки проверены вручную; модель выбирает только id — URL всегда из этого списка.
 */
export type EmployeeAiCoursePickRow = {
  id: string;
  title: string;
  provider: string;
  url: string;
  rating: number;
  reviews: string;
  match: number;
  duration: string;
  tags: string[];
  reason: string;
};

export const employeeAiCoursePicks: EmployeeAiCoursePickRow[] = [
  {
    id: "1",
    title: "Проектирование высоконагруженных систем",
    provider: "OTUS",
    url: "https://otus.ru/lessons/razrabotka-vysokonagruzhennyh-sistem/",
    rating: 4.8,
    reviews: "2.1k",
    match: 96,
    duration: "8 недель",
    tags: ["архитектура", "бэкенд"],
    reason:
      "Программа OTUS по архитектуре распределённых систем на русском — совпадает с целью по проектированию нагрузки.",
  },
  {
    id: "2",
    title: "Продвинутый TypeScript и типобезопасность",
    provider: "Stepik",
    url: "https://stepik.org/course/235437/promo",
    rating: 4.9,
    reviews: "3.4k",
    match: 93,
    duration: "6 недель",
    tags: ["фронтенд", "TypeScript"],
    reason:
      "Полный курс JS/TS на Stepik: теория, практика и типизация — близко к вашему стеку и отзывам сообщества.",
  },
  {
    id: "3",
    title: "Машинное обучение для инженеров",
    provider: "Яндекс Практикум",
    url: "https://practicum.yandex.ru/data-scientist/",
    rating: 4.7,
    reviews: "5k",
    match: 88,
    duration: "12 недель",
    tags: ["ML", "Python"],
    reason:
      "Трек по анализу данных и ML на русском: практика на реальных кейсах, удобно для инженеров из РФ.",
  },
  {
    id: "4",
    title: "DevOps и контейнеризация",
    provider: "Нетология",
    url: "https://netology.ru/programs/devops",
    rating: 4.6,
    reviews: "1.8k",
    match: 91,
    duration: "4 недели",
    tags: ["девопс", "SRE"],
    reason:
      "Курс Нетологии по CI/CD и инфраструктуре на русском — близко к задачам SRE и корпоративным стандартам.",
  },
  {
    id: "5",
    title: "Git и командная разработка",
    provider: "Stepik · SF Education",
    url: "https://stepik.org/course/3145/promo",
    rating: 4.9,
    reviews: "15k",
    match: 90,
    duration: "3 недели",
    tags: ["Git", "командная разработка"],
    reason: "Фундамент для middle: ветвление, merge, практики code review в распределённых командах.",
  },
  {
    id: "6",
    title: "Python для автоматизации и скриптов",
    provider: "Stepik",
    url: "https://stepik.org/course/512/promo",
    rating: 4.8,
    reviews: "28k",
    match: 87,
    duration: "5 недель",
    tags: ["Python", "автоматизация"],
    reason: "Базовый и прикладной Python на русском — усиливает инженерный профиль и скрипты вокруг сервисов.",
  },
];

export const employeeAiCoursePicksById: Map<string, EmployeeAiCoursePickRow> = new Map(
  employeeAiCoursePicks.map((c) => [c.id, c]),
);
