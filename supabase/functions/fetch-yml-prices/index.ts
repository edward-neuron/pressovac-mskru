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
  const categoriesMatch = xmlText.match(/<categories>([\s\S]*?)<\/categories>/);
  if (!categoriesMatch) return categories;
  
  const categoriesContent = categoriesMatch[1];
  const categoryRegex = /<category\s+id="(\d+)"(?:\s+parentId="(\d+)")?[^>]*>(.*?)<\/category>/gi;
  let match;
  let sortOrder = 0;
  
  while ((match = categoryRegex.exec(categoriesContent)) !== null) {
    const id = match[1];
    const parentId = match[2] || undefined;
    const name = match[3].trim();
    
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
  
  // Parse offers section
  const offersMatch = xmlText.match(/<offers>([\s\S]*?)<\/offers>/);
  if (!offersMatch) return products;
  
  const offersContent = offersMatch[1];
  const offerRegex = /<offer\s+id="(\d+)"[^>]*available="true"[^>]*>([\s\S]*?)<\/offer>/gi;
  let match;
  let sortOrder = 0;
  
  while ((match = offerRegex.exec(offersContent)) !== null) {
    const offerId = match[1];
    const offerContent = match[2];
    
    // Extract price
    const priceMatch = offerContent.match(/<price>(\d+(?:\.\d+)?)<\/price>/);
    const priceNum = priceMatch ? parseFloat(priceMatch[1]) : 0;
    
    // Extract name
    const nameMatch = offerContent.match(/<name><!\[CDATA\[(.*?)\]\]><\/name>/) || 
                      offerContent.match(/<name>(.*?)<\/name>/);
    const name = nameMatch ? nameMatch[1] : null;
    
    // Extract URL
    const urlMatch = offerContent.match(/<url>(.*?)<\/url>/);
    const url = urlMatch ? urlMatch[1] : null;
    
    // Extract vendorCode
    const vendorCodeMatch = offerContent.match(/<vendorCode><!\[CDATA\[(.*?)\]\]><\/vendorCode>/) ||
                            offerContent.match(/<vendorCode>(.*?)<\/vendorCode>/);
    const vendorCode = vendorCodeMatch ? vendorCodeMatch[1].trim() : undefined;
    
    // Extract picture
    const pictureMatch = offerContent.match(/<picture>(.*?)<\/picture>/);
    const picture = pictureMatch ? pictureMatch[1] : undefined;
    
    // Extract categoryId
    const categoryIdMatch = offerContent.match(/<categoryId>(\d+)<\/categoryId>/);
    const categoryId = categoryIdMatch ? categoryIdMatch[1] : undefined;
    
    if (priceNum > 0 && name && url) {
      products.push({
        id: offerId,
        name: name.trim(),
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
