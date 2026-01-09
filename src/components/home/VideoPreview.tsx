import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

type Platform = 'rutube' | 'youtube';

const VIDEO_DATA = {
  rutube: {
    url: 'https://rutube.ru/play/embed/3597bd9053d7a1ab63430e4118fb43c8?autoplay=1',
    thumbnail: 'https://pic.rutube.ru/video/76/c9/76c9c74e7b1e28d7b936e87e44888c82.jpg',
  },
  youtube: {
    url: 'https://www.youtube.com/embed/wf2sqiJv_20?autoplay=1',
    thumbnail: 'https://img.youtube.com/vi/wf2sqiJv_20/maxresdefault.jpg',
  },
};

export const VideoPreview = memo(() => {
  const [platform, setPlatform] = useState<Platform>('youtube');
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePlatformChange = (newPlatform: Platform) => {
    setPlatform(newPlatform);
    setIsPlaying(false);
  };

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
            <div className="inline-flex gap-3 rounded-full bg-muted p-2">
              <button
                onClick={() => handlePlatformChange('rutube')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all bg-blue-600 text-white ${
                  platform === 'rutube'
                    ? 'shadow-lg ring-2 ring-blue-400 ring-offset-2 ring-offset-background'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                RuTube
              </button>
              <button
                onClick={() => handlePlatformChange('youtube')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all bg-red-600 text-white ${
                  platform === 'youtube'
                    ? 'shadow-lg ring-2 ring-red-400 ring-offset-2 ring-offset-background'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                YouTube
              </button>
            </div>
          </div>

          {/* Video Container */}
          <div className="aspect-video rounded-3xl overflow-hidden shadow-xl relative bg-black">
            {isPlaying ? (
              <iframe
                key={platform}
                src={VIDEO_DATA[platform].url}
                className="w-full h-full"
                referrerPolicy={platform === 'rutube' ? 'no-referrer' : 'strict-origin-when-cross-origin'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Видео о компании Веконт-М"
              />
            ) : (
              <button
                onClick={handlePlay}
                className="w-full h-full relative group cursor-pointer"
                aria-label="Воспроизвести видео"
              >
                <img
                  src={VIDEO_DATA[platform].thumbnail}
                  alt="Превью видео"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={1280}
                  height={720}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </div>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
});

VideoPreview.displayName = 'VideoPreview';
