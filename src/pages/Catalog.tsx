import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Wind, Wrench, Sparkles, Camera, Settings, Package, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BrushMachinesCatalog } from '@/components/catalog/BrushMachinesCatalog';
import { VacuumEquipmentCatalog } from '@/components/catalog/VacuumEquipmentCatalog';
import { FilterEquipmentCatalog } from '@/components/catalog/FilterEquipmentCatalog';
import { DisinfectionEquipmentCatalog } from '@/components/catalog/DisinfectionEquipmentCatalog';
import { VideoInspectionCatalog } from '@/components/catalog/VideoInspectionCatalog';
import { CompressorEquipmentCatalog } from '@/components/catalog/CompressorEquipmentCatalog';
import { AccessoriesCatalog } from '@/components/catalog/AccessoriesCatalog';
import brushMachinesMain from '@/assets/brush-machines-main-1-1.png';
import flexibleShafts31 from '@/assets/flexible-shafts-3-1.png';
import dryCleaning31 from '@/assets/dry-cleaning-3-1.png';
import greaseRemoval31 from '@/assets/grease-removal-3-1.png';
import vacuumEquipmentMain11 from '@/assets/vacuum-equipment-main-1-1.png';
import vacuumEquipment31 from '@/assets/vacuum-equipment-3-1.png';
import filterEquipmentSquare from '@/assets/filter-equipment-square.png';
import disinfectionSquareV2 from '@/assets/disinfection-square-v2.png';
import disinfectionBannerV2 from '@/assets/disinfection-banner-v2.png';
import videoInspectionSquareV2 from '@/assets/video-inspection-square-v2.png';
import videoInspectionBannerV2 from '@/assets/video-inspection-banner-v2.png';
import videoCameras31 from '@/assets/video-cameras-3-1.png';
import scannerLocators31 from '@/assets/scanner-locators-3-1.png';
import compressorSquareV2 from '@/assets/compressor-square-v2.png';
import accessories31 from '@/assets/accessories-3-1.png';

const brushEquipmentImages: Record<string, string> = {
  'default': brushMachinesMain,
  'flexible-shafts': flexibleShafts31,
  'dry-cleaning': dryCleaning31,
  'grease-removal': greaseRemoval31,
};

const vacuumEquipmentImages: Record<string, string> = {
  'default': vacuumEquipmentMain11,
  'inside': vacuumEquipment31,
};

const filterEquipmentImages: Record<string, string> = {
  'default': filterEquipmentSquare,
};

const disinfectionEquipmentImages: Record<string, string> = {
  'default': disinfectionSquareV2,
  'inside': disinfectionBannerV2,
};

const videoInspectionImages: Record<string, string> = {
  default: videoInspectionSquareV2,
  'inspection-cameras': videoCameras31,
  locators: scannerLocators31,
  // fallback для подкатегорий без отдельного изображения 3:1
  inside: videoInspectionBannerV2,
};

const compressorEquipmentImages: Record<string, string> = {
  'default': compressorSquareV2,
};

const accessoriesImages: Record<string, string> = {
  'default': accessories31,
};

interface Category {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  hasDetailedCatalog?: boolean;
  products?: string[];
  image: string;
}

const categories: Category[] = [
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
    description: 'Щётки, центраторы, адаптеры, заглушки и другие комплектующие для оборудования Pressovac.',
    hasDetailedCatalog: true,
    image: 'from-emerald-500 to-emerald-600',
  },
];

const Catalog = () => {
  const [brushEquipmentImage, setBrushEquipmentImage] = useState<string>('default');
  const [vacuumImage, setVacuumImage] = useState<string>('default');
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

  const handleVacuumSubcategoryChange = (subcategoryId: string | null) => {
    setVacuumImage(subcategoryId ? 'inside' : 'default');
  };

  const handleDisinfectionSubcategoryChange = (subcategoryId: string | null) => {
    setDisinfectionImage(subcategoryId ? 'inside' : 'default');
  };

  const handleVideoSubcategoryChange = (subcategoryId: string | null) => {
    setVideoImage(subcategoryId || 'default');
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
            
            {/* Плашка Публичная оферта */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full border border-border bg-background/50 hover:bg-background/80 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <FileText className="w-4 h-4" />
                  Публичная оферта
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Публичная Оферта</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                  <p className="font-semibold text-foreground">
                    Информация, размещенная на сайте, не является публичной офертой
                  </p>
                  
                  <p>
                    1. Вся представленная на сайте информация, касающаяся технических характеристик, 
                    наличия на складе, стоимости товаров, носит информационный характер и ни при каких 
                    условиях не является публичной офертой, определяемой положениями Статьи 437(2) 
                    Гражданского кодекса РФ.
                  </p>
                  
                  <p>
                    2. Нажатие на кнопки «Купить», «Разместить заказ», «Оформить заказ», а также 
                    последующее заполнение тех или иных форм, не накладывает на владельцев сайта 
                    никаких обязательств.
                  </p>
                  
                  <p>
                    3. Присланное по e-mail сообщение, содержащее копию заполненной формы заявки 
                    на сайте, не является ответом на сообщение потребителя или подтверждением заказа 
                    со стороны владельцев сайта.
                  </p>
                  
                  <p>
                    4. Все материалы, размещенные на сайте являются собственностью владельцев сайта, 
                    либо собственностью организаций, с которыми у владельцев сайта есть соглашение 
                    о размещении материалов. Копирование любой информации может повлечь за собой 
                    уголовное преследование.
                  </p>
                  
                  <p>
                    5. Регистрируясь на сайте или оставляя тем или иным способом свою персональную 
                    информацию, Вы делегируете право сотрудникам компании обрабатывать вашу 
                    персональную информацию.
                  </p>
                  
                  <p>
                    6. Для аналитических целей на сайте работает система статистики, которая 
                    собирает информацию о посещенных страницах сайта, заполненных формах и т.д. 
                    Сотрудники компании имеют доступ к этой информации.
                  </p>
                  
                  <p>
                    7. Покупатель соглашается с тем, что Интернет-магазин вправе передавать информацию 
                    о размещенных Покупателем заказах третьим лицам. Переданная Интернет-магазином 
                    информация, включающая данные о номере и содержании заказа, электронного адреса 
                    и номера телефона Покупателя, может быть использована исключительно в целях 
                    оценки деятельности Интернет-магазина и улучшения качества обслуживания Покупателей.
                  </p>
                  
                  <p>
                    8. Оформляя заказ на сайте или иным способом становясь клиентом нашей компании, 
                    вы принимаете условия оферты.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
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
                      // Внутренние (подкатегории): изображение должно заполнять высоту блока слева
                      (category.id === 'brush-machines' && brushEquipmentImage !== 'default') ||
                      (category.id === 'vacuum' && vacuumImage === 'inside') ||
                      (category.id === 'disinfection' && disinfectionImage === 'inside') ||
                      (category.id === 'video' && videoImage !== 'default')
                        ? 'bg-muted min-h-[320px] md:min-h-0'
                        : category.id === 'accessories'
                          ? 'bg-muted min-h-[320px] md:min-h-0'
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
                        className={`w-full h-full ${brushEquipmentImage === 'default' ? 'object-cover' : 'object-contain'} object-center`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : category.id === 'vacuum' ? (
                      <motion.img 
                        key={vacuumImage}
                        src={vacuumEquipmentImages[vacuumImage]} 
                        alt={category.title}
                        className={`w-full h-full ${vacuumImage === 'default' ? 'object-cover' : 'object-contain'} object-center`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
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
                        className={`w-full h-full ${disinfectionImage === 'default' ? 'object-cover' : 'object-contain'} object-center`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        loading="lazy"
                      />
                    ) : category.id === 'video' ? (
                      <motion.img
                        key={videoImage}
                        src={videoInspectionImages[videoImage] || videoInspectionImages.inside}
                        alt={category.title}
                        className={`w-full h-full ${videoImage === 'default' ? 'object-cover' : 'object-contain'} object-center`}
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
                    ) : category.id === 'accessories' ? (
                      <img 
                        src={accessoriesImages['default']} 
                        alt="Комплектующие и аксессуары Pressovac"
                        className="w-full h-full object-contain object-center"
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
                          <VacuumEquipmentCatalog onSubcategoryChange={handleVacuumSubcategoryChange} />
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
                        {category.id === 'accessories' && (
                          <AccessoriesCatalog />
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
