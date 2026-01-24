import { memo } from 'react';
import { AlertTriangle } from 'lucide-react';

export const PriceIncreaseBanner = memo(() => {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
      <div className="container-custom py-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-display font-bold text-lg">
              Важная информация о ценах
            </h3>
            <p className="text-white/95 text-sm leading-relaxed">
              Дорогие клиенты! Производитель оборудования уведомил нас о повышении цен. 
              Начиная с <strong>2 февраля 2026 года</strong> новые расценки будут действовать и в нашем магазине.
            </p>
            <p className="text-white font-medium text-sm">
              ✨ Хорошая новость: если вы успеете оформить и оплатить заказ до конца дня <strong>1 февраля</strong>, 
              вы получите его по текущей, старой цене.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

PriceIncreaseBanner.displayName = 'PriceIncreaseBanner';
