// Данные для раздела "Видеоинспекция и диагностика"

// Импорт изображений подкатегорий (3:1)
import videoCameras31 from '@/assets/video-cameras-3-1.webp';
import scannerLocators31 from '@/assets/scanner-locators-3-1.webp';

// Импорт изображений продуктов (3:1)
import vs200Image from '@/assets/products/vs-200.webp';
import vs250Image from '@/assets/products/vs-250.webp';
import vs25030mImage from '@/assets/products/vs-250-30m.webp';
import vs350Image from '@/assets/products/vs-350.webp';
import vs700Image from '@/assets/products/vs-700.webp';
import l200Image from '@/assets/products/l-200.webp';

// Импорт изображений аксессуаров
import centeringBrushImage from '@/assets/products/centering-brush.webp';
import cameradomesImage from '@/assets/products/camera-domes.webp';
import protectiveSleeveImage from '@/assets/products/protective-sleeve.webp';
import mobileTrolleyImage from '@/assets/products/mobile-trolley.webp';

export interface VideoInspectionProduct {
  id: string;
  name: string;
  article: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  image?: string;
  shopUrl?: string;
  price?: string;
}

export interface VideoInspectionSubcategory {
  id: string;
  title: string;
  description: string;
  image?: string;
  products: VideoInspectionProduct[];
}

export interface VideoInspectionCategory {
  subcategories: VideoInspectionSubcategory[];
}

export const videoInspectionData: VideoInspectionCategory = {
  subcategories: [
    {
      id: 'inspection-cameras',
      title: 'Инспекционные камеры',
      description: 'Профессиональные камеры для видеоинспекции воздуховодов',
      image: videoCameras31,
      products: [
        {
          id: 'vs200',
          name: 'Камера VS200, камера Ø26мм, 20м',
          article: '250.003.003',
          description: 'Модель VS200, головка камеры Ø26 мм, длина трос-кабеля 20м, угол обзора: 120°. Модуль записи отсутствует. Эти компактные камеры высокой четкости с аккумуляторными батареями отлично подходят для проверки вертикальных и горизонтальных воздуховодов.',
          features: [],
          specifications: {
            'Диаметр головки камеры': 'Ø26 мм',
            'Длина трос-кабеля': '20 м',
            'Угол обзора': '120°',
            'Модуль записи': 'Отсутствует',
            'Страна': 'Германия'
          },
          shopUrl: '/store?category=88505018',
          image: vs200Image
        },
        {
          id: 'vs250-20m',
          name: 'Камера VS250, камера Ø26мм, 20м, видео, 1 батарея',
          article: '250.003.001',
          description: 'Модель VS250, головка камеры Ø26 мм, длина трос-кабеля 20м, Угол обзора: 120°. Цифровой регистратор записи: 2 GB SD-Card. Эти компактные камеры высокой четкости с аккумуляторными батареями отлично подходят для проверки вертикальных и горизонтальных воздуховодов.',
          features: [],
          specifications: {
            'Диаметр головки камеры': 'Ø26 мм',
            'Длина трос-кабеля': '20 м',
            'Угол обзора': '120°',
            'Цифровой регистратор': '2 GB SD-Card',
            'Страна': 'Германия'
          },
          shopUrl: '/store?category=88505018',
          image: vs250Image
        },
        {
          id: 'vs250-30m',
          name: 'Камера VS250, камера Ø26мм, 30м, видео, 1 батарея',
          article: '250.003.005',
          description: 'Инспекционная камера VS250 с диаметром 26мм, кабелем 30м и функцией видеозаписи.',
          features: [
            'Диаметр камеры: 26мм',
            'Длина кабеля: 30м',
            'Видеозапись',
            '1 батарея'
          ],
          specifications: {
            'Диаметр камеры': 'Ø26мм',
            'Длина кабеля': '30м',
            'Видео': 'Да',
            'Батареи': '1',
            'Страна': 'Германия'
          },
          shopUrl: '/store?category=88505018',
          image: vs25030mImage
        },
        {
          id: 'vs350',
          name: 'Камера VS350, камера Ø40мм, 30м, видео, 2 батареи',
          article: '250.003.002',
          description: 'Модель VS350-IP67 PRO, обеспечивает оптимальную обзорность в труднодоступных местах при помощи вращающейся головки камеры Ø40 мм на 180° и 360°. Цифровой регистратор записи: 2 GB SD-Card. Зонд может менять свое положение: 180° в горизонтальной плоскости и 360° в вертикальной. Камера обладает высокой светочувствительностью, пыле- и влагозащищенностью с классом защиты IP67, а также прост в управлении.',
          features: [],
          specifications: {
            'Диаметр головки камеры': 'Ø40 мм',
            'Длина трос-кабеля': '30 м',
            'Вращение головки': '180° горизонт. / 360° вертик.',
            'Цифровой регистратор': '2 GB SD-Card',
            'Класс защиты': 'IP67',
            'Страна': 'Германия'
          },
          shopUrl: '/store?category=88505018',
          image: vs350Image
        },
        {
          id: 'vs700-hd',
          name: 'Камера VS700 HD, камера Ø40мм, 30м, 2 бат',
          article: '250.003.007',
          description: 'Модель обеспечивает то, чего ждали профессионалы: четкие изображения с качеством HD, функцию фокусировки, которая позволяет сфокусироваться на нужном месте с высоким разрешением, и удобное управление поворотно-вращающейся головкой камеры с помощью джойстика. Инспекционная система VS700 HD камера - идеальный компаньон для осмотра канализационных труб, вытяжных систем и вентиляционных каналов или промышленного оборудования.',
          features: [],
          specifications: {
            'Диаметр головки камеры': 'Ø40 мм',
            'Длина трос-кабеля': '30 м',
            'Качество изображения': 'HD',
            'Управление': 'Джойстик',
            'Страна': 'Германия'
          },
          shopUrl: '/store?category=88505018',
          image: vs700Image
        }
      ]
    },
    {
      id: 'locators',
      title: 'Сканер-локаторы',
      description: 'Оборудование для локации и сканирования',
      image: scannerLocators31,
      products: [
        {
          id: 'l200-locator',
          name: 'L200 Сканер-Локатор',
          article: '250.004.017',
          description: 'Модель предназначен для быстрого и точного измерения поврежденных участков при помощи видеосистем VS 200/250/350/700. Яркий цветной дисплей - легко читается. Простота в использовании - руководство на дисплее при локализации. Телескопическая штанга - везде легко отслеживать поврежденные участки. Держатель с мелом позволяет осуществлять прямую маркировку дефектных участков. Звуковой сигнал для ориентации в колонках или наушниках. Перекрестье и сила сигнала указывают, как далеко и в каком направлении находится поврежденный участок.',
          features: [],
          specifications: {
            'Совместимость': 'VS 200/250/350/700',
            'Дисплей': 'Цветной',
            'Телескопическая штанга': 'Да',
            'Держатель для мела': 'Да',
            'Звуковой сигнал': 'Да',
            'Страна': 'Германия'
          },
          shopUrl: '/store?category=88505018',
          image: l200Image
        }
      ]
    },
    {
      id: 'inspection-accessories',
      title: 'Аксессуары для инспекции',
      description: 'Дополнительные аксессуары для инспекционных камер',
      products: [
        {
          id: 'centering-brush-20',
          name: 'Центрирующая щетка Ø20 для VS350',
          article: '250.004.001',
          description: 'Центрирующая щетка диаметром 20мм для стабилизации камеры в воздуховодах. Крепится за головкой камеры.',
          features: [
            'Диаметр: 20мм',
            'Совместимость с VS350',
            'Крепление за головкой камеры',
            'Обеспечивает стабильное положение камеры'
          ],
          specifications: {
            'Диаметр': 'Ø20мм',
            'Совместимость': 'VS350',
            'Страна': 'Германия'
          },
          shopUrl: '/store?category=88505018',
          image: centeringBrushImage
        },
        {
          id: 'dome-caps-40',
          name: 'Сменные купола для камеры Ø40 (10 штук)',
          article: '250.004.007',
          description: 'Комплект из 10 сменных защитных куполов для камеры диаметром 40мм.',
          features: [
            'Диаметр: 40мм',
            'Комплект: 10 штук',
            'Защита линзы камеры'
          ],
          specifications: {
            'Диаметр': 'Ø40мм',
            'Количество': '10 шт.',
            'Страна': 'Германия'
          },
          shopUrl: '/store?category=88505018',
          image: cameradomesImage
        },
        {
          id: 'protective-sleeve-40',
          name: 'Защитная втулка для головки камеры Ø40',
          article: '250.004.010',
          description: 'Защитная втулка для головки камеры диаметром 40мм.',
          features: [
            'Диаметр: 40мм',
            'Защита головки камеры',
            'Износостойкий материал'
          ],
          specifications: {
            'Диаметр': 'Ø40мм',
            'Страна': 'Германия'
          },
          shopUrl: '/store?category=88505018',
          image: protectiveSleeveImage
        },
        {
          id: 'mobile-cart-vs',
          name: 'Мобильная тележка для камер серии VS',
          article: '250.004.015',
          description: 'Мобильная тележка для удобной транспортировки и хранения инспекционного оборудования VS. Подходит для каналов более 150мм.',
          features: [
            'Совместимость со всеми моделями VS',
            'Для каналов > 150мм',
            'Удобная транспортировка',
            'Компактное хранение оборудования'
          ],
          specifications: {
            'Совместимость': 'Все модели VS',
            'Для каналов': '> 150мм',
            'Страна': 'Германия'
          },
          shopUrl: '/store?category=88505018',
          image: mobileTrolleyImage
        }
      ]
    }
  ]
};
