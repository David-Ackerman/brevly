import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./pages/app.tsx";
import { NotFound } from "./pages/not-found.tsx";
import { Redirect } from "./pages/redirect.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query.ts";
import { Toaster } from "@/components/ui/sonner";

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
    path: "/:shortenedUrl",
    Component: Redirect,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="w-full h-[100dvh] flex items-center px-3">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </main>
    <Toaster />
  </StrictMode>
);
