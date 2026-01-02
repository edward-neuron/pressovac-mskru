import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'yml-store-sort-order';

interface SortOrderData {
  categories: Record<string, number>;
  products: Record<string, number>;
}

const getStoredOrder = (): SortOrderData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading sort order:', e);
  }
  return { categories: {}, products: {} };
};

const saveOrder = (data: SortOrderData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving sort order:', e);
  }
};

export function useSortOrder() {
  const [sortOrder, setSortOrder] = useState<SortOrderData>(getStoredOrder);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    saveOrder(sortOrder);
  }, [sortOrder]);

  const updateCategoryOrder = useCallback((categoryId: string, newOrder: number) => {
    setSortOrder(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryId]: newOrder
      }
    }));
  }, []);

  const updateProductOrder = useCallback((productId: string, newOrder: number) => {
    setSortOrder(prev => ({
      ...prev,
      products: {
        ...prev.products,
        [productId]: newOrder
      }
    }));
  }, []);

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

  return {
    isEditMode,
    toggleEditMode,
    getCategorySortOrder,
    getProductSortOrder,
    reorderCategories,
    reorderProducts,
    resetOrder
  };
}
