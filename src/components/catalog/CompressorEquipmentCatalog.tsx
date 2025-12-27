import { useState } from 'react';
import { ChevronRight, ShoppingCart } from 'lucide-react';
import { ProductDrawer } from './ProductDrawer';
import { compressorEquipmentData } from '@/data/compressorEquipmentData';
import { useYmlPrices } from '@/hooks/useYmlPrices';

export function CompressorEquipmentCatalog() {
  const [selectedProduct, setSelectedProduct] = useState(compressorEquipmentData.products[0] ?? null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const { findPrice, findShopUrl, isLoading: pricesLoading } = useYmlPrices();

  const product = compressorEquipmentData.products[0];

  const handleOpen = () => {
    setIsProductOpen(true);
  };

  const handleClose = () => {
    setIsProductOpen(false);
  };

  if (!product) return null;

  const ymlPrice = findPrice(product.shopUrl, product.name, product.article);
  const ymlShopUrl = findShopUrl(product.name, product.article);
  const displayPrice = ymlPrice || null;
  const hasShopLink = (product.shopUrl && product.shopUrl !== '#') || ymlShopUrl;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleOpen}
          className="group p-4 bg-card hover:bg-primary/5 rounded-xl border border-border hover:border-primary/30 transition-all text-left"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h5 className="font-medium group-hover:text-primary transition-colors truncate">
                {product.name}
              </h5>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {product.description}
              </p>
              {displayPrice && hasShopLink && (
                <div className="flex items-center gap-2 mt-2">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    {displayPrice}
                  </span>
                </div>
              )}
              {pricesLoading && !displayPrice && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-16 h-4 bg-muted animate-pulse rounded" />
                </div>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </div>
        </button>
      </div>

      <ProductDrawer product={selectedProduct} isOpen={isProductOpen} onClose={handleClose} />
    </div>
  );
}
