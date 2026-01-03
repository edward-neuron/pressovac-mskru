import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates,
  rectSortingStrategy 
} from '@dnd-kit/sortable';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { CartDrawer } from '@/components/store/CartDrawer';
import { SortableItem } from '@/components/store/SortableItem';
import { useCart } from '@/contexts/CartContext';
import { useYmlStore, YmlProduct, YmlCategory } from '@/hooks/useYmlStore';
import { useSortOrder } from '@/hooks/useSortOrder';
import { ShoppingCart, ArrowLeft, Search, Loader2, Settings, X, Home, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Import category images
import category1 from '@/assets/store/category-1.webp';
import category2 from '@/assets/store/category-2.webp';
import category3 from '@/assets/store/category-3.webp';
import category4 from '@/assets/store/category-4.webp';
import category5 from '@/assets/store/category-5.webp';
import category6 from '@/assets/store/category-6.webp';
import category7 from '@/assets/store/category-7.webp';
import category8 from '@/assets/store/category-8.webp';
import category9 from '@/assets/store/category-9.webp';
import category10 from '@/assets/store/category-10.webp';
import category11 from '@/assets/store/category-11.webp';
import category12 from '@/assets/store/category-12.webp';
import category13 from '@/assets/store/category-13.webp';

// Mapping of category names to custom images
const categoryImageMap: Record<string, string> = {
  'Готовые комплекты оборудования': category1,
  'Машины для сухой очистки и дезинфекции': category2,
  'Машины с маркировкой взрывозащиты ATEX': category3,
  'Машины для мойки и удаления жира': category4,
  'Оборудование для дезинфекции': category5,
  'Вакуумные Всасывающие установки SU series': category6,
  'Фильтро-Вакуумные Установки SFU series': category7,
  'Фильтрующие установки FU series': category8,
  'Гибкие вращающиеся валы Pressovac': category9,
  'Чистящие щётки Pressovac': category10,
  'Аксессуары к воздуховодам': category11,
  'Видео-инспекционное оборудование': category12,
  'Компрессоры': category13,
};

// Helper function to get custom category image
const getCustomCategoryImage = (categoryName: string): string | undefined => {
  return categoryImageMap[categoryName];
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

interface CategoryCardProps {
  category: YmlCategory;
  image?: string;
  productCount: number;
  onClick: () => void;
  index: number;
}

const CategoryCard = ({ category, image, productCount, onClick, index }: CategoryCardProps) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.03 }}
    onClick={onClick}
    className="group relative bg-card rounded-lg border border-border/50 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 text-left w-full"
  >
    <div className="aspect-square bg-white relative overflow-hidden p-2">
      {image ? (
        <img 
          src={image} 
          alt={category.name}
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <ShoppingCart className="w-12 h-12 opacity-20" />
        </div>
      )}
    </div>
    <div className="px-2 py-2 border-t border-border/30">
      <h3 className="text-xs font-medium text-primary leading-tight line-clamp-2 min-h-[2rem] hover:underline">
        {category.name}
      </h3>
      <span className="text-xs text-muted-foreground">
        {productCount}
      </span>
    </div>
  </motion.button>
);

// Breadcrumbs component
interface BreadcrumbsProps {
  categoryHistory: string[];
  categories: YmlCategory[];
  onNavigateToRoot: () => void;
  onNavigateToLevel: (index: number) => void;
}

const Breadcrumbs = ({ categoryHistory, categories, onNavigateToRoot, onNavigateToLevel }: BreadcrumbsProps) => {
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || '';

  return (
    <nav className="flex items-center flex-wrap gap-1 text-sm mb-6 bg-muted/30 rounded-lg px-4 py-3">
      <button
        onClick={onNavigateToRoot}
        className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium"
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Магазин</span>
      </button>
      
      {categoryHistory.map((catId, index) => (
        <div key={catId} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          {index === categoryHistory.length - 1 ? (
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {getCategoryName(catId)}
            </span>
          ) : (
            <button
              onClick={() => onNavigateToLevel(index)}
              className="text-primary hover:text-primary/80 transition-colors truncate max-w-[150px]"
            >
              {getCategoryName(catId)}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
};

const Store = () => {
  const [categoryHistory, setCategoryHistory] = useState<string[]>([]);
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
  
  const {
    isEditMode,
    toggleEditMode,
    getCategorySortOrder,
    getProductSortOrder,
    reorderCategories,
    reorderProducts,
    resetOrder
  } = useSortOrder();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectedCategory = categoryHistory.length > 0 ? categoryHistory[categoryHistory.length - 1] : null;
  const currentCategory = categories.find(c => c.id === selectedCategory);
  
  // Get and sort root categories
  const rootCategories = useMemo(() => {
    return getRootCategories()
      .map(cat => ({ ...cat, customOrder: getCategorySortOrder(cat.id, cat.sortOrder) }))
      .sort((a, b) => a.customOrder - b.customOrder);
  }, [getRootCategories, getCategorySortOrder]);

  // Get and sort subcategories
  const subcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return getSubcategories(selectedCategory)
      .map(cat => ({ ...cat, customOrder: getCategorySortOrder(cat.id, cat.sortOrder) }))
      .sort((a, b) => a.customOrder - b.customOrder);
  }, [selectedCategory, getSubcategories, getCategorySortOrder]);
  
  const hasSubcategories = subcategories.length > 0;
  
  // Get and sort products - show products directly in category when there are no subcategories
  // OR when category has both products and subcategories, show only products directly in this category
  const productsToShow = useMemo(() => {
    if (searchQuery) {
      return searchProducts(searchQuery)
        .map(prod => ({ ...prod, customOrder: getProductSortOrder(prod.id, prod.sortOrder) }))
        .sort((a, b) => a.customOrder - b.customOrder);
    }
    if (selectedCategory) {
      // Get products directly in this category (not in subcategories)
      return getProductsByCategory(selectedCategory)
        .map(prod => ({ ...prod, customOrder: getProductSortOrder(prod.id, prod.sortOrder) }))
        .sort((a, b) => a.customOrder - b.customOrder);
    }
    return [];
  }, [searchQuery, selectedCategory, searchProducts, getProductsByCategory, getProductSortOrder]);

  const navigateToCategory = (categoryId: string) => {
    setCategoryHistory(prev => [...prev, categoryId]);
  };

  const navigateBack = () => {
    setCategoryHistory(prev => prev.slice(0, -1));
  };

  const navigateToRoot = () => {
    setCategoryHistory([]);
    setSearchQuery('');
  };

  const navigateToLevel = (index: number) => {
    setCategoryHistory(prev => prev.slice(0, index + 1));
  };

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

  const handleDragEndCategories = (event: DragEndEvent, categoryList: YmlCategory[]) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = categoryList.findIndex(c => c.id === active.id);
      const newIndex = categoryList.findIndex(c => c.id === over.id);
      const newOrder = arrayMove(categoryList, oldIndex, newIndex);
      reorderCategories(newOrder.map(c => c.id));
    }
  };

  const handleDragEndProducts = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = productsToShow.findIndex(p => p.id === active.id);
      const newIndex = productsToShow.findIndex(p => p.id === over.id);
      const newOrder = arrayMove(productsToShow, oldIndex, newIndex);
      reorderProducts(newOrder.map(p => p.id));
    }
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

            <div className="flex items-center gap-3">
              {/* Edit Mode Toggle - only visible in development */}
              {import.meta.env.DEV && (
                <>
                  <Button
                    variant={isEditMode ? "default" : "outline"}
                    size="sm"
                    onClick={toggleEditMode}
                    className={isEditMode ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    {isEditMode ? <X className="w-4 h-4 mr-2" /> : <Settings className="w-4 h-4 mr-2" />}
                    {isEditMode ? "Завершить" : "Сортировка"}
                  </Button>
                  
                  {isEditMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetOrder}
                      className="text-muted-foreground"
                    >
                      Сбросить
                    </Button>
                  )}
                </>
              )}

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
          </div>

          {/* Edit Mode Hint */}
          {isEditMode && (
            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Режим сортировки: перетаскивайте карточки за иконку ⋮⋮ для изменения порядка. Изменения сохраняются автоматически.
              </p>
            </div>
          )}

          {/* Search */}
          {!isEditMode && (
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
          )}
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
              {/* Search Results */}
              {searchQuery ? (
                <motion.div
                  key="search"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">
                      Результаты поиска ({productsToShow.length})
                    </h2>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={navigateToRoot}
                      className="text-primary p-0 h-auto mt-2"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Все категории
                    </Button>
                  </div>

                  {productsToShow.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {productsToShow.map((product, index) => {
                        const cartQty = getCartQuantity(product.id);
                        return (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="group bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                          >
                            <div className="aspect-square bg-white relative overflow-hidden">
                              {product.picture ? (
                                <img 
                                  src={product.picture} 
                                  alt={product.name}
                                  className="w-full h-full object-contain p-2"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  <ShoppingCart className="w-12 h-12 opacity-20" />
                                </div>
                              )}
                            </div>
                            <div className="p-3 space-y-2">
                              <div className="text-lg font-bold text-primary">{product.price}</div>
                              <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-tight min-h-[2.5rem]">
                                {product.name}
                              </h3>
                              {product.vendorCode && (
                                <p className="text-xs text-muted-foreground">Арт: {product.vendorCode}</p>
                              )}
                              <Button
                                onClick={() => handleAddToCart(product)}
                                size="sm"
                                className={`w-full transition-all duration-300 ${cartQty > 0 ? 'bg-green-600 hover:bg-green-700' : ''}`}
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
                        По запросу "{searchQuery}" ничего не найдено
                      </p>
                    </div>
                  )}
                </motion.div>
              ) : !selectedCategory ? (
                /* Root Categories Grid */
                <motion.div
                  key="categories"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Оборудование и аксессуары</h2>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(e) => handleDragEndCategories(e, rootCategories)}
                  >
                    <SortableContext items={rootCategories.map(c => c.id)} strategy={rectSortingStrategy}>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {rootCategories.map((category, index) => (
                          <SortableItem key={category.id} id={category.id} isEditMode={isEditMode}>
                            <CategoryCard
                              category={category}
                              image={getCustomCategoryImage(category.name) || getCategoryImage(category.id)}
                              productCount={getProductsCount(category.id)}
                              onClick={() => !isEditMode && navigateToCategory(category.id)}
                              index={index}
                            />
                          </SortableItem>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </motion.div>
              ) : (
                /* Category view - show subcategories and/or products */
                <motion.div
                  key={`category-${selectedCategory}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Breadcrumbs navigation */}
                  <Breadcrumbs
                    categoryHistory={categoryHistory}
                    categories={categories}
                    onNavigateToRoot={navigateToRoot}
                    onNavigateToLevel={navigateToLevel}
                  />

                  <h2 className="text-2xl font-bold mb-6">{currentCategory?.name}</h2>
                  
                  {/* Show subcategories if they exist */}
                  {hasSubcategories && (
                    <>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(e) => handleDragEndCategories(e, subcategories)}
                      >
                        <SortableContext items={subcategories.map(c => c.id)} strategy={rectSortingStrategy}>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                            {subcategories.map((subcategory, index) => (
                              <SortableItem key={subcategory.id} id={subcategory.id} isEditMode={isEditMode}>
                                <CategoryCard
                                  category={subcategory}
                                  image={getCategoryImage(subcategory.id)}
                                  productCount={getProductsCount(subcategory.id)}
                                  onClick={() => !isEditMode && navigateToCategory(subcategory.id)}
                                  index={index}
                                />
                              </SortableItem>
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                      
                      {/* Separator if there are also products */}
                      {productsToShow.length > 0 && (
                        <div className="my-8 border-t border-border/50" />
                      )}
                    </>
                  )}
                  
                  {/* Show products directly in this category */}
                  {productsToShow.length > 0 && (
                    <>
                      {hasSubcategories && (
                        <h3 className="text-xl font-semibold mb-4">Товары в категории</h3>
                      )}
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEndProducts}
                      >
                        <SortableContext items={productsToShow.map(p => p.id)} strategy={rectSortingStrategy}>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {productsToShow.map((product, index) => {
                              const cartQty = getCartQuantity(product.id);
                              return (
                                <SortableItem key={product.id} id={product.id} isEditMode={isEditMode}>
                                  <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="group bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                                  >
                                    <div className="aspect-square bg-white relative overflow-hidden">
                                      {product.picture ? (
                                        <img 
                                          src={product.picture} 
                                          alt={product.name}
                                          className="w-full h-full object-contain p-2"
                                          loading="lazy"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                          <ShoppingCart className="w-12 h-12 opacity-20" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="p-3 space-y-2">
                                      <div className="text-lg font-bold text-primary">{product.price}</div>
                                      <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-tight min-h-[2.5rem]">
                                        {product.name}
                                      </h3>
                                      {product.vendorCode && (
                                        <p className="text-xs text-muted-foreground">Арт: {product.vendorCode}</p>
                                      )}
                                      <Button
                                        onClick={() => !isEditMode && handleAddToCart(product)}
                                        size="sm"
                                        className={`w-full transition-all duration-300 ${cartQty > 0 ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                        disabled={isEditMode}
                                      >
                                        {cartQty > 0 ? `В корзине (${cartQty})` : 'Купить'}
                                      </Button>
                                    </div>
                                  </motion.div>
                                </SortableItem>
                              );
                            })}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </>
                  )}
                  
                  {/* Empty state */}
                  {!hasSubcategories && productsToShow.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Товары не найдены</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Floating Cart Button (Mobile) */}
      {totalItems > 0 && !isEditMode && (
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
