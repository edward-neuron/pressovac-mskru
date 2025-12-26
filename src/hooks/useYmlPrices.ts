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

  // Helper function to find price by product URL or name
  const findPrice = (shopUrl?: string, productName?: string): string | null => {
    if (!shopUrl && !productName) return null;
    
    const product = state.products.find(p => {
      // Match by URL
      if (shopUrl && shopUrl !== '#') {
        // Normalize URLs for comparison
        const normalizedShopUrl = shopUrl.replace(/\/$/, '').toLowerCase();
        const normalizedProductUrl = p.url.replace(/\/$/, '').toLowerCase();
        if (normalizedShopUrl === normalizedProductUrl) {
          return true;
        }
      }
      // Match by name (fuzzy match)
      if (productName) {
        const normalizedName = productName.toLowerCase();
        const normalizedProductName = p.name.toLowerCase();
        if (normalizedProductName.includes(normalizedName) || 
            normalizedName.includes(normalizedProductName)) {
          return true;
        }
      }
      return false;
    });
    
    return product?.price || null;
  };

  return {
    ...state,
    findPrice
  };
}
