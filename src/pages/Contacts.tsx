import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Phone, Mail, MapPin, Clock, Send, FileText, MessageSquare, CheckCircle, ArrowRight, User, PhoneCall, Building, MessageCircle, Loader2, Paperclip, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import CallbackFormModal from '@/components/CallbackFormModal';
import TurnstileWidget from '@/components/TurnstileWidget';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const contactsBreadcrumbs = [
  { name: 'Главная', url: '/' },
  { name: 'Контакты', url: '/contacts' }
];

const contactsFAQ = [
  {
    question: "Как связаться с компанией Веконт-М?",
    answer: "Вы можете связаться с нами по телефону (499) 677-2010, по email sales@pressovac-moscow.ru или заполнить форму на сайте. Мы работаем с понедельника по пятницу с 09:00 до 21:00."
  },
  {
    question: "Где находится склад Pressovac в Москве?",
    answer: "Наш склад находится по адресу: 123007, Москва, 2-й Хорошёвский проезд, 7с1, склад №4. Самовывоз возможен после согласования с менеджером."
  },
  {
    question: "Как заказать оборудование Pressovac?",
    answer: "Заполните форму заявки на сайте или свяжитесь с нами по телефону. Мы подготовим коммерческое предложение и счёт на оплату в течение 1 рабочего дня."
  }
];

const contactInfo: Array<{ icon: typeof Phone; label: string; value: string; href: string; target?: string }> = [
  { icon: Phone, label: 'Телефон', value: '(499) 677-2010', href: 'tel:+74996772010' },
  { icon: Mail, label: 'Email', value: 'sales@pressovac-moscow.ru', href: 'mailto:sales@pressovac-moscow.ru' },
  { icon: MapPin, label: 'Адрес склада', value: '123007, Москва, 2-й Хорошёвский проезд, 7с1, склад №4', href: 'https://yandex.ru/maps/?text=Москва%2C%202-й%20Хорошёвский%20проезд%2C%207с1', target: '_blank' },
  { icon: Clock, label: 'Время работы', value: 'Пн-Пт: 09:00-21:00', href: '#' },
];

type FormType = 'simple' | 'extended';

const Contacts = () => {
  const [formType, setFormType] = useState<FormType | null>(null);

  const [simpleSubmitting, setSimpleSubmitting] = useState(false);
  const [simpleAttachment, setSimpleAttachment] = useState<File | null>(null);
  const simpleFileInputRef = useRef<HTMLInputElement>(null);
  const [simpleTurnstileToken, setSimpleTurnstileToken] = useState<string | null>(null);
  const [simpleForm, setSimpleForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    privacyAccepted: false,
  });

  const handleSimpleTurnstileVerify = useCallback((token: string) => {
    setSimpleTurnstileToken(token);
  }, []);

  const handleSimpleTurnstileError = useCallback(() => {
    setSimpleTurnstileToken(null);
    toast.error('Ошибка проверки безопасности. Обновите страницу.');
  }, []);

  const handleSimpleTurnstileExpire = useCallback(() => {
    setSimpleTurnstileToken(null);
  }, []);

  const [extendedSubmitting, setExtendedSubmitting] = useState(false);
  const [extendedAttachment, setExtendedAttachment] = useState<File | null>(null);
  const extendedFileInputRef = useRef<HTMLInputElement>(null);
  const [extendedTurnstileToken, setExtendedTurnstileToken] = useState<string | null>(null);
  const [extendedForm, setExtendedForm] = useState({
    company: '',
    contactPerson: '',
    phone: '',
    email: '',
    businessType: '',
    experience: '',
    ventilationTypes: [] as string[],
    equipmentTypes: [] as string[],
    budget: '',
    comments: '',
    needsTraining: false,
    privacyAccepted: false,
  });

  const handleExtendedTurnstileVerify = useCallback((token: string) => {
    setExtendedTurnstileToken(token);
  }, []);

  const handleExtendedTurnstileError = useCallback(() => {
    setExtendedTurnstileToken(null);
    toast.error('Ошибка проверки безопасности. Обновите страницу.');
  }, []);

  const handleExtendedTurnstileExpire = useCallback(() => {
    setExtendedTurnstileToken(null);
  }, []);

  // Allowed file extensions (safe files only)
  const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'];
  const BLOCKED_EXTENSIONS = ['exe', 'bat', 'cmd', 'com', 'msi', 'scr', 'pif', 'js', 'vbs', 'wsf', 'hta', 'jar', 'ps1', 'sh', 'php', 'py', 'pl', 'rb'];

  const validateFileExtension = (file: File): boolean => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (BLOCKED_EXTENSIONS.includes(ext)) {
      toast.error(`Файлы .${ext} запрещены по соображениям безопасности`);
      return false;
    }
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      toast.error(`Файлы .${ext} не поддерживаются. Допустимые форматы: PDF, DOC, DOCX, PNG, JPG, JPEG`);
      return false;
    }
    return true;
  };

  // Lazy message patterns to block
  const LAZY_MESSAGE_PATTERNS = [
    /^перезвони(те)?(\s+мне)?\.?$/i,
    /^позвони(те)?(\s+мне)?\.?$/i,
    /^свяжи(те)?сь(\s+со\s+мной)?\.?$/i,
    /^нужна\s+консультация\.?$/i,
    /^хочу\s+узнать\.?$/i,
    /^интересует\.?$/i,
    /^вопрос\.?$/i,
    /^заявка\.?$/i,
  ];

  const MIN_SIMPLE_MESSAGE_LENGTH = 80;

  const validateSimpleMessage = (message: string): { valid: boolean; error?: string } => {
    const trimmed = message.trim();
    
    // Check for lazy messages
    for (const pattern of LAZY_MESSAGE_PATTERNS) {
      if (pattern.test(trimmed)) {
        return { 
          valid: false, 
          error: 'Пожалуйста, опишите вашу задачу и конкретный вопрос по существу. "Перезвоните мне" — недостаточно информации для качественной консультации.' 
        };
      }
    }
    
    // Check minimum length
    if (trimmed.length < MIN_SIMPLE_MESSAGE_LENGTH) {
      return { 
        valid: false, 
        error: `Введите реальное описание задачи не менее ${MIN_SIMPLE_MESSAGE_LENGTH} символов (сейчас: ${trimmed.length})` 
      };
    }
    
    return { valid: true };
  };

  const handleSimpleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!simpleForm.name || !simpleForm.phone || !simpleForm.email || !simpleForm.message) {
      toast.error('Заполните обязательные поля');
      return;
    }

    const messageValidation = validateSimpleMessage(simpleForm.message);
    if (!messageValidation.valid) {
      toast.error(messageValidation.error);
      return;
    }

    if (!simpleForm.privacyAccepted) {
      toast.error('Необходимо согласие с политикой обработки персональных данных');
      return;
    }

    if (!simpleTurnstileToken) {
      toast.error('Пожалуйста, подтвердите, что вы не робот');
      return;
    }

    setSimpleSubmitting(true);

    try {
      let attachmentPath: string | undefined;
      let attachmentFileName: string | undefined;

      if (simpleAttachment) {
        if (simpleAttachment.size > 10 * 1024 * 1024) {
          toast.error('Файл слишком большой. Максимальный размер: 10 МБ');
          setSimpleSubmitting(false);
          return;
        }

        if (!validateFileExtension(simpleAttachment)) {
          setSimpleSubmitting(false);
          return;
        }

        const fileExt = simpleAttachment.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('inquiry-attachments')
          .upload(fileName, simpleAttachment);

        if (uploadError) {
          console.error('Simple form upload error:', uploadError);
          toast.error('Ошибка загрузки файла');
          setSimpleSubmitting(false);
          return;
        }

        attachmentPath = fileName;
        attachmentFileName = simpleAttachment.name;
      }

      const { error } = await supabase.functions.invoke('send-inquiry', {
        body: {
          name: simpleForm.name,
          phone: simpleForm.phone,
          email: simpleForm.email,
          message: simpleForm.message,
          subject: 'Быстрая заявка с страницы Контакты',
          attachmentPath,
          attachmentFileName,
          turnstileToken: simpleTurnstileToken,
        },
      });

      if (error) throw error;

      // Яндекс.Метрика: цель отправки формы
      if (typeof window !== 'undefined' && (window as any).ym) {
        (window as any).ym(202504, 'reachGoal', 'form_submit');
      }

      toast.success('Сообщение отправлено!');
      setSimpleForm({ name: '', phone: '', email: '', message: '', privacyAccepted: false });
      setSimpleAttachment(null);
      setSimpleTurnstileToken(null);
      if (simpleFileInputRef.current) simpleFileInputRef.current.value = '';
      setFormType(null);
    } catch (err: any) {
      console.error('Simple inquiry submit error:', err);
      showTechWorksAlert();
    } finally {
      setSimpleSubmitting(false);
    }
  };

  const handleExtendedInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExtendedForm(prev => ({ ...prev, [name]: value }));
  };

  const handleExtendedCheckboxChange = (type: 'ventilationTypes' | 'equipmentTypes', value: string) => {
    setExtendedForm(prev => {
      const current = prev[type];
      const updated = current.includes(value) ? current.filter(i => i !== value) : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  const MIN_COMMENTS_LENGTH = 80;

  const handleExtendedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!extendedForm.company || !extendedForm.contactPerson || !extendedForm.phone || !extendedForm.email) {
      toast.error('Заполните обязательные поля');
      return;
    }

    if (!extendedForm.businessType) {
      toast.error('Выберите сферу деятельности');
      return;
    }

    if (extendedForm.ventilationTypes.length === 0) {
      toast.error('Выберите хотя бы один тип вентиляционных систем');
      return;
    }

    if (!extendedForm.comments || extendedForm.comments.trim().length < MIN_COMMENTS_LENGTH) {
      toast.error(`Введите реальное описание задачи не менее ${MIN_COMMENTS_LENGTH} символов`);
      return;
    }

    if (!extendedForm.privacyAccepted) {
      toast.error('Необходимо согласие с политикой обработки персональных данных');
      return;
    }

    if (!extendedTurnstileToken) {
      toast.error('Пожалуйста, подтвердите, что вы не робот');
      return;
    }

    setExtendedSubmitting(true);

    try {
      let attachmentPath: string | undefined;
      let attachmentFileName: string | undefined;

      if (extendedAttachment) {
        if (extendedAttachment.size > 10 * 1024 * 1024) {
          toast.error('Файл слишком большой. Максимальный размер: 10 МБ');
          setExtendedSubmitting(false);
          return;
        }

        if (!validateFileExtension(extendedAttachment)) {
          setExtendedSubmitting(false);
          return;
        }

        const fileExt = extendedAttachment.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('inquiry-attachments')
          .upload(fileName, extendedAttachment);

        if (uploadError) {
          console.error('Extended form upload error:', uploadError);
          toast.error('Ошибка загрузки файла');
          setExtendedSubmitting(false);
          return;
        }

        attachmentPath = fileName;
        attachmentFileName = extendedAttachment.name;
      }

      const { error } = await supabase.functions.invoke('send-inquiry', {
        body: { ...extendedForm, attachmentPath, attachmentFileName, turnstileToken: extendedTurnstileToken },
      });

      if (error) throw error;

      // Яндекс.Метрика: цель отправки формы
      if (typeof window !== 'undefined' && (window as any).ym) {
        (window as any).ym(202504, 'reachGoal', 'form_submit');
      }

      toast.success('Заявка успешно отправлена!');
      setExtendedForm({
        company: '',
        contactPerson: '',
        phone: '',
        email: '',
        businessType: '',
        experience: '',
        ventilationTypes: [],
        equipmentTypes: [],
        budget: '',
        comments: '',
        needsTraining: false,
        privacyAccepted: false,
      });
      setExtendedAttachment(null);
      setExtendedTurnstileToken(null);
      if (extendedFileInputRef.current) extendedFileInputRef.current.value = '';
      setFormType(null);
    } catch (err: any) {
      console.error('Extended inquiry submit error:', err);
      showTechWorksAlert();
    } finally {
      setExtendedSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEOHead 
        title="Контакты Веконт-М | Заказать оборудование Pressovac"
        description="Связаться с компанией Веконт-М: телефон (499) 677-2010, email sales@pressovac-moscow.ru. Адрес склада в Москве. Заказать оборудование Pressovac."
        keywords="контакты Веконт-М, Pressovac Москва, заказать оборудование для очистки вентиляции, телефон Pressovac"
        canonical="/contacts"
        breadcrumbs={contactsBreadcrumbs}
        faq={contactsFAQ}
      />
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.target}
                  rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border card-hover h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    {item.label === 'Телефон' ? (
                      <div className="mt-0.5 space-y-2">
                        <p className="font-semibold">{item.value}</p>
                        <div>
                          <p className="text-sm text-muted-foreground">Консультант:</p>
                          <p className="font-semibold">(925) 85-349-74</p>
                        </div>
                      </div>
                    ) : (
                      <p className="font-semibold">{item.value}</p>
                    )}
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

                <form onSubmit={handleSimpleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Имя *</label>
                      <input
                        type="text"
                        required
                        value={simpleForm.name}
                        onChange={(e) => setSimpleForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
                        placeholder="Ваше имя"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Телефон *</label>
                      <input
                        type="tel"
                        required
                        value={simpleForm.phone}
                        onChange={(e) => setSimpleForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
                        placeholder="+7 (___) ___-____"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={simpleForm.email}
                      onChange={(e) => setSimpleForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Сообщение (от 80 до 1000 символов) *</label>
                    <textarea
                      rows={5}
                      required
                      value={simpleForm.message}
                      onChange={(e) => setSimpleForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Опишите вашу задачу: форма и характер отложений, диаметр воздуховодов, особенности объекта, конкретный вопрос..."
                      maxLength={1000}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-muted-foreground">
                        Минимум {MIN_SIMPLE_MESSAGE_LENGTH} символов
                      </p>
                      <p className={`text-xs ${simpleForm.message.trim().length >= MIN_SIMPLE_MESSAGE_LENGTH ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {simpleForm.message.trim().length} / 1000
                      </p>
                    </div>
                  </div>

                  {/* File attachment */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Прикрепить файл (ТЗ, реквизиты и т.д.)</label>
                    <input
                      ref={simpleFileInputRef}
                      type="file"
                      onChange={(e) => setSimpleAttachment(e.target.files?.[0] ?? null)}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    />
                    {simpleAttachment ? (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm flex-1 truncate">{simpleAttachment.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSimpleAttachment(null);
                            if (simpleFileInputRef.current) simpleFileInputRef.current.value = '';
                          }}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => simpleFileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Paperclip className="w-4 h-4 mr-2" />
                        Выбрать файл
                      </Button>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">Максимум 10 МБ</p>
                  </div>

                  {/* Privacy consent */}
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                    <Checkbox
                      id="contacts-simple-privacy"
                      checked={simpleForm.privacyAccepted}
                      onCheckedChange={(checked) => setSimpleForm(prev => ({ ...prev, privacyAccepted: checked === true }))}
                      className="mt-0.5"
                    />
                    <label htmlFor="contacts-simple-privacy" className="text-sm cursor-pointer">
                      Я согласен с{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Политикой обработки персональных данных
                      </Link>
                    </label>
                  </div>

                  {/* Turnstile Widget */}
                  <TurnstileWidget
                    onVerify={handleSimpleTurnstileVerify}
                    onError={handleSimpleTurnstileError}
                    onExpire={handleSimpleTurnstileExpire}
                  />

                  <Button type="submit" size="lg" className="w-full" disabled={simpleSubmitting || !simpleForm.privacyAccepted || !simpleTurnstileToken}>
                    {simpleSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Отправить сообщение
                      </>
                    )}
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

                 <form onSubmit={handleExtendedSubmit} className="space-y-6">
                   {/* Contact Info */}
                   <div>
                     <h3 className="font-semibold mb-4 pb-2 border-b border-border">Контактная информация</h3>
                     <div className="grid sm:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-medium mb-2">Компания *</label>
                         <input
                           type="text"
                           name="company"
                           value={extendedForm.company}
                           onChange={handleExtendedInputChange}
                           required
                           className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
                           placeholder="Название компании"
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium mb-2">Контактное лицо *</label>
                         <input
                           type="text"
                           name="contactPerson"
                           value={extendedForm.contactPerson}
                           onChange={handleExtendedInputChange}
                           required
                           className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
                           placeholder="ФИО"
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium mb-2">Телефон *</label>
                         <input
                           type="tel"
                           name="phone"
                           value={extendedForm.phone}
                           onChange={handleExtendedInputChange}
                           required
                           className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
                           placeholder="+7 (___) ___-____"
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium mb-2">Email *</label>
                         <input
                           type="email"
                           name="email"
                           value={extendedForm.email}
                           onChange={handleExtendedInputChange}
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
                         <label className="block text-sm font-medium mb-2">Сфера деятельности *</label>
                         <select
                           name="businessType"
                           value={extendedForm.businessType}
                           onChange={handleExtendedInputChange}
                           required
                           className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
                         >
                           <option value="">Выберите сферу</option>
                           <option value="Клининговая компания">Клининговая компания</option>
                           <option value="Обслуживание зданий">Обслуживание зданий</option>
                           <option value="Ресторанный бизнес">Ресторанный бизнес</option>
                           <option value="Промышленное производство">Промышленное производство</option>
                           <option value="Другое">Другое</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-sm font-medium mb-2">Опыт работы в сфере очистки вентиляции</label>
                         <select
                           name="experience"
                           value={extendedForm.experience}
                           onChange={handleExtendedInputChange}
                           className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
                         >
                           <option value="">Выберите опыт</option>
                           <option value="Нет опыта, начинаю с нуля">Нет опыта, начинаю с нуля</option>
                           <option value="Менее 1 года">Менее 1 года</option>
                           <option value="1-3 года">1-3 года</option>
                           <option value="Более 3 лет">Более 3 лет</option>
                         </select>
                       </div>
                     </div>
                   </div>

                   {/* Equipment Needs */}
                   <div>
                     <h3 className="font-semibold mb-4 pb-2 border-b border-border">Потребности в оборудовании</h3>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium mb-3">Типы вентиляционных систем для работы *</label>
                         <div className="grid sm:grid-cols-2 gap-3">
                           {['Приточная вентиляция', 'Вытяжная вентиляция', 'Жировые вытяжки', 'Кондиционирование', 'Промышленная вентиляция', 'Другое'].map((item) => (
                             <label key={item} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border cursor-pointer hover:border-primary transition-colors">
                               <input
                                 type="checkbox"
                                 checked={extendedForm.ventilationTypes.includes(item)}
                                 onChange={() => handleExtendedCheckboxChange('ventilationTypes', item)}
                                 className="w-4 h-4 text-primary rounded"
                               />
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
                               <input
                                 type="checkbox"
                                 checked={extendedForm.equipmentTypes.includes(item)}
                                 onChange={() => handleExtendedCheckboxChange('equipmentTypes', item)}
                                 className="w-4 h-4 text-primary rounded"
                               />
                               <span className="text-sm">{item}</span>
                             </label>
                           ))}
                         </div>
                       </div>
                       <div>
                         <label className="block text-sm font-medium mb-2">Планируемый бюджет</label>
                         <select
                           name="budget"
                           value={extendedForm.budget}
                           onChange={handleExtendedInputChange}
                           className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
                         >
                           <option value="">Выберите бюджет</option>
                           <option value="До 500 000 ₽">До 500 000 ₽</option>
                           <option value="500 000 - 1 000 000 ₽">500 000 - 1 000 000 ₽</option>
                           <option value="1 000 000 - 2 000 000 ₽">1 000 000 - 2 000 000 ₽</option>
                           <option value="Более 2 000 000 ₽">Более 2 000 000 ₽</option>
                           <option value="Требуется консультация">Требуется консультация</option>
                         </select>
                       </div>
                     </div>
                   </div>

                   {/* Additional Info */}
                   <div>
                     <h3 className="font-semibold mb-4 pb-2 border-b border-border">Дополнительная информация</h3>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium mb-2">Комментарии и пожелания *</label>
                         <textarea
                           name="comments"
                           value={extendedForm.comments}
                           onChange={handleExtendedInputChange}
                           rows={5}
                           required
                           minLength={MIN_COMMENTS_LENGTH}
                           className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors resize-none"
                           placeholder="Опишите вашу задачу, форму и характер отложений внутри каналов, ~ диаметр / сечение воздуховодов (мин/макс), особенности объекта, ~ высота расположения вентиляции, любая полезная информация..."
                         />
                         <p className="text-xs text-muted-foreground mt-1">
                           Минимум {MIN_COMMENTS_LENGTH} символов ({extendedForm.comments.length}/{MIN_COMMENTS_LENGTH})
                         </p>
                       </div>

                       <label className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20 cursor-pointer">
                         <input
                           type="checkbox"
                           checked={extendedForm.needsTraining}
                           onChange={(e) => setExtendedForm(prev => ({ ...prev, needsTraining: e.target.checked }))}
                           className="w-4 h-4 text-primary rounded mt-0.5"
                         />
                         <span className="text-sm">Интересует обучение работе с оборудованием</span>
                       </label>

                       {/* File attachment */}
                       <div>
                         <label className="block text-sm font-medium mb-2">Прикрепить файл (реквизиты, ТЗ и др.)</label>
                         <input
                           ref={extendedFileInputRef}
                           type="file"
                           onChange={(e) => setExtendedAttachment(e.target.files?.[0] ?? null)}
                           className="hidden"
                           accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                         />
                         {extendedAttachment ? (
                           <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                             <Paperclip className="w-4 h-4 text-muted-foreground" />
                             <span className="text-sm flex-1 truncate">{extendedAttachment.name}</span>
                             <button
                               type="button"
                               onClick={() => {
                                 setExtendedAttachment(null);
                                 if (extendedFileInputRef.current) extendedFileInputRef.current.value = '';
                               }}
                               className="text-muted-foreground hover:text-destructive transition-colors"
                             >
                               <X className="w-4 h-4" />
                             </button>
                           </div>
                         ) : (
                           <Button
                             type="button"
                             variant="outline"
                             onClick={() => extendedFileInputRef.current?.click()}
                             className="w-full"
                           >
                             <Paperclip className="w-4 h-4 mr-2" />
                             Выбрать файл
                           </Button>
                         )}
                         <p className="text-xs text-muted-foreground mt-1">Максимум 10 МБ</p>
                       </div>
                     </div>
                   </div>

                   {/* Privacy consent */}
                   <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                     <Checkbox
                       id="contacts-extended-privacy"
                       checked={extendedForm.privacyAccepted}
                       onCheckedChange={(checked) => setExtendedForm(prev => ({ ...prev, privacyAccepted: checked === true }))}
                       className="mt-0.5"
                     />
                     <label htmlFor="contacts-extended-privacy" className="text-sm cursor-pointer">
                       Я согласен с{' '}
                       <Link to="/privacy" className="text-primary hover:underline">
                         Политикой обработки персональных данных
                       </Link>
                     </label>
                   </div>

                   {/* Turnstile Widget */}
                   <TurnstileWidget
                     onVerify={handleExtendedTurnstileVerify}
                     onError={handleExtendedTurnstileError}
                     onExpire={handleExtendedTurnstileExpire}
                   />

                   <Button type="submit" size="lg" className="w-full" disabled={extendedSubmitting || !extendedForm.privacyAccepted || !extendedTurnstileToken}>
                     {extendedSubmitting ? (
                       <>
                         <Loader2 className="w-5 h-5 animate-spin" />
                         Отправка...
                       </>
                     ) : (
                       <>
                         <Send className="w-5 h-5" />
                         Отправить заявку
                       </>
                     )}
                   </Button>
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href="https://wa.me/79258534974" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button size="lg" className="w-full bg-[#25D366] hover:bg-[#1da851]">
                          <MessageCircle className="w-5 h-5" />
                          WhatsApp
                        </Button>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-amber-500 text-white border-amber-600">
                      <p>Не забудьте включить Proxy или VPN</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <a 
                  href="https://play.google.com/store/apps/details?id=ru.oneme.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="w-full bg-gradient-to-r from-[#03d8fa] to-[#4d20f9] text-white hover:opacity-90 rounded-xl">
                    <Download className="w-4 h-4" />
                    MAX (Google Play)
                  </Button>
                </a>
                <a 
                  href="https://apps.apple.com/ru/app/max-%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B7%D0%B2%D0%BE%D0%BD%D0%BA%D0%B8-%D1%81%D0%B5%D1%80%D0%B2%D0%B8%D1%81%D1%8B/id6739530834" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="w-full bg-gradient-to-r from-[#03d8fa] to-[#4d20f9] text-white hover:opacity-90 rounded-xl">
                    <Download className="w-4 h-4" />
                    MAX (App Store)
                  </Button>
                </a>
                <a 
                  href="https://www.rustore.ru/catalog/app/ru.oneme.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="w-full bg-gradient-to-r from-[#03d8fa] to-[#4d20f9] text-white hover:opacity-90 rounded-xl">
                    <Download className="w-4 h-4" />
                    MAX (RuStore)
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
