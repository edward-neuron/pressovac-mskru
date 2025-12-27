import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const YML_BASE_URL = "https://shop-pressovac.ru/yml-export/02513391f110e59858a2403c4b3bed42/";

function buildYmlUrl(): string {
  // Некоторые серверы/прокси могут кешировать YML.
  // Добавляем cache-buster, чтобы всегда получать самые свежие цены.
  const url = new URL(YML_BASE_URL);
  url.searchParams.set("full", "1");
  url.searchParams.set("_", Date.now().toString());
  return url.toString();
}

interface YmlProduct {
  id: string;
  name: string;
  price: string;
  url: string;
  vendorCode?: string; // Заводской артикул (Код: 201.002.003)
  picture?: string;
}

// Цены в YML уже указаны с НДС, берём их напрямую без модификаций

function parseYmlProducts(xmlText: string): YmlProduct[] {
  const products: YmlProduct[] = [];
  
  // Simple regex-based parsing for YML offers
  const offerRegex = /<offer\s+id="(\d+)"[^>]*available="true"[^>]*>([\s\S]*?)<\/offer>/gi;
  let match;
  
  while ((match = offerRegex.exec(xmlText)) !== null) {
    const offerId = match[1];
    const offerContent = match[2];
    
    // Extract price
    const priceMatch = offerContent.match(/<price>(\d+(?:\.\d+)?)<\/price>/);
    const price = priceMatch ? priceMatch[1] : null;
    
    // Extract name
    const nameMatch = offerContent.match(/<name><!\[CDATA\[(.*?)\]\]><\/name>/) || 
                      offerContent.match(/<name>(.*?)<\/name>/);
    const name = nameMatch ? nameMatch[1] : null;
    
    // Extract URL
    const urlMatch = offerContent.match(/<url>(.*?)<\/url>/);
    const url = urlMatch ? urlMatch[1] : null;
    
    // Extract vendorCode (заводской артикул)
    const vendorCodeMatch = offerContent.match(/<vendorCode><!\[CDATA\[(.*?)\]\]><\/vendorCode>/) ||
                            offerContent.match(/<vendorCode>(.*?)<\/vendorCode>/);
    const vendorCode = vendorCodeMatch ? vendorCodeMatch[1].trim() : undefined;
    
    // Extract picture
    const pictureMatch = offerContent.match(/<picture>(.*?)<\/picture>/);
    const picture = pictureMatch ? pictureMatch[1] : undefined;
    
    if (price && name && url) {
      const productName = name.trim();
      products.push({
        id: offerId,
        name: productName,
        price: formatPrice(parseFloat(price)),
        url,
        vendorCode,
        picture
      });
    }
  }
  
  return products;
}

function formatPrice(price: number): string {
  // Цены в YML уже с НДС, берём напрямую
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price) + ' ₽';
}

serve(async (req) => {
  // Handle CORS preflight
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
    
    const products = parseYmlProducts(xmlText);
    console.log("Parsed products:", products.length);
    
    // Log vendorCodes for debugging
    const vendorCodes = products
      .filter(p => p.vendorCode)
      .map(p => ({ name: p.name, vendorCode: p.vendorCode, price: p.price }));
    console.log("Products with vendorCodes:", JSON.stringify(vendorCodes, null, 2));
    
    return new Response(
      JSON.stringify({ 
        success: true, 
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
