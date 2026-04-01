import React from "react";
import { ThemeProvider } from "next-themes";
import { RouterProvider } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { LocaleProvider } from "./contexts/LocaleContext";
import { router } from "./routes";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="alrosa-ui-theme">
      <LocaleProvider>
        <RouterProvider router={router} />
        <Toaster />
      </LocaleProvider>
    </ThemeProvider>
  );
}
