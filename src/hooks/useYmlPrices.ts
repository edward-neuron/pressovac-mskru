import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface YmlProduct {
  id: string;
  name: string;
  price: string;
  url: string;
  vendorCode?: string; // Заводской артикул (201.002.003)
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

  // Helper function to find price by vendorCode (factory article) or URL
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
    
    // Then try to match by vendorCode (factory article like 201.002.003)
    if (article) {
      const productByVendorCode = state.products.find(p => p.vendorCode === article);
      if (productByVendorCode) {
        return productByVendorCode.price;
      }
    }
    
    return null;
  };

  // Helper to find shop URL by vendorCode
  const findShopUrl = (productName?: string, article?: string): string | null => {
    // Try by vendorCode (factory article)
    if (article) {
      const product = state.products.find(p => p.vendorCode === article);
      if (product) {
        return product.url;
      }
    }
    
    return null;
  };

  // Helper to find minimum price by vendorCode pattern (e.g., "205.001" matches "205.001.002", "205.001.003", etc.)
  const findMinPriceByPattern = (vendorCodePattern: string): string | null => {
    const matchingProducts = state.products.filter(p => 
      p.vendorCode && p.vendorCode.startsWith(vendorCodePattern)
    );
    
    if (matchingProducts.length === 0) return null;
    
    // Parse prices and find minimum
    const prices = matchingProducts.map(p => {
      // Extract numeric value from price string like "32 600 ₽"
      const numericPrice = parseInt(p.price.replace(/\s/g, '').replace(/[^\d]/g, ''), 10);
      return { price: p.price, numericPrice };
    }).filter(p => !isNaN(p.numericPrice));
    
    if (prices.length === 0) return null;
    
    const minPrice = prices.reduce((min, p) => 
      p.numericPrice < min.numericPrice ? p : min
    );
    
    return minPrice.price;
  };

  return {
    ...state,
    findPrice,
    findShopUrl,
    findMinPriceByPattern
  };
}
