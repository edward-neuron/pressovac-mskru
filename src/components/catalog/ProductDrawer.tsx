import { useState } from 'react';
import { FileText, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { ShopRedirectModal } from './ShopRedirectModal';
import { useYmlPrices } from '@/hooks/useYmlPrices';

// Общий тип для продуктов из разных каталогов
export interface DrawerProduct {
  id: string;
  name: string;
  article?: string;
  description: string;
  image?: string;
  shopUrl?: string;
  price?: string;
  pricePrefix?: string;
  features?: string[];
  specifications?: Record<string, string>;
  brochureUrl?: string;
  availableLengths?: string[];
  vendorCodePattern?: string;
}

interface ProductDrawerProps {
  product: DrawerProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const ProductDrawer = ({ 
  product, 
  isOpen, 
  onClose, 
  onBack,
  showBackButton = false 
}: ProductDrawerProps) => {
  const [selectedLength, setSelectedLength] = useState<string | null>(null);
  const [showShopModal, setShowShopModal] = useState(false);
  const { findPrice, findShopUrl } = useYmlPrices();

  if (!product) return null;

  const hasLengths = product.availableLengths && product.availableLengths.length > 0;
  const ymlPrice = findPrice(product.shopUrl, product.name, product.article);
  const ymlShopUrl = findShopUrl(product.name, product.article);
  const displayPrice = ymlPrice || product.price;
  const effectiveShopUrl = (product.shopUrl && product.shopUrl !== '#') ? product.shopUrl : ymlShopUrl;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="relative">
          <div className="flex items-center gap-3">
            {showBackButton && onBack && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onBack}
                className="shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <SheetTitle className="text-xl font-display text-left">
              {product.name}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Product Image */}
          {product.image ? (
            <div className="w-full aspect-video bg-muted rounded-xl overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Изображение товара</span>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="font-semibold mb-2">Описание</h4>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* Available Lengths */}
          {hasLengths && (
            <div>
              <h4 className="font-semibold mb-3">Доступные длины валов</h4>
              <div className="flex flex-wrap gap-2">
                {product.availableLengths!.map((length) => (
                  <button
                    key={length}
                    onClick={() => setSelectedLength(length === selectedLength ? null : length)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      selectedLength === length
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/50 border-border hover:border-primary/50 hover:bg-muted'
                    }`}
                  >
                    {length}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Особенности</h4>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-muted-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Технические характеристики</h4>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground text-sm">{key}</span>
                    <span className="font-medium text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            {/* View Price Button */}
            {effectiveShopUrl && (
              <Button 
                variant="default" 
                className="w-full" 
                onClick={() => setShowShopModal(true)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {displayPrice ? `Оформить заказ — ${displayPrice}` : 'Оформить заказ'}
              </Button>
            )}

            {/* Brochure Button */}
            {product.brochureUrl ? (
              <Button variant="outline" className="w-full" asChild>
                <a href={product.brochureUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="w-4 h-4 mr-2" />
                  Скачать брошюру
                </a>
              </Button>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                <FileText className="w-4 h-4 mr-2" />
                Брошюра (скоро)
              </Button>
            )}

            {/* Contact Button */}
            <Button variant="secondary" className="w-full" asChild>
              <Link to="/contacts">
                Запросить информацию
              </Link>
            </Button>
          </div>
        </div>

        {/* Shop Redirect Modal */}
        {effectiveShopUrl && (
          <ShopRedirectModal
            isOpen={showShopModal}
            onClose={() => setShowShopModal(false)}
            shopUrl={effectiveShopUrl}
            productName={product.name}
            price={displayPrice || undefined}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
