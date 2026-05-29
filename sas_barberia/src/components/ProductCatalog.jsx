import React, { useState, useEffect } from 'react';
import { dbService } from '../database/supabase';
import { 
  ShoppingBag, Trash2, Plus, Minus, Check, 
  X, Sparkles, Receipt, ArrowRight 
} from 'lucide-react';

export default function ProductCatalog() {
  const [productos, setProductos] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [checkoutFinished, setCheckoutFinished] = useState(false);
  const [ticketId, setTicketId] = useState('');

  useEffect(() => {
    const cargarProductos = async () => {
      const prods = await dbService.getProductos();
      setProductos(prods);
    };
    cargarProductos();
  }, []);

  const categorias = ['Todos', 'Fijación', 'Cuidado', 'Afeitado', 'Accesorios'];

  const productosFiltrados = activeCategory === 'Todos'
    ? productos
    : productos.filter(p => p.categoria === activeCategory);

  const addToCart = (product) => {
    const existe = cart.find(item => item.id === product.id);
    if (existe) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, cantidad: 1 }]);
    }
    setIsCartOpen(true); // Abrir carrito para dar feedback visual
  };

  const updateCantidad = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const nuevaCant = item.cantidad + delta;
        return nuevaCant > 0 ? { ...item, cantidad: nuevaCant } : item;
      }
      return item;
    }).filter(item => item.cantidad > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setTicketId(`COMPRA_${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`);
    setCheckoutFinished(true);
  };

  const handleReiniciarCompra = () => {
    setCart([]);
    setCheckoutFinished(false);
    setTicketId('');
    setIsCartOpen(false);
  };

  return (
    <div id="tienda-section" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20 relative">
      
      {/* Encabezado */}
      <div className="text-center mb-12">
        <h3 className="text-3xl sm:text-4xl font-serif font-black tracking-wide text-vintage-gold uppercase">
          Estilo Premium en Casa
        </h3>
        <p className="text-vintage-cream/60 text-xs sm:text-sm max-w-lg mx-auto mt-2 leading-relaxed uppercase tracking-wider font-serif">
          Ceras fijadoras, elixires para barba y herramientas de afeitado de la vieja escuela
        </p>
        <div className="flex justify-center mt-4">
          <div className="h-[2px] w-20 bg-vintage-gold/40"></div>
        </div>
      </div>

      {/* Barra de Filtros y Carrito Flotante */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 border-b border-vintage-border/50 pb-6">
        
        {/* Categorías */}
        <div className="flex flex-wrap justify-center gap-2">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 font-serif text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeCategory === cat
                  ? 'border border-vintage-gold bg-vintage-gold/10 text-vintage-gold'
                  : 'border border-transparent text-vintage-cream/60 hover:text-vintage-cream hover:border-vintage-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Botón Carrito */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center space-x-2 bg-[#23170F] hover:bg-[#312015] border border-vintage-border text-vintage-gold px-5 py-2.5 rounded-none font-serif text-xs font-bold uppercase tracking-widest transition-all duration-300 relative"
        >
          <ShoppingBag size={15} />
          <span>Mi Maletín</span>
          {totalItems > 0 && (
            <span className="h-5 w-5 bg-vintage-burgundy text-white flex items-center justify-center text-[10px] font-sans font-bold absolute -top-2.5 -right-2.5 rounded-full border border-vintage-border animate-[pulse_2s_infinite]">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {productosFiltrados.length === 0 ? (
          <div className="col-span-full py-12 text-center text-vintage-cream/40 font-serif">
            No hay productos cargados en esta categoría.
          </div>
        ) : (
          productosFiltrados.map(prod => (
            <div
              key={prod.id}
              className="group bg-vintage-card border border-vintage-border hover:border-vintage-gold transition-all duration-300 flex flex-col justify-between p-4 relative vintage-inner-border shadow-lg"
            >
              <div>
                {/* Imagen del Producto con Zoom sepia */}
                <div className="w-full aspect-square bg-[#150E09] border border-vintage-border overflow-hidden relative mb-4">
                  <img
                    src={prod.foto}
                    alt={prod.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 sepia-hover"
                  />
                  {prod.stock <= 5 && (
                    <span className="absolute top-2.5 left-2.5 bg-vintage-burgundy text-vintage-cream text-[8px] font-serif font-black uppercase tracking-wider py-1 px-2.5 border border-vintage-border select-none shadow-lg">
                      Últimos {prod.stock}
                    </span>
                  )}
                </div>

                {/* Categoría */}
                <span className="text-[9px] tracking-widest text-vintage-bronze uppercase font-serif font-bold">
                  {prod.categoria}
                </span>

                {/* Nombre */}
                <h4 className="font-serif font-black text-base text-vintage-cream mt-1 group-hover:text-vintage-gold transition-colors duration-300">
                  {prod.nombre}
                </h4>

                {/* Descripción */}
                <p className="text-xs text-vintage-cream/70 font-sans mt-2.5 leading-relaxed">
                  {prod.descripcion}
                </p>
              </div>

              <div>
                {/* Precio y Acción */}
                <div className="flex items-center justify-between mt-6 border-t border-vintage-border/50 pt-4">
                  <span className="text-vintage-gold text-lg font-serif font-black tracking-wider">
                    ${prod.precio.toFixed(2)}
                  </span>

                  <button
                    onClick={() => addToCart(prod)}
                    className="bg-transparent border border-vintage-borderLight text-vintage-cream group-hover:border-vintage-gold group-hover:bg-vintage-gold group-hover:text-vintage-dark py-1.5 px-3.5 text-xs font-bold font-serif uppercase tracking-widest transition-all duration-300 flex items-center gap-1"
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ======================================================== */}
      {/* PANEL DEL CARRITO DE COMPRAS (DRAWER/DESPLEGABLE) */}
      {/* ======================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-end backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          
          {/* Drawer Container */}
          <div className="w-full max-w-md bg-vintage-card border-l-2 border-vintage-border h-full flex flex-col justify-between shadow-2xl relative">
            
            {/* Cabecera del Carrito */}
            <div className="p-5 border-b border-vintage-border flex justify-between items-center bg-[#1A110A]">
              <h4 className="font-serif font-bold text-vintage-gold text-lg uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag size={20} />
                Mi Maletín de Compra
              </h4>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-vintage-cream/60 hover:text-vintage-cream p-1 border border-transparent hover:border-vintage-border transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cuerpo del Carrito */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {checkoutFinished ? (
                /* Ticket de compra finalizado */
                <div className="animate-[fadeIn_0.5s_ease-out]">
                  <div className="text-center mb-6">
                    <div className="h-12 w-12 bg-vintage-gold/20 border border-vintage-gold rounded-full flex items-center justify-center mx-auto mb-2 text-vintage-gold text-lg">✓</div>
                    <h5 className="font-serif font-bold text-vintage-cream uppercase tracking-wider">¡Orden Solicitada!</h5>
                    <p className="text-[10px] text-vintage-cream/50 mt-1 uppercase tracking-wider">Paga y recoge tus artículos en la recepción</p>
                  </div>

                  {/* Ticket Monospace */}
                  <div className="ticket-container p-6 text-black border border-amber-900 rounded-none relative">
                    <div className="ticket-top-border"></div>
                    <div className="ticket-bottom-border"></div>

                    <div className="text-center font-serif mt-2 mb-4">
                      <h6 className="font-bold text-sm">EL IMPERIO</h6>
                      <p className="text-[8px] text-gray-500 uppercase">TIENDA PREMIUM DE ESTILO</p>
                    </div>

                    <div className="font-mono text-[10px] space-y-1.5">
                      <div className="flex justify-between">
                        <span>TICKET ID:</span>
                        <span>{ticketId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HORA EMISIÓN:</span>
                        <span>{new Date().toLocaleTimeString()}</span>
                      </div>

                      <div className="ticket-divider my-3"></div>

                      <div className="space-y-1">
                        {cart.map(item => (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.cantidad}x {item.nombre.substring(0, 16)}...</span>
                            <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="ticket-divider my-3"></div>

                      <div className="flex justify-between font-serif font-bold text-xs pt-1 border-t border-gray-400">
                        <span>TOTAL COMPRA:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="text-center font-mono text-[8px] text-gray-600 mt-6 tracking-widest">
                      ||||| |||| ||||| | ||| ||||
                      <p className="font-sans text-[7px] text-gray-400 mt-0.5 tracking-normal">PRESENTA EN CAJA DE LA BARBERÍA</p>
                    </div>
                  </div>

                  <button
                    onClick={handleReiniciarCompra}
                    className="w-full py-3 mt-6 bg-vintage-gold text-vintage-dark font-serif text-xs font-black uppercase tracking-widest hover:bg-vintage-goldLight transition-colors"
                  >
                    Entendido / Vaciar Maletín
                  </button>
                </div>
              ) : cart.length === 0 ? (
                /* Carrito Vacío */
                <div className="h-full flex flex-col items-center justify-center text-center text-vintage-cream/40 py-20">
                  <ShoppingBag size={48} className="text-vintage-border mb-3" />
                  <p className="font-serif text-xs uppercase tracking-wider">Tu maletín de compra está vacío</p>
                  <p className="text-[10px] text-vintage-cream/30 mt-1 max-w-xs leading-relaxed uppercase">Recorre nuestro catálogo y añade elixires premium para cuidar tu imagen</p>
                </div>
              ) : (
                /* Listado del Carrito */
                <div className="space-y-3.5">
                  {cart.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-[#150E09] border border-vintage-border p-3"
                    >
                      {/* Izquierda (Foto e info) */}
                      <div className="flex items-center gap-2.5">
                        <div className="h-12 w-12 border border-vintage-border shrink-0 bg-black">
                          <img src={item.foto} alt={item.nombre} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h6 className="font-serif font-bold text-xs text-vintage-cream max-w-[150px] truncate">{item.nombre}</h6>
                          <span className="text-[10px] text-vintage-gold font-serif">${item.precio.toFixed(2)} c/u</span>
                        </div>
                      </div>

                      {/* Derecha (Controles cantidad y borrar) */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-vintage-border bg-[#1C120C]">
                          <button
                            onClick={() => updateCantidad(item.id, -1)}
                            className="p-1 text-vintage-cream/60 hover:text-vintage-gold transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="px-2 text-xs font-serif font-bold">{item.cantidad}</span>
                          <button
                            onClick={() => updateCantidad(item.id, 1)}
                            className="p-1 text-vintage-cream/60 hover:text-vintage-gold transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-vintage-cream/40 hover:text-vintage-burgundy transition-colors p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pie de Firma del Carrito */}
            {!checkoutFinished && cart.length > 0 && (
              <div className="p-5 border-t border-vintage-border bg-[#1A110A] space-y-4">
                <div className="flex justify-between items-center text-vintage-cream">
                  <span className="font-serif text-xs uppercase tracking-wider font-semibold">Total a pagar:</span>
                  <span className="text-vintage-gold text-2xl font-serif font-black tracking-wider">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-vintage-gold hover:bg-vintage-goldLight text-vintage-dark font-serif text-sm font-black uppercase tracking-widest transition-all shadow-gold-sm flex justify-center items-center gap-1.5"
                >
                  Confirmar Orden <ArrowRight size={14} />
                </button>
                <p className="text-[9px] text-vintage-cream/50 text-center uppercase tracking-wider font-serif">
                  * Pago en efectivo o tarjeta directamente en la barbería
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
