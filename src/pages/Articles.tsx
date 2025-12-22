import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, User } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'Как обезопасить кафе и рестораны от пожара',
    excerpt: 'Любой ресторан или кафе регулярно встречает пожарных инспекторов с проверкой. Узнайте, какие требования предъявляются к вентиляционным системам и как им соответствовать.',
    date: '15 декабря 2024',
    author: 'Веконт-М',
    category: 'Безопасность',
    readTime: '5 мин',
  },
  {
    id: 2,
    title: 'Прибыльный бизнес на все времена',
    excerpt: 'Хотите открыть интересный бизнес с высокой доходностью и актуальный во все времена? Очистка вентиляции — один из лучших выборов для начинающих предпринимателей.',
    date: '10 декабря 2024',
    author: 'Веконт-М',
    category: 'Бизнес',
    readTime: '7 мин',
  },
  {
    id: 3,
    title: 'Открываем компанию по очистке вентиляции',
    excerpt: 'Пошаговое руководство по открытию бизнеса в сфере очистки вентиляции. От регистрации до первых клиентов — всё, что нужно знать.',
    date: '5 декабря 2024',
    author: 'Веконт-М',
    category: 'Руководство',
    readTime: '10 мин',
  },
  {
    id: 4,
    title: 'Очистка вентиляции как доходный бизнес',
    excerpt: 'Как начать прибыльный бизнес по очистке вентиляции? Знаете ли вы о том, что эта ниша практически не занята в большинстве регионов?',
    date: '1 декабря 2024',
    author: 'Веконт-М',
    category: 'Бизнес',
    readTime: '6 мин',
  },
  {
    id: 5,
    title: 'Санитарные нормы для систем вентиляции',
    excerpt: 'Обзор актуальных санитарных норм и требований к чистоте вентиляционных систем в различных типах помещений.',
    date: '25 ноября 2024',
    author: 'Веконт-М',
    category: 'Законодательство',
    readTime: '8 мин',
  },
  {
    id: 6,
    title: 'Выбор оборудования для очистки вентиляции',
    excerpt: 'Подробный гид по выбору профессионального оборудования для очистки вентиляционных систем. Сравнение моделей и рекомендации.',
    date: '20 ноября 2024',
    author: 'Веконт-М',
    category: 'Оборудование',
    readTime: '9 мин',
  },
];

const Articles = () => {
  return (
    <Layout>
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
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-2xl overflow-hidden border border-border card-hover flex flex-col"
              >
                <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-primary/30" />
                </div>
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                      {article.category}
                    </span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-display font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {article.date}
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Читать
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
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
