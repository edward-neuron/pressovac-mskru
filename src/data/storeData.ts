// Данные магазина - временно из YML, потом будут храниться локально
export interface StoreProduct {
  id: string;
  name: string;
  article?: string;
  description: string;
  price: number; // в рублях
  oldPrice?: number; // для скидок
  image: string;
  category: string;
  subcategory?: string;
  inStock: boolean;
  features?: string[];
}

export interface StoreCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  subcategories?: { id: string; name: string }[];
}

// Категории магазина
export const storeCategories: StoreCategory[] = [
  {
    id: 'vacuum',
    name: 'Вакуумные установки',
    description: 'Мощные системы для сбора загрязнений из воздуховодов',
    image: '/placeholder.svg',
    subcategories: [
      { id: 'portable', name: 'Переносные' },
      { id: 'mobile', name: 'Мобильные' },
      { id: 'filter', name: 'С фильтрацией' },
    ]
  },
  {
    id: 'brush',
    name: 'Щёточные машины',
    description: 'Электрические и пневматические щётки для очистки',
    image: '/placeholder.svg',
    subcategories: [
      { id: 'electric', name: 'Электрические' },
      { id: 'pneumatic', name: 'Пневматические' },
    ]
  },
  {
    id: 'video',
    name: 'Видеоинспекция',
    description: 'Камеры и оборудование для диагностики',
    image: '/placeholder.svg',
  },
  {
    id: 'disinfection',
    name: 'Дезинфекция',
    description: 'Баки, насадки и оборудование для обработки',
    image: '/placeholder.svg',
  },
  {
    id: 'accessories',
    name: 'Аксессуары',
    description: 'Шланги, насадки, адаптеры и расходники',
    image: '/placeholder.svg',
  },
];

// Примеры товаров (позже заменятся на реальные данные)
export const storeProducts: StoreProduct[] = [
  // Вакуумные установки
  {
    id: 'su-50',
    name: 'SU-50',
    article: 'SU-50',
    description: 'Переносная вакуумная установка для работы внутри помещений',
    price: 485000,
    image: '/placeholder.svg',
    category: 'vacuum',
    subcategory: 'portable',
    inStock: true,
    features: ['Мощность 3 кВт', 'Разрежение 25 кПа', 'Компактная']
  },
  {
    id: 'su-100',
    name: 'SU-100',
    article: 'SU-100',
    description: 'Профессиональная установка повышенной мощности',
    price: 625000,
    image: '/placeholder.svg',
    category: 'vacuum',
    subcategory: 'portable',
    inStock: true,
    features: ['Мощность 5.5 кВт', 'Разрежение 28 кПа', 'Для больших объектов']
  },
  {
    id: 'sfu-25',
    name: 'SFU-25',
    article: 'SFU-25',
    description: 'Фильтро-вакуумная установка со встроенным фильтром',
    price: 545000,
    image: '/placeholder.svg',
    category: 'vacuum',
    subcategory: 'filter',
    inStock: true,
    features: ['Встроенный фильтр', 'Разрежение 22 кПа', 'Автоочистка']
  },
  // Щёточные машины
  {
    id: 'e-20',
    name: 'E-20',
    article: 'E-20',
    description: 'Компактная электрическая щёточная машина',
    price: 189000,
    image: '/placeholder.svg',
    category: 'brush',
    subcategory: 'electric',
    inStock: true,
    features: ['До Ø200 мм', 'Регулировка оборотов', 'Реверс']
  },
  {
    id: 'e-30',
    name: 'E-30',
    article: 'E-30',
    description: 'Профессиональная щёточная машина для крупных воздуховодов',
    price: 245000,
    image: '/placeholder.svg',
    category: 'brush',
    subcategory: 'electric',
    inStock: true,
    features: ['До Ø300 мм', 'Мощный мотор', 'Регулировка скорости']
  },
  {
    id: 'p-25',
    name: 'P-25 / P-40',
    article: 'P25-P40',
    description: 'Пневматические щётки для работы с компрессором',
    price: 125000,
    image: '/placeholder.svg',
    category: 'brush',
    subcategory: 'pneumatic',
    inStock: true,
    features: ['Пневмопривод', 'Высокая надёжность', 'Искробезопасность']
  },
  // Видеоинспекция
  {
    id: 'vs-200',
    name: 'VS-200',
    article: 'VS-200',
    description: 'Видеосистема для инспекции воздуховодов до Ø200 мм',
    price: 320000,
    image: '/placeholder.svg',
    category: 'video',
    inStock: true,
    features: ['HD камера', 'LED подсветка', 'Запись видео']
  },
  {
    id: 'vs-350',
    name: 'VS-350',
    article: 'VS-350',
    description: 'Профессиональная видеосистема с увеличенным радиусом',
    price: 485000,
    image: '/placeholder.svg',
    category: 'video',
    inStock: true,
    features: ['Кабель 30 м', 'Поворотная камера', 'Монитор 7"']
  },
  // Дезинфекция
  {
    id: 'd-tank-10',
    name: 'Бак дезинфекции 10 л',
    article: 'D-TANK-10',
    description: 'Бак для дезинфицирующего раствора',
    price: 45000,
    image: '/placeholder.svg',
    category: 'disinfection',
    inStock: true,
    features: ['Объём 10 л', 'Нержавеющая сталь', 'Быстросъёмный']
  },
  {
    id: 'd-nozzle',
    name: 'Насадка для дезинфекции',
    article: 'D-NOZZLE',
    description: 'Распылительная насадка для равномерного нанесения',
    price: 18500,
    image: '/placeholder.svg',
    category: 'disinfection',
    inStock: true,
    features: ['Мелкодисперсное распыление', 'Регулировка потока']
  },
  // Аксессуары
  {
    id: 'flex-shaft-5m',
    name: 'Гибкий вал 5 м',
    article: 'FS-5M',
    description: 'Гибкий приводной вал для щёточных машин',
    price: 32000,
    image: '/placeholder.svg',
    category: 'accessories',
    inStock: true,
    features: ['Длина 5 м', 'Высокая гибкость']
  },
  {
    id: 'hose-10m',
    name: 'Шланг вакуумный 10 м',
    article: 'VH-10M',
    description: 'Армированный вакуумный шланг',
    price: 28000,
    image: '/placeholder.svg',
    category: 'accessories',
    inStock: true,
    features: ['Диаметр 76 мм', 'Антистатик']
  },
  {
    id: 'brush-set',
    name: 'Комплект щёток',
    article: 'BRUSH-SET',
    description: 'Набор щёток разных диаметров',
    price: 45000,
    image: '/placeholder.svg',
    category: 'accessories',
    inStock: true,
    features: ['5 размеров', 'Износостойкий ворс']
  },
];

// Форматирование цены
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
