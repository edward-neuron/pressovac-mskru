import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { getArticleBySlug, articlesData } from '@/data/articlesData';
import { ArrowLeft, Calendar, User, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/seo/SEOHead';

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return <Navigate to="/articles" replace />;
  }

  // Get related articles (same category, excluding current)
  const relatedArticles = articlesData
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 2);

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let listType: 'ul' | 'ol' | null = null;
    let inTable = false;
    let tableRows: string[][] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        if (listType === 'ul') {
          elements.push(
            <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
              {currentList.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          );
        } else {
          elements.push(
            <ol key={`list-${elements.length}`} className="list-decimal list-inside space-y-2 mb-6 text-muted-foreground">
              {currentList.map((item, i) => <li key={i}>{item}</li>)}
            </ol>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    const flushTable = () => {
      if (tableRows.length > 0) {
        const headers = tableRows[0];
        const rows = tableRows.slice(2); // Skip header separator
        elements.push(
          <div key={`table-${elements.length}`} className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  {headers.map((cell, i) => (
                    <th key={i} className="border border-border px-4 py-2 text-left font-semibold">
                      {cell.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? '' : 'bg-muted/50'}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-border px-4 py-2">
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Table detection
      if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
        flushList();
        inTable = true;
        const cells = trimmedLine.slice(1, -1).split('|');
        if (!trimmedLine.includes('---')) {
          tableRows.push(cells);
        } else {
          tableRows.push([]); // Separator placeholder
        }
        return;
      } else if (inTable) {
        flushTable();
      }

      // Headers
      if (trimmedLine.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="font-display text-2xl font-bold mt-8 mb-4">
            {trimmedLine.slice(3)}
          </h2>
        );
        return;
      }

      if (trimmedLine.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="font-display text-xl font-semibold mt-6 mb-3">
            {trimmedLine.slice(4)}
          </h3>
        );
        return;
      }

      // Bold text lines
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        flushList();
        elements.push(
          <p key={index} className="font-semibold mb-2">
            {trimmedLine.slice(2, -2)}
          </p>
        );
        return;
      }

      // List items
      if (trimmedLine.startsWith('- ')) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        currentList.push(trimmedLine.slice(2).replace(/\*\*(.*?)\*\*/g, '$1'));
        return;
      }

      if (/^\d+\.\s/.test(trimmedLine)) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        currentList.push(trimmedLine.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '$1'));
        return;
      }

      // Regular paragraph
      if (trimmedLine) {
        flushList();
        // Handle inline bold
        const processedLine = trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        elements.push(
          <p 
            key={index} 
            className="text-muted-foreground leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        );
      }
    });

    flushList();
    flushTable();

    return elements;
  };

  return (
    <Layout>
      <SEOHead 
        title={`${article.title} | Pressovac`}
        description={article.excerpt}
      />

      {/* Hero */}
      <section className="section-padding hero-gradient">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Link 
              to="/articles" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к статьям
            </Link>

            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              {article.category}
            </span>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {article.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {article.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.readTime} чтения
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Main Image */}
            {article.image && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-8 rounded-2xl overflow-hidden"
              >
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg max-w-none"
            >
              {renderContent(article.content)}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 p-8 bg-primary/5 rounded-2xl border border-primary/20"
            >
              <h3 className="font-display text-xl font-semibold mb-3">
                Нужна консультация?
              </h3>
              <p className="text-muted-foreground mb-4">
                Свяжитесь с нами для получения подробной информации об оборудовании и услугах.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/contacts">Связаться с нами</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/catalog">Смотреть каталог</Link>
                </Button>
              </div>
            </motion.div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12"
              >
                <h3 className="font-display text-xl font-semibold mb-6">
                  Похожие статьи
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedArticles.map(relatedArticle => (
                    <Link 
                      key={relatedArticle.id}
                      to={`/articles/${relatedArticle.slug}`}
                      className="group p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">{relatedArticle.readTime}</span>
                      </div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {relatedArticle.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ArticlePage;
