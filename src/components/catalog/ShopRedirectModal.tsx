import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ExternalLink, ShoppingCart } from 'lucide-react';

interface ShopRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopUrl: string;
  productName: string;
  price?: string;
}

export const ShopRedirectModal = ({
  isOpen,
  onClose,
  shopUrl,
  productName,
  price
}: ShopRedirectModalProps) => {
  const handleConfirm = () => {
    window.open(shopUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <AlertDialogTitle className="text-lg">
              {productName}
            </AlertDialogTitle>
          </div>
          
          {price && (
            <div className="bg-muted/50 rounded-lg p-4 text-center my-4">
              <span className="text-sm text-muted-foreground">Цена:</span>
              <p className="text-2xl font-bold text-primary mt-1">{price}</p>
            </div>
          )}
          
          <AlertDialogDescription className="text-sm">
            Если вы готовы оформить заказ, нажмите «Перейти в магазин», и вы будете перенаправлены 
            в раздел товара в нашем интернет-магазине в новой вкладке. Эта страница останется 
            открытой, и вы сможете вернуться к ней в любой момент.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="sm:flex-1">
            Остаться здесь
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="sm:flex-1 gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Оформить заказ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
