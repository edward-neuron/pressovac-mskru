import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Truck, Shield, CreditCard, Clock, CheckCircle, Package, Globe, FileText } from 'lucide-react';

const deliveryBreadcrumbs = [
  { name: 'Главная', url: '/' },
  { name: 'Доставка', url: '/delivery' }
];

const deliveryFAQ = [
  {
    question: "Как осуществляется доставка оборудования Pressovac?",
    answer: "Доставка осуществляется транспортными компаниями (СДЭК, Деловые линии, ПЭК) по всей России и в страны СНГ. Срок доставки в Москву — 1-2 дня, в регионы — 3-10 дней."
  },
  {
    question: "Есть ли бесплатная доставка?",
    answer: "Да, бесплатная доставка до терминала транспортной компании в Москве при заказе от 500 000 рублей. Страховка груза включена в стоимость."
  },
  {
    question: "Какие способы оплаты доступны?",
    answer: "Для юридических лиц и ИП доступен безналичный расчёт. Выставляем счёт в течение 1 рабочего дня. Для новых клиентов — предоплата 100%, для постоянных — отсрочка до 30 дней."
  }
];

const deliveryFeatures = [
  { icon: Truck, title: 'Доставка по России', description: 'Отправляем оборудование в любой регион РФ транспортными компаниями' },
  { icon: Globe, title: 'Доставка в СНГ', description: 'Работаем с клиентами из Казахстана, Беларуси и других стран СНГ' },
  { icon: Clock, title: 'Сроки доставки', description: 'Москва — 1-2 дня, регионы — 3-10 дней в зависимости от удалённости' },
  { icon: Package, title: 'Упаковка', description: 'Надёжная упаковка оборудования для безопасной транспортировки' },
];

const paymentMethods = [
  { icon: CreditCard, title: 'Безналичный расчёт', description: 'Для юридических лиц и ИП' },
  { icon: FileText, title: 'Счёт на оплату', description: 'Выставляем счёт в течение 1 рабочего дня' },
  { icon: Shield, title: 'Гарантия', description: 'Официальная гарантия на всё оборудование' },
];

const conditions = [
  'Минимальная сумма заказа — от 50 000 ₽',
  'Предоплата 100% для новых клиентов',
  'Для постоянных клиентов — отсрочка до 30 дней',
  'Бесплатная доставка от 500 000 ₽',
  'Страховка груза включена в стоимость',
  'Полный комплект документов',
];

const Delivery = () => {
  return (
    <Layout>
      <SEOHead 
        title="Доставка и оплата оборудования Pressovac | Веконт-М"
        description="Условия доставки оборудования Pressovac по России и СНГ. Бесплатная доставка от 500 000 ₽. Безналичный расчёт для юрлиц. Гарантия на всё оборудование."
        keywords="доставка Pressovac, доставка оборудования для очистки вентиляции, купить вакуумную установку Москва, оплата оборудования"
        canonical="/delivery"
        breadcrumbs={deliveryBreadcrumbs}
        faq={deliveryFAQ}
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
              Условия поставки
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Доставка и <span className="text-gradient">оплата</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Удобные условия доставки оборудования по России и странам СНГ
            </p>
          </motion.div>
        </div>
      </section>

      {/* Delivery */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Доставка</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border text-center card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Оплата</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-2xl p-6 border border-border text-center card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <method.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{method.title}</h3>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Условия работы</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {conditions.map((condition, index) => (
              <motion.div
                key={condition}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{condition}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Delivery;
