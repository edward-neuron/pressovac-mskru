/**
 * Оптимизация изображений через CDN-прокси wsrv.nl
 * Конвертирует внешние изображения в WebP на лету
 */

/**
 * Оборачивает URL изображения в CDN-прокси для конвертации в WebP
 * @param url - оригинальный URL изображения
 * @param options - параметры оптимизации
 * @returns оптимизированный URL через CDN или оригинальный URL для локальных файлов
 */
export function getOptimizedImageUrl(
  url: string | undefined,
  options: {
    quality?: number; // качество (1-100), по умолчанию 80
    width?: number;   // ширина в пикселях
    height?: number;  // высота в пикселях
  } = {}
): string {
  if (!url) return '/placeholder.svg';
  
  // Не обрабатываем локальные файлы (уже оптимизированы как WebP)
  if (url.startsWith('/') || url.startsWith('data:') || url.includes('localhost')) {
    return url;
  }
  
  // Не обрабатываем уже оптимизированные URL
  if (url.includes('wsrv.nl')) {
    return url;
  }
  
  // satom.ru блокирует запросы от CDN-прокси, загружаем напрямую
  // Изображения уже в формате WebP (.webp.jpg - это WebP с неправильным расширением)
  if (url.includes('satom.ru') || url.includes('images.satom.ru')) {
    return url;
  }
  
  const { quality = 80, width, height } = options;
  
  // Формируем параметры
  const params = new URLSearchParams({
    url: url,
    output: 'webp',
    q: quality.toString(),
  });
  
  if (width) {
    params.set('w', width.toString());
  }
  
  if (height) {
    params.set('h', height.toString());
  }
  
  // Добавляем fit для сохранения пропорций при указании размеров
  if (width || height) {
    params.set('fit', 'contain');
    params.set('bg', 'white'); // белый фон для contain
  }
  
  return `https://wsrv.nl/?${params.toString()}`;
}

/**
 * Версия для превью (маленькие изображения в каталоге)
 */
export function getPreviewImageUrl(url: string | undefined): string {
  return getOptimizedImageUrl(url, { quality: 75, width: 400 });
}

/**
 * Версия для полного просмотра (drawer/modal)
 */
export function getFullImageUrl(url: string | undefined): string {
  return getOptimizedImageUrl(url, { quality: 85 });
}
