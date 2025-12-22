import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { GraduationCap, Users, Clock, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const programs = [
  {
    title: 'Базовый курс',
    duration: '2 дня',
    description: 'Основы работы с оборудованием Pressovac для начинающих специалистов',
    topics: ['Принципы работы оборудования', 'Базовые техники очистки', 'Техника безопасности', 'Обслуживание оборудования'],
  },
  {
    title: 'Продвинутый курс',
    duration: '3 дня',
    description: 'Углублённое обучение для опытных специалистов и руководителей',
    topics: ['Сложные системы вентиляции', 'Работа с жировыми отложениями', 'Дезинфекция и санобработка', 'Диагностика проблем'],
  },
  {
    title: 'Бизнес-курс',
    duration: '5 дней',
    description: 'Полный курс для запуска собственного бизнеса по очистке вентиляции',
    topics: ['Бизнес-планирование', 'Маркетинг и продажи', 'Ценообразование', 'Сертификация и лицензии'],
  },
];

const benefits = [
  { icon: GraduationCap, title: 'Сертификат', description: 'Официальный сертификат о прохождении обучения' },
  { icon: Users, title: 'Практика', description: 'Работа с реальным оборудованием на объектах' },
  { icon: Clock, title: 'Поддержка', description: 'Консультации после окончания курса' },
  { icon: Award, title: 'Материалы', description: 'Учебные материалы и бизнес-план в подарок' },
];

const Training = () => {
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
              Обучение
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Комплексное <span className="text-gradient">обучение</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Профессиональное обучение работе с оборудованием Pressovac для специалистов 
              и предпринимателей
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border text-center card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Программы обучения
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Выберите программу, соответствующую вашим целям и уровню подготовки
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-2xl p-6 border border-border card-hover flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {program.duration}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl mb-2">{program.title}</h3>
                <p className="text-muted-foreground text-sm mb-6">{program.description}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {program.topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {topic}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/inquiry">
                    Записаться
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Training;
