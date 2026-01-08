import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { GraduationCap, Users, Clock, Award, CheckCircle, ArrowRight, Gift, FileText, Video, Calculator, Briefcase, BookOpen, Headphones, X, ZoomIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import calculationSoftwareImg from '@/assets/calculation-software.webp';
import trainingHeroBanner from '@/assets/training-hero-banner.webp';

const trainingBreadcrumbs = [
  { name: 'Главная', url: '/' },
  { name: 'Обучение', url: '/training' }
];

const trainingFAQ = [
  {
    question: "Включено ли обучение в стоимость оборудования?",
    answer: "Да, полная программа обучения предоставляется бесплатно при покупке оборудования Pressovac. Это включает видео-курсы, техническую документацию, программу расчёта работ и бизнес-план."
  },
  {
    question: "Что входит в программу обучения?",
    answer: "Программа включает: технологическую карту, вводный видео-курс, ПО для расчёта стоимости работ, бизнес-план, техническую документацию, шаблоны коммерческих предложений и готовые бизнес-документы."
  },
  {
    question: "Есть ли поддержка после покупки оборудования?",
    answer: "Да, мы предоставляем ежедневную техническую поддержку и консультации. Вы получаете доступ к сообществу профессионалов и можете задавать любые вопросы по работе с оборудованием."
  }
];

const benefits = [
  { icon: Gift, title: 'Бесплатно', description: 'Предоставляется бесплатно при покупке оборудования' },
  { icon: Headphones, title: 'Поддержка', description: 'Ежедневные консультации и помощь экспертов' },
  { icon: Users, title: 'Сообщество', description: 'Доступ к сообществу профессионалов' },
  { icon: Award, title: 'Результат', description: 'Полная готовность к успешной работе' },
];

const trainingAreas = [
  { icon: BookOpen, title: 'Техническая', subtitle: 'Теория', description: 'Полное понимание технологий и методов работы' },
  { icon: Calculator, title: 'Управление', subtitle: 'Бюджеты', description: 'Финансовое планирование и расчёт стоимости' },
  { icon: Briefcase, title: 'Коммерческая', subtitle: 'Продажи', description: 'Привлечение клиентов и ведение переговоров' },
];

const planContents = [
  { icon: FileText, title: 'Технологическая карта', description: 'Методические рекомендации и пошаговые инструкции' },
  { icon: Video, title: 'Видео-курс', description: 'Обучающий вводный видео-курс подготовки и очистки' },
  { icon: Calculator, title: 'ПО «Расчёт стоимости работ»', description: 'Уникальное программное обеспечение для калькуляции' },
  { icon: Briefcase, title: 'Бизнес-план', description: 'Развёрнутый практический пример для старта' },
  { icon: FileText, title: 'Техническая документация', description: 'Примеры исполнительной документации' },
  { icon: FileText, title: 'Коммерческие предложения', description: 'Варианты КП и калькуляций для клиентов' },
];

const businessDocuments = [
  'Договоры на оказание услуг',
  'Акты технической экспертизы',
  'Акты обследования',
  'Соглашения о тестовых очистках',
  'Журналы учёта работ',
  'Каталоги и брошюры',
];

const ourHelp = [
  'Делимся опытом',
  'Предоставляем обучающие курсы',
  'Проводим аудит действующей компании',
  'Даём конструктивные советы и лайфхаки',
  'Отвечаем на любые вопросы',
];

const Training = () => {
  const [showSoftwarePopup, setShowSoftwarePopup] = useState(false);

  return (
    <Layout>
      <SEOHead 
        title="Обучение очистке вентиляции | Бесплатное обучение Pressovac"
        description="Бесплатное обучение при покупке оборудования Pressovac: видео-курсы, бизнес-план, программа расчёта работ, техническая документация. Ежедневная поддержка."
        keywords="обучение очистке вентиляции, курсы по очистке воздуховодов, бизнес очистка вентиляции, Pressovac обучение"
        canonical="/training"
        breadcrumbs={trainingBreadcrumbs}
        faq={trainingFAQ}
      />
      {/* Software Popup */}
      <AnimatePresence>
        {showSoftwarePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowSoftwarePopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSoftwarePopup(false)}
                className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <img
                src={calculationSoftwareImg}
                alt="ПО Расчёт стоимости работ"
                className="w-full rounded-xl shadow-2xl"
              />
              <p className="text-center text-white/80 mt-4 text-sm">
                Программное обеспечение для расчёта стоимости работ по очистке вентиляции
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hero with Banner Background */}
      <section className="relative min-h-[400px] md:min-h-[500px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${trainingHeroBanner})` }}
        />
        {/* Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        
        <div className="container-custom relative z-10 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4 backdrop-blur-sm">
              Комплексное обучение
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Помощь <span className="text-gradient">бизнес-партнёру</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Наша цель — добиться успеха наших клиентов. Мы хотим, чтобы вы получали 
              наилучшие результаты от работы на оборудовании Pressovac
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary/20 border border-primary/30 backdrop-blur-sm"
            >
              <Gift className="w-6 h-6 text-primary" />
              <span className="font-semibold text-primary">Бесплатно при покупке оборудования</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Приходите в сообщество профессионалов — <span className="text-gradient">вместе мы сила!</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Мы здесь, чтобы помочь вам любым возможным способом. Экспертный совет 
                и рекомендации по всему, что связано с этой линией бизнеса.
              </p>
              <ul className="space-y-4">
                {ourHelp.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-5 border border-border card-hover"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Training Areas */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Направления обучения
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Индивидуальные программы обучения и инструктажа для вашей компании
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {trainingAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-background rounded-2xl p-8 border border-border overflow-hidden group card-hover"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <area.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-sm font-medium text-primary mb-2">{area.subtitle}</div>
                  <h3 className="font-display font-bold text-2xl mb-3">{area.title}</h3>
                  <p className="text-muted-foreground">{area.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Contents */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Что входит в план обучения
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Полный комплект материалов для успешного старта и развития бизнеса
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {planContents.map((item, index) => {
              const isCalculator = item.title === 'ПО «Расчёт стоимости работ»';
              
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-4 p-5 rounded-2xl border card-hover ${
                    isCalculator 
                      ? 'cursor-pointer group bg-primary/5 border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)] animate-pulse hover:animate-none hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.25)]' 
                      : 'bg-card border-border'
                  }`}
                  onClick={isCalculator ? () => setShowSoftwarePopup(true) : undefined}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isCalculator ? 'bg-primary/20' : 'bg-primary/10'
                  }`}>
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      {isCalculator && (
                        <ZoomIn className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Business Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 md:p-10 border border-border"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl">Готовые бизнес-документы</h3>
                <p className="text-muted-foreground">Большое количество шаблонов для работы</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {businessDocuments.map((doc, index) => (
                <motion.div
                  key={doc}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-background border border-border"
                >
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{doc}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Gift className="w-4 h-4" />
              <span>Бесплатно при покупке оборудования</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Готовы начать свой бизнес?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              План обучения предоставляется бесплатно всем, кто приобрёл оборудование Pressovac. 
              Ежедневная поддержка и консультации включены.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/catalog">
                  Посмотреть оборудование
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contacts">
                  Связаться с нами
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Training;