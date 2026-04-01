import React from "react";
import { RouterProvider } from "react-router";
import { LocaleProvider } from "./contexts/LocaleContext";
import { router } from "./routes";

export default function App() {
  return (
    <LocaleProvider>
      <RouterProvider router={router} />
    </LocaleProvider>
  );
}
