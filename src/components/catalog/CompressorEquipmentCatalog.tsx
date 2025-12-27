import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { ProductDrawer } from './ProductDrawer';
import { compressorEquipmentData } from '@/data/compressorEquipmentData';
import compressorSquareV2 from '@/assets/compressor-square-v2.png';

export function CompressorEquipmentCatalog() {
  const [selectedProduct, setSelectedProduct] = useState(compressorEquipmentData.products[0] ?? null);
  const [isProductOpen, setIsProductOpen] = useState(false);

  const product = compressorEquipmentData.products[0];

  const handleOpen = () => {
    setIsProductOpen(true);
  };

  const handleClose = () => {
    setIsProductOpen(false);
  };

  if (!product) return null;

  return (
    <div className="space-y-4">
      {/* Внутренний баннер (1:1 для компрессоров) */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-muted aspect-square max-w-md">
        <img
          src={compressorSquareV2}
          alt="Компрессор Pressovac K-370 Premium Car"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleOpen}
          className="group p-4 bg-card hover:bg-primary/5 rounded-xl border border-border hover:border-primary/30 transition-all text-left"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h5 className="font-medium group-hover:text-primary transition-colors truncate">
                {product.name}
              </h5>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {product.description}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </div>
        </button>
      </div>

      <ProductDrawer product={selectedProduct} isOpen={isProductOpen} onClose={handleClose} />
    </div>
  );
}
