import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Award, Users, Target, Heart, CheckCircle } from 'lucide-react';

const values = [
  { icon: Award, title: 'Качество', description: 'Только оригинальное финское оборудование высочайшего качества' },
  { icon: Users, title: 'Партнёрство', description: 'Долгосрочные отношения с клиентами и партнёрами' },
  { icon: Target, title: 'Экспертиза', description: 'Глубокие знания в области очистки вентиляции' },
  { icon: Heart, title: 'Забота', description: 'Индивидуальный подход к каждому клиенту' },
];

const benefits = [
  'Официальный дистрибьютор PRESSOVAC Oy',
  'Гарантия на всё оборудование',
  'Техническая поддержка 24/7',
  'Бесплатные консультации',
  'Обучение персонала',
  'Помощь в запуске бизнеса',
  'Программа расчёта работ',
  'Бизнес-план для старта',
];

const About = () => {
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
              О компании
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Компания <span className="text-gradient">«Веконт-М»</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Делаем воздух чище и жизнь комфортнее — мы являемся официальным 
              дистрибьютором финской фирмы PRESSOVAC Oy на территории России и в странах СНГ
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Наша история
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                С 2008 года мы поставляем профессиональное оборудование для очистки 
                вентиляции и удаления жира в вытяжных системах. За это время мы стали 
                надёжным партнёром для сотен компаний по всей России и СНГ.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Наша миссия — обеспечивать чистый воздух в помещениях, помогая компаниям 
                соответствовать санитарным нормам и создавать безопасную среду для людей.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                {benefits.slice(0, 4).map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 lg:p-12"
            >
              <div className="space-y-6">
                <div className="text-center">
                  <p className="font-display text-6xl font-bold text-primary">2008</p>
                  <p className="text-muted-foreground">Год основания</p>
                </div>
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
                  <div className="text-center">
                    <p className="font-display text-3xl font-bold text-foreground">500+</p>
                    <p className="text-sm text-muted-foreground">Обученных специалистов</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-3xl font-bold text-foreground">1000+</p>
                    <p className="text-sm text-muted-foreground">Выполненных проектов</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Наши ценности
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Принципы, которыми мы руководствуемся в работе каждый день
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-2xl p-6 border border-border text-center card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Почему выбирают нас
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
