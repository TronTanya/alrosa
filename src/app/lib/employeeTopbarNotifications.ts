import {
  getEmployeeLastAckAppId,
  loadNotificationReads,
  SITE_NOTIF_READS_EMPLOYEE,
} from "./siteNotificationsStorage";
import { readStoredTrainingApplications } from "./trainingApplicationsStorage";

export type EmployeeNotifIcon = "course" | "idp" | "calendar";

export type EmployeeNotifItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: EmployeeNotifIcon;
};

export const EMPLOYEE_TOPBAR_NOTIFICATION_IDS = ["1", "2", "3"] as const;

const EMPLOYEE_NOTIFICATIONS_SEED: EmployeeNotifItem[] = [
  {
    id: "1",
    title: "Новый модуль в курсе",
    body: "Доступен блок «Kubernetes: продвинутый уровень» — начните с раздела «Практикум».",
    time: "12 мин назад",
    read: true,
    icon: "course",
  },
  {
    id: "2",
    title: "Заявка на обучение",
    body: "«Продвинутый Kubernetes» отправлена на согласование руководителю.",
    time: "1 ч назад",
    read: false,
    icon: "idp",
  },
  {
    id: "3",
    title: "Напоминание",
    body: "Завтра в 10:00 — созвон с ИИ-наставником по траектории развития.",
    time: "3 ч назад",
    read: false,
    icon: "calendar",
  },
];

function formatRuTimeAgo(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const diffMs = Date.now() - d.getTime();
  const m = Math.floor(diffMs / 60000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч назад`;
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

function isEmployeeTrainingUnread(apps: ReturnType<typeof readStoredTrainingApplications>): boolean {
  if (apps.length === 0) return false;
  const ack = getEmployeeLastAckAppId();
  if (ack === null) return true;
  return apps[0].id !== ack;
}

export function buildEmployeeTopbarNotifications(): EmployeeNotifItem[] {
  const reads = loadNotificationReads(SITE_NOTIF_READS_EMPLOYEE);
  const apps = readStoredTrainingApplications();

  return EMPLOYEE_NOTIFICATIONS_SEED.map((item) => {
    if (item.id === "2") {
      const latest = apps[0];
      const read =
        apps.length === 0
          ? reads["2"] !== undefined
            ? reads["2"]
            : item.read
          : !isEmployeeTrainingUnread(apps);
      return {
        ...item,
        body: latest
          ? `«${latest.listTitle ?? latest.title}» отправлена на согласование руководителю.`
          : item.body,
        time: latest ? formatRuTimeAgo(latest.submittedAt) : item.time,
        read,
      };
    }
    return {
      ...item,
      read: reads[item.id] !== undefined ? reads[item.id] : item.read,
    };
  });
}
