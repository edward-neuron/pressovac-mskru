import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, ShoppingCart } from 'lucide-react';
import { vacuumEquipmentData, VacuumProduct, VacuumSubcategory } from '@/data/vacuumEquipmentData';
import { ProductDrawer } from './ProductDrawer';
import { Button } from '@/components/ui/button';
import { useYmlPrices } from '@/hooks/useYmlPrices';

interface VacuumEquipmentCatalogProps {
  onSubcategoryChange?: (subcategoryId: string | null) => void;
}

export function VacuumEquipmentCatalog({ onSubcategoryChange }: VacuumEquipmentCatalogProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<VacuumSubcategory | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<VacuumProduct | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const { findPrice, findShopUrl, isLoading: pricesLoading } = useYmlPrices();

  useEffect(() => {
    onSubcategoryChange?.(selectedSubcategory?.id || null);
  }, [selectedSubcategory, onSubcategoryChange]);

  const handleProductClick = (product: VacuumProduct) => {
    setSelectedProduct(product);
    setIsProductOpen(true);
  };

  const handleCloseProduct = () => {
    setIsProductOpen(false);
    setSelectedProduct(null);
  };

  const handleBackToSubcategory = () => {
    setIsProductOpen(false);
    setSelectedProduct(null);
  };

  const handleBackToMain = () => {
    setSelectedSubcategory(null);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!selectedSubcategory ? (
          // Подкатегории
          <motion.div
            key="subcategories"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {vacuumEquipmentData.subcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => setSelectedSubcategory(subcategory)}
                className="group p-4 bg-muted/50 hover:bg-primary/10 rounded-xl border border-border hover:border-primary/30 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                      {subcategory.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {subcategory.products.length} модел{subcategory.products.length === 1 ? 'ь' : subcategory.products.length < 5 ? 'и' : 'ей'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </motion.div>
        ) : (
          // Список товаров в подкатегории
          <motion.div
            key="products"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToMain}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Назад
              </Button>
              <h4 className="font-semibold">{selectedSubcategory.title}</h4>
            </div>

            {/* Изображение подкатегории (3:1) */}
            {selectedSubcategory.image && (
              <div className="rounded-xl overflow-hidden">
                <img 
                  src={selectedSubcategory.image} 
                  alt={selectedSubcategory.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              {selectedSubcategory.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedSubcategory.products.map((product) => {
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductDrawer
        product={selectedProduct ? {
          ...selectedProduct,
          price: findPrice(selectedProduct.shopUrl, selectedProduct.name, selectedProduct.article) || undefined,
          shopUrl: selectedProduct.shopUrl || findShopUrl(selectedProduct.name, selectedProduct.article) || undefined
        } : null}
        isOpen={isProductOpen}
        onClose={handleCloseProduct}
        onBack={handleBackToSubcategory}
        showBackButton={true}
      />
    </div>
  );
}
