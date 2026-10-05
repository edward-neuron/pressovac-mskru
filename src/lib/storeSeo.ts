// SEO-данные магазина: считаются синхронно из storeFallback.json,
// чтобы работать и в браузере, и при пререндере (без загрузки данных).
import fallback from '@/data/storeFallback.json';

const SITE = 'https://pressovac-msk.ru';

type FbProduct = { id: string; name: string; price: number; category_id: string; picture?: string; vendor_code?: string; available?: boolean; description?: string };
type FbCategory = { id: string; name: string; parent_id: string | null };

const products = (fallback as any).products as FbProduct[];
const categories = (fallback as any).categories as FbCategory[];

// ЧПУ-адреса (тестовое внедрение: 2 раздела, 2 товара)
// Разделы: /store/{slug}; товары: /store/product/{модель}-{артикул}
export const CATEGORY_SLUGS: Record<string, string> = { '86975775': 'dry-cleaning', '86975750': 'kits' };
export const PRODUCT_SLUGS: Record<string, string> = { '198978976': 'product/p40-201-001-102', '198978986': 'product/e-20-201-002-003' };
// Старые короткие тестовые адреса -> новые (301)
export const LEGACY_SLUG_REDIRECTS: Record<string, string> = { 'p40': '/store/product/p40-201-001-102', 'e-20': '/store/product/e-20-201-002-003' };
export const resolveStoreSlug = (slug?: string): { productId?: string; categoryId?: string } => {
  if (!slug) return {};
  const c = Object.keys(CATEGORY_SLUGS).find((k) => CATEGORY_SLUGS[k] === slug);
  if (c) return { categoryId: c };
  const pr = Object.keys(PRODUCT_SLUGS).find((k) => PRODUCT_SLUGS[k] === slug || PRODUCT_SLUGS[k] === `product/${slug}`);
  return pr ? { productId: pr } : {};
};
export const storeProductPath = (id: string) => PRODUCT_SLUGS[id] ? `/store/${PRODUCT_SLUGS[id]}` : `/store/product/${id}`;
export const storeCategoryPath = (id: string) => CATEGORY_SLUGS[id] ? `/store/${CATEGORY_SLUGS[id]}` : `/store/category/${id}`;

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

export interface StoreSeo {
  title: string;
  description: string;
  canonical: string;
  ogType: 'website' | 'product';
  ogImage?: string;
  structuredData?: object;
}

export const ROOT_SEO: StoreSeo = {
  title: 'Магазин оборудования Pressovac | Купить оборудование для очистки вентиляции',
  description: 'Купить профессиональное оборудование Pressovac для очистки вентиляции. Вакуумные установки, щёточные машины, видеоинспекция. Доставка по России.',
  canonical: '/store',
  ogType: 'website',
};

export function getStoreSeo(productId?: string | null, categoryId?: string | null, live?: { name?: string; price?: number; article?: string; image?: string; inStock?: boolean }): StoreSeo {
  if (productId) {
    const p = products.find((x) => x.id === productId);
    const name = clean(live?.name ?? p?.name ?? '');
    if (name) {
      const sku = live?.article ?? p?.vendor_code;
      const price = live?.price ?? p?.price;
      const inStock = live?.inStock ?? p?.available ?? true;
      const image = live?.image ?? p?.picture;
      const canonical = storeProductPath(productId);
      return {
        title: `${name}${sku ? `, арт. ${sku}` : ''} — купить | Pressovac`,
        description: `${name}${sku ? ` (арт. ${sku})` : ''} — купить у официального дистрибьютора Pressovac в Москве.${price ? ` Цена ${Math.round(price).toLocaleString('ru-RU')} ₽.` : ''} Доставка по России.`,
        canonical,
        ogType: 'product',
        ogImage: image,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name,
          ...(sku ? { sku, mpn: sku } : {}),
          ...(image ? { image: image.startsWith('http') ? image : `${SITE}${image}` } : {}),
          brand: { '@type': 'Brand', name: 'Pressovac' },
          offers: {
            '@type': 'Offer',
            url: `${SITE}${canonical}`,
            priceCurrency: 'RUB',
            ...(price ? { price: Number(price).toFixed(2) } : {}),
            availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
            seller: { '@type': 'Organization', name: 'Pressovac Moscow' },
          },
        },
      };
    }
  }
  if (categoryId) {
    const c = categories.find((x) => x.id === categoryId);
    if (c) {
      const name = clean(c.name);
      return {
        title: `${name} — купить | Pressovac`,
        description: `${name}: купить оборудование Pressovac у официального дистрибьютора в Москве. Цены, наличие, доставка по России.`,
        canonical: storeCategoryPath(categoryId),
        ogType: 'website',
      };
    }
  }
  return ROOT_SEO;
}

export const allStoreProductIds = () => products.map((p) => p.id);
export const allStoreCategoryIds = () => categories.map((c) => c.id);
