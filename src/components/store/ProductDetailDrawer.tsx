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
    if (minOrderConfig) {
      toast.info(minOrderConfig.message, {
        icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
        duration: 4000
      });
    }

    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setFlyingItem({
        id: `${product.id}-${Date.now()}`,
        image: product.picture || '/placeholder.svg',
        startX: rect.left + rect.width / 2 - 40,
        startY: rect.top + rect.height / 2 - 40,
      });
    }

    const qty = minOrderConfig ? minOrderConfig.minQuantity : 1;
    
    if (cartQty > 0 && minOrderConfig) {
      if (cartQty < minOrderConfig.minQuantity) {
        updateQuantity(product.id, minOrderConfig.minQuantity);
      }
    } else {
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

  // Helper to render a text line, handling **bold** markers
  const renderTextLine = (line: string, index: number, className: string = "") => {
    // Check if line has bold markers
    if (line.startsWith('**') && line.endsWith('**')) {
      const boldText = line.slice(2, -2);
      return (
        <p key={index} className={`text-sm leading-tight text-foreground font-semibold ${className}`}>
          {boldText}
        </p>
      );
    }
    return (
      <p key={index} className={`text-sm leading-tight text-foreground ${className}`}>
        {line}
      </p>
    );
  };

  // Parse description to show as list if it contains multiple lines
  const renderDescription = () => {
    if (!product.description) {
      return <p className="text-muted-foreground">Описание недоступно</p>;
    }

    const cleanText = stripHtmlToText(product.description);

    if (!cleanText) {
      return <p className="text-muted-foreground">Описание недоступно</p>;
    }

    const { introLines, listItems, sections, footnotes, warnings, isKit } = parseDescriptionBlocks(cleanText);

    return (
      <div className="space-y-3">
        {/* Описание - intro paragraphs (no header here since parent already has one) */}
        {introLines.length > 0 && (
          <div className="space-y-0.5">
            {introLines.map((line, index) => {
              const isTitleLine = line.toLowerCase().includes('в комплект поставки входит');
              // Handle bold markers
              if (line.startsWith('**') && line.endsWith('**')) {
                const boldText = line.slice(2, -2);
                return (
                  <p key={index} className="text-sm leading-tight text-foreground font-semibold mt-2">
                    {boldText}
                  </p>
                );
              }
              return (
                <p key={index} className={`text-sm leading-tight text-foreground ${isTitleLine ? 'font-semibold' : ''}`}>
                  {line}
                </p>
              );
            })}
          </div>
        )}

        {/* Named sections (Технические спецификации, Применение, Преимущества) */}
        {sections.map((section, sIndex) => (
          <div key={sIndex} className="space-y-0.5 mt-3">
            <p className="font-semibold text-foreground">{section.title}</p>
            <div className="space-y-0.5">
              {section.items.map((item, iIndex) => {
                // Handle bold markers in section items
                if (item.startsWith('**') && item.endsWith('**')) {
                  const boldText = item.slice(2, -2);
                  return (
                    <p key={iIndex} className="text-sm leading-tight text-foreground font-semibold mt-2">
                      {boldText}
                    </p>
                  );
                }
                
                const cleanItem = item.replace(/^[-–—−]\s*/, '').trim();
                const isListItem = /^[-–—−]/.test(item);
                return isListItem ? (
                  <div key={iIndex} className="flex items-start gap-2 text-sm leading-tight text-foreground">
                    <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                    <span>{cleanItem}</span>
                  </div>
                ) : (
                  <p key={iIndex} className="text-sm leading-tight text-foreground">{item}</p>
                );
              })}
            </div>
          </div>
        ))}

        {/* Kit composition - ONLY for real kits with quantities */}
        {isKit && listItems.length > 0 && (
          <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-2 h-auto text-left hover:bg-primary/5"
              >
                <span className="text-sm font-medium">
                  Состав комплекта ({listItems.length} поз.)
                </span>
                {isDescriptionOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <ul className="space-y-0.5">
                {listItems.map((line, index) => {
                  const cleanLine = line.replace(/^[-–—]\s*/, '').trim();
                  return (
                    <li key={index} className="flex items-start gap-2 text-sm leading-tight text-foreground">
                      <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                      <span>{cleanLine}</span>
                    </li>
                  );
                })}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Footnotes */}
        {footnotes.length > 0 && (
          <div className="pt-2 border-t border-border/50 space-y-0.5">
            {footnotes.map((line, index) => (
              <p key={index} className="text-xs leading-tight text-muted-foreground italic">{line}</p>
            ))}
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mt-3 pt-3 border-t border-amber-500/30 bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 space-y-0.5">
            {warnings.map((line, index) => (
              <p key={index} className="text-xs leading-tight text-amber-700 dark:text-amber-400">{line}</p>
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
          <div className="space-y-2">
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