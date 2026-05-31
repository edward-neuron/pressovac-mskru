import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { FileText, Send, CheckCircle, Loader2, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import Honeypot, { isBotSubmission } from '@/components/Honeypot';
import { showTechWorksAlert } from '@/components/TechWorksAlert';

interface FormData {
  company: string;
  contactPerson: string;
  phone: string;
  email: string;
  businessType: string;
  experience: string;
  ventilationTypes: string[];
  equipmentTypes: string[];
  budget: string;
  comments: string;
  needsTraining: boolean;
  privacyAccepted: boolean;
}

const Inquiry = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [honeypot, setHoneypot] = useState('');
  const [formOpenedAt, setFormOpenedAt] = useState(() => Date.now());
  const [formData, setFormData] = useState<FormData>({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (type: 'ventilationTypes' | 'equipmentTypes', value: string) => {
    setFormData(prev => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Файл слишком большой. Максимальный размер: 10 МБ');
        return;
      }
      if (!validateFileExtension(file)) {
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setAttachment(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot / time-trap anti-bot check
    if (isBotSubmission(honeypot, formOpenedAt)) {
      toast.success('Заявка успешно отправлена!');
      return;
    }

    if (!formData.contactPerson || !formData.phone || !formData.email) {
      toast.error('Заполните обязательные поля');
      return;
    }

    if (!formData.privacyAccepted) {
      toast.error('Необходимо согласие с политикой обработки персональных данных');
      return;
    }

    setIsSubmitting(true);

    try {
      let attachmentPath: string | undefined;
      let attachmentFileName: string | undefined;

      // Upload file if present
      if (attachment) {
        const fileExt = attachment.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('inquiry-attachments')
          .upload(fileName, attachment);

        if (uploadError) {
          console.error('File upload error:', uploadError);
          toast.error('Ошибка загрузки файла');
          setIsSubmitting(false);
          return;
        }

        attachmentPath = fileName;
        attachmentFileName = attachment.name;
      }

      const { error } = await supabase.functions.invoke('send-inquiry', {
        body: { ...formData, attachmentPath, attachmentFileName },
      });

      if (error) throw error;

      // Яндекс.Метрика: цель отправки формы
      if (typeof window !== 'undefined' && (window as any).ym) {
        (window as any).ym(202504, 'reachGoal', 'form_submit');
      }

      toast.success('Заявка успешно отправлена! Проверьте почту для подтверждения.');
      
      // Reset form
      setFormData({
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
      setAttachment(null);
      setHoneypot('');
      setFormOpenedAt(Date.now());
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Error submitting inquiry:', error);
      showTechWorksAlert();
    } finally {
      setIsSubmitting(false);
    }
  };

  const ventilationOptions = ['Приточная вентиляция', 'Вытяжная вентиляция', 'Жировые вытяжки', 'Кондиционирование', 'Промышленная вентиляция', 'Другое'];
  const equipmentOptions = ['Щёточные машины', 'Вакуумные установки', 'Фильтрующие установки', 'Дезинфекция', 'Видеоинспекция', 'Полный комплект'];

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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="font-semibold mb-4 pb-2 border-b border-border">Контактная информация</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Компания</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors"
                        placeholder="Название компании"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Контактное лицо *</label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
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
                        value={formData.phone}
                        onChange={handleInputChange}
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
                        value={formData.email}
                        onChange={handleInputChange}
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
                      <select 
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
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
                        value={formData.experience}
                        onChange={handleInputChange}
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
                      <label className="block text-sm font-medium mb-3">Типы вентиляционных систем для работы</label>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {ventilationOptions.map((item) => (
                          <label key={item} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border cursor-pointer hover:border-primary transition-colors">
                            <input 
                              type="checkbox" 
                              checked={formData.ventilationTypes.includes(item)}
                              onChange={() => handleCheckboxChange('ventilationTypes', item)}
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
                        {equipmentOptions.map((item) => (
                          <label key={item} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border cursor-pointer hover:border-primary transition-colors">
                            <input 
                              type="checkbox" 
                              checked={formData.equipmentTypes.includes(item)}
                              onChange={() => handleCheckboxChange('equipmentTypes', item)}
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
                        value={formData.budget}
                        onChange={handleInputChange}
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
                      <label className="block text-sm font-medium mb-2">Комментарии и пожелания</label>
                      <textarea
                        name="comments"
                        value={formData.comments}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary transition-colors resize-none"
                        placeholder="Опишите ваши задачи, особенности объектов, любые дополнительные пожелания..."
                      />
                    </div>
                    <label className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.needsTraining}
                        onChange={(e) => setFormData(prev => ({ ...prev, needsTraining: e.target.checked }))}
                        className="w-4 h-4 text-primary rounded mt-0.5" 
                      />
                      <span className="text-sm">
                        Интересует обучение работе с оборудованием
                      </span>
                    </label>

                    {/* File attachment */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Прикрепить файл (реквизиты, ТЗ и др.)</label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      />
                      {attachment ? (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                          <Paperclip className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm flex-1 truncate">{attachment.name}</span>
                          <button
                            type="button"
                            onClick={removeAttachment}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          <Paperclip className="w-4 h-4 mr-2" />
                          Выбрать файл
                        </Button>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, DOC, DOCX, XLS, XLSX, JPG, PNG. Максимум 10 МБ
                      </p>
                    </div>
                  </div>
                </div>

                {/* Privacy consent */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                  <Checkbox
                    id="privacy"
                    checked={formData.privacyAccepted}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, privacyAccepted: checked === true }))
                    }
                    className="mt-0.5"
                  />
                  <label htmlFor="privacy" className="text-sm cursor-pointer">
                    Я согласен с{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Политикой обработки персональных данных
                    </Link>
                  </label>
                </div>

                <Honeypot value={honeypot} onChange={setHoneypot} />

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !formData.privacyAccepted}>
                  {isSubmitting ? (
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
    </Layout>
  );
};

export default Inquiry;
