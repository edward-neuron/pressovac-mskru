import { memo, useState } from 'react';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export const PriceIncreaseBanner = memo(() => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="container-custom py-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full group">
            <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-display font-bold text-white text-lg">
                      Важная информация о ценах
                    </h3>
                    <p className="text-white/80 text-sm">
                      Нажмите, чтобы узнать подробности
                    </p>
                  </div>
                </div>
                <ChevronDown 
                  className={`w-6 h-6 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
              </div>
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="bg-card border border-border rounded-b-xl -mt-2 pt-6 pb-4 px-4 shadow-md">
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                Дорогие клиенты! Производитель оборудования уведомил нас о повышении цен. 
                Начиная с <span className="font-semibold text-foreground">2 февраля 2026 года</span> новые расценки будут действовать и в нашем магазине.
              </p>
              <p className="text-foreground font-medium bg-primary/10 rounded-lg p-3 border border-primary/20">
                ✨ Хорошая новость: если вы успеете оформить и оплатить заказ до конца дня{' '}
                <span className="text-primary font-semibold">1 февраля</span>, вы получите его по текущей цене.
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
});

PriceIncreaseBanner.displayName = 'PriceIncreaseBanner';
