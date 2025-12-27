import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, ChevronRight, Wind, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { vacuumEquipmentData, VacuumProduct, VacuumSubcategory } from '@/data/vacuumEquipmentData';
import { useYmlPrices } from '@/hooks/useYmlPrices';
import { ProductDrawer } from './ProductDrawer';

interface VacuumEquipmentCatalogProps {
  onSubcategoryChange?: (subcategoryId: string | null) => void;
}

const subcategoryIcons: Record<string, React.ReactNode> = {
  'su-vacuum': <Wind className="w-6 h-6" />,
  'sfu-vacuum': <Filter className="w-6 h-6" />
};

export function VacuumEquipmentCatalog({ onSubcategoryChange }: VacuumEquipmentCatalogProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<VacuumSubcategory | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<VacuumProduct | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const { findPrice, findShopUrl, isLoading } = useYmlPrices();

  useEffect(() => {
    onSubcategoryChange?.(selectedSubcategory?.id || null);
  }, [selectedSubcategory, onSubcategoryChange]);

  const handleSubcategoryClick = (subcategory: VacuumSubcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handleProductClick = (product: VacuumProduct) => {
    setSelectedProduct(product);
    setIsProductOpen(true);
  };

  const handleCloseProduct = () => {
    setIsProductOpen(false);
    setSelectedProduct(null);
  };

  const handleBackToSubcategories = () => {
    setSelectedSubcategory(null);
  };

  const getProductPrice = (product: VacuumProduct): string | null => {
    return findPrice(product.shopUrl, product.name, product.article);
  };

  const getProductShopUrl = (product: VacuumProduct): string | null => {
    return product.shopUrl || findShopUrl(product.name, product.article);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!selectedSubcategory ? (
          // Subcategories list
          <motion.div
            key="subcategories"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 md:grid-cols-2"
          >
            {vacuumEquipmentData.subcategories.map((subcategory) => (
              <Card
                key={subcategory.id}
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50 group"
                onClick={() => handleSubcategoryClick(subcategory)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {subcategoryIcons[subcategory.id]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                          {subcategory.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {subcategory.description}
                        </p>
                        <Badge variant="secondary" className="mt-2">
                          {subcategory.products.length} модел{subcategory.products.length === 1 ? 'ь' : subcategory.products.length < 5 ? 'и' : 'ей'}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : (
          // Products list
          <motion.div
            key="products"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Button
              variant="ghost"
              onClick={handleBackToSubcategories}
              className="mb-4 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к категориям
            </Button>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{selectedSubcategory.title}</h3>
              <p className="text-muted-foreground">{selectedSubcategory.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {selectedSubcategory.products.map((product) => {
                const price = getProductPrice(product);
                const shopUrl = getProductShopUrl(product);

                return (
                  <Card
                    key={product.id}
                    className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50 group overflow-hidden"
                    onClick={() => handleProductClick(product)}
                  >
                    <CardContent className="p-0">
                      {/* Placeholder for product image */}
                      <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <Wind className="w-16 h-16 text-muted-foreground/30" />
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {product.description}
                        </p>
                        
                        {/* Key specs preview */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs">
                              {value}
                            </Badge>
                          ))}
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          {isLoading ? (
                            <Skeleton className="h-6 w-24" />
                          ) : price ? (
                            <span className="text-lg font-bold text-primary">{price}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Цена по запросу</span>
                          )}
                          
                          {shopUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(shopUrl, '_blank');
                              }}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Купить
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product drawer */}
      <ProductDrawer
        isOpen={isProductOpen}
        onClose={handleCloseProduct}
        product={selectedProduct ? {
          ...selectedProduct,
          price: getProductPrice(selectedProduct) || undefined,
          shopUrl: getProductShopUrl(selectedProduct) || undefined
        } : null}
      />
    </div>
  );
}
