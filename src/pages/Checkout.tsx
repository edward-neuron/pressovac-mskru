import { useState, useRef } from 'react';
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
import { useToast } from '@/hooks/use-toast';

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/jpg',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];

const Checkout = () => {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    city: '',
    paymentMethod: '',
    deliveryMethod: '',
    comment: '',
    callbackRequested: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user fills the field
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: File[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast({
          title: 'Недопустимый формат',
          description: `Файл "${file.name}" имеет недопустимый формат. Допустимые форматы: PDF, Word, PNG, JPG`,
          variant: 'destructive',
        });
        continue;
      }

      if (file.size > maxSize) {
        toast({
          title: 'Файл слишком большой',
          description: `Файл "${file.name}" превышает максимальный размер 10MB`,
          variant: 'destructive',
        });
        continue;
      }

      newFiles.push(file);
    }

    setAttachments(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, boolean> = {};
    
    if (!formData.name.trim()) errors.name = true;
    if (!formData.company.trim()) errors.company = true;
    if (!formData.phone.trim()) errors.phone = true;
    if (!formData.email.trim()) errors.email = true;
    if (!formData.city.trim()) errors.city = true;
    if (!formData.paymentMethod) errors.paymentMethod = true;
    if (!formData.deliveryMethod) errors.deliveryMethod = true;

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast({
        title: 'Заполните все обязательные поля',
        description: 'Пожалуйста, заполните все поля, отмеченные звёздочкой',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: 'Корзина пуста',
        description: 'Добавьте товары перед оформлением заказа',
        variant: 'destructive',
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Generate order number
    const generatedOrderNumber = `PV-${Date.now().toString().slice(-8)}`;

    // Simulate order submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setOrderNumber(generatedOrderNumber);
    setOrderSuccess(true);
    clearCart();
    
    setIsSubmitting(false);
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
                    <Label htmlFor="city" className={validationErrors.city ? 'text-destructive' : ''}>
                      Город доставки *
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Москва"
                      className={validationErrors.city ? 'border-destructive ring-destructive' : ''}
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
                    Допустимые форматы: PDF, Word, PNG, JPG (до 10MB)
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ALLOWED_EXTENSIONS.join(',')}
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-4"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Выбрать файлы
                  </Button>

                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      {attachments.map((file, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                        >
                          <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm flex-1 truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeAttachment(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comment */}
                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="comment">Комментарий к заказу</Label>
                    <Textarea
                      id="comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleInputChange}
                      placeholder="Дополнительные пожелания, вопросы..."
                      rows={4}
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
                    disabled={isSubmitting}
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
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          className="w-full h-full object-cover"
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
