import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Phone, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Honeypot, { isBotSubmission } from '@/components/Honeypot';
import { showTechWorksAlert } from '@/components/TechWorksAlert';

export const CTASection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [formOpenedAt] = useState(() => Date.now());
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot / time-trap anti-bot check
    if (isBotSubmission(honeypot, formOpenedAt)) {
      toast({ title: 'Спасибо, заявка отправлена!' });
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, укажите ваше имя',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.phone.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, укажите телефон',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, укажите корректный email',
        variant: 'destructive',
      });
      return;
    }

    if (formData.message.trim().length < 80) {
      toast({
        title: 'Ошибка',
        description: `Сообщение должно содержать минимум 80 символов (сейчас: ${formData.message.trim().length})`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-inquiry', {
        body: {
          type: 'quick-contact',
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        },
      });

      if (error) {
        const serverMessage = (error as any)?.context?.body?.error;
        throw new Error(serverMessage || error.message || 'Не удалось отправить заявку');
      }

      if (data && (data as any).error) {
        throw new Error((data as any).error);
      }

      toast({
        title: 'Заявка отправлена',
        description: 'Мы свяжемся с вами в ближайшее время',
      });

      // Яндекс.Метрика: цель отправки формы
      if (typeof window !== 'undefined' && (window as any).ym) {
        (window as any).ym(202504, 'reachGoal', 'form_submit');
      }

      setFormData({ name: '', phone: '', email: '', message: '' });
      setHoneypot('');
    } catch (error) {
      console.error('Error submitting form:', error);
      showTechWorksAlert();
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h3 className="font-display font-semibold text-xl text-primary-foreground mb-2">
              Быстрая связь
            </h3>
            <p className="text-primary-foreground/60 text-sm mb-6">
              * Все поля обязательны для заполнения
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ваше имя *"
                  className="w-full px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/50"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+7 (999) 123-45-67 *"
                  className="w-full px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/50"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email *"
                  className="w-full px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/50"
                  required
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Сообщение (минимум 80 символов) *"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/50 resize-none"
                  required
                  minLength={80}
                />
                <p className="text-primary-foreground/50 text-xs mt-1">
                  {formData.message.length}/80 символов
                </p>
              </div>
              
              <Honeypot value={honeypot} onChange={setHoneypot} />

              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting}
                className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Отправить
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
