// Данные для раздела "Щёточные машины Pressovac"

// Импорт изображений продуктов
import e20Image from '@/assets/products/e-20.png';
import e30Image from '@/assets/products/e-30.png';
import e25lImage from '@/assets/products/e-25l.png';
import p25p40Image from '@/assets/products/p25-p40.png';
import fsMiniImage from '@/assets/products/fs-mini.png';

// Импорт изображений подкатегорий (3:1)
import flexibleShafts31 from '@/assets/flexible-shafts-3-1.png';
import dryCleaning31 from '@/assets/dry-cleaning-3-1.png';
import greaseRemoval31 from '@/assets/grease-removal-3-1.png';
export interface Product {
  id: string;
  name: string;
  article: string; // Артикул для сопоставления с YML (E20, P25, PDW40 и т.д.)
  description: string;
  features: string[];
  specifications: Record<string, string>;
  availableLengths?: string[];
  image?: string;
  brochureUrl?: string;
  shopUrl?: string;
  price?: string;
  pricePrefix?: string; // "от" для товаров с разными ценами по длинам
  vendorCodePattern?: string; // Паттерн для поиска минимальной цены (например "205.001" для гибких валов Стандарт)
}

export interface Subcategory {
  id: string;
  title: string;
  description: string;
  image?: string; // Изображение подкатегории (3:1)
  products: Product[];
}

export interface BrushMachinesCategory {
  subcategories: Subcategory[];
}

export const brushMachinesData: BrushMachinesCategory = {
  subcategories: [
    {
      id: 'flexible-shafts',
      title: 'Гибкие валы',
      description: 'Гибкие валы для щёточных машин разных типов и размеров',
      image: flexibleShafts31,
      products: [
        {
          id: 'shaft-mini',
          name: 'Супер гибкий вал Мини',
          article: 'SHAFT-MINI',
          description: 'Компактный гибкий вал для очистки воздуховодов малого диаметра. Идеален для труднодоступных мест.',
          features: [
            'Диаметр воздуховодов: 50-150 мм',
            'Высокая гибкость',
            'Лёгкий вес'
          ],
          specifications: {
            'Диаметр': '8 мм',
            'Материал': 'Сталь с покрытием'
          },
          availableLengths: ['3 м', '6 м'],
          shopUrl: 'https://shop-pressovac.ru/products/gibkie-vrashchayushchiesya-valy-pressovac-f88504918/',
          pricePrefix: 'от',
          vendorCodePattern: '205.004',
          image: fsMiniImage
        },
        {
          id: 'shaft-standard',
          name: 'Гибкий вал Стандарт',
          article: 'SHAFT-STD',
          description: 'Универсальный гибкий вал для стандартных воздуховодов круглого и прямоугольного сечения.',
          features: [
            'Диаметр воздуховодов: 100-400 мм',
            'Универсальное применение',
            'Надёжная конструкция'
          ],
          specifications: {
            'Диаметр': '12 мм',
            'Материал': 'Высокопрочная сталь'
          },
          availableLengths: ['3 м', '5 м', '8 м', '12 м', '15 м', '20 м'],
          shopUrl: 'https://shop-pressovac.ru/products/gibkie-vrashchayushchiesya-valy-pressovac-f88504918/',
          pricePrefix: 'от',
          vendorCodePattern: '205.001'
        },
        {
          id: 'shaft-steel',
          name: 'Стальной вал',
          article: 'SHAFT-STEEL',
          description: 'Усиленный стальной вал для интенсивной эксплуатации и тяжёлых загрязнений.',
          features: [
            'Диаметр воздуховодов: 200-600 мм',
            'Повышенная прочность',
            'Для тяжёлых условий'
          ],
          specifications: {
            'Диаметр': '16 мм',
            'Материал': 'Легированная сталь'
          },
          availableLengths: ['3 м', '5 м', '8 м', '12 м', '15 м', '20 м'],
          shopUrl: 'https://shop-pressovac.ru/products/gibkie-vrashchayushchiesya-valy-pressovac-f88504918/',
          pricePrefix: 'от',
          vendorCodePattern: '205.002'
        }
      ]
    },
    {
      id: 'dry-cleaning',
      title: 'Машины для сухой очистки',
      description: 'Щёточные машины для сухой очистки воздуховодов от пыли и сухих загрязнений',
      image: dryCleaning31,
      products: [
        {
          id: 'dry-electric-e20',
          name: 'Pressovac E-20',
          article: '201.002.003',
          description: 'Электрическая щёточная машина для очистки воздуховодов диаметром до 500 мм.',
          features: [
            'Длина вала: 20 м',
            'Очистка воздуховодов до Ø500 мм',
            'Электрический привод',
            'Надёжная конструкция'
          ],
          specifications: {
            'Длина вала': '20 м',
            'Макс. диаметр': 'Ø500 мм',
            'Тип привода': 'Электрический',
            'Страна': 'Финляндия'
          },
          image: e20Image
        },
        {
          id: 'dry-electric-e30',
          name: 'Pressovac E-30',
          article: '201.002.014',
          description: 'Электрическая щёточная машина с увеличенной длиной вала для очистки воздуховодов диаметром до 500 мм.',
          features: [
            'Длина вала: 30 м',
            'Очистка воздуховодов до Ø500 мм',
            'Электрический привод',
            'Для протяжённых систем'
          ],
          specifications: {
            'Длина вала': '30 м',
            'Макс. диаметр': 'Ø500 мм',
            'Тип привода': 'Электрический',
            'Страна': 'Финляндия'
          },
          image: e30Image
        },
        {
          id: 'dry-electric-e25l',
          name: 'Pressovac E-25L',
          article: '201.006.001',
          description: 'Электрическая щёточная машина для очистки воздуховодов большого диаметра до 800 мм.',
          features: [
            'Длина вала: 25 м',
            'Очистка воздуховодов до Ø800 мм',
            'Электрический привод',
            'Для крупных воздуховодов'
          ],
          specifications: {
            'Длина вала': '25 м',
            'Макс. диаметр': 'Ø800 мм',
            'Тип привода': 'Электрический',
            'Страна': 'Финляндия'
          },
          image: e25lImage
        },
        {
          id: 'dry-pneumatic-p25',
          name: 'Pressovac P-25',
          article: '201.001.101',
          description: 'Пневматическая щёточная машина для очистки и дезинфекции воздуховодов диаметром до 1200 мм.',
          features: [
            'Длина вала: 25 м',
            'Очистка и дезинфекция до Ø1200 мм',
            'Пневматический привод',
            'Искробезопасность'
          ],
          specifications: {
            'Длина вала': '25 м',
            'Макс. диаметр': 'Ø1200 мм',
            'Тип привода': 'Пневматический',
            'Страна': 'Финляндия'
          },
          image: p25p40Image
        },
        {
          id: 'dry-pneumatic-p40',
          name: 'Pressovac P-40',
          article: '201.001.102',
          description: 'Пневматическая щёточная машина с максимальной длиной вала для очистки и дезинфекции крупных воздуховодов.',
          features: [
            'Длина вала: 40 м',
            'Очистка и дезинфекция до Ø1200 мм',
            'Пневматический привод',
            'Для протяжённых систем'
          ],
          specifications: {
            'Длина вала': '40 м',
            'Макс. диаметр': 'Ø1200 мм',
            'Тип привода': 'Пневматический',
            'Страна': 'Финляндия'
          },
          image: p25p40Image
        }
      ]
    },
    {
      id: 'grease-removal',
      title: 'Машины для удаления жира',
      description: 'Специализированные машины для очистки кухонных вытяжек и жировых отложений',
      image: greaseRemoval31,
      products: [
        {
          id: 'grease-electric-cs8',
          name: 'Pressovac CS-8 Combi',
          article: '205.008.008',
          description: 'Комбинированный моющий вал для удаления жировых отложений из воздуховодов.',
          features: [
            'Длина вала: 8 м',
            'Комбинированная очистка',
            'Электрический привод',
            'Для кухонных вытяжек'
          ],
          specifications: {
            'Длина вала': '8 м',
            'Тип': 'Комбинированный',
            'Страна': 'Финляндия'
          }
        },
        {
          id: 'grease-electric-edw15',
          name: 'Pressovac EDW-15',
          article: '201.005.001',
          description: 'Электрическая моющая машина для очистки жировых отложений из воздуховодов.',
          features: [
            'Длина вала: 15 м',
            'Очистка воздуховодов до Ø350 мм',
            'Электрический привод',
            'Для протяжённых кухонных систем'
          ],
          specifications: {
            'Длина вала': '15 м',
            'Макс. диаметр': 'Ø350 мм',
            'Тип привода': 'Электрический',
            'Страна': 'Финляндия'
          }
        },
        {
          id: 'grease-pneumatic-pdw25',
          name: 'Pressovac PDW-25',
          article: '201.004.011',
          description: 'Пневматическая моющая машина для универсальной очистки воздуховодов диаметром до 1200 мм.',
          features: [
            'Длина вала: 25 м',
            'Универсальная очистка до Ø1200 мм',
            'Пневматический привод',
            'Для промышленных кухонь'
          ],
          specifications: {
            'Длина вала': '25 м',
            'Макс. диаметр': 'Ø1200 мм',
            'Тип привода': 'Пневматический',
            'Страна': 'Финляндия'
          }
        },
        {
          id: 'grease-pneumatic-pdw30',
          name: 'Pressovac PDW-30',
          article: '201.004.012',
          description: 'Пневматическая моющая машина с увеличенной длиной вала для крупных систем.',
          features: [
            'Длина вала: 30 м',
            'Универсальная очистка до Ø1200 мм',
            'Пневматический привод',
            'Для протяжённых систем'
          ],
          specifications: {
            'Длина вала': '30 м',
            'Макс. диаметр': 'Ø1200 мм',
            'Тип привода': 'Пневматический',
            'Страна': 'Финляндия'
          }
        },
        {
          id: 'grease-pneumatic-pdw40',
          name: 'Pressovac PDW-40',
          article: '201.004.013',
          description: 'Пневматическая моющая машина максимальной длины для очистки протяжённых вентиляционных систем.',
          features: [
            'Длина вала: 40 м',
            'Универсальная очистка до Ø1200 мм',
            'Пневматический привод',
            'Максимальный охват'
          ],
          specifications: {
            'Длина вала': '40 м',
            'Макс. диаметр': 'Ø1200 мм',
            'Тип привода': 'Пневматический',
            'Страна': 'Финляндия'
          }
        }
      ]
    }
  ]
};
