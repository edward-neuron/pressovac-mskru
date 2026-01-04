import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Карта редиректов со старого сайта pressovac-msk.ru
const redirectMap: Record<string, string> = {
  // Основные страницы
  '/company': '/about',
  '/contact': '/contacts',
  '/terms-of-delivery-and-payment': '/delivery',
  '/politika-konfidentsialnosti': '/privacy',
  '/demand-registration': '/inquiry',
  '/educational-materials': '/training',
  '/training-materials-index': '/training',
  '/basic-cleaning-concept': '/technology',
  '/technical-information-v-2': '/technology',
  '/catalogue-pressovac': '/catalog',
  '/our-certificates': '/about',
  '/our-certificates-menu': '/about',
  '/program-for-partners': '/about',
  '/programma-dlya-partnerov': '/about',
  '/gallery-video-index': '/catalog',
  
  // Оборудование -> Каталог
  '/ductcleaning-equipment-v2': '/catalog',
  '/suction-unit': '/catalog',
  '/filter-units': '/catalog',
  '/disinfection-equipment': '/catalog',
  '/videoinspection-diagnostics': '/catalog',
  '/compressor-equipment': '/catalog',
  '/accessories': '/catalog',
  '/decisions-on-complete-set': '/catalog',
  '/decisions-on-complete-set-2018': '/catalog',
  '/decisions-on-complete-set-2020': '/catalog',
  '/actions-now': '/catalog',
  '/urrent-promotions': '/catalog',
  '/price-list': '/catalog',
  '/pdf-brochures': '/catalog',
  '/pdf-brochures-link': '/catalog',
  '/loan-programs': '/catalog',
  '/shop-online-topmenu': '/store',
  
  // Статьи и новости
  '/articles': '/articles',
  '/news': '/articles',
  '/arcticles': '/articles',
};

// Паттерны для частичного совпадения (начало пути)
const redirectPatterns: Array<{ pattern: string; target: string }> = [
  // Интернет-магазин -> Каталог
  { pattern: '/shop-online-topmenu/', target: '/store' },
  
  // Оборудование
  { pattern: '/ductcleaning-equipment-v2/', target: '/catalog' },
  { pattern: '/suction-unit/', target: '/catalog' },
  { pattern: '/filter-units/', target: '/catalog' },
  { pattern: '/disinfection-equipment/', target: '/catalog' },
  { pattern: '/videoinspection-diagnostics/', target: '/catalog' },
  { pattern: '/compressor-equipment/', target: '/catalog' },
  { pattern: '/accessories/', target: '/catalog' },
  { pattern: '/decisions-on-complete-set/', target: '/catalog' },
  { pattern: '/decisions-on-complete-set-2018/', target: '/catalog' },
  { pattern: '/decisions-on-complete-set-2020/', target: '/catalog' },
  { pattern: '/catalogue-pressovac/', target: '/catalog' },
  { pattern: '/pdf-brochures/', target: '/catalog' },
  { pattern: '/actions-now/', target: '/catalog' },
  { pattern: '/urrent-promotions/', target: '/catalog' },
  { pattern: '/price-list/', target: '/catalog' },
  { pattern: '/loan-programs/', target: '/catalog' },
  { pattern: '/9-catalog/', target: '/catalog' },
  
  // Статьи и новости - только старые числовые URL (например /articles/204-starting-a-duct-cleaning-company)
  // НЕ перехватываем новые slug-и (fire-safety-restaurants, profitable-business и т.д.)
  { pattern: '/news/', target: '/articles' },
  { pattern: '/arcticles/', target: '/articles' },
  
  // Технология
  { pattern: '/basic-cleaning-concept/', target: '/technology' },
  { pattern: '/technical-information-v-2/', target: '/technology' },
  
  // Обучение
  { pattern: '/educational-materials/', target: '/training' },
  { pattern: '/training-materials-index/', target: '/training' },
  
  // О компании
  { pattern: '/company/', target: '/about' },
  { pattern: '/our-certificates/', target: '/about' },
  { pattern: '/our-certificates-menu/', target: '/about' },
  
  // Контакты
  { pattern: '/contact/', target: '/contacts' },
  
  // Заявка
  { pattern: '/demand-registration/', target: '/inquiry' },
  
  // PDF и изображения - редирект на каталог
  { pattern: '/images/', target: '/catalog' },
  
  // Поиск - на главную
  { pattern: '/component/search/', target: '/' },
];

export function LegacyRedirects() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    
    // Не перехватываем новые slug-и статей
    const newArticleSlugs = [
      'fire-safety-restaurants',
      'profitable-business', 
      'starting-cleaning-company',
      'cleaning-as-profitable-business',
      'sanitary-norms',
      'equipment-selection-guide'
    ];
    
    // Проверяем, является ли это новой статьёй
    if (path.startsWith('/articles/')) {
      const slug = path.replace('/articles/', '');
      if (newArticleSlugs.includes(slug)) {
        return; // Не редиректим новые статьи
      }
      // Старые статьи (с числами) редиректим на /articles
      navigate('/articles', { replace: true });
      return;
    }
    
    // Проверяем точное совпадение
    if (redirectMap[path]) {
      navigate(redirectMap[path], { replace: true });
      return;
    }
    
    // Проверяем паттерны (начало пути)
    for (const { pattern, target } of redirectPatterns) {
      if (path.startsWith(pattern)) {
        navigate(target, { replace: true });
        return;
      }
    }
    
    // Проверяем URL с index.php (Joomla-стиль)
    if (path.includes('index.php')) {
      // Определяем целевую страницу по контексту
      if (path.includes('company') || path.includes('certificates')) {
        navigate('/about', { replace: true });
      } else if (path.includes('contact')) {
        navigate('/contacts', { replace: true });
      } else {
        navigate('/catalog', { replace: true });
      }
      return;
    }
    
    // Числовые пути типа /111, /17 -> каталог или контакты
    const numericMatch = path.match(/^\/(\d+)$/);
    if (numericMatch) {
      const num = parseInt(numericMatch[1], 10);
      if (num === 17) {
        navigate('/contacts', { replace: true });
      } else {
        navigate('/catalog', { replace: true });
      }
      return;
    }
  }, [location.pathname, navigate]);

  return null;
}
