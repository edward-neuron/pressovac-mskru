import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Wrench, GraduationCap } from 'lucide-react';

const categories = [
  {
    icon: Zap,
    title: 'Щёточные машины',
    description: 'Профессиональные щёточные машины для механической очистки воздуховодов любого сечения',
    href: '/catalog#brush-machines',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Shield,
    title: 'Вакуумные установки',
    description: 'Мощные вакуумные системы для эффективного сбора загрязнений при очистке',
    href: '/catalog#vacuum',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: Wrench,
    title: 'Фильтрующие установки',
    description: 'Высокоэффективные фильтры для очистки воздуха и сбора мелкодисперсных частиц',
    href: '/catalog#filters',
    color: 'from-teal-500 to-teal-600',
  },
  {
    icon: GraduationCap,
    title: 'Дезинфекция',
    description: 'Оборудование для антибактериальной обработки и дезинфекции вентиляционных систем',
    href: '/catalog#disinfection',
    color: 'from-indigo-500 to-indigo-600',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const CatalogPreview = () => {
  return (
    <section className="section-padding bg-card">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Каталог оборудования
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Линейки оборудования <span className="text-gradient">Pressovac</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Полный комплекс решений для профессиональной очистки и обслуживания 
            систем вентиляции и кондиционирования
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.title} variants={itemVariants}>
              <Link
                to={category.href}
                className="group block h-full bg-background rounded-2xl p-6 border border-border card-hover"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {category.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Подробнее
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            Смотреть весь каталог
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
