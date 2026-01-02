import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { CartDrawer } from '@/components/store/CartDrawer';
import { useCart } from '@/contexts/CartContext';
import { useYmlStore, YmlProduct } from '@/hooks/useYmlStore';
import { ShoppingCart, ChevronRight, ArrowLeft, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const Store = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems, totalPrice, addItem, items } = useCart();
  const { 
    isLoading, 
    error, 
    getRootCategories, 
    getSubcategories,
    getProductsByCategory, 
    getProductsCount,
    getCategoryImage,
    searchProducts,
    categories 
  } = useYmlStore();

  const rootCategories = getRootCategories();
  const currentCategory = categories.find(c => c.id === selectedCategory);
  const subcategories = selectedCategory ? getSubcategories(selectedCategory) : [];
  
  const filteredProducts = searchQuery 
    ? searchProducts(searchQuery)
    : selectedCategory 
      ? getProductsByCategory(selectedCategory)
      : [];

  const handleAddToCart = (product: YmlProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.priceNum,
      image: product.picture || '/placeholder.svg',
      article: product.vendorCode
    });
  };

  const getCartQuantity = (productId: string) => {
    return items.find(item => item.id === productId)?.quantity || 0;
  };

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
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Загрузка каталога...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-destructive">
              <p>Ошибка загрузки: {error}</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {!selectedCategory && !searchQuery ? (
                /* Categories Grid */
                <motion.div
                  key="categories"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Категории</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {rootCategories.map((category, index) => {
                      const productCount = getProductsCount(category.id);
                      const categoryImage = getCategoryImage(category.id);
                      
                      return (
                        <motion.button
                          key={category.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={() => setSelectedCategory(category.id)}
                          className="group relative bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 text-left"
                        >
                          <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
                            {categoryImage && (
                              <img 
                                src={categoryImage} 
                                alt={category.name}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                            <div className="absolute bottom-2 left-2 right-2">
                              <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
                                {category.name}
                              </h3>
                            </div>
                          </div>
                          <div className="px-2 py-2 flex items-center justify-between">
                            <span className="text-xs text-primary font-medium">
                              {productCount} {productCount === 1 ? 'товар' : productCount < 5 ? 'товара' : 'товаров'}
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
                  {selectedCategory && !searchQuery && (
                    <>
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
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {filteredProducts.length} {filteredProducts.length === 1 ? 'товар' : filteredProducts.length < 5 ? 'товара' : 'товаров'}
                        </span>
                      </div>

                      {/* Subcategories */}
                      {subcategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {subcategories.map(sub => (
                            <Button
                              key={sub.id}
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCategory(sub.id)}
                              className="text-sm"
                            >
                              {sub.name}
                            </Button>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {searchQuery && (
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold">
                        Результаты поиска ({filteredProducts.length})
                      </h2>
                      {selectedCategory && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => setSelectedCategory(null)}
                          className="text-primary p-0 h-auto mt-2"
                        >
                          <ArrowLeft className="w-4 h-4 mr-1" />
                          Все категории
                        </Button>
                      )}
                    </div>
                  )}

                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {filteredProducts.map((product, index) => {
                        const cartQty = getCartQuantity(product.id);
                        
                        return (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="group bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                          >
                            {/* Image */}
                            <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted relative overflow-hidden">
                              {product.picture ? (
                                <img 
                                  src={product.picture} 
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  <ShoppingCart className="w-12 h-12 opacity-20" />
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-3 space-y-2">
                              {/* Price */}
                              <div className="text-lg font-bold text-primary">
                                {product.price}
                              </div>

                              {/* Name */}
                              <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-tight min-h-[2.5rem]">
                                {product.name}
                              </h3>

                              {/* Button */}
                              <Button
                                onClick={() => handleAddToCart(product)}
                                size="sm"
                                className={`w-full transition-all duration-300 ${
                                  cartQty > 0 ? 'bg-green-600 hover:bg-green-700' : ''
                                }`}
                              >
                                {cartQty > 0 ? `В корзине (${cartQty})` : 'Купить'}
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        {searchQuery ? `По запросу "${searchQuery}" ничего не найдено` : 'Товары не найдены'}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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
