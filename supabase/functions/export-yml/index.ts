import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch categories
    const { data: categories, error: catError } = await supabase
      .from('product_categories')
      .select('*')
      .order('id');
    
    if (catError) throw catError;

    // Fetch products
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')
      .eq('available', true)
      .order('id');
    
    if (prodError) throw prodError;

    // Generate YML
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    
    let yml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE yml_catalog SYSTEM "shops.dtd">
<yml_catalog date="${now}">
  <shop>
    <name>Pressovac Moscow</name>
    <company>ООО Пресовак Москва</company>
    <url>https://pressovac-moscow.ru</url>
    <currencies>
      <currency id="RUB" rate="1"/>
    </currencies>
    <categories>
`;

    // Add categories
    for (const cat of categories || []) {
      if (cat.parent_id) {
        yml += `      <category id="${cat.id}" parentId="${cat.parent_id}">${escapeXml(cat.name)}</category>\n`;
      } else {
        yml += `      <category id="${cat.id}">${escapeXml(cat.name)}</category>\n`;
      }
    }

    yml += `    </categories>
    <offers>
`;

    // Add products
    for (const prod of products || []) {
      yml += `      <offer id="${prod.id}" available="true">
        <name>${escapeXml(prod.name)}</name>
        <price>${prod.price}</price>
        <currencyId>${prod.currency_id || 'RUB'}</currencyId>
        <categoryId>${prod.category_id}</categoryId>
`;
      
      if (prod.picture) {
        yml += `        <picture>${escapeXml(prod.picture)}</picture>\n`;
      }
      
      if (prod.vendor_code) {
        yml += `        <vendorCode>${escapeXml(prod.vendor_code)}</vendorCode>\n`;
      }
      
      if (prod.description) {
        yml += `        <description><![CDATA[${prod.description}]]></description>\n`;
      }
      
      yml += `      </offer>\n`;
    }

    yml += `    </offers>
  </shop>
</yml_catalog>`;

    return new Response(yml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Content-Disposition': 'inline; filename="pressovac-catalog.yml"'
      }
    });
    
  } catch (error) {
    console.error('Export error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
