/**
 * src/components/AnalyticsRouteTracker.tsx
 * ------------------------------------------------------------------
 * Отправляет «hit» в Яндекс.Метрику при каждом переходе внутри SPA.
 * Без этого Метрика видит в основном входы, а не переходы между страницами.
 *
 * GA4 здесь НЕ трогаем: Enhanced Measurement сам шлёт page_view на смену
 * SPA-роута (History API). Если продублировать — будут двойные просмотры.
 *
 * Подключение: положить рядом со <ScrollToTop /> в src/App.tsx (внутри BrowserRouter).
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { hit } from "@/lib/analytics";

export const AnalyticsRouteTracker = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    hit(pathname + search, document.title);
  }, [pathname, search]);

  return null;
};
