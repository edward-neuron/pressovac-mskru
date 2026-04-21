// Данные для раздела "Оборудование для дезинфекции"

// Импорт изображений подкатегорий (3:1)
import disinfectionTanks31 from '@/assets/disinfection-tanks-3-1.webp';
import disinfectionNozzles31 from '@/assets/disinfection-nozzles-3-1.webp';

// Импорт изображений продуктов (3:1)
import dTanksImage from '@/assets/products/disinfection-tanks-all.webp';
import dNozzleImage from '@/assets/products/d-nozzle.webp';

export interface DisinfectionProduct {
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

export interface DisinfectionSubcategory {
  id: string;
  title: string;
  description: string;
  image?: string;
  products: DisinfectionProduct[];
}

export interface DisinfectionEquipmentCategory {
  subcategories: DisinfectionSubcategory[];
}

export const disinfectionEquipmentData: DisinfectionEquipmentCategory = {
  subcategories: [
    {
      id: 'disinfection-tanks',
      title: 'Дезинфекционные баки',
      description: 'Профессиональные баки для дезинфекции вентиляционных систем',
      image: disinfectionTanks31,
      products: [
        {
          id: 'disinfection-tank-5l',
          name: 'Дезинфекционный бак 5л',
          article: '209.001.001',
          description: 'Компактный дезинфекционный бак объёмом 5 литров для небольших объектов.',
          features: [
            'Объём: 5 литров',
            'Компактные размеры',
            'Удобная транспортировка'
          ],
          specifications: {
            'Объём': '5 л',
            'Страна': 'Финляндия'
          },
          shopUrl: '/store?category=88504943',
          image: dTanksImage
        },
        {
          id: 'disinfection-tank-10l',
          name: 'Дезинфекционный бак 10л',
          article: '209.001.002',
          description: 'Дезинфекционный бак объёмом 10 литров для средних объектов.',
          features: [
            'Объём: 10 литров',
            'Оптимальный размер',
            'Высокая производительность'
          ],
          specifications: {
            'Объём': '10 л',
            'Страна': 'Финляндия'
          },
          shopUrl: '/store?category=88504943',
          image: dTanksImage
        },
        {
          id: 'disinfection-tank-20l',
          name: 'Дезинфекционный бак 20л',
          article: '209.002.002',
          description: 'Большой дезинфекционный бак объёмом 20 литров для крупных промышленных объектов.',
          features: [
            'Объём: 20 литров',
            'Для крупных объектов',
            'Высокая производительность'
          ],
          specifications: {
            'Объём': '20 л',
            'Страна': 'Финляндия'
          },
          shopUrl: '/store?category=88504943',
          image: dTanksImage
        }
      ]
    },
    {
      id: 'disinfection-nozzles',
      title: 'Дезинфекционные насадки',
      description: 'Насадки и аксессуары для дезинфекционного оборудования',
      image: disinfectionNozzles31,
      products: [
        {
          id: 'disinfection-nozzle',
          name: 'Дезинфекционная насадка',
          article: '209.001.003',
          description: 'Специальная насадка для равномерного распыления дезинфицирующего раствора.',
          features: [
            'Равномерное распыление',
            'Совместимость с баками',
            'Высокая эффективность'
          ],
          specifications: {
            'Тип': 'Насадка',
            'Страна': 'Финляндия'
          },
          shopUrl: '/store?category=88504943',
          image: dNozzleImage
        }
      ]
    }
  ]
};
