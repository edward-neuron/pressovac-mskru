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
          id: 'g3f7-kit-fu50-fu100',
          name: 'G3+F7 Комплект фильтров для FU-50 / FU-100',
          article: '207.002.001',
          description: 'Комплект фильтров класса G3 + F7 для установок FU-50 / FU-100.',
          features: ['Класс фильтра: G3 + F7'],
          specifications: {
            'Класс фильтра': 'G3 + F7',
            'Совместимость': 'FU-50 / FU-100',
            'Тип': 'Комплект фильтров'
          }
        },
        {
          id: 'g3f7-pocket-sfu50',
          name: 'G3 + F7 карманный фильтр для SFU-50',
          article: '207.002.012',
          description: 'Карманный фильтр класса G3 + F7 для установки SFU-50.',
          features: ['Класс фильтра: G3 + F7'],
          specifications: {
            'Класс фильтра': 'G3 + F7',
            'Совместимость': 'SFU-50',
            'Тип': 'Карманный фильтр'
          }
        }
      ]
    }
  ]
};
