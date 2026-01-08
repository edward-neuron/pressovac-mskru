import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/data/storeData';
import { ArrowLeft, ShoppingBag, Check, Loader2, Minus, Plus, Trash2, Upload, X, Phone, FileText, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import TurnstileWidget from '@/components/TurnstileWidget';
import { getPreviewImageUrl } from '@/lib/imageOptimization';

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'];
const BLOCKED_EXTENSIONS = ['exe', 'bat', 'cmd', 'com', 'msi', 'scr', 'pif', 'js', 'vbs', 'wsf', 'hta', 'jar', 'ps1', 'sh', 'php', 'py', 'pl', 'rb'];

const Checkout = () => {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    location: '',
    paymentMethod: '',
    deliveryMethod: '',
    comment: '',
    callbackRequested: false,
  });

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken(null);
    // Don't show toast - handled silently or in preview mode
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (value && validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      callbackRequested: checked
    }));
  };

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

  const validateForm = (): boolean => {
    const errors: Record<string, boolean> = {};
    
    if (!formData.name.trim()) errors.name = true;
    if (!formData.company.trim()) errors.company = true;
    if (!formData.phone.trim()) errors.phone = true;
    if (!formData.email.trim()) errors.email = true;
    if (!formData.location.trim()) errors.location = true;
    if (!formData.paymentMethod) errors.paymentMethod = true;
    if (!formData.deliveryMethod) errors.deliveryMethod = true;
    if (!formData.comment.trim()) errors.comment = true;

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Заполните все обязательные поля');
      return false;
    }

    return true;
  };

  const getPaymentMethodLabel = (value: string): string => {
    switch (value) {
      case 'invoice': return 'Оплата по счёту';
      case 'cash': return 'Оплата наличными';
      default: return value;
    }
  };

  const getDeliveryMethodLabel = (value: string): string => {
    switch (value) {
      case 'pickup': return 'Самовывоз со склада';
      case 'delovye-linii': return 'Доставка ТК «Деловые Линии»';
      case 'jet-logistic': return 'Международная доставка (Jet Logistic)';
      default: return value;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Корзина пуста. Добавьте товары перед оформлением заказа');
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (!turnstileToken) {
      toast.error('Пожалуйста, подтвердите, что вы не робот');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate order number
      const generatedOrderNumber = `PV-${Date.now().toString().slice(-8)}`;

      let attachmentPath: string | undefined;
      let attachmentFileName: string | undefined;

      // Upload file if present
      if (attachment) {
        const fileExt = attachment.name.split('.').pop();
        const fileName = `orders/${generatedOrderNumber}-${Date.now()}.${fileExt}`;

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

      // Build order details for email
      const orderItems = items.map(item => ({
        name: item.name,
        sku: item.article || '',
        quantity: item.quantity,
        price: item.price,
        image: item.image || '',
      }));

      const { error } = await supabase.functions.invoke('send-inquiry', {
        body: {
          type: 'store-order',
          orderNumber: generatedOrderNumber,
          name: formData.name,
          company: formData.company,
          phone: formData.phone,
          email: formData.email,
          location: formData.location,
          paymentMethod: getPaymentMethodLabel(formData.paymentMethod),
          deliveryMethod: getDeliveryMethodLabel(formData.deliveryMethod),
          comments: formData.comment,
          callbackRequested: formData.callbackRequested,
          orderItems,
          totalPrice,
          attachmentPath,
          attachmentFileName,
          turnstileToken,
          subject: `Заказ №${generatedOrderNumber} из интернет-магазина`,
        },
      });

      if (error) throw error;

      setOrderNumber(generatedOrderNumber);
      setOrderSuccess(true);
      clearCart();
      
    } catch (error: any) {
      console.error('Error submitting order:', error);
      toast.error('Ошибка при отправке заказа. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (orderSuccess) {
    return (
      <Layout>
        <SEOHead 
          title="Заказ оформлен | Магазин Pressovac"
          description="Ваш заказ успешно оформлен"
          canonical="/store/checkout"
        />
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              
              <h1 className="text-2xl font-bold mb-4">Заказ успешно оформлен</h1>
              
              <p className="text-muted-foreground mb-8">
                Информацию о заказе <strong>№{orderNumber}</strong> можно посмотреть 
                в вашей электронной почте, указанной при оформлении.
              </p>

              <div className="bg-card rounded-2xl border border-border/50 p-6 mb-8">
                <h2 className="font-semibold mb-4">Наши контакты</h2>
                <div className="space-y-3 text-left">
                  <a 
                    href="tel:+74996772010" 
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>+7 (499) 677-20-10 <span className="text-sm">(многоканальный)</span></span>
                  </a>
                  <a 
                    href="tel:+79258534974" 
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>+7 (925) 85-349-74 <span className="text-sm">(консультант онлайн)</span></span>
                  </a>
                </div>
              </div>

              <Link to="/store">
                <Button size="lg">Вернуться в магазин</Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <SEOHead 
          title="Оформление заказа | Магазин Pressovac"
          description="Оформление заказа на оборудование Pressovac"
          canonical="/store/checkout"
        />
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Корзина пуста</h1>
              <p className="text-muted-foreground mb-6">
                Добавьте товары из каталога, чтобы оформить заказ
              </p>
              <Link to="/store">
                <Button>Перейти в магазин</Button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead 
        title="Оформление заказа | Магазин Pressovac"
        description="Оформление заказа на оборудование Pressovac"
        canonical="/store/checkout"
      />

      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* Back Link */}
          <Link 
            to="/store" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться в магазин
          </Link>

          <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-card rounded-2xl border border-border/50 p-6 space-y-6"
              >
                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Контактные данные</h2>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className={validationErrors.name ? 'text-destructive' : ''}>
                        Имя *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Иван Иванов"
                        className={validationErrors.name ? 'border-destructive ring-destructive' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className={validationErrors.company ? 'text-destructive' : ''}>
                        Компания *
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        required
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="ООО «Название»"
                        className={validationErrors.company ? 'border-destructive ring-destructive' : ''}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className={validationErrors.phone ? 'text-destructive' : ''}>
                        Телефон *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+7 (999) 123-45-67"
                        className={validationErrors.phone ? 'border-destructive ring-destructive' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className={validationErrors.email ? 'text-destructive' : ''}>
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="mail@example.com"
                        className={validationErrors.email ? 'border-destructive ring-destructive' : ''}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="location" className={validationErrors.location ? 'text-destructive' : ''}>
                      Страна/Город доставки *
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Россия, Москва"
                      className={validationErrors.location ? 'border-destructive ring-destructive' : ''}
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="pt-4 border-t">
                  <h2 className={`text-xl font-semibold mb-4 ${validationErrors.paymentMethod ? 'text-destructive' : ''}`}>
                    Форма оплаты *
                  </h2>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleRadioChange('paymentMethod', value)}
                    className={`space-y-3 ${validationErrors.paymentMethod ? 'p-3 rounded-lg border border-destructive bg-destructive/5' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="invoice" id="payment-invoice" />
                      <Label htmlFor="payment-invoice" className="cursor-pointer">
                        Оплата по счёту
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="cash" id="payment-cash" />
                      <Label htmlFor="payment-cash" className="cursor-pointer">
                        Оплата наличными
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Delivery Method */}
                <div className="pt-4 border-t">
                  <h2 className={`text-xl font-semibold mb-4 ${validationErrors.deliveryMethod ? 'text-destructive' : ''}`}>
                    Условия поставки *
                  </h2>
                  <RadioGroup
                    value={formData.deliveryMethod}
                    onValueChange={(value) => handleRadioChange('deliveryMethod', value)}
                    className={`space-y-3 ${validationErrors.deliveryMethod ? 'p-3 rounded-lg border border-destructive bg-destructive/5' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="pickup" id="delivery-pickup" />
                      <Label htmlFor="delivery-pickup" className="cursor-pointer">
                        Самовывоз со склада
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="delovye-linii" id="delivery-delovye" />
                      <Label htmlFor="delivery-delovye" className="cursor-pointer">
                        Доставка ТК «Деловые Линии»
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="jet-logistic" id="delivery-jet" />
                      <Label htmlFor="delivery-jet" className="cursor-pointer">
                        Международная доставка (Jet Logistic)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Attachments */}
                <div className="pt-4 border-t">
                  <h2 className="text-xl font-semibold mb-4">Прикрепить реквизиты</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Допустимые форматы: PDF, DOC, DOCX, PNG, JPG, JPEG (до 10 МБ)
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  
                  {!attachment ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Выбрать файл
                    </Button>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm flex-1 truncate">{attachment.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(attachment.size / 1024 / 1024).toFixed(2)} МБ
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={removeAttachment}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Comment */}
                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="comment" className={validationErrors.comment ? 'text-destructive' : ''}>
                      Комментарий к заказу *
                    </Label>
                    <Textarea
                      id="comment"
                      name="comment"
                      required
                      value={formData.comment}
                      onChange={handleInputChange}
                      placeholder="Дополнительные пожелания, вопросы..."
                      rows={4}
                      className={validationErrors.comment ? 'border-destructive ring-destructive' : ''}
                    />
                  </div>

                  {/* Callback Checkbox */}
                  <div className="flex items-center space-x-3 mt-4">
                    <Checkbox
                      id="callback"
                      checked={formData.callbackRequested}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="callback" className="cursor-pointer text-sm">
                      Перезвонить для уточнения деталей заказа
                    </Label>
                  </div>
                </div>

                {/* Turnstile */}
                <div className="pt-4 border-t">
                  <TurnstileWidget
                    onVerify={handleTurnstileVerify}
                    onError={handleTurnstileError}
                    onExpire={handleTurnstileExpire}
                  />
                </div>

                {/* Submit */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-4">
                    * Нажимая кнопку «Отправить заказ», вы соглашаетесь с{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      политикой конфиденциальности
                    </Link>
                  </p>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting || !turnstileToken}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Отправить заказ
                      </>
                    )}
                  </Button>
                </div>
              </motion.form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl border border-border/50 p-6 sticky top-24"
              >
                <h2 className="text-xl font-semibold mb-4">Ваш заказ</h2>
                
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-4 border-b border-border/50">
                      <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        <img
                          src={getPreviewImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                        <div className="text-sm text-primary font-semibold">
                          {formatPrice(item.price)}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-auto text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Товаров:</span>
                    <span>{items.reduce((sum, i) => sum + i.quantity, 0)} шт.</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Итого:</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    Цены условно актуальные, включают НДС 22%. После оформления заказа, вы получите точный расчет. Детали уточняйте у консультанта.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
