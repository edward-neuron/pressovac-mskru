import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ShoppingCart } from 'lucide-react';
import { filterEquipmentData, FilterProduct } from '@/data/filterEquipmentData';
import { ProductDrawer } from './ProductDrawer';
import { useYmlPrices } from '@/hooks/useYmlPrices';

export function FilterEquipmentCatalog() {
  const [selectedProduct, setSelectedProduct] = useState<FilterProduct | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const { findPrice, findShopUrl, isLoading: pricesLoading } = useYmlPrices();

  const handleProductClick = (product: FilterProduct) => {
    setSelectedProduct(product);
    setIsProductOpen(true);
  };

  const handleCloseProduct = () => {
    setIsProductOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {filterEquipmentData.products.map((product) => {
          const ymlPrice = findPrice(product.shopUrl, product.name, product.article);
          const ymlShopUrl = findShopUrl(product.name, product.article);
          const displayPrice = ymlPrice || product.price;
          const hasShopLink = (product.shopUrl && product.shopUrl !== '#') || ymlShopUrl;
          
          return (
            <button
              key={product.id}
              onClick={() => handleProductClick(product)}
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
          );
        })}
      </motion.div>

      <ProductDrawer
        product={selectedProduct ? {
          ...selectedProduct,
          price: findPrice(selectedProduct.shopUrl, selectedProduct.name, selectedProduct.article) || undefined,
          shopUrl: selectedProduct.shopUrl || findShopUrl(selectedProduct.name, selectedProduct.article) || undefined
        } : null}
        isOpen={isProductOpen}
        onClose={handleCloseProduct}
        showBackButton={false}
      />
    </div>
  );
}
