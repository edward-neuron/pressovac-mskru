import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import pressovacLogo from '@/assets/pressovac-logo.png';

const navigation = [
  { name: 'Главная', href: '/' },
  { name: 'О нас', href: '/about' },
  { name: 'Каталог', href: '/catalog' },
  { name: 'Технология', href: '/technology' },
  { name: 'Обучение', href: '/training' },
  { name: 'Статьи', href: '/articles' },
  { name: 'Контакты', href: '/contacts' },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={pressovacLogo} 
              alt="Pressovac" 
              className="w-12 h-12 object-contain"
            />
            <div className="hidden sm:block">
              <span className="font-display font-bold text-xl text-foreground">Pressovac</span>
              <p className="text-xs text-muted-foreground">Финское оборудование</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+74996772010"
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>(499) 677-2010</span>
            </a>
            <Link 
              to="/store" 
              className="relative flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Магазин</span>
              {totalItems > 0 && (
                <span className="bg-primary-foreground text-primary text-xs px-2 py-0.5 rounded-full font-bold ml-1">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-border space-y-3">
                  <a
                    href="tel:+74996772010"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground"
                  >
                    <Phone className="w-4 h-4 text-primary" />
                    <span>(499) 677-2010</span>
                  </a>
                  <div className="px-4">
                    <Link 
                      to="/store" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Магазин</span>
                      {totalItems > 0 && (
                        <span className="bg-primary-foreground text-primary text-xs px-2 py-0.5 rounded-full font-bold">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
