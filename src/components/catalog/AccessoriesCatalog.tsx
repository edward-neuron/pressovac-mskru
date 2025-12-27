import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, ExternalLink } from 'lucide-react';
import { accessoriesData, Subcategory } from '@/data/accessoriesData';
import { ProductDrawer, DrawerProduct } from './ProductDrawer';
import { Button } from '@/components/ui/button';

interface AccessoriesCatalogProps {
  onSubcategoryChange?: (subcategoryId: string | null) => void;
}

export const AccessoriesCatalog = ({ onSubcategoryChange }: AccessoriesCatalogProps) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<DrawerProduct | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);

  useEffect(() => {
    onSubcategoryChange?.(selectedSubcategory?.id || null);
  }, [selectedSubcategory, onSubcategoryChange]);

  const handleProductClick = (product: DrawerProduct) => {
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {accessoriesData.subcategories.map((subcategory) => (
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
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {subcategory.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
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

            <p className="text-sm text-muted-foreground">
              {selectedSubcategory.description}
            </p>

            {selectedSubcategory.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedSubcategory.products.map((product) => {
                  const hasShopLink = product.shopUrl && product.shopUrl !== '#';
                  
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
                          {hasShopLink && (
                            <div className="flex items-center gap-2 mt-2">
                              <ExternalLink className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium text-primary">
                                Перейти в магазин
                              </span>
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 bg-muted/30 rounded-xl border border-border text-center">
                <p className="text-muted-foreground">
                  Товары в данной категории будут добавлены в ближайшее время.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ProductDrawer
        product={selectedProduct}
        isOpen={isProductOpen}
        onClose={handleCloseProduct}
        onBack={handleBackToSubcategory}
        showBackButton={true}
      />
    </div>
  );
};
