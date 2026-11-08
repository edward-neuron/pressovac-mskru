import type { YmlCategory, YmlProduct } from '@/hooks/useYmlStore';

export const R40_CATEGORY_ID = 'r40-family';
export const R40_CATEGORY_NAME = 'Щеточный Мультиробот R-40 с видеоинспекцией для очистки';
export const R40_CATEGORY_DESCRIPTION =
  'Щеточный Мультиробот R-40 Brushing с видеоинспекцией для очистки от Ø400 до Ø1000 мм';

const IMAGE_ROOT = '/images/products/r40-family';

export const R40_GALLERY = [
  `${IMAGE_ROOT}/r40-gallery-01.webp`,
  `${IMAGE_ROOT}/r40-gallery-02.webp`,
  `${IMAGE_ROOT}/r40-gallery-03.webp`,
  `${IMAGE_ROOT}/r40-gallery-04.webp`,
  `${IMAGE_ROOT}/r40-gallery-05.webp`,
];

export const I40_GALLERY = [
  `${IMAGE_ROOT}/i40-gallery-01.webp`,
  `${IMAGE_ROOT}/i40-gallery-02.webp`,
  `${IMAGE_ROOT}/i40-gallery-03.webp`,
  `${IMAGE_ROOT}/i40-gallery-04.webp`,
];

export const R_BRUSH_SET_IMAGE = `${IMAGE_ROOT}/r-brush-set.webp`;
export const R40_CARD_IMAGE = `${IMAGE_ROOT}/r40-card.webp`;
export const R40_LIGHT_IMAGE = `${IMAGE_ROOT}/r40-gallery-01.webp`;
export const I40_LIGHT_IMAGE = `${IMAGE_ROOT}/i40-gallery-01.webp`;

export const R40_PRODUCT_DESCRIPTION =
  'Компактный и легкий щеточный мультиробот R-40 для чистки и осмотра круглых и прямоугольных воздуховодов до 1000 мм и длиной до 40 м.';

export const R40_KEY_FEATURES = [
  '2 в 1: функция чистки и видеоинспекции',
  'Компактный и легкий',
  'Портативный блок питания 48 В (2,6 кг)',
  'Беспроводная портативная консоль с 8-дюймовым дисплеем Full HD+ и удобным интерфейсом',
  'Регулируемая скорость робота и вращение на 360° на месте',
  'Плавная регулировка высоты чистки',
  'Регулируемая скорость и направление вращения щетки',
  'Простая замена щетки без инструментов',
  'Интенсивные светодиоды с регулируемой яркостью',
  'Три цветные камеры Full HD для визуализации в реальном времени',
  'Запись фотографий и видео в формате Full HD на съемную карту microSD 256 ГБ класса 10 (в комплекте)',
  'Цифровой счетчик дистанции',
  'Легкосъемный модуль для чистки',
  'Рекомендуемые аксессуары: набор R-щеток из 5 шт. и транспортировочный кейс',
];

const brushDescription =
  'В комплект поставки входят пять щеток типа R — по одной щетке каждого размера для воздуховодов диаметром от Ø315 до Ø800 мм; на выбор предлагаются варианты с Мягкой, Жесткой или Твердосплавной щетиной. Набор предназначен для очистки воздуховодов и совместим с мульти-роботом R-40 Brushing Robot.';

export const R40_CATEGORY: YmlCategory = {
  id: R40_CATEGORY_ID,
  name: R40_CATEGORY_NAME,
  description: R40_CATEGORY_DESCRIPTION,
  sortOrder: 1,
};

export const R40_PRODUCTS: YmlProduct[] = [
  {
    id: 'r40-brushing-robot',
    name: 'R-40 Brushing Robot',
    description: `${R40_PRODUCT_DESCRIPTION}\n\nДиапазон очистки: Ø 400-1000 мм. Рабочий вылет: до 40 м.`,
    price: '2 769 890 ₽',
    priceNum: 2769890,
    url: '',
    picture: R40_LIGHT_IMAGE,
    categoryId: R40_CATEGORY_ID,
    sortOrder: 0,
  },
  {
    id: 'i40-inspection-robot',
    name: 'I-40 Inspection Robot',
    description: 'Инспекционный робот для осмотра воздуховодов. Минимальный размер канала: 150 мм по высоте и 250 мм по ширине.',
    price: '1 481 570 ₽',
    priceNum: 1481570,
    url: '',
    picture: I40_LIGHT_IMAGE,
    categoryId: R40_CATEGORY_ID,
    sortOrder: 1,
  },
  {
    id: 'r40-transport-case',
    name: 'Кейс для транспортировки R-40',
    description: 'Транспортировочный кейс для робота R-40.',
    price: '103 340 ₽',
    priceNum: 103340,
    url: '',
    categoryId: R40_CATEGORY_ID,
    sortOrder: 2,
  },
  {
    id: 'r-brush-set-standard',
    name: 'Комплект щеток R-brush Стандарт (5 щеток, Ø 315–800 мм)',
    description: brushDescription,
    price: '',
    priceNum: null,
    url: '',
    picture: R_BRUSH_SET_IMAGE,
    categoryId: R40_CATEGORY_ID,
    sortOrder: 3,
  },
  {
    id: 'r-brush-set-hard',
    name: 'Комплект щеток R-brush Жесткие (5 щеток, Ø 315–800 мм)',
    description: brushDescription,
    price: '',
    priceNum: null,
    url: '',
    picture: R_BRUSH_SET_IMAGE,
    categoryId: R40_CATEGORY_ID,
    sortOrder: 4,
  },
  {
    id: 'r-brush-set-abrasive',
    name: 'Комплект щеток R-brush Абразивные (5 щеток, Ø 315–800 мм)',
    description: brushDescription,
    price: '',
    priceNum: null,
    url: '',
    picture: R_BRUSH_SET_IMAGE,
    categoryId: R40_CATEGORY_ID,
    sortOrder: 5,
  },
];

export const R40_PRODUCT_IDS = new Set(R40_PRODUCTS.map((product) => product.id));
