// Конфигурация минимального заказа для определенных товаров
// Ключ - артикул или id товара, значение - минимальное количество

export interface MinOrderConfig {
  vendorCode?: string;
  productNameContains?: string;
  minQuantity: number;
  message: string;
}

export const MIN_ORDER_PRODUCTS: MinOrderConfig[] = [
  // Активная пена Agent X — мин. партия 5 канистр
  {
    // В базе/прайсе встречаются разные артикулы для этого товара
    vendorCode: 'RU8100222',
    productNameContains: 'Agent X',
    minQuantity: 5,
    message: 'Минимальный заказ 5 канистр',
  },
  {
    vendorCode: '440300',
    productNameContains: 'Agent X',
    minQuantity: 5,
    message: 'Минимальный заказ 5 канистр',
  },
];

/**
 * Проверяет минимальный заказ для товара
 */
export function getMinOrderConfig(productName: string, vendorCode?: string): MinOrderConfig | null {
  const name = (productName || '').toLowerCase();
  const code = (vendorCode || '').trim();

  return (
    MIN_ORDER_PRODUCTS.find((config) => {
      if (config.vendorCode && code && config.vendorCode === code) {
        return true;
      }
      if (config.productNameContains && name.includes(config.productNameContains.toLowerCase())) {
        return true;
      }
      return false;
    }) || null
  );
}

/**
 * Проверяет, удовлетворяет ли количество минимальному заказу
 */
export function validateMinOrder(quantity: number, productName: string, vendorCode?: string): { valid: boolean; minQty: number; message: string } | null {
  const config = getMinOrderConfig(productName, vendorCode);
  if (!config) return null;
  
  return {
    valid: quantity >= config.minQuantity,
    minQty: config.minQuantity,
    message: config.message
  };
}
