// Данные для раздела "Видеоинспекция и диагностика"

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
      products: [
        {
          id: 'vs200',
          name: 'Камера VS200, камера Ø26мм, 20м',
          article: '250.003.003',
          description: 'Инспекционная камера с диаметром 26мм и кабелем 20м.',
          features: [
            'Диаметр камеры: 26мм',
            'Длина кабеля: 20м',
            '1 батарея'
          ],
          specifications: {
            'Диаметр камеры': 'Ø26мм',
            'Длина кабеля': '20м',
            'Страна': 'Финляндия'
          }
        },
        {
          id: 'vs250-20m',
          name: 'Камера VS250, камера Ø26мм, 20м, видео, 1 батарея',
          article: '250.003.001',
          description: 'Инспекционная камера VS250 с диаметром 26мм, кабелем 20м и функцией видеозаписи.',
          features: [
            'Диаметр камеры: 26мм',
            'Длина кабеля: 20м',
            'Видеозапись',
            '1 батарея'
          ],
          specifications: {
            'Диаметр камеры': 'Ø26мм',
            'Длина кабеля': '20м',
            'Видео': 'Да',
            'Батареи': '1',
            'Страна': 'Финляндия'
          }
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
            'Страна': 'Финляндия'
          }
        },
        {
          id: 'vs350',
          name: 'Камера VS350, камера Ø40мм, 30м, видео, 2 батареи',
          article: '250.003.002',
          description: 'Инспекционная камера VS350 с диаметром 40мм, кабелем 30м и двумя батареями.',
          features: [
            'Диаметр камеры: 40мм',
            'Длина кабеля: 30м',
            'Видеозапись',
            '2 батареи'
          ],
          specifications: {
            'Диаметр камеры': 'Ø40мм',
            'Длина кабеля': '30м',
            'Видео': 'Да',
            'Батареи': '2',
            'Страна': 'Финляндия'
          }
        },
        {
          id: 'vs700-hd',
          name: 'Камера VS700 HD, камера Ø40мм, 30м, 2 бат',
          article: '250.003.007',
          description: 'Профессиональная HD камера VS700 с диаметром 40мм и кабелем 30м.',
          features: [
            'HD качество',
            'Диаметр камеры: 40мм',
            'Длина кабеля: 30м',
            '2 батареи'
          ],
          specifications: {
            'Диаметр камеры': 'Ø40мм',
            'Длина кабеля': '30м',
            'Качество': 'HD',
            'Батареи': '2',
            'Страна': 'Финляндия'
          }
        }
      ]
    },
    {
      id: 'locators',
      title: 'Сканер-локаторы',
      description: 'Оборудование для локации и сканирования',
      products: [
        {
          id: 'l200-locator',
          name: 'L200 Сканер-Локатор',
          article: '250.004.017',
          description: 'Сканер-локатор L200 для определения местоположения камеры в воздуховодах.',
          features: [
            'Подходит для всех моделей VS',
            'Точное определение положения',
            'Простота использования'
          ],
          specifications: {
            'Совместимость': 'Все модели VS',
            'Страна': 'Финляндия'
          }
        }
      ]
    }
  ]
};
