import { memo } from 'react';
import { AlertTriangle } from 'lucide-react';

export const PriceIncreaseBanner = memo(() => {
  return (
    <div className="bg-primary/5 border-b border-primary/20">
      <div className="container-custom py-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="font-display font-semibold text-lg text-foreground">
              Важная информация о ценах
            </h3>
            <div className="space-y-2 text-muted-foreground leading-relaxed">
              <p>
                Дорогие клиенты! Производитель оборудования уведомил нас о повышении цен. 
                Начиная с <span className="font-semibold text-foreground">2 февраля 2026 года</span> новые расценки будут действовать и в нашем магазине.
              </p>
              <p className="text-foreground font-medium">
                Хорошая новость: если вы успеете оформить и оплатить заказ до конца дня{' '}
                <span className="text-primary font-semibold">1 февраля</span>, вы получите его по текущей цене.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PriceIncreaseBanner.displayName = 'PriceIncreaseBanner';
