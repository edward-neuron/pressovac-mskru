import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface YmlProduct {
  id: string;
  name: string;
  description?: string;
  price: string;
  priceNum: number;
  url: string;
  vendorCode?: string;
  picture?: string;
  categoryId?: string;
  sortOrder: number;
}

export interface YmlCategory {
  id: string;
  name: string;
  parentId?: string;
  sortOrder: number;
}

interface YmlStoreState {
  categories: YmlCategory[];
  products: YmlProduct[];
  isLoading: boolean;
  error: string | null;
  fetchedAt: string | null;
}

// Cache for data
let cachedData: { 
  categories: YmlCategory[]; 
  products: YmlProduct[]; 
  fetchedAt: string 
} | null = null;

// Function to clear cache (exported for manual refresh)
export function clearYmlStoreCache() {
  cachedData = null;
}

// Helper function to format price
function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(price)) + ' ₽';
}

export function useYmlStore() {
  const [state, setState] = useState<YmlStoreState>({
    categories: cachedData?.categories || [],
    products: cachedData?.products || [],
    isLoading: !cachedData,
    error: null,
    fetchedAt: cachedData?.fetchedAt || null
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (cachedData && refreshTrigger === 0) {
      return;
    }

    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        // Fetch directly from database tables
        const [categoriesRes, productsRes] = await Promise.all([
          supabase.from('product_categories').select('*').order('id'),
          supabase.from('products').select('*').eq('available', true).order('id')
        ]);

        if (categoriesRes.error) throw categoriesRes.error;
        if (productsRes.error) throw productsRes.error;

        // Transform data to match expected interface
        const categories: YmlCategory[] = (categoriesRes.data || []).map((c, idx) => ({
          id: c.id,
          name: c.name,
          parentId: c.parent_id || undefined,
          sortOrder: idx
        }));

        const products: YmlProduct[] = (productsRes.data || []).map((p, idx) => ({
          id: p.id,
          name: p.name,
          description: p.description || undefined,
          price: formatPrice(Number(p.price)),
          priceNum: Number(p.price),
          url: `https://shop-pressovac.ru/product/${p.id}`, // Legacy URL for compatibility
          vendorCode: p.vendor_code || undefined,
          picture: p.picture || undefined,
          categoryId: p.category_id,
          sortOrder: idx
        }));

        cachedData = { 
          categories, 
          products,
          fetchedAt: new Date().toISOString()
        };

        setState({
          categories,
          products,
          isLoading: false,
          error: null,
          fetchedAt: cachedData.fetchedAt
        });
      } catch (err) {
        console.error('Error fetching store data:', err);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }));
      }
    };

    fetchData();
  }, [refreshTrigger]);

  // Force refetch data
  const refetch = () => {
    cachedData = null;
    setRefreshTrigger(prev => prev + 1);
  };

  // Get root categories (no parentId)
  const getRootCategories = () => {
    return state.categories
      .filter(c => !c.parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  // Get subcategories for a parent
  const getSubcategories = (parentId: string) => {
    return state.categories
      .filter(c => c.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  // Get products directly in a category (not subcategories)
  const getProductsByCategory = (categoryId: string): YmlProduct[] => {
    return state.products
      .filter(p => p.categoryId === categoryId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  // Get all products for a category including all nested subcategories (for counting)
  const getAllProductsByCategory = (categoryId: string): YmlProduct[] => {
    const getAllChildCategoryIds = (parentId: string): string[] => {
      const children = state.categories.filter(c => c.parentId === parentId);
      const ids: string[] = [];
      for (const child of children) {
        ids.push(child.id);
        ids.push(...getAllChildCategoryIds(child.id));
      }
      return ids;
    };
    
    const allCategoryIds = [categoryId, ...getAllChildCategoryIds(categoryId)];
    
    return state.products
      .filter(p => p.categoryId && allCategoryIds.includes(p.categoryId))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  // Get products count for a category (including all nested subcategories)
  const getProductsCount = (categoryId: string): number => {
    return getAllProductsByCategory(categoryId).length;
  };

  // Get category image (first product's image from all nested products)
  const getCategoryImage = (categoryId: string): string | undefined => {
    const products = getAllProductsByCategory(categoryId);
    return products[0]?.picture;
  };

  // Словарь синонимов и альтернативных названий для контекстного поиска
  const synonymsMap: Record<string, string[]> = {
    // Жир и мойка
    'жир': ['мойк', 'жиро', 'grease', 'удалени', 'кухон', 'ресторан'],
    'удаление жира': ['мойк', 'жир', 'grease', 'кухон'],
    'мойка': ['жир', 'grease', 'удалени'],
    'grease': ['жир', 'мойк', 'удалени'],
    
    // Пылеулавливание = Вакуумные установки
    'пыл': ['вакуум', 'всасыва', 'sfu', 'su-', 'фильтр', 'hepa'],
    'пылеулавлива': ['вакуум', 'всасыва', 'sfu', 'su-', 'фильтр', 'hepa'],
    'пылесос': ['вакуум', 'всасыва', 'sfu', 'su-'],
    'улавлива': ['вакуум', 'фильтр', 'hepa', 'sfu'],
    
    // Вакуум
    'вакуум': ['всасыва', 'su-', 'sfu', 'пыл', 'фильтр'],
    'всасыва': ['вакуум', 'su-', 'sfu'],
    
    // Щётки
    'щетк': ['brush', 'щётк', 'кисть'],
    'щётк': ['brush', 'щетк', 'кисть'],
    'brush': ['щетк', 'щётк'],
    
    // Шланги
    'шланг': ['hose', 'рукав'],
    'hose': ['шланг', 'рукав'],
    'рукав': ['шланг', 'hose'],
    
    // Валы
    'вал': ['shaft', 'гибк'],
    'shaft': ['вал', 'гибк'],
    'гибкий вал': ['shaft', 'flex'],
    
    // Видеокамеры
    'камер': ['video', 'видео', 'инспекц', 'vs-', 'vs200', 'vs250', 'vs350', 'vs700'],
    'видео': ['камер', 'video', 'инспекц', 'vs-'],
    'video': ['камер', 'видео', 'инспекц'],
    'инспекц': ['камер', 'видео', 'video', 'vs-'],
    
    // Дезинфекция
    'дезинфекц': ['обеззаражив', 'санитар', 'disinfect'],
    'обеззаражив': ['дезинфекц', 'санитар'],
    'санитар': ['дезинфекц', 'обеззаражив'],
    
    // Фильтры
    'фильтр': ['hepa', 'filter', 'sfu', 'очистк'],
    'hepa': ['фильтр', 'filter', 'sfu'],
    'filter': ['фильтр', 'hepa'],
    
    // АТЕХ
    'атех': ['atex', 'взрыв', 'взрывозащ'],
    'atex': ['атех', 'взрыв', 'взрывозащ'],
    'взрыв': ['atex', 'атех', 'взрывозащ'],
    'взрывозащ': ['atex', 'атех'],
    
    // Аксессуары
    'аксессуар': ['комплект', 'набор', 'принадлежност'],
    'комплект': ['набор', 'аксессуар', 'kit'],
    'набор': ['комплект', 'аксессуар', 'kit'],
    
    // Машины для чистки
    'машин': ['оборудован', 'установк', 'аппарат'],
    'оборудован': ['машин', 'установк', 'аппарат'],
    'установк': ['машин', 'оборудован', 'аппарат'],
    'чистк': ['очистк', 'мойк', 'cleaning'],
    'очистк': ['чистк', 'мойк', 'cleaning'],
    'cleaning': ['чистк', 'очистк', 'мойк'],
    
    // Компрессоры
    'компрессор': ['compressor', 'воздух', 'давлен'],
    'compressor': ['компрессор'],
    
    // Люки
    'люк': ['hatch', 'ревизион', 'service'],
    'hatch': ['люк', 'ревизион'],
    'ревизион': ['люк', 'hatch', 'service'],
  };

  // Функция для получения синонимов
  const getSynonyms = (query: string): string[] => {
    const lowerQuery = query.toLowerCase();
    const synonyms: Set<string> = new Set();
    
    // Ищем совпадения в ключах словаря
    for (const [key, values] of Object.entries(synonymsMap)) {
      if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
        values.forEach(v => synonyms.add(v));
      }
    }
    
    return Array.from(synonyms);
  };

  // Search products by name, vendorCode, description, or synonyms
  const searchProducts = (query: string) => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return [];
    
    const synonyms = getSynonyms(lowerQuery);
    
    // Функция проверки совпадения
    const matchesQuery = (text: string | undefined): boolean => {
      if (!text) return false;
      const lowerText = text.toLowerCase();
      
      // Прямое совпадение
      if (lowerText.includes(lowerQuery)) return true;
      
      // Проверка синонимов
      for (const synonym of synonyms) {
        if (lowerText.includes(synonym)) return true;
      }
      
      return false;
    };
    
    // Также ищем категории по синонимам и добавляем их товары
    const matchingCategoryIds: Set<string> = new Set();
    
    for (const category of state.categories) {
      if (matchesQuery(category.name)) {
        matchingCategoryIds.add(category.id);
        // Добавляем все дочерние категории
        const addChildren = (parentId: string) => {
          state.categories
            .filter(c => c.parentId === parentId)
            .forEach(child => {
              matchingCategoryIds.add(child.id);
              addChildren(child.id);
            });
        };
        addChildren(category.id);
      }
    }
    
    return state.products
      .filter(p => 
        matchesQuery(p.name) ||
        matchesQuery(p.vendorCode) ||
        matchesQuery(p.description) ||
        (p.categoryId && matchingCategoryIds.has(p.categoryId))
      )
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  return {
    ...state,
    refetch,
    getRootCategories,
    getSubcategories,
    getProductsByCategory,
    getAllProductsByCategory,
    getProductsCount,
    getCategoryImage,
    searchProducts
  };
}
