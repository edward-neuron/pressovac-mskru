// Данные магазина - структура из YML, редактируется локально
export interface StoreProduct {
  id: string;
  name: string;
  article?: string;
  description: string;
  price: number; // в рублях
  oldPrice?: number; // для скидок
  image: string;
  images?: string[]; // галерея
  category: string;
  subcategory?: string;
  inStock: boolean;
  features?: string[];
  videoUrl?: string;
}

export interface StoreCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount?: number;
  subcategories?: { id: string; name: string }[];
}

// Категории магазина в порядке из YML
export const storeCategories: StoreCategory[] = [
  {
    id: 'kits',
    name: 'Готовые комплекты оборудования',
    description: 'Полные комплекты для различных типов очистки',
    image: '/placeholder.svg',
    productCount: 26,
    subcategories: [
      { id: 'dry-cleaning-kits', name: 'Комплекты для сухой очистки и дезинфекции' },
      { id: 'grease-removal-kits', name: 'Комплекты для мойки и удаления жировых отложений' },
      { id: 'universal-kits', name: 'Универсальные комплекты (сухая и жировая очистка)' },
      { id: 'atex-kits', name: 'Комплект оборудования с маркировкой взрывозащиты АТЕХ' },
    ]
  },
  {
    id: 'dry-cleaning',
    name: 'Машины для сухой очистки и дезинфекции',
    description: 'Электрические и пневматические щёточные машины',
    image: '/placeholder.svg',
    productCount: 27,
    subcategories: [
      { id: 'p25-p40-accessories', name: 'Аксессуары для P25 и P40' },
      { id: 'e25l-accessories', name: 'Аксессуары для E25-L' },
      { id: 'e20-ebox-accessories', name: 'Аксессуары для E-20/E-20S/E-BOX' },
    ]
  },
  {
    id: 'atex',
    name: 'Машины с маркировкой взрывозащиты ATEX',
    description: 'Оборудование для работы во взрывоопасных средах',
    image: '/placeholder.svg',
    productCount: 6,
    subcategories: [
      { id: 'p40-atex-accessories', name: 'Аксессуары для пневматической машины P40 ATEX' },
    ]
  },
  {
    id: 'grease-removal',
    name: 'Машины для мойки и удаления жира',
    description: 'Моющие машины для кухонных вытяжек и жировых отложений',
    image: '/placeholder.svg',
    productCount: 29,
    subcategories: [
      { id: 'pdw-accessories', name: 'Аксессуары для PDW' },
      { id: 'edw-accessories', name: 'Аксессуары для EDW' },
    ]
  },
  {
    id: 'disinfection',
    name: 'Оборудование для дезинфекции',
    description: 'Баки, насадки и комплектующие для обработки',
    image: '/placeholder.svg',
    productCount: 7,
  },
  {
    id: 'vacuum-su',
    name: 'Вакуумные Всасывающие установки SU series',
    description: 'Мощные вакуумные установки для сбора загрязнений',
    image: '/placeholder.svg',
    productCount: 6,
  },
  {
    id: 'vacuum-sfu',
    name: 'Фильтро-Вакуумные Установки SFU series',
    description: 'Установки со встроенной фильтрацией',
    image: '/placeholder.svg',
    productCount: 4,
  },
  {
    id: 'filter',
    name: 'Фильтрующие установки FU series',
    description: 'Фильтрующие блоки и системы очистки воздуха',
    image: '/placeholder.svg',
    productCount: 4,
  },
  {
    id: 'flexible-shafts',
    name: 'Гибкие вращающиеся валы Pressovac',
    description: 'Гибкие валы для передачи вращения к щёткам',
    image: '/placeholder.svg',
    productCount: 17,
    subcategories: [
      { id: 'shafts-mini', name: 'Гибкие валы Мини' },
      { id: 'shafts-standard', name: 'Гибкие валы Стандарт' },
      { id: 'shafts-steel', name: 'Гибкие валы Сталь' },
      { id: 'shafts-accessories', name: 'Аксессуары для гибких валов Стандарт и Сталь' },
    ]
  },
  {
    id: 'brushes',
    name: 'Чистящие щётки Pressovac',
    description: 'Щётки различных типов и диаметров',
    image: '/placeholder.svg',
    productCount: 18,
    subcategories: [
      { id: 'brushes-v-type', name: 'КОМПЛЕКТЫ щёток V-тип для Супер Гибких валов Мини' },
      { id: 'brushes-e-type', name: 'КОМПЛЕКТЫ щёток E-тип (гибкие валы и электрические машины Е-20/30)' },
      { id: 'brushes-c-type', name: 'КОМПЛЕКТЫ щёток C-тип (для моющих машин EDW и валов CS-Combi)' },
      { id: 'brushes-s-type', name: 'КОМПЛЕКТЫ щёток S-тип для всех типов щёточных машин' },
      { id: 'brushes-l-type', name: 'КОМПЛЕКТЫ щёток L-тип (для всех Пневматических машин и E25-L)' },
    ]
  },
  {
    id: 'duct-accessories',
    name: 'Аксессуары к воздуховодам',
    description: 'Шланги, лючки, адаптеры, заглушки и скребки',
    image: '/placeholder.svg',
    productCount: 42,
    subcategories: [
      { id: 'flex-hoses', name: 'Гибкие армированные шланги' },
      { id: 'round-hatches', name: 'Лючки для круглых воздуховодов' },
      { id: 'rect-hatches', name: 'Лючки для прямоугольных каналов' },
      { id: 'adapters', name: 'Конусы, Врезки, Адаптеры, Переходники' },
      { id: 'barriers', name: 'Барьерные заградительные заглушки' },
      { id: 'scrapers', name: 'Скребки для удаления твердых отложений' },
    ]
  },
  {
    id: 'video',
    name: 'Видео-инспекционное оборудование',
    description: 'Камеры и системы для визуального контроля воздуховодов',
    image: '/placeholder.svg',
    productCount: 9,
  },
  {
    id: 'compressors',
    name: 'Компрессоры',
    description: 'Компрессоры для пневматического оборудования',
    image: '/placeholder.svg',
    productCount: 1,
  },
  {
    id: 'training',
    name: 'Комплексный план обучения',
    description: 'Обучение работе с оборудованием Pressovac',
    image: '/placeholder.svg',
    productCount: 1,
  },
];

// Примеры товаров (позже заменятся на реальные данные из YML)
export const storeProducts: StoreProduct[] = [
  // Готовые комплекты
  {
    id: 'kit-6',
    name: 'Чистящий комплект №6',
    article: '201.001.106',
    description: 'Комплект для очистки медицинских, офисных и административных зданий',
    price: 2699500,
    image: '/placeholder.svg',
    category: 'kits',
    subcategory: 'dry-cleaning-kits',
    inStock: true,
    features: ['P-40 Пневматическая машина', 'SU-100 Вакуумная установка', 'F-100 Фильтрующий блок', '9 единиц в комплекте']
  },
  {
    id: 'kit-5',
    name: 'Чистящий комплект №5',
    article: '201.001.105',
    description: 'Комплект для очистки воздуховодов до 800 мм',
    price: 2357040,
    image: '/placeholder.svg',
    category: 'kits',
    subcategory: 'dry-cleaning-kits',
    inStock: true,
    features: ['P-25 Пневматическая машина', 'SU-2,2 кВт Вакуумная установка', 'F-100 Фильтрующий блок', '8 единиц в комплекте']
  },
  // Машины для сухой очистки
  {
    id: 'e-20',
    name: 'Электрическая щёточная машина E-20',
    article: '101.020.001',
    description: 'Компактная электрическая щёточная машина',
    price: 189000,
    image: '/placeholder.svg',
    category: 'dry-cleaning',
    inStock: true,
    features: ['До Ø200 мм', 'Регулировка оборотов', 'Реверс']
  },
  {
    id: 'e-25l',
    name: 'Электрическая щёточная машина E25-L',
    article: '101.025.001',
    description: 'Профессиональная машина с увеличенной длиной вала',
    price: 389000,
    image: '/placeholder.svg',
    category: 'dry-cleaning',
    inStock: true,
    features: ['Длина вала 25 м', 'Для больших объектов', 'Высокая производительность']
  },
  {
    id: 'e-30',
    name: 'Электрическая щёточная машина E-30',
    article: '101.030.001',
    description: 'Мощная щёточная машина для крупных воздуховодов',
    price: 245000,
    image: '/placeholder.svg',
    category: 'dry-cleaning',
    inStock: true,
    features: ['До Ø300 мм', 'Мощный мотор', 'Регулировка скорости']
  },
  {
    id: 'p-25',
    name: 'Пневматическая щёточная машина P25',
    article: '102.025.001',
    description: 'Пневматическая щётка для работы с компрессором',
    price: 125000,
    image: '/placeholder.svg',
    category: 'dry-cleaning',
    inStock: true,
    features: ['Пневмопривод', 'Длина 25 м', 'Искробезопасность']
  },
  {
    id: 'p-40',
    name: 'Пневматическая щёточная машина P40',
    article: '102.040.001',
    description: 'Пневматическая щётка увеличенной мощности',
    price: 185000,
    image: '/placeholder.svg',
    category: 'dry-cleaning',
    inStock: true,
    features: ['Пневмопривод', 'Длина 40 м', 'Для крупных объектов']
  },
  // ATEX
  {
    id: 'p-40-atex',
    name: 'Пневматическая машина P40 ATEX',
    article: '102.040.ATEX',
    description: 'Взрывозащищённая пневматическая машина',
    price: 295000,
    image: '/placeholder.svg',
    category: 'atex',
    inStock: true,
    features: ['Маркировка ATEX', 'Взрывобезопасность', 'Для опасных сред']
  },
  // Машины для удаления жира
  {
    id: 'pdw-15',
    name: 'Моющая машина PDW-15',
    article: '103.015.001',
    description: 'Пневматическая моющая машина',
    price: 225000,
    image: '/placeholder.svg',
    category: 'grease-removal',
    inStock: true,
    features: ['Пневмопривод', 'Подача воды', 'Для жировых отложений']
  },
  {
    id: 'edw-15',
    name: 'Моющая машина EDW-15',
    article: '103.015.002',
    description: 'Электрическая моющая машина',
    price: 285000,
    image: '/placeholder.svg',
    category: 'grease-removal',
    inStock: true,
    features: ['Электропривод', 'Высокое давление', 'Эффективное удаление жира']
  },
  // Дезинфекция
  {
    id: 'd-tank-10',
    name: 'Бак дезинфекции 10 л',
    article: '301.010.001',
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
    article: '301.001.001',
    description: 'Распылительная насадка для равномерного нанесения',
    price: 18500,
    image: '/placeholder.svg',
    category: 'disinfection',
    inStock: true,
    features: ['Мелкодисперсное распыление', 'Регулировка потока']
  },
  // Вакуумные установки SU
  {
    id: 'su-50',
    name: 'Вакуумная установка SU-50',
    article: '201.050.001',
    description: 'Переносная вакуумная установка 5000 м³/час',
    price: 485000,
    image: '/placeholder.svg',
    category: 'vacuum-su',
    inStock: true,
    features: ['Производительность 5000 м³/ч', 'Регулировка мощности', 'Компактная']
  },
  {
    id: 'su-100',
    name: 'Вакуумная установка SU-100',
    article: '201.100.001',
    description: 'Профессиональная установка 10000 м³/час',
    price: 625000,
    image: '/placeholder.svg',
    category: 'vacuum-su',
    inStock: true,
    features: ['Производительность 10000 м³/ч', 'Для больших объектов', 'Высокое разрежение']
  },
  // Фильтро-вакуумные SFU
  {
    id: 'sfu-10',
    name: 'Фильтро-вакуумная установка SFU-10',
    article: '202.010.001',
    description: 'Компактная установка со встроенным фильтром',
    price: 385000,
    image: '/placeholder.svg',
    category: 'vacuum-sfu',
    inStock: true,
    features: ['Встроенный фильтр', 'Компактная', 'Для небольших объектов']
  },
  {
    id: 'sfu-25',
    name: 'Фильтро-вакуумная установка SFU-25',
    article: '202.025.001',
    description: 'Установка со встроенным фильтром средней мощности',
    price: 545000,
    image: '/placeholder.svg',
    category: 'vacuum-sfu',
    inStock: true,
    features: ['Встроенный фильтр', 'Автоочистка', 'Для средних объектов']
  },
  {
    id: 'sfu-50',
    name: 'Фильтро-вакуумная установка SFU-50',
    article: '202.050.001',
    description: 'Мощная установка со встроенным фильтром',
    price: 685000,
    image: '/placeholder.svg',
    category: 'vacuum-sfu',
    inStock: true,
    features: ['Встроенный фильтр', 'Высокая производительность', 'Для крупных объектов']
  },
  // Фильтрующие установки
  {
    id: 'f-50',
    name: 'Фильтрующий блок F-50',
    article: '203.050.001',
    description: 'Фильтрующий блок 4300-5000 м³/час',
    price: 185000,
    image: '/placeholder.svg',
    category: 'filter',
    inStock: true,
    features: ['До 5000 м³/ч', 'Фильтры G3+F7', 'Лёгкая конструкция']
  },
  {
    id: 'f-100',
    name: 'Фильтрующий блок F-100',
    article: '203.100.001',
    description: 'Фильтрующий блок 8600-10000 м³/час',
    price: 245000,
    image: '/placeholder.svg',
    category: 'filter',
    inStock: true,
    features: ['До 10000 м³/ч', 'Фильтры G3+F7', 'Для крупных объектов']
  },
  // Гибкие валы
  {
    id: 'fs-mini-3m',
    name: 'Гибкий вал Мини 3 м',
    article: '401.003.001',
    description: 'Супер гибкий вал для узких воздуховодов',
    price: 18000,
    image: '/placeholder.svg',
    category: 'flexible-shafts',
    subcategory: 'shafts-mini',
    inStock: true,
    features: ['Длина 3 м', 'Супер гибкий', 'Для узких каналов']
  },
  {
    id: 'fs-standard-5m',
    name: 'Гибкий вал Стандарт 5 м',
    article: '401.005.001',
    description: 'Стандартный гибкий вал',
    price: 32000,
    image: '/placeholder.svg',
    category: 'flexible-shafts',
    subcategory: 'shafts-standard',
    inStock: true,
    features: ['Длина 5 м', 'Высокая гибкость', 'Универсальный']
  },
  {
    id: 'fs-steel-5m',
    name: 'Гибкий вал Сталь 5 м',
    article: '401.005.002',
    description: 'Стальной гибкий вал повышенной прочности',
    price: 45000,
    image: '/placeholder.svg',
    category: 'flexible-shafts',
    subcategory: 'shafts-steel',
    inStock: true,
    features: ['Длина 5 м', 'Сталь', 'Повышенная прочность']
  },
  // Щётки
  {
    id: 'brush-set-s',
    name: 'Комплект щёток S-тип (7 шт)',
    article: '501.007.001',
    description: 'Набор щёток для щёточных машин',
    price: 45000,
    image: '/placeholder.svg',
    category: 'brushes',
    subcategory: 'brushes-s-type',
    inStock: true,
    features: ['7 размеров', 'Ø200-Ø800 мм', 'Износостойкий ворс']
  },
  // Аксессуары к воздуховодам
  {
    id: 'hose-10m',
    name: 'Гибкий армированный шланг 10 м',
    article: '601.010.001',
    description: 'Армированный вакуумный шланг',
    price: 28000,
    image: '/placeholder.svg',
    category: 'duct-accessories',
    subcategory: 'flex-hoses',
    inStock: true,
    features: ['Диаметр 315 мм', 'Длина 10 м', 'Антистатик']
  },
  // Видеоинспекция
  {
    id: 'vs-200',
    name: 'Видеосистема VS-200',
    article: '701.200.001',
    description: 'Видеосистема для инспекции воздуховодов',
    price: 320000,
    image: '/placeholder.svg',
    category: 'video',
    inStock: true,
    features: ['HD камера', 'LED подсветка', 'Кабель 30 м', 'Германия']
  },
  {
    id: 'vs-350',
    name: 'Видеосистема VS-350',
    article: '701.350.001',
    description: 'Профессиональная видеосистема с увеличенным радиусом',
    price: 485000,
    image: '/placeholder.svg',
    category: 'video',
    inStock: true,
    features: ['Поворотная камера', 'Монитор 7"', 'Кабель 50 м', 'Германия']
  },
  // Компрессоры
  {
    id: 'compressor-1',
    name: 'Компрессор KAESER',
    article: '801.001.001',
    description: 'Профессиональный компрессор для пневмооборудования',
    price: 185000,
    image: '/placeholder.svg',
    category: 'compressors',
    inStock: true,
    features: ['Высокая производительность', 'Надёжность', 'Низкий уровень шума']
  },
  // Обучение
  {
    id: 'training-full',
    name: 'Комплексный план обучения',
    article: '901.001.001',
    description: 'Полный курс обучения работе с оборудованием Pressovac',
    price: 85000,
    image: '/placeholder.svg',
    category: 'training',
    inStock: true,
    features: ['Теория и практика', 'Сертификат', 'Поддержка после обучения']
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
