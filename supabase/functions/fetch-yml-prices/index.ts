import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const YML_BASE_URL = "https://shop-pressovac.ru/yml-export/02513391f110e59858a2403c4b3bed42/";

function buildYmlUrl(): string {
  const url = new URL(YML_BASE_URL);
  url.searchParams.set("full", "1");
  url.searchParams.set("_", Date.now().toString());
  return url.toString();
}

interface YmlProduct {
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

interface YmlCategory {
  id: string;
  name: string;
  parentId?: string;
  sortOrder: number;
}

function parseYmlCategories(xmlText: string): YmlCategory[] {
  const categories: YmlCategory[] = [];
  
  // Parse categories section
  const categoriesMatch = xmlText.match(/<categories>([\s\S]*?)<\/categories>/i);
  if (!categoriesMatch) return categories;
  
  const categoriesContent = categoriesMatch[1];
  
  // Use a simpler approach - find all category tags sequentially
  const allCategoryMatches = categoriesContent.matchAll(/<category\s+id="(\d+)"(?:\s+parentid="(\d+)")?[^>]*>([^<]*)<\/category>/gi);
  
  let sortOrder = 0;
  for (const match of allCategoryMatches) {
    const id = match[1];
    const parentId = match[2] || undefined;
    const name = match[3].trim();
    
    // Skip root category (id="0")
    if (id === "0") continue;
    
    categories.push({
      id,
      name,
      parentId,
      sortOrder: sortOrder++
    });
  }
  
  return categories;
}

function parseYmlProducts(xmlText: string): YmlProduct[] {
  const products: YmlProduct[] = [];
  // Ключ для отслеживания дубликатов: vendorCode + categoryId
  // Это удаляет дубли ВНУТРИ одной категории, но сохраняет товар в разных категориях
  const seenProductsInCategory = new Set<string>();
  
  // Parse offers section
  const offersMatch = xmlText.match(/<offers>([\s\S]*?)<\/offers>/i);
  if (!offersMatch) return products;
  
  const offersContent = offersMatch[1];
  
  // Match offers sequentially to preserve order
  const allOfferMatches = offersContent.matchAll(/<offer\s+id="(\d+)"[^>]*available="true"[^>]*>([\s\S]*?)<\/offer>/gi);
  
  let sortOrder = 0;
  for (const match of allOfferMatches) {
    const offerId = match[1];
    const offerContent = match[2];
    
    // Extract price
    const priceMatch = offerContent.match(/<price>(\d+(?:\.\d+)?)<\/price>/i);
    const priceNum = priceMatch ? parseFloat(priceMatch[1]) : 0;
    
    // Extract name
    const nameMatch = offerContent.match(/<name><!\[CDATA\[(.*?)\]\]><\/name>/i) || 
                      offerContent.match(/<name>([^<]*)<\/name>/i);
    const name = nameMatch ? nameMatch[1] : null;
    
    // Extract URL
    const urlMatch = offerContent.match(/<url>([^<]*)<\/url>/i);
    const url = urlMatch ? urlMatch[1] : null;
    
    // Extract vendorCode
    const vendorCodeMatch = offerContent.match(/<vendorCode><!\[CDATA\[(.*?)\]\]><\/vendorCode>/i) ||
                            offerContent.match(/<vendorCode>([^<]*)<\/vendorCode>/i);
    const vendorCode = vendorCodeMatch ? vendorCodeMatch[1].trim() : undefined;
    
    // Extract description
    const descriptionMatch = offerContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) ||
                             offerContent.match(/<description>([^<]*)<\/description>/i);
    const description = descriptionMatch ? descriptionMatch[1].trim() : undefined;
    
    // Extract first picture only
    const pictureMatch = offerContent.match(/<picture>([^<]*)<\/picture>/i);
    const picture = pictureMatch ? pictureMatch[1] : undefined;
    
    // Extract categoryId
    const categoryIdMatch = offerContent.match(/<categoryid>(\d+)<\/categoryid>/i);
    const categoryId = categoryIdMatch ? categoryIdMatch[1] : undefined;
    
    // Удаляем дубликаты ТОЛЬКО внутри одной категории (vendorCode + categoryId)
    // Товар с одинаковым артикулом в РАЗНЫХ категориях сохраняется
    const uniqueKey = vendorCode && categoryId ? `${vendorCode}_${categoryId}` : null;
    if (uniqueKey && seenProductsInCategory.has(uniqueKey)) {
      console.log(`Skipping duplicate: ${vendorCode} in category ${categoryId}`);
      continue;
    }
    if (uniqueKey) {
      seenProductsInCategory.add(uniqueKey);
    }
    
    if (priceNum > 0 && name && url) {
      // Log products for debugging description formatting
      if (name.includes('EDW') || name.includes('PDW') || name.includes('Универсальный')) {
        console.log(`[DEBUG] Product: ${name}`);
        console.log(`[DEBUG] Description FULL: ${description}`);
      }
      
      products.push({
        id: offerId,
        name: name.trim(),
        description,
        price: formatPrice(priceNum),
        priceNum,
        url,
        vendorCode,
        picture,
        categoryId,
        sortOrder: sortOrder++
      });
    }
  }
  
  return products;
}

function formatPrice(priceFromYml: number): string {
  const finalPrice = Math.round(priceFromYml);
  return (
    new Intl.NumberFormat('ru-RU', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(finalPrice) + ' ₽'
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ymlUrl = buildYmlUrl();
    console.log("Fetching YML from:", ymlUrl);
    
    const response = await fetch(ymlUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Pressovac/1.0)',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch YML: ${response.status}`);
    }
    
    const xmlText = await response.text();
    console.log("YML fetched, length:", xmlText.length);
    
    const categories = parseYmlCategories(xmlText);
    const products = parseYmlProducts(xmlText);
    
    console.log("Parsed categories:", categories.length);
    console.log("Parsed products:", products.length);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        categories,
        products,
        fetchedAt: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error:", errorMessage);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
