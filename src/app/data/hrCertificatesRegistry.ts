/** Реестр сертификатов сотрудников (демо для HR / L&D) */

export type HrCertStatus = "Действует" | "Истекает" | "Архив";

export interface HrCertificateRow {
  id: string;
  employeeName: string;
  department: string;
  title: string;
  issuer: string;
  issuedAt: string;
  expiresAt: string;
  credentialId: string;
  status: HrCertStatus;
}

export const hrCertificatesRegistry: HrCertificateRow[] = [
  { id: "1", employeeName: "Елена Волкова", department: "Platform", title: "AWS Solutions Architect Associate", issuer: "Amazon Web Services", issuedAt: "12.11.2025", expiresAt: "12.11.2028", credentialId: "AWS-SAA-99201", status: "Действует" },
  { id: "2", employeeName: "Михаил Петров", department: "Разработка ПО", title: "Kubernetes Administrator (CKA)", issuer: "Linux Foundation", issuedAt: "08.09.2025", expiresAt: "08.09.2028", credentialId: "LF-CKA-44102", status: "Действует" },
  { id: "3", employeeName: "Ольга Сидорова", department: "QA", title: "ISTQB Advanced Level Test Analyst", issuer: "ISTQB", issuedAt: "20.06.2025", expiresAt: "20.06.2028", credentialId: "ISTQB-AT-7712", status: "Истекает" },
  { id: "4", employeeName: "Игорь Никифоров", department: "DevOps / Infra", title: "Terraform Associate", issuer: "HashiCorp", issuedAt: "03.04.2025", expiresAt: "03.04.2027", credentialId: "HCP-TF-22091", status: "Действует" },
  { id: "5", employeeName: "Анна Кузнецова", department: "Продакт", title: "Professional Scrum Product Owner I", issuer: "Scrum.org", issuedAt: "18.02.2025", expiresAt: "—", credentialId: "PSPO-I-88341", status: "Действует" },
  { id: "6", employeeName: "Светлана Морозова", department: "HR & People", title: "Корпоративная ИБ и персональные данные", issuer: "Алроса ИТ · ЕСО", issuedAt: "15.12.2025", expiresAt: "15.12.2028", credentialId: "ALROSA-SEC-2025-88421", status: "Действует" },
  { id: "7", employeeName: "Павел Семёнов", department: "Финансы", title: "Excel Expert (Microsoft 365)", issuer: "Microsoft", issuedAt: "10.08.2024", expiresAt: "10.08.2026", credentialId: "MS-EX-55201", status: "Истекает" },
  { id: "8", employeeName: "Сергей Козлов", department: "Инфобез", title: "CISSP (сертификат)", issuer: "(ISC)²", issuedAt: "22.05.2023", expiresAt: "22.05.2026", credentialId: "ISC2-CISSP-00912", status: "Действует" },
  { id: "9", employeeName: "Наталья Егорова", department: "Аналитика данных", title: "Data Analyst с Python", issuer: "Яндекс Практикум", issuedAt: "14.03.2025", expiresAt: "—", credentialId: "YP-DA-99102", status: "Действует" },
  { id: "10", employeeName: "Артём Васильев", department: "Дизайн & UX", title: "Google UX Design", issuer: "Coursera / Google", issuedAt: "02.01.2024", expiresAt: "—", credentialId: "G-UX-2024-112", status: "Архив" },
  { id: "11", employeeName: "Кристина Лебедева", department: "Юридический", title: "Правовые основы ИБ", issuer: "Алроса ИТ · ЕСО", issuedAt: "01.06.2024", expiresAt: "01.06.2027", credentialId: "ALROSA-LAW-IB-441", status: "Действует" },
  { id: "12", employeeName: "Виктория Степанова", department: "Разработка ПО", title: "Oracle Java SE 17 Developer", issuer: "Oracle", issuedAt: "30.09.2023", expiresAt: "30.09.2026", credentialId: "OCP-JAVA-17-2201", status: "Истекает" },
];

export const HR_CERTIFICATES_TOTAL = hrCertificatesRegistry.length;
