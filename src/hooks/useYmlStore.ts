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

  useEffect(() => {
    if (cachedData) {
      return;
    }

    const fetchData = async () => {
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
