import { X, FileText, ArrowLeft } from 'lucide-react';
import { Product } from '@/data/brushMachinesData';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Link } from 'react-router-dom';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const ProductModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onBack,
  showBackButton = false 
}: ProductModalProps) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
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
            <DialogTitle className="text-2xl font-display">
              {product.name}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Image placeholder */}
          <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Изображение товара</span>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold mb-2">Описание</h4>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-3">Особенности</h4>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Specifications */}
          <div>
            <h4 className="font-semibold mb-3">Технические характеристики</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            {product.brochureUrl ? (
              <Button variant="outline" className="flex-1" asChild>
                <a href={product.brochureUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="w-4 h-4 mr-2" />
                  Скачать брошюру
                </a>
              </Button>
            ) : (
              <Button variant="outline" className="flex-1" disabled>
                <FileText className="w-4 h-4 mr-2" />
                Брошюра (скоро)
              </Button>
            )}
            <Button className="flex-1" asChild>
              <Link to="/contacts">
                Запросить информацию
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
