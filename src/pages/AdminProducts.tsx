import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Save, Loader2, ArrowLeft, ShieldAlert, LogIn } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  vendor_code: string | null;
  picture: string | null;
}

const AdminProducts = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        return;
      }
      
      setIsLoggedIn(true);

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      setIsAdmin(!!roles);
    };

    checkAdmin();
  }, []);

  // Search products
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, vendor_code, picture')
        .or(`name.ilike.%${searchQuery}%,id.eq.${searchQuery},vendor_code.ilike.%${searchQuery}%`)
        .limit(20);

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Search error:', err);
      toast.error('Ошибка поиска');
    } finally {
      setIsLoading(false);
    }
  };

  // Select product for editing
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditedDescription(product.description || '');
  };

  // Save description
  const handleSave = async () => {
    if (!selectedProduct) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          description: editedDescription,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProduct.id);

      if (error) throw error;

      toast.success('Описание сохранено!');
      
      // Update local state
      setProducts(prev => prev.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, description: editedDescription }
          : p
      ));
      setSelectedProduct(prev => prev ? { ...prev, description: editedDescription } : null);
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (isAdmin === null) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <LogIn className="w-16 h-16 text-muted-foreground mx-auto" />
            <h1 className="text-2xl font-bold">Требуется авторизация</h1>
            <p className="text-muted-foreground">Войдите в систему для доступа к админ-панели</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <ShieldAlert className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">Доступ запрещён</h1>
            <p className="text-muted-foreground">У вас нет прав администратора</p>
            <Button onClick={() => navigate('/store')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться в магазин
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/store')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Редактор товаров</h1>
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Поиск по названию, ID или артикулу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Products List */}
          <div className="space-y-2">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Результаты ({products.length})
            </h2>
            <div className="border rounded-lg divide-y max-h-[500px] overflow-y-auto">
              {products.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Введите запрос для поиска
                </div>
              ) : (
                products.map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className={`w-full p-3 text-left hover:bg-muted/50 transition-colors ${
                      selectedProduct?.id === product.id ? 'bg-primary/10' : ''
                    }`}
                  >
                    <div className="font-medium line-clamp-1">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {product.id} {product.vendor_code && `• Арт: ${product.vendor_code}`}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Editor */}
          <div className="space-y-4">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Редактирование
            </h2>
            
            {selectedProduct ? (
              <div className="border rounded-lg p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Название</label>
                  <p className="text-sm text-foreground mt-1">{selectedProduct.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">ID</label>
                  <p className="text-xs text-muted-foreground font-mono mt-1">{selectedProduct.id}</p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Описание</label>
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    rows={12}
                    className="font-mono text-xs"
                    placeholder="Введите описание товара..."
                  />
                </div>

                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Сохранить
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg p-8 text-center text-muted-foreground">
                Выберите товар из списка для редактирования
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminProducts;
