import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const STORE_CACHE_KEY = 'pressovac-store-cache-v2';

interface CachedStoreData {
  categories: YmlCategory[];
  products: YmlProduct[];
  fetchedAt: string;
}

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
let cachedData: CachedStoreData | null = null;
const productDescriptionCache = new Map<string, string | undefined>();

function readPersistentCache(): CachedStoreData | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORE_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CachedStoreData;
    if (!Array.isArray(parsed.categories) || !Array.isArray(parsed.products) || !parsed.fetchedAt) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writePersistentCache(data: CachedStoreData) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORE_CACHE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage quota / private mode errors
  }
}

async function withRetry<T>(operation: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => window.setTimeout(resolve, attempt * 400));
      }
    }
  }

  throw lastError;
}

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
  const initialCache = cachedData || readPersistentCache();

  if (!cachedData && initialCache) {
    cachedData = initialCache;
  }

  const [state, setState] = useState<YmlStoreState>({
    categories: initialCache?.categories || [],
    products: initialCache?.products || [],
    isLoading: !initialCache,
    error: null,
    fetchedAt: initialCache?.fetchedAt || null
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (cachedData && refreshTrigger === 0) {
      return;
    }

    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        const [categoriesRes, productsRes] = await withRetry(() => Promise.all([
          supabase.from('product_categories').select('*').order('id'),
          supabase
            .from('products')
            .select('id, name, price, category_id, picture, vendor_code')
            .eq('available', true)
            .order('id')
        ]));

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
          description: productDescriptionCache.get(p.id),
          price: formatPrice(Number(p.price)),
          priceNum: Number(p.price),
          url: `/store?search=${encodeURIComponent(p.name)}`, // Internal store URL
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

        writePersistentCache(cachedData);

        setState({
          categories,
          products,
          isLoading: false,
          error: null,
          fetchedAt: cachedData.fetchedAt
        });
      } catch (err) {
        console.error('Error fetching store data:', err);
        const fallbackCache = cachedData || readPersistentCache();

        if (fallbackCache) {
          setState({
            categories: fallbackCache.categories,
            products: fallbackCache.products,
            isLoading: false,
            error: null,
            fetchedAt: fallbackCache.fetchedAt
          });
          return;
        }

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

  const loadProductDetails = async (product: YmlProduct): Promise<YmlProduct> => {
    if (product.description !== undefined) return product;

    try {
      const { data, error } = await withRetry(async () => {
        return await supabase
          .from('products')
          .select('description')
          .eq('id', product.id)
          .maybeSingle();
      });

      if (error) throw error;

      const description = data?.description || undefined;
      productDescriptionCache.set(product.id, description);

      const nextProduct = {
        ...product,
        description,
      };

      setState(prev => ({
        ...prev,
        products: prev.products.map((item) => item.id === product.id ? nextProduct : item),
      }));

      if (cachedData) {
        cachedData = {
          ...cachedData,
          products: cachedData.products.map((item) => item.id === product.id ? nextProduct : item),
        };
        writePersistentCache(cachedData);
      }

      return nextProduct;
    } catch {
      return product;
    }
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

  // Специальные запросы, которые должны искать только по определённым категориям
  // Формат: ключ запроса -> массив ID категорий
  const specialCategoryQueries: Record<string, string[]> = {
    // Щёточные машины - только машины и валы, без аксессуаров и комплектов
    'щеточн': [
      '86975775', // Машины для сухой очистки и дезинфекции
      '86975795', // Машины для мойки и удаления жира
      '88504908', // Машины с маркировкой взрывозащиты ATEX
      '88504918', // Гибкие вращающиеся валы Pressovac (корневая)
      '88504923', // Гибкие валы Мини
      '88504928', // Гибкие валы Стандарт
      '88504933', // Гибкие валы Сталь
    ],
    'щёточн': [
      '86975775',
      '86975795', 
      '88504908',
      '88504918',
      '88504923',
      '88504928',
      '88504933',
    ],
    'brushing': [
      '86975775',
      '86975795', 
      '88504908',
      '88504918',
      '88504923',
      '88504928',
      '88504933',
    ],
    // Вакуумные установки - только SU и SFU серии, без щёточных машин, комплектов и аксессуаров
    'вакуум': [
      '88504978', // Вакуумные Всасывающие установки SU series
      '86975885', // Фильтро-Вакуумные Установки SFU series
    ],
    'пылеулавлив': [
      '88504978', // Вакуумные Всасывающие установки SU series
      '86975885', // Фильтро-Вакуумные Установки SFU series
    ],
    'пылесос': [
      '88504978', // Вакуумные Всасывающие установки SU series
      '86975885', // Фильтро-Вакуумные Установки SFU series
    ],
    'всасыва': [
      '88504978', // Вакуумные Всасывающие установки SU series
      '86975885', // Фильтро-Вакуумные Установки SFU series
    ],
    'vacuum': [
      '88504978', // Вакуумные Всасывающие установки SU series
      '86975885', // Фильтро-Вакуумные Установки SFU series
    ],
  };

  // Словарь синонимов и альтернативных названий для контекстного поиска
  const synonymsMap: Record<string, string[]> = {
    // Жир и мойка
    'жир': ['мойк', 'жиро', 'grease', 'удалени', 'кухон', 'ресторан', 'pdw', 'edw'],
    'удаление жира': ['мойк', 'жир', 'grease', 'кухон', 'pdw', 'edw'],
    'мойка': ['жир', 'grease', 'удалени', 'pdw', 'edw'],
    'grease': ['жир', 'мойк', 'удалени', 'pdw', 'edw'],
    
    // Пылеулавливание = Вакуумные установки
    'пыл': ['вакуум', 'всасыва', 'sfu', 'su-', 'фильтр', 'hepa'],
    'пылеулавлива': ['вакуум', 'всасыва', 'sfu', 'su-', 'фильтр', 'hepa'],
    'пылесос': ['вакуум', 'всасыва', 'sfu', 'su-'],
    'улавлива': ['вакуум', 'фильтр', 'hepa', 'sfu'],
    
    // Вакуум
    'вакуум': ['всасыва', 'su-', 'sfu', 'пыл', 'фильтр'],
    'всасыва': ['вакуум', 'su-', 'sfu'],
    
    // Щётки (аксессуары - отдельно от "щёточная машина")
    'щетк': ['brush', 'щётк'],
    'щётк': ['brush', 'щетк'],
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
    'аксессуар': ['принадлежност'],
    
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

  // Проверка на специальный категорийный запрос
  const getSpecialCategoryIds = (query: string): string[] | null => {
    const lowerQuery = query.toLowerCase();
    for (const [key, categoryIds] of Object.entries(specialCategoryQueries)) {
      if (lowerQuery.includes(key)) {
        return categoryIds;
      }
    }
    return null;
  };

  // Search products by name, vendorCode, description, or synonyms
  const searchProducts = (query: string) => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return [];
    
    // Проверяем, есть ли специальный запрос по категориям
    const specialCategoryIds = getSpecialCategoryIds(lowerQuery);
    
    if (specialCategoryIds) {
      // Для специальных запросов возвращаем только товары из указанных категорий
      // БЕЗ аксессуаров (исключаем подкатегории с "Аксессуары")
      return state.products
        .filter(p => {
          if (!p.categoryId) return false;
          // Проверяем, что категория в списке разрешённых
          if (!specialCategoryIds.includes(p.categoryId)) return false;
          // Дополнительно проверяем название категории - исключаем аксессуары
          const category = state.categories.find(c => c.id === p.categoryId);
          if (category && category.name.toLowerCase().includes('аксессуар')) return false;
          return true;
        })
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }
    
    // Стандартный поиск с синонимами
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
    loadProductDetails,
    getRootCategories,
    getSubcategories,
    getProductsByCategory,
    getAllProductsByCategory,
    getProductsCount,
    getCategoryImage,
    searchProducts
  };
}
