import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Mail, X, Copy, Check } from 'lucide-react';

// Глобальный триггер: импортируйте showTechWorksAlert() и вызывайте
// вместо toast.error при сбое отправки любой формы / заказа.
const EVENT_NAME = 'tech-works-alert:show';

export const showTechWorksAlert = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
};

const SUPPORT_EMAIL = 'sales@pressovac-moscow.ru';

export const TechWorksAlert = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = () => {
      setCopied(false);
      setOpen(true);
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  // Закрытие по Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard недоступен */
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Затемнение + блюр */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Синяя плашка */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            role="alertdialog"
            aria-live="assertive"
            className="relative w-full max-w-[480px] mx-auto"
          >
            <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-2xl">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
                className="absolute right-3 top-3 rounded-full p-1.5 text-primary-foreground/80 transition hover:bg-white/10 hover:text-primary-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-5 pr-10 sm:p-7">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div className="pt-1 min-w-0 flex-1">
                    <h3 className="font-display text-lg font-bold sm:text-xl">
                      Идут временные технические работы
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-primary-foreground/90">
                      Отправка формы временно недоступна. Пожалуйста, направьте
                      ваш запрос на нашу почту — мы ответим в ближайшее время.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="inline-flex flex-1 min-w-0 items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-sm font-semibold text-primary transition hover:bg-white/90"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{SUPPORT_EMAIL}</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 py-3 text-sm font-medium text-primary-foreground transition hover:bg-white/10"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" /> Скопировано
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Копировать
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TechWorksAlert;