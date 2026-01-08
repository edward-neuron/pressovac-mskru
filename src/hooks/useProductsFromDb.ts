import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DbProduct {
  id: string;
  name: string;
  price: number;
  currency_id: string;
  category_id: string;
  picture?: string;
  vendor_code?: string;
  description?: string;
  available: boolean;
}

export interface DbCategory {
  id: string;
  name: string;
  parent_id?: string;
}

interface ProductsDbState {
  products: DbProduct[];
  categories: DbCategory[];
  isLoading: boolean;
  error: string | null;
}

// In-memory cache
let cachedData: { products: DbProduct[]; categories: DbCategory[]; fetchedAt: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useProductsFromDb() {
  const [state, setState] = useState<ProductsDbState>(() => {
    if (cachedData && Date.now() - cachedData.fetchedAt < CACHE_TTL) {
      return {
        products: cachedData.products,
        categories: cachedData.categories,
        isLoading: false,
        error: null
      };
    }
    return {
      products: [],
      categories: [],
      isLoading: true,
      error: null
    };
  });

  useEffect(() => {
    if (cachedData && Date.now() - cachedData.fetchedAt < CACHE_TTL) {
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch categories and products in parallel
        const [categoriesRes, productsRes] = await Promise.all([
          supabase.from('product_categories').select('*').order('name'),
          supabase.from('products').select('*').eq('available', true).order('name')
        ]);

        if (categoriesRes.error) throw categoriesRes.error;
        if (productsRes.error) throw productsRes.error;

        const categories = (categoriesRes.data || []) as DbCategory[];
        const products = (productsRes.data || []) as DbProduct[];

        cachedData = {
          products,
          categories,
          fetchedAt: Date.now()
        };

        setState({
          products,
          categories,
          isLoading: false,
          error: null
        });
      } catch (err) {
        console.error('Error fetching products from DB:', err);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load products'
        }));
      }
    };

    fetchData();
  }, []);

  // Helper functions
  const getRootCategories = useCallback((): DbCategory[] => {
    return state.categories.filter(c => !c.parent_id);
  }, [state.categories]);

  const getSubcategories = useCallback((parentId: string): DbCategory[] => {
    return state.categories.filter(c => c.parent_id === parentId);
  }, [state.categories]);

  const getProductsByCategory = useCallback((categoryId: string): DbProduct[] => {
    return state.products.filter(p => p.category_id === categoryId);
  }, [state.products]);

  const getAllProductsByCategory = useCallback((categoryId: string): DbProduct[] => {
    // Get products in this category and all subcategories
    const getAllCategoryIds = (catId: string): string[] => {
      const ids = [catId];
      const subs = state.categories.filter(c => c.parent_id === catId);
      for (const sub of subs) {
        ids.push(...getAllCategoryIds(sub.id));
      }
      return ids;
    };

    const allCategoryIds = getAllCategoryIds(categoryId);
    return state.products.filter(p => allCategoryIds.includes(p.category_id));
  }, [state.products, state.categories]);

  const getProductsCount = useCallback((categoryId: string): number => {
    return getAllProductsByCategory(categoryId).length;
  }, [getAllProductsByCategory]);

  const getCategoryImage = useCallback((categoryId: string): string | undefined => {
    const products = getAllProductsByCategory(categoryId);
    return products.find(p => p.picture)?.picture;
  }, [getAllProductsByCategory]);

  const searchProducts = useCallback((query: string): DbProduct[] => {
    const lowerQuery = query.toLowerCase();
    return state.products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.vendor_code?.toLowerCase().includes(lowerQuery)
    );
  }, [state.products]);

  const formatPrice = useCallback((price: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }, []);

  return {
    ...state,
    getRootCategories,
    getSubcategories,
    getProductsByCategory,
    getAllProductsByCategory,
    getProductsCount,
    getCategoryImage,
    searchProducts,
    formatPrice
  };
}
