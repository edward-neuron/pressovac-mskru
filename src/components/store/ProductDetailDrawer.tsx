import { useState, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, ExternalLink, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { YmlProduct } from '@/hooks/useYmlStore';
import { useCart } from '@/contexts/CartContext';
import { parseDescriptionBlocks, stripHtmlToText } from '@/lib/descriptionFormatting';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FlyingCartAnimation } from './FlyingCartAnimation';
import { getFullImageUrl } from '@/lib/imageOptimization';
import { getMinOrderConfig } from '@/data/minOrderConfig';
import { toast } from 'sonner';

interface ProductDetailDrawerProps {
  product: YmlProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductDetailDrawer = ({ product, open, onOpenChange }: ProductDetailDrawerProps) => {
  const { addItem, items, openCart, updateQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [flyingItem, setFlyingItem] = useState<{
    id: string;
    image: string;
    startX: number;
    startY: number;
  } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  if (!product) return null;

  const cartItem = items.find(item => item.id === product.id);
  const cartQty = cartItem?.quantity || 0;
  
  // Проверка минимального заказа
  const minOrderConfig = getMinOrderConfig(product.name, product.vendorCode);

  const handleAddToCart = () => {
    // Проверка минимального заказа - показываем предупреждение
    if (minOrderConfig) {
      toast.info(minOrderConfig.message, {
        icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
        duration: 4000
      });
    }

    // Запуск анимации
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setFlyingItem({
        id: `${product.id}-${Date.now()}`,
        image: product.picture || '/placeholder.svg',
        startX: rect.left + rect.width / 2 - 40,
        startY: rect.top + rect.height / 2 - 40,
      });
    }

    // Если есть минимальный заказ, добавляем сразу минимальное количество
    const qty = minOrderConfig ? minOrderConfig.minQuantity : 1;
    
    if (cartQty > 0 && minOrderConfig) {
      // Если уже в корзине и есть минимум, устанавливаем минимум если меньше
      if (cartQty < minOrderConfig.minQuantity) {
        updateQuantity(product.id, minOrderConfig.minQuantity);
      }
    } else {
      // Добавляем с нужным количеством
      for (let i = 0; i < qty; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.priceNum,
          image: product.picture || '/placeholder.svg',
          article: product.vendorCode
        });
      }
    }
    
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleButtonClick = () => {
    if (cartQty > 0 && !justAdded) {
      onOpenChange(false);
      openCart();
    } else {
      handleAddToCart();
    }
  };


  // Parse description to show as list if it contains multiple lines
  const renderDescription = () => {
    if (!product.description) {
      return <p className="text-muted-foreground">Описание недоступно</p>;
    }

    // Clean + normalize supplier HTML into readable text
    const cleanText = stripHtmlToText(product.description);

    if (!cleanText) {
      return <p className="text-muted-foreground">Описание недоступно</p>;
    }

    // Split into blocks (intro, list, footnotes, warnings)
    const { introLines, listItems, footnotes, warnings } = parseDescriptionBlocks(cleanText);

    // Check if this is a kit (has list items)
    const isKit = listItems.length > 0;
    const itemCount = listItems.length;

    if (isKit) {
      return (
        <div className="space-y-4">
          {/* Intro paragraphs always visible */}
          {introLines.length > 0 && (
            <div className="space-y-2">
              {introLines.map((line, index) => {
                const isTitleLine = line.toLowerCase().includes('в комплект поставки входит');
                return (
                  <p key={index} className={`text-sm text-foreground ${isTitleLine ? 'font-semibold' : ''}`}>
                    {line}
                  </p>
                );
              })}
            </div>
          )}

          {/* Collapsible list items */}
          <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-2 h-auto text-left hover:bg-primary/5"
              >
                <span className="text-sm font-medium">
                  Состав комплекта ({itemCount} поз.)
                </span>
                {isDescriptionOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <ul className="space-y-1.5">
                {listItems.map((line, index) => {
                  const cleanLine = line.replace(/^[-–—]\s*/, '').trim();
                  return (
                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                      <span>{cleanLine}</span>
                    </li>
                  );
                })}
              </ul>

              {/* Footnotes */}
              {footnotes.length > 0 && (
                <div className="pt-2 mt-2 border-t border-border/50 space-y-1">
                  {footnotes.map((line, index) => (
                    <p key={index} className="text-xs text-muted-foreground italic">{line}</p>
                  ))}
                </div>
              )}

              {/* Warnings */}
              {warnings.length > 0 && (
                <div className="mt-4 pt-3 border-t border-amber-500/30 bg-amber-500/5 rounded-lg p-3 space-y-1">
                  {warnings.map((line, index) => (
                    <p key={index} className="text-xs text-amber-700 dark:text-amber-400">{line}</p>
                  ))}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    }

    // Non-kit products: show everything as before
    return (
      <div className="space-y-4">
        {/* Intro paragraphs */}
        {introLines.length > 0 && (
          <div className="space-y-2">
            {introLines.map((line, index) => (
              <p key={index} className="text-sm text-foreground">{line}</p>
            ))}
          </div>
        )}

        {/* List items (if any) */}
        {listItems.length > 0 && (
          <ul className="space-y-1.5">
            {listItems.map((line, index) => {
              const cleanLine = line.replace(/^[-–—]\s*/, '').trim();
              return (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                  <span>{cleanLine}</span>
                </li>
              );
            })}
          </ul>
        )}

        {/* Footnotes */}
        {footnotes.length > 0 && (
          <div className="pt-2 border-t border-border/50 space-y-1">
            {footnotes.map((line, index) => (
              <p key={index} className="text-xs text-muted-foreground italic">{line}</p>
            ))}
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mt-4 pt-3 border-t border-amber-500/30 bg-amber-500/5 rounded-lg p-3 space-y-1">
            {warnings.map((line, index) => (
              <p key={index} className="text-xs text-amber-700 dark:text-amber-400">{line}</p>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-left pr-8">{product.name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Product Image */}
          <div className="aspect-square bg-white rounded-lg overflow-hidden border border-border/50">
            {product.picture ? (
              <img
                ref={imageRef}
                src={getFullImageUrl(product.picture)}
                alt={product.name}
                className="w-full h-full object-contain p-4"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <ShoppingCart className="w-16 h-16 opacity-20" />
              </div>
            )}
          </div>

          {/* Flying Animation */}
          <FlyingCartAnimation 
            item={flyingItem} 
            onComplete={() => setFlyingItem(null)} 
          />

          {/* Price & Article */}
          <div className="space-y-2">
            <div className="text-2xl font-bold text-primary">{product.price}</div>
            {product.vendorCode && (
              <p className="text-sm text-muted-foreground">Артикул: {product.vendorCode}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Описание</h3>
            <div className="bg-muted/30 rounded-lg p-4">
              {renderDescription()}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-border">
            <Button
              onClick={handleButtonClick}
              size="lg"
              className={`w-full transition-all duration-300 ${
                justAdded
                  ? 'bg-green-600 hover:bg-green-600'
                  : cartQty > 0
                    ? 'bg-green-600 hover:bg-green-700'
                    : ''
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Добавлено!
                </>
              ) : cartQty > 0 ? (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  В корзине ({cartQty})
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Добавить в корзину
                </>
              )}
            </Button>

            {product.url && (
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                asChild
              >
                <a href={product.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Подробнее на сайте
                </a>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
