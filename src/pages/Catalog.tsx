import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Wind, Wrench, Sparkles, Camera, Settings, Package } from 'lucide-react';
import { BrushMachinesCatalog } from '@/components/catalog/BrushMachinesCatalog';
import { VacuumEquipmentCatalog } from '@/components/catalog/VacuumEquipmentCatalog';
import { FilterEquipmentCatalog } from '@/components/catalog/FilterEquipmentCatalog';
import { DisinfectionEquipmentCatalog } from '@/components/catalog/DisinfectionEquipmentCatalog';
import { VideoInspectionCatalog } from '@/components/catalog/VideoInspectionCatalog';
import { CompressorEquipmentCatalog } from '@/components/catalog/CompressorEquipmentCatalog';
import brushMachinesMain from '@/assets/brush-machines-main-1-1.png';
import flexibleShafts from '@/assets/flexible-shafts.png';
import dryCleaningMachines from '@/assets/dry-cleaning-machines.png';
import greaseRemovalMachines from '@/assets/grease-removal-machines.png';
import vacuumEquipmentSquare from '@/assets/vacuum-equipment-square.png';
import filterEquipmentSquare from '@/assets/filter-equipment-square.png';
import disinfectionSquareV2 from '@/assets/disinfection-square-v2.png';
import disinfectionBannerV2 from '@/assets/disinfection-banner-v2.png';
import videoInspectionSquareV2 from '@/assets/video-inspection-square-v2.png';
import videoInspectionBannerV2 from '@/assets/video-inspection-banner-v2.png';
import compressorSquareV2 from '@/assets/compressor-square-v2.png';

const brushEquipmentImages: Record<string, string> = {
  'default': brushMachinesMain,
  'flexible-shafts': flexibleShafts,
  'dry-cleaning': dryCleaningMachines,
  'grease-removal': greaseRemovalMachines,
};

const vacuumEquipmentImages: Record<string, string> = {
  'default': vacuumEquipmentSquare,
};

const filterEquipmentImages: Record<string, string> = {
  'default': filterEquipmentSquare,
};

const disinfectionEquipmentImages: Record<string, string> = {
  'default': disinfectionSquareV2,
  'inside': disinfectionBannerV2,
};

const videoInspectionImages: Record<string, string> = {
  'default': videoInspectionSquareV2,
  'inside': videoInspectionBannerV2,
};

const compressorEquipmentImages: Record<string, string> = {
  'default': compressorSquareV2,
};

const categories = [
  {
    id: 'brush-machines',
    icon: Zap,
    title: 'Щёточное оборудование Pressovac',
    description: 'Профессиональное щёточное оборудование для механической очистки воздуховодов круглого и прямоугольного сечения. Эффективное удаление пыли, жира и загрязнений.',
    hasDetailedCatalog: true,
    image: 'from-blue-500 to-blue-600',
  },
  {
    id: 'vacuum',
    icon: Wind,
    title: 'Вакуумные установки',
    description: 'Мощные вакуумные системы для эффективного сбора загрязнений при очистке вентиляции. Высокая производительность и надёжность.',
    hasDetailedCatalog: true,
    image: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 'filters',
    icon: Wrench,
    title: 'Фильтрующие установки',
    description: 'Грязь утилизируется и собирается в Фильтрующих установках F50 и F100. Благодаря специальной конструкции из облегченного материала, фильтрующие установки F50 и F100 имеют очень лёгкий вес и соответственно легко передвигаются.',
    hasDetailedCatalog: true,
    image: 'from-teal-500 to-teal-600',
  },
  {
    id: 'disinfection',
    icon: Sparkles,
    title: 'Оборудование для дезинфекции',
    description: 'Специализированное оборудование для антибактериальной обработки и дезинфекции вентиляционных систем и воздуховодов.',
    hasDetailedCatalog: true,
    image: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 'video',
    icon: Camera,
    title: 'Видеоинспекция и диагностика',
    description: 'Оборудование для видеоинспекции воздуховодов, позволяющее оценить степень загрязнения и качество выполненных работ.',
    hasDetailedCatalog: true,
    image: 'from-violet-500 to-violet-600',
  },
  {
    id: 'compressor',
    icon: Settings,
    title: 'Компрессорное оборудование',
    description: 'Компрессоры и пневматическое оборудование для работы щёточных машин и других устройств очистки.',
    hasDetailedCatalog: true,
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
  const [brushEquipmentImage, setBrushEquipmentImage] = useState<string>('default');
  const [disinfectionImage, setDisinfectionImage] = useState<string>('default');
  const [videoImage, setVideoImage] = useState<string>('default');

  const handleSubcategoryChange = (subcategoryId: string | null) => {
    if (!subcategoryId) {
      setBrushEquipmentImage('default');
    } else if (subcategoryId === 'flexible-shafts') {
      setBrushEquipmentImage('flexible-shafts');
    } else if (subcategoryId === 'dry-cleaning') {
      setBrushEquipmentImage('dry-cleaning');
    } else if (subcategoryId === 'grease-removal') {
      setBrushEquipmentImage('grease-removal');
    }
  };

  const handleDisinfectionSubcategoryChange = (subcategoryId: string | null) => {
    setDisinfectionImage(subcategoryId ? 'inside' : 'default');
  };

  const handleVideoSubcategoryChange = (subcategoryId: string | null) => {
    setVideoImage(subcategoryId ? 'inside' : 'default');
  };

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
                <div className="grid md:grid-cols-3 gap-0 md:items-stretch">
                  {/* Изображение слева */}
                  <div
                    className={`${
                      (category.id === 'disinfection' && disinfectionImage === 'inside') || (category.id === 'video' && videoImage === 'inside')
                        ? 'bg-muted aspect-[3/1]'
                        : (category.id === 'brush-machines' || category.id === 'vacuum' || category.id === 'filters' || category.id === 'disinfection' || category.id === 'video' || category.id === 'compressor')
                          ? 'bg-muted aspect-square self-start md:self-start'
                          : `bg-gradient-to-br ${category.image} min-h-[280px] md:min-h-0`
                    } flex items-center justify-center relative overflow-hidden`}
                  >
                    {category.id === 'brush-machines' ? (
                      <motion.img 
                        key={brushEquipmentImage}
                        src={brushEquipmentImages[brushEquipmentImage]} 
                        alt={category.title}
                        className="w-full h-full object-cover object-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : category.id === 'vacuum' ? (
                      <img 
                        src={vacuumEquipmentImages['default']} 
                        alt={category.title}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                    ) : category.id === 'filters' ? (
                      <img 
                        src={filterEquipmentImages['default']} 
                        alt={category.title}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                    ) : category.id === 'disinfection' ? (
                      <motion.img
                        key={disinfectionImage}
                        src={disinfectionEquipmentImages[disinfectionImage]} 
                        alt={category.title}
                        className="w-full h-full object-cover object-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        loading="lazy"
                      />
                    ) : category.id === 'video' ? (
                      <motion.img
                        key={videoImage}
                        src={videoInspectionImages[videoImage]} 
                        alt={category.title}
                        className="w-full h-full object-cover object-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        loading="lazy"
                      />
                    ) : category.id === 'compressor' ? (
                      <img 
                        src={compressorEquipmentImages['default']} 
                        alt="Компрессор Pressovac K-370 Premium Car"
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                    ) : (
                      <category.icon className="w-24 h-24 text-white/90" />
                    )}
                  </div>
                  {/* Контент справа */}
                  <div className="md:col-span-2 p-6 md:p-8 space-y-4">
                    <h2 className="font-display text-2xl font-bold">{category.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{category.description}</p>
                    
                    {/* Детальный каталог для оборудования */}
                    {category.hasDetailedCatalog ? (
                      <div className="pt-4">
                        {category.id === 'brush-machines' && (
                          <BrushMachinesCatalog onSubcategoryChange={handleSubcategoryChange} />
                        )}
                        {category.id === 'vacuum' && (
                          <VacuumEquipmentCatalog />
                        )}
                        {category.id === 'filters' && (
                          <FilterEquipmentCatalog />
                        )}
                        {category.id === 'disinfection' && (
                          <DisinfectionEquipmentCatalog onSubcategoryChange={handleDisinfectionSubcategoryChange} />
                        )}
                        {category.id === 'video' && (
                          <VideoInspectionCatalog onSubcategoryChange={handleVideoSubcategoryChange} />
                        )}
                        {category.id === 'compressor' && (
                          <CompressorEquipmentCatalog />
                        )}
                      </div>
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
