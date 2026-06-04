import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
// Self-hosted fonts (Russia blocks fonts.googleapis.com / fonts.gstatic.com on some ISPs)
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "./index.css";

// Build marker: force production rebuild to pick up VITE_SUPABASE_URL=api.pressovac-msk.ru (2026-06-04)

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
