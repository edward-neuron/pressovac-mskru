import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Wrench, Sparkles, Camera, Settings, Package } from 'lucide-react';
import { BrushMachinesCatalog } from '@/components/catalog/BrushMachinesCatalog';
import brushMachinesBanner from '@/assets/brush-machines-banner.png';
const categories = [
  {
    id: 'brush-machines',
    icon: Zap,
    title: 'Щёточные машины Pressovac',
    description: 'Профессиональные щёточные машины для механической очистки воздуховодов круглого и прямоугольного сечения. Эффективное удаление пыли, жира и загрязнений.',
    hasDetailedCatalog: true,
    image: 'from-blue-500 to-blue-600',
  },
  {
    id: 'vacuum',
    icon: Shield,
    title: 'Вакуумные установки',
    description: 'Мощные вакуумные системы для эффективного сбора загрязнений при очистке вентиляции. Высокая производительность и надёжность.',
    products: ['Pressovac V1000', 'Pressovac V2000', 'Pressovac V3000'],
    image: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 'filters',
    icon: Wrench,
    title: 'Фильтрующие установки',
    description: 'Высокоэффективные HEPA-фильтры для очистки воздуха и сбора мелкодисперсных частиц. Соответствие европейским стандартам качества.',
    products: ['Pressovac F500', 'Pressovac F1000'],
    image: 'from-teal-500 to-teal-600',
  },
  {
    id: 'disinfection',
    icon: Sparkles,
    title: 'Оборудование для дезинфекции',
    description: 'Специализированное оборудование для антибактериальной обработки и дезинфекции вентиляционных систем и воздуховодов.',
    products: ['Pressovac D100', 'Pressovac D200'],
    image: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 'video',
    icon: Camera,
    title: 'Видеоинспекция и диагностика',
    description: 'Оборудование для видеоинспекции воздуховодов, позволяющее оценить степень загрязнения и качество выполненных работ.',
    products: ['Pressovac CAM100', 'Pressovac CAM200'],
    image: 'from-violet-500 to-violet-600',
  },
  {
    id: 'compressor',
    icon: Settings,
    title: 'Компрессорное оборудование',
    description: 'Компрессоры и пневматическое оборудование для работы щёточных машин и других устройств очистки.',
    products: ['Pressovac C100', 'Pressovac C200'],
    image: 'from-sky-500 to-sky-600',
  },
  {
    id: 'accessories',
    icon: Package,
    title: 'Комплектующие и аксессуары',
    description: 'Щётки различного диаметра, штанги, насадки и другие комплектующие для оборудования Pressovac.',
    products: ['Щётки', 'Штанги', 'Насадки', 'Адаптеры'],
    image: 'from-emerald-500 to-emerald-600',
  },
];

const Catalog = () => {

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
              Каталог оборудования
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Оборудование <span className="text-gradient">Pressovac</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Полный ассортимент профессионального финского оборудования для очистки 
              и дезинфекции систем вентиляции
            </p>
          </motion.div>

        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="space-y-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                id={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-2xl border border-border overflow-hidden card-hover"
              >
                {/* Горизонтальный layout — изображение сверху */}
                <div className="flex flex-col">
                  {/* Изображение / баннер категории */}
                  <div className={`bg-gradient-to-br ${category.image} h-48 md:h-56 flex items-center justify-center relative overflow-hidden`}>
                    {category.id === 'brush-machines' ? (
                      <img 
                        src={brushMachinesBanner} 
                        alt={category.title}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <category.icon className="w-20 h-20 text-white/90" />
                    )}
                    {/* Заголовок поверх изображения */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
                      <div className="p-6 md:p-8">
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-white">{category.title}</h2>
                        <p className="text-white/90 mt-2 max-w-lg leading-relaxed hidden md:block">{category.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Контент */}
                  <div className="p-6 md:p-8 space-y-4">
                    {/* Описание на мобильных */}
                    <p className="text-muted-foreground leading-relaxed md:hidden">{category.description}</p>
                    
                    {/* Детальный каталог для щёточных машин */}
                    {category.hasDetailedCatalog ? (
                      <BrushMachinesCatalog />
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {category.products?.map((product) => (
                            <span 
                              key={product}
                              className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                            >
                              {product}
                            </span>
                          ))}
                        </div>
                        <Link
                          to="/contacts"
                          className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all pt-2"
                        >
                          Запросить информацию
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;
