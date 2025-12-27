// Данные для раздела "Фильтрующие установки Pressovac"

export interface FilterProduct {
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

export interface FilterSubcategory {
  id: string;
  title: string;
  description: string;
  products: FilterProduct[];
}

export interface FilterEquipmentCategory {
  subcategories: FilterSubcategory[];
}

export const filterEquipmentData: FilterEquipmentCategory = {
  subcategories: [
    {
      id: 'filter-units',
      title: 'Фильтрующие установки',
      description: 'Лёгкие и мобильные установки для сбора и утилизации загрязнений',
      products: [
        {
          id: 'f-50',
          name: 'Фильтрующий блок F-50',
          article: '207.001.001',
          description: 'Фильтрующий блок производительностью 4300/5000 м³/час для средних вентиляционных систем.',
          features: [
            'Производительность: 4300/5000 м³/час',
            'Двухступенчатая фильтрация',
            'Компактные размеры',
            'Простота обслуживания'
          ],
          specifications: {
            'Производительность': '4 300/5 000 м³/час',
            'Класс фильтра': 'G3 + F7',
            'Страна': 'Финляндия'
          }
        },
        {
          id: 'f-100',
          name: 'Фильтрующий блок F-100',
          article: '207.001.002',
          description: 'Мощный фильтрующий блок производительностью 8600/10000 м³/час для крупных промышленных объектов.',
          features: [
            'Производительность: 8600/10000 м³/час',
            'Двухступенчатая фильтрация',
            'Высокая мощность',
            'Для интенсивной эксплуатации'
          ],
          specifications: {
            'Производительность': '8 600/10 000 м³/час',
            'Класс фильтра': 'G3 + F7',
            'Страна': 'Финляндия'
          }
        }
      ]
    },
    {
      id: 'hepa-cleaners',
      title: 'HEPA-10 очистители',
      description: 'Высокоэффективные очистители с HEPA-фильтрацией',
      products: [
        {
          id: 'hepa-10',
          name: 'HEPA-10 Очиститель воздуха',
          article: '206.005.001',
          description: 'Компактный очиститель воздуха с HEPA-фильтром производительностью 1000 м³/час.',
          features: [
            'Производительность: 1000 м³/час',
            'HEPA-фильтр высокой эффективности',
            'Компактные размеры',
            'Тихая работа'
          ],
          specifications: {
            'Производительность': '1 000 м³/час',
            'Класс фильтра': 'HEPA',
            'Страна': 'Финляндия'
          }
        }
      ]
    },
    {
      id: 'special-filters',
      title: 'Специальные Фильтры',
      description: 'Сменные фильтры и расходные материалы',
      products: [
        {
          id: 'filter-bag-50',
          name: 'Мешок фильтрующий 50 л',
          article: '203.005.001',
          description: 'Сменный фильтрующий мешок для установки F-50.',
          features: [
            'Объём: 50 л',
            'Высокая фильтрация',
            'Простая замена'
          ],
          specifications: {
            'Объём': '50 л',
            'Совместимость': 'F-50'
          }
        },
        {
          id: 'filter-bag-100',
          name: 'Мешок фильтрующий 100 л',
          article: '203.005.002',
          description: 'Сменный фильтрующий мешок для установки F-100.',
          features: [
            'Объём: 100 л',
            'Высокая фильтрация',
            'Простая замена'
          ],
          specifications: {
            'Объём': '100 л',
            'Совместимость': 'F-100'
          }
        }
      ]
    }
  ]
};
