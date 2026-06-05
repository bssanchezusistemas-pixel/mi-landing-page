'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Lock, LayoutDashboard, Package, ShoppingCart, BarChart3, 
  Search, Save, LogOut, CheckCircle2, AlertTriangle, TrendingUp,
  Tag, Layers, RefreshCw
} from 'lucide-react';
import { db, Product, Order, Category } from '@/lib/db';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'metrics'>('metrics');

  // Core data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Search & editing states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState(0);
  const [variantStocks, setVariantStocks] = useState<{ [variantId: string]: number }>({});
  
  // Check auth state on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('pe_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setCategories(db.getCategories());
      loadAdminData();
    }
  }, [isAuthenticated]);

  const loadAdminData = () => {
    setProducts(db.getProducts({}));
    setOrders(db.getOrders());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin passwords
    if (password === 'admin123' || password === 'pipecalle2026') {
      setIsAuthenticated(true);
      localStorage.setItem('pe_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Contraseña incorrecta. Intenta de nuevo.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pe_admin_auth');
  };

  // Filter products in admin
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.variants?.some(v => v.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Edit action triggers
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditPrice(product.price);
    
    // Set stocks of variants
    const stocks: { [variantId: string]: number } = {};
    product.variants?.forEach((v) => {
      stocks[v.id] = v.stock;
    });
    setVariantStocks(stocks);
  };

  const handleStockChange = (variantId: string, value: string) => {
    const num = parseInt(value) || 0;
    setVariantStocks({
      ...variantStocks,
      [variantId]: Math.max(0, num),
    });
  };

  const handleSaveProductChanges = () => {
    if (!selectedProduct) return;

    // 1. Update Price
    db.updateProductPrice(selectedProduct.id, editPrice);

    // 2. Update Stocks of variants
    let allSucceeded = true;
    Object.keys(variantStocks).forEach((vId) => {
      const success = db.updateStock(vId, variantStocks[vId]);
      if (!success) allSucceeded = false;
    });

    if (allSucceeded) {
      alert('¡Cambios guardados con éxito!');
      setSelectedProduct(null);
      loadAdminData(); // Refresh list
    } else {
      alert('Hubo un problema al guardar algunos stocks.');
    }
  };

  const handleOrderStatusUpdate = (orderId: string, nextStatus: string) => {
    const success = db.updateOrderStatus(orderId, nextStatus);
    if (success) {
      loadAdminData(); // Refresh list
    }
  };

  // Math metrics details
  const totalSales = orders
    .filter(o => o.status === 'entregado')
    .reduce((acc, o) => acc + o.total_amount, 0);

  const pendingSales = orders
    .filter(o => o.status === 'pendiente')
    .reduce((acc, o) => acc + o.total_amount, 0);

  const lowStockCount = products.reduce((acc, p) => {
    const hasLowStock = p.variants?.some(v => v.stock < 5);
    return hasLowStock ? acc + 1 : acc;
  }, 0);

  // Render Auth Login view
  if (!isAuthenticated) {
    return (
      <div className='min-h-[70vh] flex items-center justify-center bg-brand-black text-brand-white px-4 font-street'>
        <div className='bg-brand-secondary border border-brand-border/40 p-8 rounded-xl max-w-sm w-full space-y-6 shadow-2xl'>
          <div className='text-center space-y-2'>
            <div className='w-12 h-12 flex items-center justify-center bg-brand-black border border-brand-beige/20 text-brand-beige rounded-full mx-auto mb-2'>
              <Lock className='w-5 h-5' />
            </div>
            <h1 className='text-xl font-extrabold uppercase tracking-widest text-brand-white'>
              PIPE EN LA CALLE
            </h1>
            <p className='text-xs text-brand-muted uppercase tracking-wider'>
              PANEL ADMINISTRATIVO
            </p>
          </div>

          <form onSubmit={handleLogin} className='space-y-4 text-sm'>
            <div className='space-y-1.5'>
              <label htmlFor='adminPass' className='block text-xs font-bold uppercase tracking-wider text-brand-muted'>
                Contraseña de Acceso
              </label>
              <input
                id='adminPass'
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Escribe la contraseña...'
                className='w-full bg-brand-black border border-brand-border/60 rounded-sm py-2.5 px-3 text-sm text-brand-white focus:border-brand-beige/50 focus:outline-none transition-colors'
              />
              {loginError && (
                <span className='text-xs text-red-500 font-bold block mt-1'>{loginError}</span>
              )}
            </div>

            <button
              type='submit'
              className='w-full bg-brand-beige text-brand-black hover:bg-brand-beige-hover transition-colors font-extrabold text-xs tracking-widest uppercase py-3.5 rounded-sm'
            >
              Iniciar Sesión
            </button>
          </form>

          <div className='text-[10px] text-center text-brand-muted border-t border-brand-border/30 pt-4'>
            Usa la contraseña demo: <code className='text-brand-beige font-mono'>admin123</code> o <code className='text-brand-beige font-mono'>pipecalle2026</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 bg-brand-black text-brand-white min-h-screen font-street'>
      {/* Header Panel */}
      <header className='flex flex-wrap items-center justify-between gap-4 border-b border-brand-border/30 pb-6 mb-8'>
        <div>
          <h1 className='text-3xl font-extrabold uppercase tracking-tight text-brand-white'>
            CONTROL DE NEGOCIO
          </h1>
          <p className='text-brand-muted text-xs uppercase tracking-wider mt-1'>
            PIPE EN LA CALLE · PANEL DE ADMINISTRACIÓN
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={loadAdminData}
            className='bg-brand-secondary border border-brand-border p-2.5 rounded text-brand-white hover:text-brand-beige transition-colors'
            title='Sincronizar Datos'
          >
            <RefreshCw className='w-4 h-4' />
          </button>
          
          <button
            onClick={handleLogout}
            className='bg-brand-secondary border border-brand-border/60 text-xs font-bold tracking-widest uppercase py-2.5 px-4 rounded text-brand-white hover:bg-red-950/20 hover:text-red-400 hover:border-red-900/40 transition-all inline-flex items-center gap-2'
          >
            <LogOut className='w-4 h-4' /> Salir
          </button>
        </div>
      </header>

      {/* Tabs Selector Navigation */}
      <nav className='flex border-b border-brand-border/40 mb-8 overflow-x-auto gap-4'>
        <button
          onClick={() => { setActiveTab('metrics'); setSelectedProduct(null); }}
          className={`pb-3 text-xs tracking-widest font-extrabold uppercase border-b-2 transition-all inline-flex items-center gap-2 shrink-0 ${
            activeTab === 'metrics'
              ? 'border-brand-beige text-brand-beige'
              : 'border-transparent text-brand-muted hover:text-brand-white'
          }`}
        >
          <BarChart3 className='w-4 h-4' /> Métricas & Resumen
        </button>
        <button
          onClick={() => { setActiveTab('inventory'); setSelectedProduct(null); }}
          className={`pb-3 text-xs tracking-widest font-extrabold uppercase border-b-2 transition-all inline-flex items-center gap-2 shrink-0 ${
            activeTab === 'inventory'
              ? 'border-brand-beige text-brand-beige'
              : 'border-transparent text-brand-muted hover:text-brand-white'
          }`}
        >
          <Package className='w-4 h-4' /> Inventario de ropa
        </button>
        <button
          onClick={() => { setActiveTab('orders'); setSelectedProduct(null); }}
          className={`pb-3 text-xs tracking-widest font-extrabold uppercase border-b-2 transition-all inline-flex items-center gap-2 shrink-0 ${
            activeTab === 'orders'
              ? 'border-brand-beige text-brand-beige'
              : 'border-transparent text-brand-muted hover:text-brand-white'
          }`}
        >
          <ShoppingCart className='w-4 h-4' /> Control de Pedidos
        </button>
      </nav>

      {/* Tab: METRICS / ANALYTICS */}
      {activeTab === 'metrics' && (
        <section className='space-y-8 animate-fade-in'>
          {/* Dashboard Summary Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='bg-brand-secondary border border-brand-border/40 p-6 rounded-xl flex items-center justify-between'>
              <div className='space-y-1'>
                <span className='text-[10px] tracking-wider font-bold uppercase text-brand-muted block'>Ventas Concretadas</span>
                <span className='text-2xl font-extrabold text-brand-beige'>${totalSales.toLocaleString('es-CO')} COP</span>
              </div>
              <div className='p-3 bg-brand-black border border-brand-border text-brand-beige rounded-lg'>
                <TrendingUp className='w-5 h-5' />
              </div>
            </div>

            <div className='bg-brand-secondary border border-brand-border/40 p-6 rounded-xl flex items-center justify-between'>
              <div className='space-y-1'>
                <span className='text-[10px] tracking-wider font-bold uppercase text-brand-muted block'>Ventas en Proceso</span>
                <span className='text-2xl font-extrabold text-brand-white'>${pendingSales.toLocaleString('es-CO')} COP</span>
              </div>
              <div className='p-3 bg-brand-black border border-brand-border text-brand-muted rounded-lg'>
                <ShoppingCart className='w-5 h-5' />
              </div>
            </div>

            <div className='bg-brand-secondary border border-brand-border/40 p-6 rounded-xl flex items-center justify-between'>
              <div className='space-y-1'>
                <span className='text-[10px] tracking-wider font-bold uppercase text-brand-muted block'>Modelos Registrados</span>
                <span className='text-2xl font-extrabold text-brand-white'>{products.length} prendas</span>
              </div>
              <div className='p-3 bg-brand-black border border-brand-border text-brand-muted rounded-lg'>
                <Tag className='w-5 h-5' />
              </div>
            </div>

            <div className='bg-brand-secondary border border-brand-border/40 p-6 rounded-xl flex items-center justify-between'>
              <div className='space-y-1'>
                <span className='text-[10px] tracking-wider font-bold uppercase text-brand-muted block'>Alerta Stock Bajo</span>
                <span className={`text-2xl font-extrabold ${lowStockCount > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                  {lowStockCount} modelos
                </span>
              </div>
              <div className={`p-3 bg-brand-black border border-brand-border rounded-lg ${lowStockCount > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                {lowStockCount > 0 ? <AlertTriangle className='w-5 h-5' /> : <CheckCircle2 className='w-5 h-5' />}
              </div>
            </div>
          </div>

          {/* Quick Details layout */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Recent Orders Overview */}
            <div className='bg-brand-secondary border border-brand-border/40 p-6 rounded-xl space-y-4'>
              <h3 className='font-bold text-sm tracking-wider uppercase text-brand-beige border-b border-brand-border/30 pb-3 flex items-center gap-2'>
                <ShoppingCart className='w-4.5 h-4.5' /> Pedidos Recientes
              </h3>
              <div className='divide-y divide-brand-border/30 overflow-y-auto max-h-[350px] pr-2 space-y-3.5'>
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className='flex items-center justify-between pt-3.5 first:pt-0'>
                    <div className='space-y-0.5'>
                      <p className='font-bold uppercase text-xs text-brand-white'>{order.buyer_name}</p>
                      <p className='text-[10px] text-brand-muted'>{new Date(order.created_at).toLocaleDateString()} · {order.buyer_city}</p>
                    </div>
                    <div className='text-right space-y-1'>
                      <p className='text-xs font-mono font-bold text-brand-beige'>${order.total_amount.toLocaleString('es-CO')} COP</p>
                      <span className={`inline-block text-[8px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        order.status === 'entregado'
                          ? 'bg-green-950/40 text-green-400 border border-green-900/50'
                          : order.status === 'pendiente'
                          ? 'bg-yellow-950/40 text-yellow-400 border border-yellow-900/50'
                          : 'bg-brand-black text-brand-muted border border-brand-border/80'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className='text-brand-muted text-xs text-center py-8'>No hay pedidos registrados en local storage todavía.</p>
                )}
              </div>
            </div>

            {/* Catalog distribution of items */}
            <div className='bg-brand-secondary border border-brand-border/40 p-6 rounded-xl space-y-4'>
              <h3 className='font-bold text-sm tracking-wider uppercase text-brand-beige border-b border-brand-border/30 pb-3 flex items-center gap-2'>
                <Layers className='w-4.5 h-4.5' /> Distribución del Catálogo
              </h3>
              <div className='space-y-3'>
                {categories.map((cat) => {
                  const count = products.filter(p => p.category_id === cat.id).length;
                  const percent = Math.round((count / products.length) * 100) || 0;
                  return (
                    <div key={cat.id} className='space-y-1.5'>
                      <div className='flex justify-between text-xs font-bold'>
                        <span className='text-brand-white uppercase'>{cat.name}</span>
                        <span className='text-brand-beige font-mono'>{count} items ({percent}%)</span>
                      </div>
                      <div className='w-full bg-brand-black rounded-full h-1.5 border border-brand-border/30'>
                        <div 
                          className='bg-brand-beige h-1.5 rounded-full' 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab: INVENTORY CONTROL */}
      {activeTab === 'inventory' && (
        <section className='space-y-6 animate-fade-in'>
          <div className='flex flex-wrap items-center justify-between gap-4 bg-brand-secondary border border-brand-border/40 p-4 rounded-xl'>
            {/* Search items */}
            <div className='relative w-full sm:max-w-xs'>
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Buscar por modelo o SKU...'
                className='w-full bg-brand-black border border-brand-border/60 rounded-sm py-2 pl-9 pr-4 text-xs text-brand-white placeholder-brand-muted focus:border-brand-beige/50 focus:outline-none transition-colors'
              />
              <Search className='absolute left-3 top-2.5 w-3.5 h-3.5 text-brand-muted' />
            </div>
            <div className='text-xs text-brand-muted font-bold uppercase'>
              Resultados: <span className='text-brand-beige'>{filteredProducts.length} modelos</span>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
            {/* Inventory table */}
            <div className='lg:col-span-2 bg-brand-secondary border border-brand-border/40 rounded-xl overflow-hidden'>
              <div className='overflow-x-auto max-h-[500px]'>
                <table className='w-full text-left border-collapse text-xs'>
                  <thead className='bg-brand-black text-brand-muted border-b border-brand-border uppercase font-bold tracking-wider'>
                    <tr>
                      <th className='p-3.5'>Nombre / Categoría</th>
                      <th className='p-3.5'>Precio</th>
                      <th className='p-3.5'>Stock Total</th>
                      <th className='p-3.5 text-right'>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-brand-border/40'>
                    {filteredProducts.map((p) => {
                      const totalStock = p.variants?.reduce((acc, v) => acc + v.stock, 0) || 0;
                      const hasLowStock = p.variants?.some(v => v.stock < 5);
                      return (
                        <tr 
                          key={p.id} 
                          className={`hover:bg-brand-black/20 transition-colors ${
                            selectedProduct?.id === p.id ? 'bg-brand-beige/5' : ''
                          }`}
                        >
                          <td className='p-3.5'>
                            <p className='font-bold uppercase text-brand-white line-clamp-1'>{p.name}</p>
                            <p className='text-[10px] text-brand-muted uppercase'>{p.category?.name}</p>
                          </td>
                          <td className='p-3.5 font-mono text-brand-beige font-semibold'>
                            ${p.price.toLocaleString('es-CO')}
                          </td>
                          <td className='p-3.5'>
                            <span className={`font-mono font-bold ${hasLowStock ? 'text-amber-500' : 'text-brand-white/80'}`}>
                              {totalStock} unids
                            </span>
                          </td>
                          <td className='p-3.5 text-right'>
                            <button
                              onClick={() => handleSelectProduct(p)}
                              className='bg-brand-black border border-brand-border px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:border-brand-beige transition-colors'
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edit Drawer Panel */}
            <div className='bg-brand-secondary border border-brand-border/40 p-6 rounded-xl space-y-6'>
              <h3 className='font-bold text-sm tracking-wider uppercase text-brand-beige border-b border-brand-border/30 pb-3 flex items-center gap-2'>
                <Package className='w-4.5 h-4.5' /> Editor de Prenda
              </h3>

              {selectedProduct ? (
                <div className='space-y-5 text-sm'>
                  <div>
                    <h4 className='font-extrabold uppercase text-sm text-brand-white leading-tight'>{selectedProduct.name}</h4>
                    <span className='text-[10px] text-brand-muted uppercase'>{selectedProduct.category?.name}</span>
                  </div>

                  {/* Price adjust */}
                  <div className='space-y-1.5'>
                    <label className='block text-xs font-bold uppercase tracking-wider text-brand-muted'>
                      Precio de Venta (COP)
                    </label>
                    <input
                      type='number'
                      value={editPrice}
                      onChange={(e) => setEditPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      className='w-full bg-brand-black border border-brand-border/60 rounded-sm py-2 px-3 text-sm text-brand-white focus:outline-none focus:border-brand-beige'
                    />
                  </div>

                  {/* Variants stock list adjustment */}
                  <div className='space-y-2.5'>
                    <span className='block text-xs font-bold uppercase tracking-wider text-brand-muted'>
                      Stock por Variantes:
                    </span>
                    <div className='divide-y divide-brand-border/30 border border-brand-border/40 rounded bg-brand-black overflow-y-auto max-h-[180px] p-2 space-y-2'>
                      {selectedProduct.variants?.map((v) => (
                        <div key={v.id} className='flex items-center justify-between text-xs py-1.5 first:pt-0'>
                          <span className='font-bold text-brand-white/80 uppercase'>{v.size} / {v.color}</span>
                          <input
                            type='number'
                            min='0'
                            value={variantStocks[v.id] !== undefined ? variantStocks[v.id] : v.stock}
                            onChange={(e) => handleStockChange(v.id, e.target.value)}
                            className='w-16 bg-brand-secondary border border-brand-border text-center py-1 rounded text-brand-white text-xs font-mono'
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save changes action */}
                  <div className='flex gap-3 pt-2'>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className='flex-1 bg-brand-black border border-brand-border text-brand-white text-xs font-bold tracking-widest uppercase py-3 rounded-sm'
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveProductChanges}
                      className='flex-1 bg-brand-beige text-brand-black hover:bg-brand-beige-hover text-xs font-extrabold tracking-widest uppercase py-3 rounded-sm flex items-center justify-center gap-1.5'
                    >
                      <Save className='w-4 h-4' /> Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <div className='text-center py-12 text-brand-muted text-xs'>
                  Selecciona una prenda de la lista de inventario para ajustar el precio y el stock de sus variantes.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Tab: CONTROL DE PEDIDOS (ORDERS) */}
      {activeTab === 'orders' && (
        <section className='space-y-6 animate-fade-in'>
          <div className='bg-brand-secondary border border-brand-border/40 rounded-xl overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse text-xs min-w-[700px]'>
                <thead className='bg-brand-black text-brand-muted border-b border-brand-border uppercase font-bold tracking-wider'>
                  <tr>
                    <th className='p-3.5'>Orden ID / Fecha</th>
                    <th className='p-3.5'>Cliente / Dirección</th>
                    <th className='p-3.5'>Detalle de Compra</th>
                    <th className='p-3.5'>Total</th>
                    <th className='p-3.5'>Estado</th>
                    <th className='p-3.5 text-right'>Acción</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-brand-border/40'>
                  {orders.map((o) => (
                    <tr key={o.id} className='hover:bg-brand-black/10 transition-colors'>
                      <td className='p-3.5 font-mono align-top'>
                        <span className='font-bold text-brand-white'>{o.id}</span>
                        <p className='text-[10px] text-brand-muted mt-0.5'>{new Date(o.created_at).toLocaleString()}</p>
                      </td>
                      <td className='p-3.5 align-top'>
                        <p className='font-bold uppercase text-brand-white'>{o.buyer_name}</p>
                        <p className='text-brand-muted mt-0.5'>{o.buyer_phone}</p>
                        <p className='text-[10px] text-brand-muted leading-tight mt-1'>{o.buyer_address}, {o.buyer_city}</p>
                      </td>
                      <td className='p-3.5 align-top space-y-1 max-w-[250px]'>
                        {o.items?.map((item) => (
                          <div key={item.id} className='text-[10px] text-brand-white/90 leading-tight'>
                            <span className='font-extrabold'>{item.quantity}x</span> {item.product_name} 
                            <span className='text-brand-muted font-bold ml-1'>({item.variant_details})</span>
                          </div>
                        ))}
                      </td>
                      <td className='p-3.5 font-mono text-brand-beige font-semibold align-top'>
                        ${o.total_amount.toLocaleString('es-CO')}
                      </td>
                      <td className='p-3.5 align-top'>
                        <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-1 rounded ${
                          o.status === 'entregado'
                            ? 'bg-green-950/40 text-green-400 border border-green-900/50'
                            : o.status === 'pendiente'
                            ? 'bg-yellow-950/40 text-yellow-400 border border-yellow-900/50'
                            : o.status === 'enviado'
                            ? 'bg-blue-950/40 text-blue-400 border border-blue-900/50'
                            : 'bg-brand-black text-brand-muted border border-brand-border/80'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className='p-3.5 align-top text-right'>
                        <select
                          value={o.status}
                          onChange={(e) => handleOrderStatusUpdate(o.id, e.target.value)}
                          className='bg-brand-black border border-brand-border text-brand-white text-[10px] font-bold tracking-wider uppercase py-1.5 px-2.5 focus:outline-none focus:border-brand-beige rounded-sm'
                        >
                          <option value='pendiente'>Pendiente</option>
                          <option value='enviado'>Enviado</option>
                          <option value='entregado'>Entregado</option>
                          <option value='cancelado'>Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className='p-12 text-center text-brand-muted text-xs'>
                        No hay pedidos registrados en local storage. Realiza un checkout en el carrito para verlos aquí.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
