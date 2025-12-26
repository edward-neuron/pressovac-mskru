import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const YML_URL = "https://shop-pressovac.ru/yml-export/02513391f110e59858a2403c4b3bed42/?full=1";

interface YmlProduct {
  id: string;
  name: string;
  price: string;
  url: string;
  vendorCode?: string; // Заводской артикул (Код: 201.002.003)
  picture?: string;
}

// Проверяем, нужно ли добавлять НДС к товару
// НДС добавляем к позициям, где в YML цена без НДС (например: моющие машины/валы и гибкие/стальные валы)
// "Щёточные" машины (P-25, P-40, E-20, E-25L, E-30, E-BOX) уже имеют цены с НДС
function needsVat(name: string, vendorCode?: string): boolean {
  const nameLower = name.toLowerCase();
  const code = (vendorCode ?? '').trim();

  const isShaft =
    code.startsWith('205.001.') || // Гибкие валы (Стандарт)
    code.startsWith('205.002.') || // Стальные валы
    code.startsWith('205.004.');   // Супер гибкий вал (Мини)

  // "моющая" или "моющий" в названии = цена без НДС, нужно добавить
  return nameLower.includes('моющ') || isShaft;
}

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
        price: formatPrice(parseFloat(price), productName, vendorCode),
        url,
        vendorCode,
        picture
      });
    }
  }
  
  return products;
}

function formatPrice(price: number, productName: string, vendorCode?: string): string {
  // Добавляем НДС 20% только к категориям, где в YML цена без НДС
  const finalPrice = needsVat(productName, vendorCode) ? Math.round(price * 1.2) : price;
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(finalPrice) + ' ₽';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Fetching YML from:", YML_URL);
    
    const response = await fetch(YML_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Pressovac/1.0)'
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
