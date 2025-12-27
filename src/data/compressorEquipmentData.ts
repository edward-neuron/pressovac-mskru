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
        'Код товара': '210.001.001',
        'Производитель': 'Kaiser',
        'Страна производства': 'Германия',
        'Объём ресивера': '30 л',
        'Тип': 'поршневой',
        'Вес': '70 кг',
        'Давление': '10 бар',
        'Мощность': '2.2 кВт',
        'Питание': 'электричество',
        'Привод': 'прямой привод',
        'Вид': 'передвижной'
      },
      shopUrl: '#'
    }
  ]
};
