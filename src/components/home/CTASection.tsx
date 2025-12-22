import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>
      
      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
              Готовы начать работу?
            </h2>
            <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-lg">
              Заполните опросный лист для подбора оптимального оборудования под ваши задачи. 
              Наши специалисты свяжутся с вами в ближайшее время.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/inquiry">
                  <FileText className="w-5 h-5" />
                  Опросный лист
                </Link>
              </Button>
              <Button 
                size="lg" 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                asChild
              >
                <a href="tel:+74996772010">
                  <Phone className="w-5 h-5" />
                  Позвонить нам
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/20"
          >
            <h3 className="font-display font-semibold text-xl text-primary-foreground mb-6">
              Быстрая связь
            </h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Ваше имя"
                className="w-full px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/50"
              />
              <input
                type="tel"
                placeholder="Телефон"
                className="w-full px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/50"
              />
              <textarea
                placeholder="Сообщение"
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/50 resize-none"
              />
              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Send className="w-5 h-5" />
                Отправить
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
