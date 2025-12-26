import { useState } from 'react';
import { FileText, ArrowLeft, ExternalLink } from 'lucide-react';
import { Product } from '@/data/brushMachinesData';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Link } from 'react-router-dom';

interface ProductDrawerProps {
  product: Product | null;
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

  if (!product) return null;

  const hasLengths = product.availableLengths && product.availableLengths.length > 0;

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
          {/* Image placeholder */}
          <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Изображение товара</span>
          </div>

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

          {/* Specifications */}
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

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            {/* View Price Button */}
            {product.shopUrl && (
              <Button variant="default" className="w-full" asChild>
                <a href={product.shopUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Посмотреть цену
                </a>
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
      </SheetContent>
    </Sheet>
  );
};
