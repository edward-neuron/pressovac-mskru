import { useState } from 'react';
import { motion } from 'framer-motion';

type Platform = 'rutube' | 'youtube';

const VIDEO_URLS = {
  rutube: 'https://rutube.ru/play/embed/3597bd9053d7a1ab63430e4118fb43c8',
  youtube: 'https://www.youtube.com/embed/wf2sqiJv_20',
};

export const VideoPreview = () => {
  const [platform, setPlatform] = useState<Platform>('rutube');

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
            Почему выбирают <span className="text-gradient">нас</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Владелец компании рассказывает о преимуществах работы с нами
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Platform Switcher */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-full bg-muted p-1">
              <button
                onClick={() => setPlatform('rutube')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  platform === 'rutube'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                RuTube
              </button>
              <button
                onClick={() => setPlatform('youtube')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  platform === 'youtube'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                YouTube
              </button>
            </div>
          </div>

          {/* Video Embed */}
          <div className="aspect-video rounded-3xl overflow-hidden shadow-xl">
            <iframe
              key={platform}
              src={VIDEO_URLS[platform]}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Видео о компании Веконт-М"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
