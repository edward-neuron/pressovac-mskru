import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, ShoppingCart } from 'lucide-react';
import { brushMachinesData, Product, Subcategory } from '@/data/brushMachinesData';
import { ProductDrawer } from './ProductDrawer';
import { Button } from '@/components/ui/button';
import { useYmlPrices } from '@/hooks/useYmlPrices';

interface BrushMachinesCatalogProps {
  onSubcategoryChange?: (subcategoryId: string | null) => void;
}

export const BrushMachinesCatalog = ({ onSubcategoryChange }: BrushMachinesCatalogProps) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const { findPrice, findShopUrl, findMinPriceByPattern, isLoading: pricesLoading } = useYmlPrices();

  useEffect(() => {
    onSubcategoryChange?.(selectedSubcategory?.id || null);
  }, [selectedSubcategory, onSubcategoryChange]);

  const handleProductClick = (product: Product) => {
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
            {brushMachinesData.subcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => setSelectedSubcategory(subcategory)}
                className={`group p-4 rounded-xl border transition-all text-left ${
                  subcategory.isAtex
                    ? 'bg-gradient-to-r from-slate-700 to-red-700 hover:from-slate-600 hover:to-red-600 border-slate-600 hover:border-slate-500'
                    : 'bg-muted/50 hover:bg-primary/10 border-border hover:border-primary/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold transition-colors ${
                      subcategory.isAtex
                        ? 'text-white'
                        : 'group-hover:text-primary'
                    }`}>
                      {subcategory.title}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      subcategory.isAtex
                        ? 'text-white/80'
                        : 'text-muted-foreground'
                    }`}>
                      {subcategory.products.length} модел{subcategory.products.length === 1 ? 'ь' : subcategory.products.length < 5 ? 'и' : 'ей'}
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 group-hover:translate-x-1 transition-all ${
                    subcategory.isAtex
                      ? 'text-white/80'
                      : 'text-muted-foreground group-hover:text-primary'
                  }`} />
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedSubcategory.products.map((product) => {
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
                        <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Посмотреть цену в магазине
                        </div>
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
        product={selectedProduct}
        isOpen={isProductOpen}
        onClose={handleCloseProduct}
        onBack={handleBackToSubcategory}
        showBackButton={true}
      />
    </div>
  );
};
