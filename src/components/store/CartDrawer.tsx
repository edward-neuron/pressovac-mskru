import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/data/storeData';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
  children?: React.ReactNode;
}

export const CartDrawer = ({ children }: CartDrawerProps) => {
  const { items, updateQuantity, removeItem, totalItems, totalPrice } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Корзина
            {totalItems > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Корзина пуста</h3>
              <p className="text-muted-foreground text-sm">
                Добавьте товары из каталога, чтобы оформить заказ
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-3 p-3 bg-muted/50 rounded-xl"
                  >
                    {/* Image */}
                    <div className="w-16 h-16 rounded-lg bg-background overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                      {item.article && (
                        <span className="text-xs text-muted-foreground">Арт. {item.article}</span>
                      )}
                      <div className="font-semibold text-primary mt-1">
                        {formatPrice(item.price)}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Итого:</span>
              <span className="text-2xl font-bold">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              * Цены ориентировочные. Точную стоимость уточняйте у менеджера.
            </p>
            <Link to="/store/checkout" className="block">
              <Button className="w-full" size="lg">
                Оформить заказ
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
