import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export const VideoPreview = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Видео
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Как это <span className="text-gradient">работает</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Посмотрите демонстрацию работы оборудования Pressovac в реальных условиях
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl overflow-hidden relative group cursor-pointer">
            <div className="absolute inset-0 bg-foreground/5" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 ml-1" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-card/90 backdrop-blur-sm rounded-xl p-4">
                <h3 className="font-display font-semibold text-foreground">Демонстрация очистки вентиляции</h3>
                <p className="text-sm text-muted-foreground">Полный процесс работы с оборудованием Pressovac</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
