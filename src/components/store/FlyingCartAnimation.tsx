import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FlyingItem {
  id: string;
  image: string;
  startX: number;
  startY: number;
}

interface FlyingCartAnimationProps {
  item: FlyingItem | null;
  onComplete: () => void;
}

export const FlyingCartAnimation = ({ item, onComplete }: FlyingCartAnimationProps) => {
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (item) {
      // Найти иконку корзины в header
      const cartIcon = document.querySelector('[data-cart-icon]');
      if (cartIcon) {
        const rect = cartIcon.getBoundingClientRect();
        setTargetPos({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      } else {
        // Fallback - верхний правый угол
        setTargetPos({ x: window.innerWidth - 100, y: 40 });
      }
    }
  }, [item]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key={item.id}
          initial={{
            position: 'fixed',
            left: item.startX,
            top: item.startY,
            width: 80,
            height: 80,
            opacity: 1,
            scale: 1,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
          animate={{
            left: targetPos.x - 20,
            top: targetPos.y - 20,
            width: 40,
            height: 40,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{
            duration: 0.6,
            ease: [0.32, 0, 0.67, 0],
          }}
          onAnimationComplete={onComplete}
          className="rounded-full overflow-hidden shadow-lg border-2 border-primary bg-background"
        >
          <img
            src={item.image}
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
