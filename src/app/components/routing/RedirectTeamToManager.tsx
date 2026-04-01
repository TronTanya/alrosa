import { Navigate } from "react-router";
import { ROUTE_PATHS } from "../../routePaths";

/** Старый URL /team → канонический дашборд руководителя /manager */
export function RedirectTeamToManager() {
  return <Navigate to={ROUTE_PATHS.manager} replace />;
}
