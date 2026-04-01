/** Демо-реестр пользователей ЕСО для админ-панели */

export type AdminUserStatus = "Активен" | "Заблокирован" | "Приглашён";

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: AdminUserStatus;
  lastLogin: string;
}

export const ADMIN_USERS_TOTAL = 312;

export const adminUsersCatalog: AdminUserRow[] = [
  { id: "1", name: "Соколов Дмитрий Андреевич", email: "d.sokolov@company.ru", role: "Администратор", department: "ИТ-инфраструктура", status: "Активен", lastLogin: "30.03.2026 10:42" },
  { id: "2", name: "Смирнова Анна Павловна", email: "a.smirnova@company.ru", role: "Директор по обучению и развитию (L&D)", department: "Обучение", status: "Активен", lastLogin: "30.03.2026 09:18" },
  { id: "3", name: "Петров Иван Сергеевич", email: "i.petrov@company.ru", role: "Руководитель", department: "Разработка", status: "Активен", lastLogin: "29.03.2026 17:55" },
  { id: "4", name: "Волкова Елена Викторовна", email: "e.volkova@company.ru", role: "Руководитель", department: "Платформа", status: "Активен", lastLogin: "30.03.2026 08:02" },
  { id: "5", name: "Кузнецова Анна Дмитриевна", email: "a.kuznetsova@company.ru", role: "Сотрудник", department: "Продакт", status: "Активен", lastLogin: "28.03.2026 14:30" },
  { id: "6", name: "Никифоров Игорь Олегович", email: "i.nikiforov@company.ru", role: "Сотрудник", department: "Девопс", status: "Активен", lastLogin: "30.03.2026 07:15" },
  { id: "7", name: "Сидорова Ольга Николаевна", email: "o.sidorova@company.ru", role: "Сотрудник", department: "QA", status: "Приглашён", lastLogin: "—" },
  { id: "8", name: "Козлов Денис Алексеевич", email: "d.kozlov@company.ru", role: "Сотрудник", department: "Аналитика", status: "Активен", lastLogin: "27.03.2026 11:40" },
  { id: "9", name: "Морозова Мария Игоревна", email: "m.morozova@company.ru", role: "HR-менеджер", department: "Кадры", status: "Активен", lastLogin: "30.03.2026 10:05" },
  { id: "10", name: "Лебедев Артём Павлович", email: "a.lebedev@company.ru", role: "Куратор курса", department: "Обучение", status: "Заблокирован", lastLogin: "15.03.2026 09:00" },
  { id: "11", name: "Фёдорова Екатерина Семёновна", email: "e.fedorova@company.ru", role: "Аналитик", department: "BI", status: "Активен", lastLogin: "29.03.2026 16:22" },
  { id: "12", name: "Громов Павел Викторович", email: "p.gromov@company.ru", role: "Сотрудник", department: "Безопасность", status: "Активен", lastLogin: "30.03.2026 06:50" },
];
