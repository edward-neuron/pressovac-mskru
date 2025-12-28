import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { HeroSection } from '@/components/home/HeroSection';
import { CatalogPreview } from '@/components/home/CatalogPreview';
import { AboutPreview } from '@/components/home/AboutPreview';
import { VideoPreview } from '@/components/home/VideoPreview';
import { ArticlesPreview } from '@/components/home/ArticlesPreview';
import { CTASection } from '@/components/home/CTASection';

// Structured data for organization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Веконт-М",
  "alternateName": "Pressovac Moscow",
  "url": "https://pressovac-msk.ru",
  "logo": "https://pressovac-msk.ru/og-image.png",
  "description": "Официальный дистрибьютор финского оборудования Pressovac для очистки вентиляции в России",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Москва",
    "addressCountry": "RU"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+7-499-677-20-10",
    "contactType": "sales",
    "areaServed": ["RU", "BY", "KZ"],
    "availableLanguage": "Russian"
  },
  "sameAs": []
};

// Structured data for products/services
const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Оборудование для очистки вентиляции Pressovac",
  "description": "Каталог профессионального оборудования для очистки систем вентиляции",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Вакуумные установки",
      "description": "Мощные вакуумные системы для сбора загрязнений"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Щёточные машины",
      "description": "Профессиональные щёточные машины для механической очистки воздуховодов"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Видеоинспекция",
      "description": "Оборудование для видеодиагностики вентиляционных систем"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Дезинфекция",
      "description": "Системы для антибактериальной обработки вентиляции"
    }
  ]
};

const combinedSchema = [organizationSchema, servicesSchema];

const Index = () => {
  return (
    <Layout>
      <SEOHead 
        title="Pressovac — профессиональное оборудование для очистки вентиляции | Официальный дистрибьютор"
        description="Купить профессиональное финское оборудование Pressovac для очистки вентиляции. Вакуумные установки, щёточные машины, видеоинспекция, дезинфекция. Доставка по России. Гарантия. Обучение."
        keywords="Pressovac, купить оборудование для очистки вентиляции, вакуумные установки Pressovac, щёточные машины для воздуховодов, видеоинспекция вентиляции, дезинфекция воздуховодов, Веконт-М Москва"
        canonical="/"
        structuredData={combinedSchema}
      />
      <HeroSection />
      <CatalogPreview />
      <AboutPreview />
      <VideoPreview />
      <ArticlesPreview />
      <CTASection />
    </Layout>
  );
};

export default Index;
