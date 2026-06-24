'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Package, ShoppingBag, Zap, Mail, MapPin, Phone, User } from 'lucide-react';
import type { ClientOrder, OrderItem } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
// Explicit relative path pointing straight down to your file
import { supabase } from '../../lib/supabase';
export const runtime = 'edge';
const categories = ['Keyboards', 'Mice', 'Services'];

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'Keyboards',
    description: '',
    image_url: '',
    stock: '100',
    featured: false,
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('client_orders').select('*').order('created_at', { ascending: false }),
      ]);

      if (productsRes.error) throw productsRes.error;
      if (ordersRes.error) throw ordersRes.error;

      setProducts(productsRes.data || []);
      setOrders((ordersRes.data || []) as ClientOrder[]);
    } catch (err: any) {
      console.error("Fetch Failure:", err);
      toast({ title: 'Sync Error', description: err?.message || 'Could not connect to database', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const name = (form.name || '').trim();
    const priceValue = parseFloat(form.price);
    const stockValue = parseInt(form.stock, 10);

    if (!name || Number.isNaN(priceValue) || priceValue < 0) {
      toast({ title: 'Validation Error', description: 'Name and a positive price are required.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);

    const productData = {
      name,
      price: priceValue,
      category: form.category,
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      stock: Number.isNaN(stockValue) ? 0 : stockValue,
      featured: Boolean(form.featured),
    };

    try {
      if (editingProduct) {
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? data[0] : p));
        }
        toast({ title: 'Success', description: 'Product updated successfully' });
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          setProducts(prev => [data[0], ...prev]);
        }
        toast({ title: 'Success', description: 'Product created successfully' });
      }
      resetForm();
    } catch (err: any) {
      alert("Database error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product permanently?')) return;
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      
      if (error) {
        // If Supabase throws an RLS or permission block error, throw an alert immediately
        alert("Supabase Error: " + error.message);
        return;
      }

      // If network deletion succeeds, remove from visual UI state
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Success', description: 'Product permanently removed' });
    } catch (err: any) {
      alert("Execution error: " + err.message);
    }
  }

  function editProduct(product: any) {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      price: (product.price ?? '').toString(),
      category: product.category || 'Keyboards',
      description: product.description || '',
      image_url: product.image_url || '',
      stock: (product.stock ?? '0').toString(),
      featured: product.featured ?? false,
    });
    setShowForm(true);
  }

  function resetForm() {
    setEditingProduct(null);
    setForm({ name: '', price: '', category: 'Keyboards', description: '', image_url: '', stock: '100', featured: false });
    setShowForm(false);
  }

  function parseOrderItems(items: unknown): OrderItem[] {
    if (!Array.isArray(items)) return [];
    return items.filter(
      (item): item is OrderItem =>
        item != null &&
        typeof item === 'object' &&
        'product' in item &&
        item.product != null &&
        typeof item.product === 'object' &&
        'name' in item.product
    );
  }

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    revenue: orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-primary/20 bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Management Panel</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/')}>Back to Store</Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </div>
          <div className="bg-card border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
          <div className="bg-card border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Pending Orders</p>
            <p className="text-2xl font-bold">{stats.pendingOrders}</p>
          </div>
          <div className="bg-card border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">PHP {stats.revenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Button variant={activeTab === 'products' ? 'default' : 'outline'} onClick={() => setActiveTab('products')}>Products</Button>
          <Button variant={activeTab === 'orders' ? 'default' : 'outline'} onClick={() => setActiveTab('orders')}>Orders</Button>
        </div>

        {activeTab === 'products' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Products</h2>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </div>

            {showForm && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-card border border-primary/20 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                    <Button variant="ghost" size="icon" onClick={resetForm}><X className="h-5 w-5" /></Button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price (PHP) *</Label>
                        <Input id="price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <select id="category" className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="image">Image URL (optional)</Label>
                      <Input id="image" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stock">Stock</Label>
                        <Input id="stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                      </div>
                      <div className="flex items-end pb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-primary" />
                          <span className="text-sm">Featured Product</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={resetForm} className="flex-1">Cancel</Button>
                      <Button type="submit" className="flex-1 gap-2" disabled={submitting}>
                        <Save className="h-4 w-4" />
                        {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No products found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 bg-card border border-primary/20 rounded-lg">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Package className="h-6 w-6 text-muted-foreground" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{product.name}</h3>
                      <p className="text-primary font-bold">PHP {Number(product.price || 0).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{product.category} {product.featured && '| Featured'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => editProduct(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Orders</h2>
              <p className="text-sm text-muted-foreground">{orders.length} total</p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No orders yet.</p>
                <p className="text-sm mt-1">Orders submitted from the store cart will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const orderItems = parseOrderItems(order.order_items);

                  return (
                    <div
                      key={order.id}
                      className="bg-card border border-primary/20 rounded-lg overflow-hidden"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 p-4 border-b border-primary/10 bg-muted/30">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Order ID</p>
                          <p className="font-mono font-semibold">{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Total</p>
                          <p className="text-xl font-bold text-primary">
                            PHP {Number(order.total_amount || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <User className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground">Client Name</p>
                              <p className="font-medium">{order.client_name}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground">Email</p>
                              <p className="font-medium break-all">{order.client_email || 'Not provided'}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground">Phone</p>
                              <p className="font-medium">{order.phone_number}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground">Delivery Address</p>
                              <p className="font-medium">{order.delivery_address}</p>
                            </div>
                          </div>
                          {order.special_instructions && (
                            <div className="rounded-md bg-muted/50 border border-primary/10 p-3 mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Special Instructions</p>
                              <p className="text-sm italic">{order.special_instructions}</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                            Ordered Items ({orderItems.length})
                          </p>
                          {orderItems.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No item details available.</p>
                          ) : (
                            <div className="space-y-2">
                              {orderItems.map((item, index) => (
                                <div
                                  key={`${order.id}-${item.product.id}-${index}`}
                                  className="flex items-center gap-3 p-2 rounded-md bg-muted/50 border border-primary/10"
                                >
                                  <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                    {item.product.image_url ? (
                                      <img
                                        src={item.product.image_url}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Package className="h-5 w-5 text-muted-foreground" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{item.product.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Qty: {item.quantity ?? 1}
                                    </p>
                                  </div>
                                  <p className="text-sm font-bold text-primary flex-shrink-0">
                                    PHP {Number(item.product.price || 0).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}