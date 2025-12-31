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
  const { addItem, items } = useCart();
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
      <div className="p-4 space-y-3">
        {/* Article */}
        {product.article && (
          <span className="text-xs text-muted-foreground font-mono">
            Арт. {product.article}
          </span>
        )}

        {/* Name */}
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.features.slice(0, 2).map((feature, i) => (
              <span
                key={i}
                className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Price & Button */}
        <div className="flex items-end justify-between pt-2 border-t border-border/50">
          <div>
            <div className="text-xl font-bold text-foreground">
              {formatPrice(product.price)}
            </div>
            {product.oldPrice && (
              <div className="text-sm text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </div>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            size="sm"
            className={`transition-all duration-300 ${
              justAdded 
                ? 'bg-green-600 hover:bg-green-600' 
                : isInCart 
                  ? 'bg-primary/80' 
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
                Ещё ({cartItem?.quantity})
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-1" />
                В корзину
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
