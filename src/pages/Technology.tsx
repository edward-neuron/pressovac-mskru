import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Play, CheckCircle, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const videoCategories = [
  {
    id: 'dry-cleaning',
    title: 'Сухая очистка вентиляции',
    videos: [
      { id: '9927894db7f21eb0aad294b3d45a9bf7', title: 'Пневматические щёточные машины' },
      { id: 'd34463dd502fded108c07ff35e9e3445', title: 'Центрирующее устройство' },
      { id: 'e9ceafa50aa2258c93f95ed42afdec4e', title: 'Т-Адаптер для пневматических машин' },
      { id: '84bd1b10f818e2250c4b9010d5877c2d', title: 'Супер гибкие валы "Мини"' },
      { id: '4e301ddd18c5caeec1488831b7b933fc', title: 'Гибкие валы для очистки воздухозаборников' },
      { id: '3fb6512f5ef1d2e1cf9de5a0826a9cff', title: 'Гибкие гофрированные шланги' },
      { id: 'abe24c45d7eeb37830d4ee165991c589', title: 'Врезки, Конусы, Адаптеры для обслуживания' },
    ],
  },
  {
    id: 'grease-removal',
    title: 'Удаление жира и нагара',
    videos: [
      { id: '29c9698b4f13746ed1111019f6d9002a', title: 'Концепция удаления жира (полная версия)' },
      { id: 'd35efc5eac366396053d3f97f96fc1bc', title: 'Концепция удаления жира (короткая версия)' },
      { id: '28358cf4ae9c77e935f729f075aa9321', title: 'Удаление жира под низким давлением (8,9 бар)' },
      { id: 'fdaa2d1687b357ce3284a55028303765', title: 'Удаление жира (низкое и высокое давление)' },
      { id: '4a4400790ad9a371e889d7a335e7c3ab', title: 'Agent X1 - Активная пена для удаления жира' },
      { id: '4e788ba8da52b2a361964185b7fc79b0', title: 'Традиционный метод ручной очистки' },
    ],
  },
  {
    id: 'video-inspection',
    title: 'Видеоинспекция',
    videos: [
      { id: '3bbe573cf96573a7006dc3dd96519976', title: 'Видеоинспекционная камера VS350 HD' },
      { id: '8689bf881499e6c6f1d2812dd99b66da', title: 'Видеоинспекционная камера VS700 FHD PRO' },
      { id: '35f7188393338728e5c53bb799ba7d2e', title: 'Видеоинспекция VS700 (Автофокус, замер расстояния)' },
    ],
  },
];

// YouTube использует другие ID, не такие как RuTube.
// Соответствия "rutubeId" -> "youtubeId"
const YOUTUBE_IDS: Record<string, string> = {
  // Сухая очистка
  '9927894db7f21eb0aad294b3d45a9bf7': 'IURiZ30KPsA', // Пневматические щёточные машины
  'd34463dd502fded108c07ff35e9e3445': 'aX4jOk3zkEk', // Центрирующее устройство
  'e9ceafa50aa2258c93f95ed42afdec4e': 'diGq9VoNoGo', // Т-Адаптер для пневматических машин
  '84bd1b10f818e2250c4b9010d5877c2d': 'gfAcHAY8lFU', // Супер гибкие валы "Мини"
  '4e301ddd18c5caeec1488831b7b933fc': 'xEXcMMz6EMw', // Гибкие валы для очистки воздухозаборников
  '3fb6512f5ef1d2e1cf9de5a0826a9cff': '6exZ-kL9T5g', // Гибкие гофрированные шланги
  'abe24c45d7eeb37830d4ee165991c589': 'oQwXqq0Urhg', // Врезки, Конусы, Адаптеры
  // Удаление жира
  '29c9698b4f13746ed1111019f6d9002a': 'U6P_PCFbPA8', // Концепция удаления жира (полная)
  'd35efc5eac366396053d3f97f96fc1bc': 'dVYHXnAIwTs', // Концепция удаления жира (короткая)
  '28358cf4ae9c77e935f729f075aa9321': 'G2vpWn12RXI', // Удаление жира под низким давлением
  'fdaa2d1687b357ce3284a55028303765': 'sikYkKNxSZQ', // Удаление жира (низкое и высокое давление)
  '4a4400790ad9a371e889d7a335e7c3ab': 'sSw6v34nLKs', // Agent X1
  '4e788ba8da52b2a361964185b7fc79b0': 'HCV8km8tkpE', // Традиционный метод ручной очистки
  // Видеоинспекция
  '3bbe573cf96573a7006dc3dd96519976': 'GOsC7fAwgKU', // VS350 HD
  '8689bf881499e6c6f1d2812dd99b66da': 'TMNGU_iu2dg', // VS700 FHD PRO
  '35f7188393338728e5c53bb799ba7d2e': 'DaWXXOdHW6o', // VS700 (Автофокус)
};

const steps = [
  { 
    number: '01', 
    title: 'Диагностика', 
    description: 'Видеоинспекция воздуховодов для оценки степени загрязнения и определения объёма работ' 
  },
  { 
    number: '02', 
    title: 'Подготовка', 
    description: 'Герметизация системы и установка вакуумного оборудования для сбора загрязнений' 
  },
  { 
    number: '03', 
    title: 'Механическая очистка', 
    description: 'Щёточные машины Pressovac удаляют отложения пыли и жира со стенок воздуховодов' 
  },
  { 
    number: '04', 
    title: 'Дезинфекция', 
    description: 'Антибактериальная обработка поверхностей для уничтожения микроорганизмов' 
  },
  { 
    number: '05', 
    title: 'Контроль качества', 
    description: 'Повторная видеоинспекция для подтверждения качества выполненных работ' 
  },
];

const advantages = [
  'Экологически чистая технология',
  'Соответствие санитарным нормам',
  'Снижение пожароопасности',
  'Улучшение качества воздуха',
  'Продление срока службы оборудования',
  'Экономия электроэнергии',
];

type Platform = 'rutube' | 'youtube';

const Technology = () => {
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState(videoCategories[0].id);
  const [platform, setPlatform] = useState<Platform>('rutube');

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding hero-gradient">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              О технологии
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Технология <span className="text-gradient">очистки вентиляции</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Узнайте, как работает профессиональная система очистки вентиляции 
              с использованием оборудования Pressovac
            </p>
          </motion.div>
        </div>
      </section>

      {/* Video Gallery */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Видео о технологиях
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Посмотрите демонстрацию работы оборудования Pressovac
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {videoCategories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                animate={{
                  scale: activeCategory === category.id ? [1.05, 1.1, 1.05] : [1, 1.03, 1],
                  boxShadow: activeCategory === category.id 
                    ? ['0 8px 25px -8px hsl(var(--primary) / 0.4)', '0 12px 35px -10px hsl(var(--primary) / 0.5)', '0 8px 25px -8px hsl(var(--primary) / 0.4)']
                    : ['0 4px 12px -4px hsl(var(--foreground) / 0.1)', '0 6px 18px -6px hsl(var(--foreground) / 0.15)', '0 4px 12px -4px hsl(var(--foreground) / 0.1)']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.3
                }}
                whileHover={{ scale: 1.12, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-xl text-sm font-semibold border-2 ${
                  activeCategory === category.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-border hover:border-primary hover:text-primary'
                }`}
              >
                {category.title}
              </motion.button>
            ))}
          </div>

          {/* Video Grid */}
          {videoCategories.map((category) => (
            <AnimatePresence key={category.id} mode="wait">
              {activeCategory === category.id && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {category.videos.map((video, index) => {
                    const youtubeId = YOUTUBE_IDS[video.id];
                    // Use YouTube thumbnail (more reliable, no CORS issues)
                    const thumbnailUrl = youtubeId 
                      ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
                      : null;
                    
                    return (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          const ytId = YOUTUBE_IDS[video.id];
                          setPlatform(ytId ? 'youtube' : 'rutube');
                          setSelectedVideo(video);
                        }}
                        className="group cursor-pointer"
                      >
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 mb-3">
                          {thumbnailUrl && (
                            <img
                              src={thumbnailUrl}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 ml-0.5" />
                            </div>
                          </div>
                        </div>
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {video.title}
                        </h3>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl bg-card rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 text-foreground flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              {/* Platform Switcher */}
              <div className="flex justify-center gap-3 p-4 border-b border-border">
                <button
                  onClick={() => setPlatform('rutube')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all bg-blue-600 text-white ${
                    platform === 'rutube'
                      ? 'shadow-lg ring-2 ring-blue-400 ring-offset-2 ring-offset-background'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  RuTube
                </button>

                {(() => {
                  const ytId = selectedVideo ? YOUTUBE_IDS[selectedVideo.id] : undefined;
                  const disabled = !ytId;

                  return (
                    <button
                      onClick={() => {
                        if (disabled) {
                          toast({
                            title: 'YouTube-версия не настроена',
                            description: 'Пришлите ссылку/ID YouTube для этого ролика — добавлю и кнопка заработает.',
                          });
                          return;
                        }
                        setPlatform('youtube');
                      }}
                      disabled={disabled}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all bg-red-600 text-white ${
                        platform === 'youtube'
                          ? 'shadow-lg ring-2 ring-red-400 ring-offset-2 ring-offset-background'
                          : 'opacity-70 hover:opacity-100'
                      } ${disabled ? 'opacity-40 cursor-not-allowed hover:opacity-40' : ''}`}
                    >
                      YouTube
                    </button>
                  );
                })()}
              </div>
              
              <div className="aspect-video">
                {(() => {
                  const ytId = YOUTUBE_IDS[selectedVideo.id];
                  const effectivePlatform = platform === 'youtube' && ytId ? 'youtube' : 'rutube';

                  return (
                    <iframe
                      key={`${selectedVideo.id}-${effectivePlatform}-${ytId ?? 'no-yt'}`}
                      src={effectivePlatform === 'rutube'
                        ? `https://rutube.ru/play/embed/${selectedVideo.id}`
                        : `https://www.youtube.com/embed/${ytId}`
                      }
                      className="w-full h-full"
                      loading="lazy"
                      referrerPolicy={effectivePlatform === 'rutube' ? 'no-referrer' : 'strict-origin-when-cross-origin'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={selectedVideo.title}
                    />
                  );
                })()}
              </div>
              <div className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display font-semibold text-lg">{selectedVideo.title}</h3>
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={`https://rutube.ru/video/${selectedVideo.id}/`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Открыть на RuTube
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steps */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Этапы очистки
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Пошаговый процесс профессиональной очистки вентиляционных систем
            </p>
          </motion.div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-xl">{step.number}</span>
                </div>
                <div className="bg-background rounded-2xl p-6 border border-border flex-1">
                  <h3 className="font-display font-semibold text-xl mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Преимущества технологии
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {advantages.map((advantage, index) => (
              <motion.div
                key={advantage}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="font-medium">{advantage}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Посмотреть оборудование
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Technology;
