/**
 * Отечественные площадки для подбора курсов: .ru / известные РФ-сервисы.
 * Зарубежные MOOC и глобальные облака отсекаются.
 */
const FOREIGN_HOST_SUFFIXES = [
  "coursera.org",
  "edx.org",
  "udemy.com",
  "udacity.com",
  "pluralsight.com",
  "khanacademy.org",
  "skillshare.com",
  "linkedin.com",
  "aws.amazon.com",
  "cloud.google.com",
  "learn.microsoft.com",
  "ibm.com",
  "oracle.com",
];

const DOMESTIC_HOSTS = [
  "stepik.org",
  "hexlet.io",
  "practicum.yandex.ru",
  "academy.yandex.ru",
  "skillbox.ru",
  "netology.ru",
  "geekbrains.ru",
  "openedu.ru",
  "otus.ru",
  "purpleschool.ru",
  "slurm.io",
  "constructor.tinkoff.ru",
  "education.yandex.ru",
];

export function isDomesticCourseUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    for (const s of FOREIGN_HOST_SUFFIXES) {
      if (host === s || host.endsWith("." + s)) return false;
    }
    if (host.endsWith(".ru") || host.endsWith(".рф") || host.endsWith(".su")) return true;
    return DOMESTIC_HOSTS.some((d) => host === d || host.endsWith("." + d));
  } catch {
    return false;
  }
}
