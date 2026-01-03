import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const LOCAL_STORAGE_KEY = 'yml-store-sort-order';
const DB_SCOPE = 'default';

interface SortOrderData {
  categories: Record<string, number>;
  products: Record<string, number>;
}

// Load from localStorage as fallback/initial data
const getStoredOrder = (): SortOrderData => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading sort order from localStorage:', e);
  }
  return { categories: {}, products: {} };
};

// Save to localStorage (for offline/backup)
const saveToLocalStorage = (data: SortOrderData) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving sort order to localStorage:', e);
  }
};

export function useSortOrder() {
  const [sortOrder, setSortOrder] = useState<SortOrderData>(getStoredOrder);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load from database on mount
  useEffect(() => {
    const loadFromDatabase = async () => {
      try {
        const { data, error } = await supabase
          .from('store_sort_order')
          .select('categories, products')
          .eq('scope', DB_SCOPE)
          .maybeSingle();

        if (error) {
          console.error('Error loading sort order from database:', error);
          return;
        }

        if (data) {
          const dbData: SortOrderData = {
            categories: (data.categories as Record<string, number>) || {},
            products: (data.products as Record<string, number>) || {}
          };
          setSortOrder(dbData);
          saveToLocalStorage(dbData); // Sync to localStorage
          console.log('Sort order loaded from database');
        } else {
          // No data in DB, use localStorage and save to DB
          const localData = getStoredOrder();
          if (Object.keys(localData.categories).length > 0 || Object.keys(localData.products).length > 0) {
            console.log('Migrating localStorage sort order to database...');
            await saveToDatabase(localData);
          }
        }
      } catch (e) {
        console.error('Error loading sort order:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadFromDatabase();
  }, []);

  // Save to database via edge function
  const saveToDatabase = async (data: SortOrderData) => {
    setIsSaving(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('update-sort-order', {
        body: {
          scope: DB_SCOPE,
          categories: data.categories,
          products: data.products
        }
      });

      if (error) {
        console.error('Error saving sort order to database:', error);
      } else {
        console.log('Sort order saved to database');
      }
    } catch (e) {
      console.error('Error saving sort order:', e);
    } finally {
      setIsSaving(false);
    }
  };

  // Persist changes to both localStorage and database
  useEffect(() => {
    if (!isLoading) {
      saveToLocalStorage(sortOrder);
      saveToDatabase(sortOrder);
    }
  }, [sortOrder, isLoading]);

  const reorderCategories = useCallback((categoryIds: string[]) => {
    setSortOrder(prev => {
      const newCategoryOrder = { ...prev.categories };
      categoryIds.forEach((id, index) => {
        newCategoryOrder[id] = index;
      });
      return { ...prev, categories: newCategoryOrder };
    });
  }, []);

  const reorderProducts = useCallback((productIds: string[]) => {
    setSortOrder(prev => {
      const newProductOrder = { ...prev.products };
      productIds.forEach((id, index) => {
        newProductOrder[id] = index;
      });
      return { ...prev, products: newProductOrder };
    });
  }, []);

  const getCategorySortOrder = useCallback((categoryId: string, defaultOrder: number): number => {
    return sortOrder.categories[categoryId] ?? defaultOrder;
  }, [sortOrder.categories]);

  const getProductSortOrder = useCallback((productId: string, defaultOrder: number): number => {
    return sortOrder.products[productId] ?? defaultOrder;
  }, [sortOrder.products]);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, []);

  const resetOrder = useCallback(() => {
    setSortOrder({ categories: {}, products: {} });
  }, []);

  // Export current order to console for backup
  const exportOrder = useCallback(() => {
    console.log('Current sort order:', JSON.stringify(sortOrder, null, 2));
    return sortOrder;
  }, [sortOrder]);

  // Import order from object
  const importOrder = useCallback((data: SortOrderData) => {
    setSortOrder(data);
  }, []);

  return {
    isEditMode,
    isLoading,
    isSaving,
    toggleEditMode,
    getCategorySortOrder,
    getProductSortOrder,
    reorderCategories,
    reorderProducts,
    resetOrder,
    exportOrder,
    importOrder
  };
}
