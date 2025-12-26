import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface YmlProduct {
  id: string;
  name: string;
  price: string;
  url: string;
  picture?: string;
}

interface YmlPricesState {
  products: YmlProduct[];
  isLoading: boolean;
  error: string | null;
  fetchedAt: string | null;
}

// Cache for YML prices to avoid refetching on every render
let cachedData: { products: YmlProduct[]; fetchedAt: string } | null = null;

export function useYmlPrices() {
  const [state, setState] = useState<YmlPricesState>({
    products: cachedData?.products || [],
    isLoading: !cachedData,
    error: null,
    fetchedAt: cachedData?.fetchedAt || null
  });

  useEffect(() => {
    // If we have cached data, don't refetch
    if (cachedData) {
      return;
    }

    const fetchPrices = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-yml-prices');
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data.success) {
          cachedData = { 
            products: data.products, 
            fetchedAt: data.fetchedAt 
          };
          setState({
            products: data.products,
            isLoading: false,
            error: null,
            fetchedAt: data.fetchedAt
          });
        } else {
          throw new Error(data.error || 'Failed to fetch prices');
        }
      } catch (err) {
        console.error('Error fetching YML prices:', err);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }));
      }
    };

    fetchPrices();
  }, []);

  // Extract model code from YML product name (E20, P25, PDW40, E25-L, etc.)
  const extractModelCode = (name: string): string | null => {
    // Match patterns like E-20, E20, P-25, P25, PDW-40, EDW-15, CS-8, E-25L, etc.
    const match = name.match(/\b([A-Z]{1,3}-?\d+[A-Z]?)\b/i);
    if (match) {
      // Normalize: remove dashes and uppercase
      return match[1].replace(/-/g, '').toUpperCase();
    }
    return null;
  };

  // Normalize article code (remove dashes, uppercase)
  const normalizeArticle = (article: string): string => {
    return article.replace(/-/g, '').toUpperCase();
  };

  // Helper function to find price by article or URL
  const findPrice = (shopUrl?: string, productName?: string, article?: string): string | null => {
    // First try to match by URL (most reliable)
    if (shopUrl && shopUrl !== '#') {
      const normalizedShopUrl = shopUrl.replace(/\/$/, '').toLowerCase();
      const productByUrl = state.products.find(p => {
        const normalizedProductUrl = p.url.replace(/\/$/, '').toLowerCase();
        return normalizedShopUrl === normalizedProductUrl;
      });
      if (productByUrl) {
        return productByUrl.price;
      }
    }
    
    // Then try to match by article code (E20, P25, PDW40, etc.)
    if (article) {
      const normalizedArticle = normalizeArticle(article);
      const productByArticle = state.products.find(p => {
        const ymlModelCode = extractModelCode(p.name);
        return ymlModelCode === normalizedArticle;
      });
      if (productByArticle) {
        return productByArticle.price;
      }
    }
    
    // Fallback: try to extract from product name
    if (productName) {
      const ourModelCode = extractModelCode(productName);
      if (ourModelCode) {
        const productByModel = state.products.find(p => {
          const ymlModelCode = extractModelCode(p.name);
          return ymlModelCode === ourModelCode;
        });
        if (productByModel) {
          return productByModel.price;
        }
      }
    }
    
    return null;
  };

  // Helper to find shop URL by article
  const findShopUrl = (productName?: string, article?: string): string | null => {
    // First try by article
    if (article) {
      const normalizedArticle = normalizeArticle(article);
      const product = state.products.find(p => {
        const ymlModelCode = extractModelCode(p.name);
        return ymlModelCode === normalizedArticle;
      });
      if (product) {
        return product.url;
      }
    }
    
    // Fallback: try to extract from product name
    if (productName) {
      const ourModelCode = extractModelCode(productName);
      if (ourModelCode) {
        const product = state.products.find(p => {
          const ymlModelCode = extractModelCode(p.name);
          return ymlModelCode === ourModelCode;
        });
        if (product) {
          return product.url;
        }
      }
    }
    
    return null;
  };

  return {
    ...state,
    findPrice,
    findShopUrl
  };
}
