import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import {
  isOutlookMsalConfigured,
  OUTLOOK_MSAL_AUTO_REDIRECT_LOCK_KEY,
  outlookMsalInitialize,
} from "./app/lib/outlookMsal";
import "./styles/index.css";

async function bootstrap() {
  if (isOutlookMsalConfigured()) {
    try {
      const app = await outlookMsalInitialize();
      const result = await app.handleRedirectPromise();
      if (result?.account) {
        app.setActiveAccount(result.account);
      }
    } catch {
      /* MSAL: игнорируем сбой обработки redirect при холодном старте */
    }
  }

  try {
    sessionStorage.removeItem(OUTLOOK_MSAL_AUTO_REDIRECT_LOCK_KEY);
  } catch {
    /* ignore */
  }

  createRoot(document.getElementById("root")!).render(<App />);
}

void bootstrap();
