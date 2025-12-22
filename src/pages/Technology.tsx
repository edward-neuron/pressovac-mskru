import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Play, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  { 
    number: '01', 
    title: 'Диагностика', 
    description: 'Видеоинспекция воздуховодов для оценки степени загрязнения и определения объёма работ' 
  },
  { 
    number: '02', 
    title: 'Подготовка', 
    description: 'Герметизация системы и установка вакуумного оборудования для сбора загрязнений' 
  },
  { 
    number: '03', 
    title: 'Механическая очистка', 
    description: 'Щёточные машины Pressovac удаляют отложения пыли и жира со стенок воздуховодов' 
  },
  { 
    number: '04', 
    title: 'Дезинфекция', 
    description: 'Антибактериальная обработка поверхностей для уничтожения микроорганизмов' 
  },
  { 
    number: '05', 
    title: 'Контроль качества', 
    description: 'Повторная видеоинспекция для подтверждения качества выполненных работ' 
  },
];

const advantages = [
  'Экологически чистая технология',
  'Соответствие санитарным нормам',
  'Снижение пожароопасности',
  'Улучшение качества воздуха',
  'Продление срока службы оборудования',
  'Экономия электроэнергии',
];

const Technology = () => {
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
              О технологии
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Технология <span className="text-gradient">очистки вентиляции</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Узнайте, как работает профессиональная система очистки вентиляции 
              с использованием оборудования Pressovac
            </p>
          </motion.div>
        </div>
      </section>

      {/* Video */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl overflow-hidden relative group cursor-pointer">
              <div className="absolute inset-0 bg-foreground/5" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 ml-1" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Этапы очистки
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Пошаговый процесс профессиональной очистки вентиляционных систем
            </p>
          </motion.div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-xl">{step.number}</span>
                </div>
                <div className="bg-background rounded-2xl p-6 border border-border flex-1">
                  <h3 className="font-display font-semibold text-xl mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Преимущества технологии
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {advantages.map((advantage, index) => (
              <motion.div
                key={advantage}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="font-medium">{advantage}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Посмотреть оборудование
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Technology;
