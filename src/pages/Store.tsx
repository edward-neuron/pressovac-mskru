import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/ProductCard';
import { CartDrawer } from '@/components/store/CartDrawer';
import { useCart } from '@/contexts/CartContext';
import { storeCategories, storeProducts, formatPrice } from '@/data/storeData';
import { ShoppingCart, ChevronRight, ArrowLeft, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Store = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems, totalPrice } = useCart();

  const currentCategory = storeCategories.find(c => c.id === selectedCategory);
  
  const filteredProducts = storeProducts.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.article?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <SEOHead 
        title="Магазин оборудования Pressovac | Купить оборудование для очистки вентиляции"
        description="Купить профессиональное оборудование Pressovac для очистки вентиляции. Вакуумные установки, щёточные машины, видеоинспекция. Доставка по России."
        keywords="купить Pressovac, магазин оборудования для вентиляции, цены Pressovac"
        canonical="/store"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 via-background to-background pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Магазин Pressovac
              </h1>
              <p className="text-muted-foreground max-w-xl">
                Профессиональное оборудование для очистки систем вентиляции. 
                Добавляйте товары в корзину и оформляйте заказ.
              </p>
            </div>

            {/* Cart Button */}
            <CartDrawer>
              <Button 
                variant="outline" 
                size="lg"
                className="relative border-primary/30 hover:bg-primary/5"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {totalItems > 0 ? (
                  <>
                    <span className="font-semibold">{formatPrice(totalPrice)}</span>
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  </>
                ) : (
                  <span>Корзина пуста</span>
                )}
              </Button>
            </CartDrawer>
          </div>

          {/* Search */}
          <div className="mt-8 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию или артикулу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            {!selectedCategory ? (
              /* Categories Grid */
              <motion.div
                key="categories"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-2xl font-bold mb-6">Категории</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {storeCategories.map((category, index) => {
                    const productCount = category.productCount || storeProducts.filter(p => p.category === category.id).length;
                    
                    return (
                      <motion.button
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedCategory(category.id)}
                        className="group relative bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 text-left"
                      >
                        <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
                              {category.name}
                            </h3>
                          </div>
                        </div>
                        <div className="px-2 py-2 flex items-center justify-between">
                          <span className="text-xs text-primary font-medium">
                            {productCount}
                          </span>
                          <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* Products Grid */
              <motion.div
                key="products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Back button & Category title */}
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Все категории
                  </Button>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{currentCategory?.name}</h2>
                    <p className="text-muted-foreground">{currentCategory?.description}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'товар' : filteredProducts.length < 5 ? 'товара' : 'товаров'}
                  </span>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Товары не найдены</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show all products if searching */}
          {searchQuery && !selectedCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold mb-6">
                Результаты поиска ({filteredProducts.length})
              </h2>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">По запросу "{searchQuery}" ничего не найдено</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Floating Cart Button (Mobile) */}
      {totalItems > 0 && (
        <CartDrawer>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-6 right-6 md:hidden z-50"
          >
            <Button size="lg" className="rounded-full shadow-lg h-14 px-6">
              <ShoppingCart className="w-5 h-5 mr-2" />
              {formatPrice(totalPrice)}
              <span className="ml-2 bg-primary-foreground/20 px-2 py-0.5 rounded-full text-sm">
                {totalItems}
              </span>
            </Button>
          </motion.div>
        </CartDrawer>
      )}
    </Layout>
  );
};

export default Store;
