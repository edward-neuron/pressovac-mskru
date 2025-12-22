import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { FileText, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Inquiry = () => {
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
              Опросный лист
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Подбор <span className="text-gradient">оборудования</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Заполните форму, и наши специалисты подберут оптимальный комплект 
              оборудования под ваши задачи
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 border border-border"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl">Опросный лист</h2>
                  <p className="text-sm text-muted-foreground">Заполните все поля для точного подбора</p>
                </div>
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
    </Layout>
  );
};

export default Inquiry;
