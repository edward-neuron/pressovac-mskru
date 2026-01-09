import { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedWaves } from './AnimatedWaves';
import equipmentHero from '@/assets/equipment-hero.webp';

const features = [
  'Финское качество с 1990 года',
  'Официальная гарантия',
  'Сервисная поддержка',
  'Обучение персонала',
];

// Memoized feature item for performance
const FeatureItem = memo(({ feature, index }: { feature: string; index: number }) => (
  <motion.li
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
    className="flex items-center gap-2 text-sm text-foreground"
  >
    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
    {feature}
  </motion.li>
));
FeatureItem.displayName = 'FeatureItem';

export const HeroSection = memo(() => {
  return (
    <section className="relative hero-gradient overflow-hidden">
      {/* Animated Waves Background - lazy */}
      <AnimatedWaves />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>
      
      <div className="container-custom section-padding relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Официальный дистрибьютор в России</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Оборудование для{' '}
              <span className="text-gradient">очистки вентиляции</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Профессиональное финское оборудование PRESSOVAC для очистки и дезинфекции 
              систем вентиляции. Надёжность и качество с 1990 года.
            </p>

            <ul className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <FeatureItem key={feature} feature={feature} index={index} />
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/catalog">
                  Каталог оборудования
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/technology">
                  <Play className="w-5 h-5" />
                  Как это работает
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Image - priority loading */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl transform scale-110" />
            <div className="relative bg-card rounded-3xl p-8 shadow-card">
              <img
                src={equipmentHero}
                alt="Оборудование Pressovac для очистки вентиляции"
                className="w-full h-auto object-contain"
                width={600}
                height={400}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
            
            {/* Stats Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 shadow-card border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="font-display font-bold text-xl text-primary">30+</span>
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">лет опыта</p>
                  <p className="text-sm text-muted-foreground">на рынке</p>
                </div>
              </div>
            </motion.div>

            {/* Quality Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-2xl px-4 py-3 shadow-lg"
            >
              <p className="text-sm font-semibold">Made in Finland 🇫🇮</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
