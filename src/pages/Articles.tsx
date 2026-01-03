import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar } from 'lucide-react';
import { articlesData } from '@/data/articlesData';

const articlesBreadcrumbs = [
  { name: 'Главная', url: '/' },
  { name: 'Статьи', url: '/articles' }
];

const articlesFAQ = [
  {
    question: "Как начать бизнес по очистке вентиляции?",
    answer: "Для старта бизнеса по очистке вентиляции необходимо: зарегистрировать ИП/ООО, приобрести минимальный комплект оборудования (вакуумная установка, щёточная машина, видеокамера), пройти обучение и получить необходимые сертификаты."
  },
  {
    question: "Какие требования к очистке вентиляции по СанПиН?",
    answer: "Согласно СанПиН, очистка вентиляции должна проводиться регулярно с документальным подтверждением. Для предприятий общепита — каждые 3-6 месяцев, для офисов — не реже 1 раза в год."
  },
  {
    question: "Какое оборудование нужно для профессиональной очистки вентиляции?",
    answer: "Минимальный профессиональный набор включает: вакуумную установку с HEPA-фильтром, щёточную машину с гибким валом, набор щёток разных диаметров, видеокамеру для инспекции и средства дезинфекции."
  }
];

const Articles = () => {
  return (
    <Layout>
      <SEOHead 
        title="Статьи о бизнесе по очистке вентиляции | Pressovac"
        description="Экспертные статьи о бизнесе по очистке вентиляции: как начать, выбор оборудования, санитарные требования, технологии очистки. Полезные материалы от Веконт-М."
        keywords="статьи очистка вентиляции, бизнес очистка воздуховодов, как начать бизнес по очистке вентиляции, СанПиН вентиляция"
        canonical="/articles"
        breadcrumbs={articlesBreadcrumbs}
        faq={articlesFAQ}
      />
      {/* Hero */}
      <section className="section-padding hero-gradient">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Статьи
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Полезные <span className="text-gradient">материалы</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Экспертные статьи о бизнесе по очистке вентиляции, технологиях и оборудовании
            </p>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articlesData.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-2xl overflow-hidden border border-border card-hover flex flex-col"
              >
                <Link to={`/articles/${article.slug}`} className="block">
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
                    {article.image ? (
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <BookOpen className="w-16 h-16 text-primary/30" />
                    )}
                  </div>
                </Link>
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                      {article.category}
                    </span>
                    <span>{article.readTime}</span>
                  </div>
                  <Link to={`/articles/${article.slug}`}>
                    <h3 className="font-display font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {article.date}
                    </div>
                    <Link 
                      to={`/articles/${article.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                    >
                      Читать
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Articles;