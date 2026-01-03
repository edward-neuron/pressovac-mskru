import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  structuredData?: object | object[];
  breadcrumbs?: BreadcrumbItem[];
  faq?: FAQItem[];
  article?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
  };
}

const defaultTitle = 'Pressovac — профессиональное оборудование для очистки вентиляции';
const defaultDescription = 'Pressovac — официальный дистрибьютор финского оборудования для очистки и дезинфекции систем вентиляции. Вакуумные установки, щёточные машины, видеоинспекция. Доставка по России.';
const defaultKeywords = 'Pressovac, очистка вентиляции, оборудование для чистки воздуховодов, вакуумные установки, щёточные машины, видеоинспекция вентиляции, дезинфекция вентиляции, Веконт-М';
const siteUrl = 'https://pressovac-msk.ru';

// Generate BreadcrumbList structured data
const generateBreadcrumbSchema = (breadcrumbs: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`
  }))
});

// Generate FAQPage structured data
const generateFAQSchema = (faq: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faq.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
});

export const SEOHead = ({
  title = defaultTitle,
  description = defaultDescription,
  keywords = defaultKeywords,
  canonical = '/',
  ogImage = '/og-image.png',
  ogType = 'website',
  structuredData,
  breadcrumbs,
  faq,
  article,
}: SEOHeadProps) => {
  const fullCanonical = canonical.startsWith('http') ? canonical : `${siteUrl}${canonical}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  // Combine all structured data
  const allStructuredData: object[] = [];
  
  if (structuredData) {
    if (Array.isArray(structuredData)) {
      allStructuredData.push(...structuredData);
    } else {
      allStructuredData.push(structuredData);
    }
  }
  
  if (breadcrumbs && breadcrumbs.length > 0) {
    allStructuredData.push(generateBreadcrumbSchema(breadcrumbs));
  }
  
  if (faq && faq.length > 0) {
    allStructuredData.push(generateFAQSchema(faq));
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Additional meta tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="yandex" content="index, follow" />
      <meta name="author" content="Веконт-М" />
      <meta name="geo.region" content="RU-MOW" />
      <meta name="geo.placename" content="Москва" />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:site_name" content="Pressovac Moscow" />

      {/* Article specific OG tags */}
      {article && ogType === 'article' && (
        <>
          {article.author && <meta property="article:author" content={article.author} />}
          {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          {article.section && <meta property="article:section" content={article.section} />}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Structured Data */}
      {allStructuredData.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(allStructuredData.length === 1 ? allStructuredData[0] : allStructuredData)}
        </script>
      )}
    </Helmet>
  );
};
