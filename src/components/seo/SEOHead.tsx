import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  structuredData?: object;
}

const defaultTitle = 'Pressovac — профессиональное оборудование для очистки вентиляции';
const defaultDescription = 'Pressovac — официальный дистрибьютор финского оборудования для очистки и дезинфекции систем вентиляции. Вакуумные установки, щёточные машины, видеоинспекция. Доставка по России.';
const defaultKeywords = 'Pressovac, очистка вентиляции, оборудование для чистки воздуховодов, вакуумные установки, щёточные машины, видеоинспекция вентиляции, дезинфекция вентиляции, Веконт-М';
const siteUrl = 'https://pressovac-msk.ru';

export const SEOHead = ({
  title = defaultTitle,
  description = defaultDescription,
  keywords = defaultKeywords,
  canonical = '/',
  ogImage = '/og-image.png',
  ogType = 'website',
  structuredData,
}: SEOHeadProps) => {
  const fullCanonical = canonical.startsWith('http') ? canonical : `${siteUrl}${canonical}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:site_name" content="Pressovac Moscow" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
