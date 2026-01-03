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

// FAQ for homepage
const homepageFAQ = [
  {
    question: "Что такое оборудование Pressovac?",
    answer: "Pressovac — это профессиональное финское оборудование для очистки и дезинфекции систем вентиляции. Включает вакуумные установки, щёточные машины, системы видеоинспекции и дезинфекции воздуховодов."
  },
  {
    question: "Как часто нужно чистить вентиляцию?",
    answer: "Согласно СанПиН, очистку вентиляции рекомендуется проводить не реже 1 раза в год для офисных помещений и каждые 3-6 месяцев для предприятий общественного питания и производств."
  },
  {
    question: "Какое оборудование нужно для начала бизнеса по очистке вентиляции?",
    answer: "Минимальный комплект включает: вакуумную установку, щёточную машину с гибким валом, набор щёток и видеокамеру для инспекции. Компания Веконт-М предоставляет консультации по подбору оборудования и обучение персонала."
  },
  {
    question: "Есть ли гарантия на оборудование Pressovac?",
    answer: "Да, на всё оборудование Pressovac предоставляется официальная гарантия производителя. Мы также обеспечиваем сервисное обслуживание и поставку запасных частей."
  },
  {
    question: "Осуществляете ли вы доставку по России?",
    answer: "Да, мы осуществляем доставку оборудования Pressovac по всей России и в страны СНГ. Доставка до терминала транспортной компании в Москве — бесплатно."
  }
];

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
        faq={homepageFAQ}
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
