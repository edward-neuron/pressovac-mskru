export interface Product {
  id: string;
  name: string;
  article?: string;
  description: string;
  image?: string;
  shopUrl?: string;
  features?: string[];
  specifications?: Record<string, string>;
}

export interface Subcategory {
  id: string;
  title: string;
  description: string;
  products: Product[];
  shopUrl?: string;
}

export interface AccessoriesData {
  title: string;
  description: string;
  subcategories: Subcategory[];
}

export const accessoriesData: AccessoriesData = {
  title: 'Комплектующие и аксессуары',
  description: 'Щётки, адаптеры, заглушки и другие комплектующие для оборудования Pressovac.',
  subcategories: [
    {
      id: 'cleaning-brushes',
      title: 'Чистящие щётки',
      description: 'Профессиональные чистящие щётки различных диаметров для очистки воздуховодов.',
      products: [],
      shopUrl: '/store?category=88504948'
    },
    {
      id: 'centering-devices',
      title: 'Центратор',
      description: 'Центрирующие устройства для стабилизации оборудования в воздуховодах.',
      products: [],
      shopUrl: '/store?category=86975780&product=200911452'
    },
    {
      id: 't-adapter',
      title: 'Т-Адаптер',
      description: 'Т-образные адаптеры для подключения оборудования к воздуховодам.',
      products: [],
      shopUrl: '/store?category=86975780&product=200911447'
    },
    {
      id: 'vacuum-discs',
      title: 'Вакуумные диски',
      description: 'Вакуумные диски для создания герметичного соединения при очистке.',
      products: []
    },
    {
      id: 'grease-scrapers',
      title: 'Скребки для жира',
      description: 'Специализированные скребки для удаления жировых отложений из вентиляционных каналов.',
      products: [],
      shopUrl: '/store?category=88504983'
    },
    {
      id: 'flexible-hoses',
      title: 'Гибкие шланги',
      description: 'Гибкие шланги для подключения вакуумного оборудования.',
      products: [],
      shopUrl: '/store?category=88504983'
    },
    {
      id: 'inspection-hatches',
      title: 'Лючки инспекции',
      description: 'Инспекционные лючки для доступа к воздуховодам при обслуживании и диагностике.',
      products: [],
      shopUrl: '/store?category=88504983'
    },
    {
      id: 'adapters-inserts',
      title: 'Врезки, адаптеры',
      description: 'Врезки и адаптеры для подключения оборудования к различным типам воздуховодов.',
      products: [],
      shopUrl: '/store?category=88504983'
    },
    {
      id: 'barrier-plugs',
      title: 'Барьерные заглушки',
      description: 'Барьерные заглушки для герметизации участков воздуховодов при очистке.',
      products: [],
      shopUrl: '/store?category=88504983'
    },
    {
      id: 'active-foam',
      title: 'Активная пена',
      description: 'Специальные чистящие средства и активная пена для обработки воздуховодов.',
      products: [],
      shopUrl: '/store?category=86975795&product=198978956'
    }
  ]
};
