import { useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Paperclip, PhoneCall, Send, Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface CallbackFormModalProps {
  children: React.ReactNode;
}

const timeSlots = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
];

const CallbackFormModal = ({ children }: CallbackFormModalProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    company: '',
    phone: '',
    email: '',
    preferredTime: '',
    message: '',
    privacyAccepted: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.city || !formData.company || !formData.phone || !formData.email) {
      toast({
        title: 'Заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.privacyAccepted) {
      toast({
        title: 'Необходимо согласие с политикой обработки персональных данных',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let attachmentPath: string | undefined;

      if (attachment) {
        if (attachment.size > 10 * 1024 * 1024) {
          toast({
            title: 'Файл слишком большой',
            description: 'Максимальный размер: 10 МБ',
            variant: 'destructive',
          });
          return;
        }

        const fileExt = attachment.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('inquiry-attachments')
          .upload(fileName, attachment);

        if (uploadError) {
          console.error('Callback attachment upload error:', uploadError);
          toast({
            title: 'Ошибка загрузки файла',
            variant: 'destructive',
          });
          return;
        }

        attachmentPath = fileName;
      }

      const { error } = await supabase.functions.invoke('send-inquiry', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          message: `Заказ обратного звонка\n\nГород: ${formData.city}\nУдобное время: ${formData.preferredTime || 'Не указано'}\n\nСообщение:\n${formData.message || 'Не указано'}`,
          subject: 'Заказ обратного звонка',
          attachmentPath,
        },
      });

      if (error) throw error;

      toast({
        title: 'Заявка отправлена!',
        description: 'Мы свяжемся с вами в указанное время.',
      });

      setFormData({
        name: '',
        city: '',
        company: '',
        phone: '',
        email: '',
        preferredTime: '',
        message: '',
        privacyAccepted: false,
      });
      removeAttachment();
      setOpen(false);
    } catch (error) {
      console.error('Error sending callback request:', error);
      toast({
        title: 'Ошибка отправки',
        description: 'Попробуйте позже или позвоните нам напрямую.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <PhoneCall className="w-5 h-5 text-primary" />
            Заказать обратный звонок
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">ФИО *</Label>
              <Input
                id="name"
                placeholder="Иванов Иван Иванович"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Город *</Label>
              <Input
                id="city"
                placeholder="Москва"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Компания *</Label>
            <Input
              id="company"
              placeholder="Название компании"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredTime">Удобное время для звонка</Label>
            <Select
              value={formData.preferredTime}
              onValueChange={(value) => handleChange('preferredTime', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите время" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Краткое описание запроса</Label>
            <Textarea
              id="message"
              placeholder="Опишите вашу задачу или вопрос..."
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              rows={3}
            />
          </div>

          {/* File attachment */}
          <div className="space-y-2">
            <Label>Прикрепить файл (ТЗ, реквизиты и т.д.)</Label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
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
            <p className="text-xs text-muted-foreground">Максимум 10 МБ</p>
          </div>

          {/* Privacy consent */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
            <Checkbox
              id="callback-privacy"
              checked={formData.privacyAccepted}
              onCheckedChange={(checked) => handleChange('privacyAccepted', checked === true)}
              className="mt-0.5"
            />
            <label htmlFor="callback-privacy" className="text-sm cursor-pointer">
              Я согласен с{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                Политикой обработки персональных данных
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting || !formData.privacyAccepted}
          >
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
      </DialogContent>
    </Dialog>
  );
};

export default CallbackFormModal;
