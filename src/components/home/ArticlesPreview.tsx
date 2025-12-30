import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import fireSafety1 from '@/assets/articles/fire-safety-3.jpg';
import profitable1 from '@/assets/articles/profitable-1.jpg';
import startingMain from '@/assets/articles/starting-main.jpg';

const articles = [
  {
    slug: 'fire-safety-restaurants',
    title: 'Как обезопасить кафе и рестораны от пожара',
    excerpt: 'Любой ресторан или кафе регулярно встречает пожарных инспекторов с проверкой. Узнайте, как соответствовать всем требованиям.',
    date: '15 декабря 2024',
    category: 'Безопасность',
    image: fireSafety1,
  },
  {
    slug: 'profitable-business',
    title: 'Прибыльный бизнес на все времена',
    excerpt: 'Хотите открыть интересный бизнес с высокой доходностью и актуальный во все времена? Очистка вентиляции — ваш выбор.',
    date: '10 декабря 2024',
    category: 'Бизнес',
    image: profitable1,
  },
  {
    slug: 'starting-cleaning-company',
    title: 'Открываем компанию по очистке вентиляции',
    excerpt: 'Вы горите желанием открыть свое дело? У вас есть необходимый капитал? Мы поможем вам начать.',
    date: '5 декабря 2024',
    category: 'Руководство',
    image: startingMain,
  },
];

export const ArticlesPreview = () => {
  return (
    <section className="section-padding bg-card">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12"
        >
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Полезные статьи
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Экспертные материалы
            </h2>
          </div>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            Все статьи
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-background rounded-2xl overflow-hidden border border-border card-hover"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {article.date}
                  </div>
                </div>
                <h3 className="font-display font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {article.excerpt}
                </p>
                <Link
                  to={`/articles/${article.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                >
                  Читать далее
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
