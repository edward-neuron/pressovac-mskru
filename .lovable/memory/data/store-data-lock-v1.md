# Memory: data/store-data-lock-v1
Updated: 2025-01-23

## ⚠️ DATA LOCK ACTIVE

Store product data (196 products) is **FROZEN** as of January 2025.

### What is locked:
- **Prices**: All prices verified with 22% VAT from official CSV price list
- **Images**: All 196 images localized in `/images/products/` and `/images/products/kits/` as optimized WebP files
- **Descriptions**: HTML specifications for kits (EDW, PDW, ATEX) manually restored

### Protection mechanisms:
1. **Edge Function Lock**: `migrate-yml-to-db` has `DATA_LOCKED = true` flag that blocks any external sync
2. **Price Preservation**: Even if unlocked, existing prices in DB are preserved during sync
3. **Image Preservation**: Local paths starting with `/` are never overwritten by external URLs

### To make changes:
- **Individual product updates**: Use Supabase dashboard or direct SQL
- **Bulk price updates**: Unlock the edge function temporarily by setting `DATA_LOCKED = false`
- **New products**: Can be added manually via SQL or by unlocking migration

### Source of truth:
- User's CSV file: `прайс-лист_22.01.26.csv`
- Column B: Артикулы (vendor_code)
- Column AB: Цена с НДС 22%
- Column F: Вес товара (for future use)

### DO NOT:
- Automatically sync from external YML feeds
- Overwrite localized images with external URLs
- Modify prices without explicit user approval
