import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { CatalogPreview } from '@/components/home/CatalogPreview';
import { AboutPreview } from '@/components/home/AboutPreview';
import { VideoPreview } from '@/components/home/VideoPreview';
import { ArticlesPreview } from '@/components/home/ArticlesPreview';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
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
