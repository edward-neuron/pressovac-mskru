import { useEffect, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Download, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { YmlProduct } from '@/hooks/useYmlStore';
import {
  I40_GALLERY,
  R40_GALLERY,
  R40_KEY_FEATURES,
  R40_PRODUCT_DESCRIPTION,
} from '@/data/r40ProductFamily';

interface R40ProductDrawerProps {
  product: YmlProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatRubles = (price: number) =>
  `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(price)} ₽`;

const ProductGallery = ({ images, title }: { images: readonly string[]; title: string }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => setActiveIndex(0), [images]);

  if (images.length === 0) {
    return <div className="aspect-square rounded-xl border bg-slate-200" aria-label="Изображение пока не добавлено" />;
  }

  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + images.length) % images.length);
  };

  return (
    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3">
      {images.length > 1 && (
        <div className="flex max-h-[25rem] flex-col gap-2 overflow-y-auto pr-1">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`Фото ${index + 1} товара ${title}`}
              aria-pressed={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              className={`aspect-square w-14 shrink-0 overflow-hidden rounded-md border-2 bg-white transition-colors ${
                activeIndex === index ? 'border-sky-500' : 'border-border hover:border-sky-300'
              }`}
            >
              <img src={image} alt="" className="h-full w-full object-contain p-1" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <div className={`relative aspect-square min-w-0 overflow-hidden rounded-xl border border-border/60 bg-white ${images.length === 1 ? 'col-span-2' : ''}`}>
        <img src={images[activeIndex]} alt={title} className="h-full w-full object-contain p-3" />
        {images.length > 1 && (
          <>
            <Button type="button" variant="outline" size="icon" aria-label="Предыдущее фото" onClick={() => move(-1)} className="absolute left-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white/90">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button type="button" variant="outline" size="icon" aria-label="Следующее фото" onClick={() => move(1)} className="absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white/90">
              <ChevronRight className="h-5 w-5" />
            </Button>
            <span className="absolute bottom-2 right-2 rounded-full bg-background/90 px-2 py-1 text-xs text-muted-foreground">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export const R40ProductFamilyDrawer = ({ product, open, onOpenChange }: R40ProductDrawerProps) => {
  const { addItem, items, openCart } = useCart();
  const cartQuantity = items.find((item) => item.id === product.id)?.quantity ?? 0;
  const isR40 = product.id === 'r40-brushing-robot';
  const isI40 = product.id === 'i40-inspection-robot';
  const images = isR40 ? R40_GALLERY : isI40 ? I40_GALLERY : product.picture ? [product.picture] : [];

  const handlePurchase = () => {
    if (cartQuantity > 0) {
      openCart();
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.priceNum,
      image: product.picture,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="pr-8 text-left">{product.name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pb-6">
          <ProductGallery images={images} title={product.name} />

          <div className="space-y-3">
            {product.priceNum !== null && <div className="text-2xl font-bold text-primary">{formatRubles(product.priceNum)}</div>}
            <p className="text-sm text-muted-foreground">Арт.</p>

            {isR40 ? (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{R40_PRODUCT_DESCRIPTION}</p>
                <p className="text-sm font-medium">Диапазон очистки: Ø 400-1000 мм. Рабочий вылет: до 40 м.</p>
                <div className="rounded-xl bg-muted/40 p-4">
                  <h3 className="mb-3 font-semibold">Ключевые особенности</h3>
                  <ul className="space-y-2 text-sm leading-relaxed">
                    {R40_KEY_FEATURES.map((feature) => <li key={feature}>• {feature}</li>)}
                  </ul>
                </div>
                <div className="rounded-lg bg-sky-500 px-4 py-4 text-center text-sm font-semibold text-white opacity-80">
                  <Download className="mr-2 inline h-4 w-4" />
                  Скачать технический паспорт изделия
                </div>
              </div>
            ) : isI40 ? (
              <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            ) : product.id.startsWith('r-brush-set-') ? (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
                <ul className="space-y-2 text-sm leading-relaxed">
                  <li>• Размер каналов: Ø 315-800 мм</li>
                  <li>• Тип каналов: Прямоугольные / Круглые</li>
                  <li>• Совместимость: Мультиробот R-40</li>
                </ul>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            )}
          </div>

          <Button type="button" className="w-full" size="lg" onClick={handlePurchase}>
            {cartQuantity > 0 ? <Check className="mr-2 h-4 w-4" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
            {cartQuantity > 0 ? `В корзине (${cartQuantity})` : 'Купить'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
