import k370Square from '@/assets/products/k-370-premium-car-square.png';
import type { Product } from '@/data/brushMachinesData';

export interface CompressorEquipmentCategory {
  products: Product[];
}

export const compressorEquipmentData: CompressorEquipmentCategory = {
  products: [
    {
      id: 'k-370-premium-car',
      name: 'K-370 Premium Car',
      article: '210.001.001',
      description:
        'Профессиональный компрессор Pressovac для питания пневмоинструмента и оборудования очистки вентиляции.',
      image: k370Square,
      features: [
        'Надёжная работа на объекте',
        'Удобная транспортировка',
        'Подходит для пневматического оборудования Pressovac'
      ],
      specifications: {
        'Модель': 'K-370 Premium Car',
        'Тип': 'Компрессор',
        'Применение': 'Питание пневмоинструмента'
      },
      shopUrl: '#'
    }
  ]
};
