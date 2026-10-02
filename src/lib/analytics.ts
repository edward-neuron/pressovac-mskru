/**
 * src/lib/analytics.ts
 * ------------------------------------------------------------------
 * Единый слой аналитики: Яндекс.Метрика (202504) + Google Analytics 4 (G-CG5P07BWFX).
 *
 * Все события идут через track() / hit() / trackPurchase(), чтобы не разбрасывать
 * вызовы window.ym(...) и window.gtag(...) по компонентам. Меняем поведение
 * аналитики в одном месте.
 *
 * ВАЖНО (Метрика): reachGoal('<id>') должен совпадать с ID цели,
 * созданной в кабинете Метрики (регистр и латиница/кириллица важны).
 *
 * ВАЖНО (GA4): page_view на смену SPA-роута GA4 отправляет сам через
 * Enhanced Measurement (теги «Просмотры страниц»). Здесь его дублировать
 * не нужно — иначе будут двойные просмотры.
 */

export const YM_ID = 202504;
export const GA_ID = "G-CG5P07BWFX";

type Params = Record<string, unknown>;

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Хит при смене SPA-роута — только для Метрики (GA4 ловит сам). */
export function hit(path: string, title?: string) {
  if (typeof window === "undefined") return;
  window.ym?.(YM_ID, "hit", path, title ? { title, referer: document.referrer } : undefined);
}

/** Событие-цель: уходит И в Метрику (reachGoal), И в GA4 (event) одним вызовом. */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.ym?.(YM_ID, "reachGoal", event, params);
  window.gtag?.("event", event, params);
}

/** Товар в GA4-формате (для add_to_cart / view_item / purchase). */
export interface GAItem {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
  item_category?: string;
}

/** Главная конверсия — заказ. Метрика: цель order_complete. GA4: purchase. */
export function trackPurchase(
  orderId: string,
  value: number,
  items: GAItem[],
  currency = "RUB"
) {
  if (typeof window === "undefined") return;
  window.ym?.(YM_ID, "reachGoal", "order_complete", { order_price: value, currency });
  window.gtag?.("event", "purchase", {
    transaction_id: orderId,
    value,
    currency,
    items,
  });
}

/* ------------------------------------------------------------------
 * Готовые хелперы под конкретные места магазина.
 * ------------------------------------------------------------------ */

/** Открытие карточки товара. */
export const onProductView = (item: GAItem) =>
  track("view_item", { ...item, currency: "RUB" });

/** «В корзину». */
export const onAddToCart = (item: GAItem, value: number, currency = "RUB") =>
  track("add_to_cart", { ...item, value, currency });

/** Начало оформления (если понадобится отдельная точка). */
export const onBeginCheckout = (value: number, items: GAItem[], currency = "RUB") =>
  track("begin_checkout", { value, currency, items });

/** Заявки — РАЗНЫЕ цели, чтобы в отчётах не сливались в кучу. */
export const onLeadInquiry = () => track("lead_inquiry");
export const onLeadContact = () => track("lead_contact");
export const onLeadCallback = () => track("lead_callback");

/** Микроконверсии. */
export const onPhoneClick = () => track("phone_click");
export const onMessengerClick = (kind = "whatsapp") => track("messenger_click", { kind });
