import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import pressovacLogo from '@/assets/pressovac-logo.png';

const navigation = {
  main: [
    { name: 'Главная', href: '/' },
    { name: 'О нас', href: '/about' },
    { name: 'Каталог', href: '/catalog' },
    { name: 'Технология', href: '/technology' },
  ],
  services: [
    { name: 'Обучение', href: '/training' },
    { name: 'Статьи', href: '/articles' },
    { name: 'Условия поставки', href: '/delivery' },
    { name: 'Опросный лист', href: '/inquiry' },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={pressovacLogo} 
                alt="Pressovac" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <span className="font-display font-bold text-xl">Pressovac</span>
                <p className="text-xs opacity-70">Официальный дистрибьютор</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Компания "Веконт-М" — официальный дистрибьютор финской фирмы PRESSOVAC Oy 
              на территории России и в странах СНГ с 2008 года.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Навигация</h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-all"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Услуги</h3>
            <ul className="space-y-3">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-all"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Контакты</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <a href="tel:+74996772010" className="text-sm hover:text-accent transition-colors">
                    (499) 677-2010
                  </a>
                  <p className="text-xs opacity-70">Пн-Пт: 09:00-21:00</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent mt-0.5" />
                <a href="mailto:sales@pressovac-moscow.ru" className="text-sm hover:text-accent transition-colors">
                  sales@pressovac-moscow.ru
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <span className="text-sm opacity-80">
                  Москва, Россия
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ExternalLink className="w-5 h-5 text-accent mt-0.5" />
                <a 
                  href="https://shop.pressovac-msk.ru" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm hover:text-accent transition-colors"
                >
                  Интернет-магазин
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm opacity-70">
              © {new Date().getFullYear()} Pressovac. Все права защищены.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/delivery" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                Условия поставки
              </Link>
              <Link to="/contacts" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                Контакты
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
