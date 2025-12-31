import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/data/storeData';
import { ArrowLeft, ShoppingBag, Check, Loader2, Minus, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    city: '',
    comment: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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

    setIsSubmitting(true);

    // Simulate order submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'Заказ отправлен!',
      description: 'Наш менеджер свяжется с вами в ближайшее время',
    });

    clearCart();
    navigate('/store');
    
    setIsSubmitting(false);
  };

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
                <h2 className="text-xl font-semibold mb-4">Контактные данные</h2>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя *</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Компания</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="ООО «Название»"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="mail@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Город доставки</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Москва"
                  />
                </div>

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
                  <p className="text-xs text-muted-foreground mt-2">
                    * Цены ориентировочные. Точную стоимость и условия доставки уточняйте у менеджера.
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
