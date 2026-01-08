import { motion } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { StoreProduct, formatPrice } from '@/data/storeData';
import { useState } from 'react';

interface ProductCardProps {
  product: StoreProduct;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addItem, items, openCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  
  const isInCart = items.some(item => item.id === product.id);
  const cartItem = items.find(item => item.id === product.id);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      article: product.article,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleButtonClick = () => {
    if (isInCart && !justAdded) {
      openCart();
    } else {
      handleAddToCart();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="text-muted-foreground font-medium">Под заказ</span>
          </div>
        )}
        {product.oldPrice && (
          <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Price */}
        <div className="text-xl font-bold text-primary">
          {formatPrice(product.price)}
        </div>

        {/* Name */}
        <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Button */}
        <Button
          onClick={handleButtonClick}
          size="sm"
          className={`w-full mt-2 transition-all duration-300 ${
            justAdded 
              ? 'bg-green-600 hover:bg-green-600' 
              : isInCart 
                ? 'bg-green-600 hover:bg-green-700' 
                : ''
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Добавлено
            </>
          ) : isInCart ? (
            <>
              <ShoppingCart className="w-4 h-4 mr-1" />
              В корзине ({cartItem?.quantity})
            </>
          ) : (
            'Купить'
          )}
        </Button>
      </div>
    </motion.div>
  );
};
