import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, Building, Globe } from 'lucide-react';

const stats = [
  { icon: Award, value: '30+', label: 'лет на рынке' },
  { icon: Users, value: '500+', label: 'обученных специалистов' },
  { icon: Building, value: '1000+', label: 'проектов' },
  { icon: Globe, value: 'СНГ', label: 'география поставок' },
];

export const AboutPreview = () => {
  return (
    <section className="section-padding" aria-labelledby="about-heading">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              О компании
            </span>
            <h2 id="about-heading" className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Компания <span className="text-gradient tracking-tight">«Веконт‑М»</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Мы являемся официальным дистрибьютором финской фирмы PRESSOVAC Oy 
              на территории России и в странах СНГ. Поставляем профессиональное 
              оборудование для очистки вентиляции и удаления жира в вытяжных системах.
            </p>
            <ul className="space-y-3">
              {['Делимся опытом и лайфхаками', 'Проводим бесплатный аудит компании', 'Помогаем запустить бизнес', 'Предоставляем комплексное обучение'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Узнать больше о нас
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border text-center card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-primary" />
                </div>
                <p className="font-display text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
