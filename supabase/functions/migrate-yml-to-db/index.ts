import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================================================
// DATA LOCK: Prices and images are FROZEN as of January 2025
// DO NOT modify this function to update prices or images from external sources
// All 196 products have verified prices and localized images in /images/products/
// ============================================================================
const DATA_LOCKED = true;

const YML_BASE_URL = 'https://shop-pressovac.ru/yml-export/02513391f110e59858a2403c4b3bed42/';

function buildYmlUrl(): string {
  const url = new URL(YML_BASE_URL);
  url.searchParams.set("full", "1");
  url.searchParams.set("_", Date.now().toString());
  return url.toString();
}

interface YmlProduct {
  id: string;
  name: string;
  price: number;
  currencyId: string;
  categoryId: string;
  picture?: string;
  vendorCode?: string;
  description?: string;
  available: boolean;
}

interface YmlCategory {
  id: string;
  name: string;
  parentId?: string;
}

function parseYmlCategories(xmlText: string): YmlCategory[] {
  const categories: YmlCategory[] = [];
  const categoryRegex = /<category id="([^"]+)"(?:\s+parentId="([^"]+)")?[^>]*>([^<]+)<\/category>/g;
  let match;
  
  while ((match = categoryRegex.exec(xmlText)) !== null) {
    categories.push({
      id: match[1],
      name: match[3].trim(),
      parentId: match[2] || undefined
    });
  }
  
  return categories;
}

function parseYmlProducts(xmlText: string): YmlProduct[] {
  const products: YmlProduct[] = [];
  
  const hasDescriptionTags = xmlText.includes('<description>');
  const hasCdataTags = xmlText.includes('<![CDATA[');
  console.log(`[DEBUG] XML contains <description> tags: ${hasDescriptionTags}`);
  console.log(`[DEBUG] XML contains CDATA tags: ${hasCdataTags}`);
  
  const offerRegex = /<offer id="([^"]+)"[^>]*available="([^"]+)"[^>]*>([\s\S]*?)<\/offer>/gi;
  let match;
  
  while ((match = offerRegex.exec(xmlText)) !== null) {
    const offerId = match[1];
    const available = match[2] === 'true';
    const offerContent = match[3];
    
    const nameMatch = offerContent.match(/<name><!\[CDATA\[(.*?)\]\]><\/name>/i) ||
                      offerContent.match(/<name>([^<]+)<\/name>/i);
    
    const priceMatch = offerContent.match(/<price>([^<]+)<\/price>/i);
    const currencyMatch = offerContent.match(/<currencyId>([^<]+)<\/currencyId>/i);
    const categoryMatch = offerContent.match(/<categoryId>([^<]+)<\/categoryId>/i);
    const pictureMatch = offerContent.match(/<picture>([^<]+)<\/picture>/i);
    
    const vendorCodeMatch = offerContent.match(/<vendorCode><!\[CDATA\[(.*?)\]\]><\/vendorCode>/i) ||
                            offerContent.match(/<vendorCode>([^<]+)<\/vendorCode>/i);
    
    let descriptionMatch = offerContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i);
    if (!descriptionMatch) {
      descriptionMatch = offerContent.match(/<description>([\s\S]*?)<\/description>/i);
    }
    
    if (descriptionMatch && descriptionMatch[1]) {
      console.log(`[DEBUG] Found description for: ${nameMatch?.[1]?.substring(0, 40)}`);
    }
    
    if (nameMatch && priceMatch && categoryMatch) {
      products.push({
        id: offerId,
        name: nameMatch[1].trim(),
        price: parseFloat(priceMatch[1]),
        currencyId: currencyMatch ? currencyMatch[1] : 'RUB',
        categoryId: categoryMatch[1],
        picture: pictureMatch ? pictureMatch[1] : undefined,
        vendorCode: vendorCodeMatch ? vendorCodeMatch[1]?.trim() : undefined,
        description: descriptionMatch ? descriptionMatch[1] : undefined,
        available
      });
    }
  }
  
  return products;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // DATA LOCK CHECK - Prevent any external sync when locked
  if (DATA_LOCKED) {
    console.log('⚠️ DATA LOCK ACTIVE: Migration blocked. Prices and images are frozen.');
    return new Response(
      JSON.stringify({
        success: false,
        locked: true,
        message: 'Data migration is locked. Prices and images are frozen as of January 2025. To unlock, set DATA_LOCKED = false in the edge function.'
      }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const ymlUrl = buildYmlUrl();
    console.log('Fetching YML from:', ymlUrl);
    
    const response = await fetch(ymlUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Pressovac/1.0)',
        'Cache-Control': 'no-cache'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch YML: ${response.status}`);
    }
    
    const xmlText = await response.text();
    console.log('YML fetched, size:', xmlText.length);
    
    const categories = parseYmlCategories(xmlText);
    const products = parseYmlProducts(xmlText);
    
    console.log(`Parsed ${categories.length} categories and ${products.length} products`);
    
    const rootCategories = categories.filter(c => !c.parentId);
    const childCategories = categories.filter(c => c.parentId);
    
    if (rootCategories.length > 0) {
      const { error: rootError } = await supabase
        .from('product_categories')
        .upsert(
          rootCategories.map(c => ({
            id: c.id,
            name: c.name,
            parent_id: null
          })),
          { onConflict: 'id' }
        );
      
      if (rootError) {
        console.error('Error inserting root categories:', rootError);
        throw rootError;
      }
    }
    
    if (childCategories.length > 0) {
      const { error: childError } = await supabase
        .from('product_categories')
        .upsert(
          childCategories.map(c => ({
            id: c.id,
            name: c.name,
            parent_id: c.parentId
          })),
          { onConflict: 'id' }
        );
      
      if (childError) {
        console.error('Error inserting child categories:', childError);
        throw childError;
      }
    }
    
    // Get existing products to preserve local data
    const { data: existingProducts } = await supabase
      .from('products')
      .select('id, picture, description, price');
    
    const existingMap = new Map<string, { picture?: string; description?: string; price?: number }>();
    for (const p of existingProducts || []) {
      existingMap.set(p.id, { picture: p.picture, description: p.description, price: p.price });
    }
    
    const BATCH_SIZE = 100;
    let insertedProducts = 0;
    
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      
      const { error: productError } = await supabase
        .from('products')
        .upsert(
          batch.map(p => {
            const existing = existingMap.get(p.id);
            
            // ALWAYS preserve local images (starting with /)
            const picture = existing?.picture?.startsWith('/') 
              ? existing.picture 
              : (p.picture || existing?.picture);
            
            // ALWAYS preserve existing description if present
            const description = existing?.description || p.description || null;
            
            // ALWAYS preserve existing price if present (price lock)
            const price = existing?.price ?? p.price;
            
            return {
              id: p.id,
              name: p.name,
              price,
              currency_id: p.currencyId,
              category_id: p.categoryId,
              picture,
              vendor_code: p.vendorCode,
              description,
              available: p.available
            };
          }),
          { onConflict: 'id' }
        );
      
      if (productError) {
        console.error('Error inserting products batch:', productError);
        throw productError;
      }
      
      insertedProducts += batch.length;
      console.log(`Inserted ${insertedProducts}/${products.length} products`);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        categoriesCount: categories.length,
        productsCount: products.length,
        message: 'Migration completed successfully (prices and images preserved)'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Migration error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
