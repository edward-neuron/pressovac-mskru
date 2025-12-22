import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const contactInfo = [
  { icon: Phone, label: 'Телефон', value: '(499) 677-2010', href: 'tel:+74996772010' },
  { icon: Mail, label: 'Email', value: 'info@pressovac-msk.ru', href: 'mailto:info@pressovac-msk.ru' },
  { icon: MapPin, label: 'Адрес', value: 'Москва, Россия', href: '#' },
  { icon: Clock, label: 'Время работы', value: 'Пн-Пт: 09:00-21:00', href: '#' },
];

const Contacts = () => {
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
              Контакты
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Свяжитесь <span className="text-gradient">с нами</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Мы всегда готовы ответить на ваши вопросы и помочь с выбором оборудования
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-display text-3xl font-bold mb-4">Контактная информация</h2>
                <p className="text-muted-foreground">
                  Свяжитесь с нами любым удобным способом — мы ответим в кратчайшие сроки
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border card-hover"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-semibold">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                <h3 className="font-display font-semibold text-lg mb-2">Офис продаж</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Приглашаем вас посетить наш офис для демонстрации оборудования
                </p>
                <a 
                  href="tel:+74996772010" 
                  className="inline-flex items-center gap-2 text-primary font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  Записаться на демонстрацию
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 border border-border"
            >
              <h2 className="font-display text-2xl font-bold mb-6">Напишите нам</h2>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Имя *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Телефон *</label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
                      placeholder="+7 (___) ___-____"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Тема обращения</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors">
                    <option>Консультация по оборудованию</option>
                    <option>Заказ оборудования</option>
                    <option>Обучение</option>
                    <option>Сервисное обслуживание</option>
                    <option>Другое</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Сообщение</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Опишите ваш вопрос или задачу..."
                  />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  <Send className="w-5 h-5" />
                  Отправить сообщение
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contacts;
