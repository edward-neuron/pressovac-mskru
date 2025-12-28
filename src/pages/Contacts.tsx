import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Phone, Mail, MapPin, Clock, Send, FileText, MessageSquare, CheckCircle, ArrowRight, User, PhoneCall, Building, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CallbackFormModal from '@/components/CallbackFormModal';
const contactInfo = [
  { icon: Phone, label: 'Телефон', value: '(499) 677-2010', href: 'tel:+74996772010' },
  { icon: Mail, label: 'Email', value: 'sales@pressovac-moscow.ru', href: 'mailto:sales@pressovac-moscow.ru' },
  { icon: MapPin, label: 'Адрес', value: 'Москва, Россия', href: '#' },
  { icon: Clock, label: 'Время работы', value: 'Пн-Пт: 09:00-21:00', href: '#' },
];

type FormType = 'simple' | 'extended';

const Contacts = () => {
  const [formType, setFormType] = useState<FormType | null>(null);

  return (
    <Layout>
      {/* Form Type Selection - Right at the top */}
      {!formType && (
        <section className="section-padding">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Выберите способ обращения
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Отправьте быструю заявку или заполните расширенную форму для точного подбора оборудования
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
              {/* Simple Form Option */}
              <motion.button
                onClick={() => setFormType('simple')}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-left p-8 rounded-2xl bg-card border-2 border-border hover:border-primary transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Быстрая заявка</h3>
                <p className="text-muted-foreground mb-6">
                  Отправьте сообщение в свободной форме. Подходит для общих вопросов, консультаций и первичного обращения.
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <span>Заполнить</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              {/* Extended Form Option */}
              <motion.button
                onClick={() => setFormType('extended')}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-left p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/30 hover:border-primary transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Опросный лист</h3>
                <p className="text-muted-foreground mb-6">
                  Детальная анкета для точного подбора оборудования. Мы подготовим индивидуальное коммерческое предложение.
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <span>Заполнить</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            </div>

            {/* Contact Info Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border card-hover"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-semibold">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Simple Form */}
      {formType === 'simple' && (
        <section className="section-padding pt-8">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-8 border border-border"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-xl">Быстрая заявка</h2>
                      <p className="text-sm text-muted-foreground">Напишите в свободной форме</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setFormType(null)}>
                    Назад
                  </Button>
                </div>

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
                    <label className="block text-sm font-medium mb-2">Сообщение *</label>
                    <textarea
                      rows={5}
                      required
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
      )}

      {/* Extended Form (Questionnaire) */}
      {formType === 'extended' && (
        <section className="section-padding pt-8">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-8 border border-border"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-xl">Опросный лист</h2>
                      <p className="text-sm text-muted-foreground">Заполните для точного подбора</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setFormType(null)}>
                    Назад
                  </Button>
                </div>

                <form className="space-y-6">
                  {/* Contact Info */}
                  <div>
                    <h3 className="font-semibold mb-4 pb-2 border-b border-border">Контактная информация</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Компания</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
                          placeholder="Название компании"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Контактное лицо *</label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
                          placeholder="ФИО"
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
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <input
                          type="email"
                          required
                          className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
                          placeholder="email@company.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Info */}
                  <div>
                    <h3 className="font-semibold mb-4 pb-2 border-b border-border">Информация о деятельности</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Сфера деятельности</label>
                        <select className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors">
                          <option>Выберите сферу</option>
                          <option>Клининговая компания</option>
                          <option>Обслуживание зданий</option>
                          <option>Ресторанный бизнес</option>
                          <option>Промышленное производство</option>
                          <option>Другое</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Опыт работы в сфере очистки вентиляции</label>
                        <select className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors">
                          <option>Выберите опыт</option>
                          <option>Нет опыта, начинаю с нуля</option>
                          <option>Менее 1 года</option>
                          <option>1-3 года</option>
                          <option>Более 3 лет</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Equipment Needs */}
                  <div>
                    <h3 className="font-semibold mb-4 pb-2 border-b border-border">Потребности в оборудовании</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-3">Типы вентиляционных систем для работы</label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {['Приточная вентиляция', 'Вытяжная вентиляция', 'Жировые вытяжки', 'Кондиционирование', 'Промышленная вентиляция', 'Другое'].map((item) => (
                            <label key={item} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border cursor-pointer hover:border-primary transition-colors">
                              <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                              <span className="text-sm">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-3">Интересующее оборудование</label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {['Щёточные машины', 'Вакуумные установки', 'Фильтрующие установки', 'Дезинфекция', 'Видеоинспекция', 'Полный комплект'].map((item) => (
                            <label key={item} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border cursor-pointer hover:border-primary transition-colors">
                              <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                              <span className="text-sm">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Планируемый бюджет</label>
                        <select className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors">
                          <option>Выберите бюджет</option>
                          <option>До 500 000 ₽</option>
                          <option>500 000 - 1 000 000 ₽</option>
                          <option>1 000 000 - 2 000 000 ₽</option>
                          <option>Более 2 000 000 ₽</option>
                          <option>Требуется консультация</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div>
                    <h3 className="font-semibold mb-4 pb-2 border-b border-border">Дополнительная информация</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Комментарии и пожелания</label>
                        <textarea
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors resize-none"
                          placeholder="Опишите ваши задачи, особенности объектов, любые дополнительные пожелания..."
                        />
                      </div>
                      <label className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-primary rounded mt-0.5" />
                        <span className="text-sm">
                          Интересует обучение работе с оборудованием
                        </span>
                      </label>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Send className="w-5 h-5" />
                    Отправить заявку
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </form>
              </motion.div>

              {/* Benefits */}
              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                {[
                  { text: 'Бесплатная консультация' },
                  { text: 'Ответ в течение 24 часов' },
                  { text: 'Индивидуальный подбор' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Company Info & Expert Consultant */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Legal Address */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Building className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">Юридический адрес</h3>
              <p className="text-muted-foreground leading-relaxed">
                123308, Россия, г. Москва,<br />
                3-й Силикатный проезд, д. 4, кор. 1
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                ООО «Веконт-М»
              </p>
            </motion.div>

            {/* Expert Consultant */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <User className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-4">Консультант-эксперт</h3>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span>Опыт профессионального трубочиста</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span>Знание бизнеса по очистке</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span>Консультации новичков и профессионалов</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span>Аудит, выявление боли, решение задач</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span>Консультации по подбору оборудования</span>
                </li>
              </ul>
              <div className="flex flex-col gap-3">
                <a href="tel:+79258534974">
                  <Button size="lg" className="w-full">
                    <Phone className="w-5 h-5" />
                    Позвонить
                  </Button>
                </a>
                <CallbackFormModal>
                  <Button variant="outline" size="lg" className="w-full">
                    <PhoneCall className="w-5 h-5" />
                    Обратный звонок
                  </Button>
                </CallbackFormModal>
              </div>
            </motion.div>

            {/* Messengers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20"
            >
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6">
                <MessageCircle className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="font-display font-bold text-xl mb-6">Мессенджеры</h3>
              <div className="flex flex-col gap-3">
                <a 
                  href="https://t.me/pressovac_chat" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="w-full bg-[#0088cc] hover:bg-[#0077b5]">
                    <Send className="w-5 h-5" />
                    Telegram Chat
                  </Button>
                </a>
                <a 
                  href="https://api.whatsapp.com/send?phone=79258534974" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="w-full bg-[#25D366] hover:bg-[#1da851]">
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </Button>
                </a>
                <a 
                  href="https://api.whatsapp.com/send?phone=79258534974" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="outline" className="w-full border-green-500/50 text-green-600 hover:bg-green-500/10">
                    Chatti
                  </Button>
                </a>
                <a 
                  href="https://api.whatsapp.com/send?phone=79258534974" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="outline" className="w-full border-blue-500/50 text-blue-600 hover:bg-blue-500/10">
                    MAX
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contacts;
