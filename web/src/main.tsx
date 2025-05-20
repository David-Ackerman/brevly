import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./pages/App.tsx";
import { NotFound } from "./pages/NotFound.tsx";
import { Redirect } from "./pages/Redirect.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/not-found",
    Component: NotFound,
  },
  {
    path: "/:shortenedLink",
    Component: Redirect,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="w-full h-[100dvh] flex items-center px-3">
      <RouterProvider router={router} />
    </main>
  </StrictMode>
);
