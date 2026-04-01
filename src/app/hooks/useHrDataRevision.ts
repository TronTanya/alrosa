import { useEffect, useState } from "react";
import { TRAINING_APPLICATIONS_UPDATED } from "../lib/trainingApplicationsStorage";

/** Увеличивается при изменении заявок в localStorage — пересчёт метрик дашборда. */
export function useHrDataRevision(): number {
  const [n, setN] = useState(0);
  useEffect(() => {
    const h = () => setN((x) => x + 1);
    window.addEventListener(TRAINING_APPLICATIONS_UPDATED, h);
    return () => window.removeEventListener(TRAINING_APPLICATIONS_UPDATED, h);
  }, []);
  return n;
}
