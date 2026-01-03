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

// Cache for YML data
let cachedData: { 
  categories: YmlCategory[]; 
  products: YmlProduct[]; 
  fetchedAt: string 
} | null = null;

export function useYmlStore() {
  const [state, setState] = useState<YmlStoreState>({
    categories: cachedData?.categories || [],
    products: cachedData?.products || [],
    isLoading: !cachedData,
    error: null,
    fetchedAt: cachedData?.fetchedAt || null
  });

  useEffect(() => {
    if (cachedData) {
      return;
    }

    const fetchData = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-yml-prices');
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data.success) {
          cachedData = { 
            categories: data.categories || [], 
            products: data.products || [],
            fetchedAt: data.fetchedAt 
          };
          setState({
            categories: data.categories || [],
            products: data.products || [],
            isLoading: false,
            error: null,
            fetchedAt: data.fetchedAt
          });
        } else {
          throw new Error(data.error || 'Failed to fetch YML data');
        }
      } catch (err) {
        console.error('Error fetching YML data:', err);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }));
      }
    };

    fetchData();
  }, []);

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

  // Search products by name or vendorCode
  const searchProducts = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return state.products
      .filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.vendorCode?.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  return {
    ...state,
    getRootCategories,
    getSubcategories,
    getProductsByCategory,
    getAllProductsByCategory,
    getProductsCount,
    getCategoryImage,
    searchProducts
  };
}
