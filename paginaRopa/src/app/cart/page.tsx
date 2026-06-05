'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Send, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { db } from '@/lib/db';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  // Buyer form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!name || !phone || !city || !address) {
      alert('Por favor completa todos los datos de envío.');
      return;
    }

    setIsSubmitting(true);

    // 1. Create order in our DB layer (which deducts local storage stock!)
    const orderItems = cart.map(item => ({
      productId: item.product.id,
      variantId: item.variant.id,
      quantity: item.quantity,
    }));

    const order = db.createOrder(
      {
        buyer_name: name,
        buyer_phone: phone,
        buyer_city: city,
        buyer_address: address,
      },
      orderItems
    );

    if (!order) {
      alert('Error: Hubo un problema al procesar el pedido. Revisa que haya stock disponible de los artículos seleccionados.');
      setIsSubmitting(false);
      return;
    }

    // 2. Format the WhatsApp message summary
    const formattedDate = new Date().toLocaleDateString('es-CO');
    
    let productsText = '';
    cart.forEach((item) => {
      productsText += `- ${item.quantity}x ${item.product.name} (Talla: ${item.variant.size}, Color: ${item.variant.color}) - $${(item.product.price * item.quantity).toLocaleString('es-CO')} COP\n`;
    });

    const message = `*PIPE EN LA CALLE - NUEVO PEDIDO*\n` +
      `---------------------------------------\n` +
      `*Fecha:* ${formattedDate}\n` +
      `*Orden ID:* ${order.id}\n\n` +
      `*Prendas ordenadas:*\n` +
      `${productsText}\n` +
      `*Total a pagar:* $${cartTotal.toLocaleString('es-CO')} COP\n\n` +
      `*Datos de Envío:*\n` +
      `- *Nombre:* ${name}\n` +
      `- *Celular:* ${phone}\n` +
      `- *Ciudad:* ${city}\n` +
      `- *Dirección:* ${address}\n\n` +
      `Quedo atento a la confirmación de la cuenta de pago y envío. ¡Gracias!`;

    // Encode message
    const whatsappNumber = '573154647189'; // Pipe en la Calle contact number
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // 3. Open WhatsApp link
    window.open(whatsappUrl, '_blank');

    // 4. Clear Cart state
    clearCart();
    setIsSubmitting(false);

    // 5. Direct user to order confirmation page or show alert and route home
    alert('¡Tu pedido ha sido registrado! Serás redirigido a WhatsApp para concretar tu pago.');
    router.push('/');
  };

  if (cart.length === 0) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center text-center bg-brand-black text-brand-white px-4 gap-4'>
        <div className='p-6 bg-brand-secondary border border-brand-border/40 rounded-full text-brand-beige mb-2 animate-pulse'>
          <ShoppingBag className='w-12 h-12' />
        </div>
        <h2 className='text-2xl font-bold uppercase tracking-widest text-brand-white'>
          Tu carrito está vacío
        </h2>
        <p className='text-brand-muted text-sm max-w-sm'>
          Explora nuestra colección y añade prendas a tu carrito para realizar un pedido.
        </p>
        <Link
          href='/catalog'
          className='bg-brand-beige text-brand-black text-xs font-extrabold tracking-widest uppercase py-3.5 px-8 rounded-sm hover:bg-brand-beige-hover transition-colors inline-flex items-center gap-2 mt-2 font-street'
        >
          Ir a Comprar <ArrowRight className='w-4.5 h-4.5' />
        </Link>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 bg-brand-black text-brand-white min-h-[75vh]'>
      <header className='mb-8 border-b border-brand-border/30 pb-6'>
        <h1 className='text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-brand-white'>
          TU CARRITO
        </h1>
        <p className='text-brand-muted text-sm'>
          Revisa tus prendas seleccionadas y completa los datos para realizar tu pedido vía WhatsApp.
        </p>
      </header>

      {/* Grid: Cart Items + Checkout Form */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
        {/* Cart Items List */}
        <section className='lg:col-span-7 space-y-4'>
          <div className='bg-brand-secondary border border-brand-border/40 rounded-xl p-4 md:p-6 space-y-4'>
            {cart.map((item) => (
              <div
                key={item.variant.id}
                className='flex items-center gap-4 border-b border-brand-border/30 pb-4 last:border-0 last:pb-0'
              >
                {/* Item Thumbnail */}
                <div className='relative w-16 h-20 md:w-20 md:h-26 rounded overflow-hidden border border-brand-border/50 bg-brand-black shrink-0'>
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    sizes='80px'
                    className='object-cover w-full h-full'
                  />
                </div>

                {/* Details info */}
                <div className='flex-grow min-w-0'>
                  <span className='text-[8px] md:text-[9px] tracking-widest text-brand-beige uppercase font-bold block mb-0.5'>
                    {item.product.category?.name}
                  </span>
                  <h3 className='font-bold text-sm md:text-base text-brand-white uppercase truncate tracking-tight'>
                    {item.product.name}
                  </h3>
                  <p className='text-[10px] md:text-xs text-brand-muted font-bold mt-1 uppercase'>
                    Talla: <span className='text-brand-white'>{item.variant.size}</span> | Color: <span className='text-brand-white'>{item.variant.color}</span>
                  </p>
                  
                  {/* Prices */}
                  <div className='text-xs md:text-sm font-extrabold text-brand-beige tracking-tight mt-1.5'>
                    ${item.product.price.toLocaleString('es-CO')} COP
                  </div>
                </div>

                {/* Actions */}
                <div className='flex flex-col items-end justify-between gap-4 shrink-0'>
                  <button
                    onClick={() => removeFromCart(item.variant.id)}
                    className='text-brand-muted hover:text-red-500 transition-colors p-1'
                    aria-label='Eliminar prenda'
                  >
                    <Trash2 className='w-4.5 h-4.5' />
                  </button>

                  {/* Quantity controls */}
                  <div className='flex items-center border border-brand-border/60 rounded overflow-hidden bg-brand-black scale-90 md:scale-100'>
                    <button
                      onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                      className='px-2.5 py-1 hover:bg-brand-secondary transition-colors font-bold'
                    >
                      -
                    </button>
                    <span className='px-2.5 font-mono text-xs font-bold'>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                      className='px-2.5 py-1 hover:bg-brand-secondary transition-colors font-bold'
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href='/catalog'
            className='inline-flex items-center gap-2 text-xs tracking-widest font-extrabold uppercase text-brand-muted hover:text-brand-white transition-colors pt-2'
          >
            <ArrowLeft className='w-4 h-4' /> Seguir Comprando
          </Link>
        </section>

        {/* Checkout Form */}
        <section className='lg:col-span-5 bg-brand-secondary border border-brand-border/40 p-6 rounded-xl space-y-6'>
          <h3 className='font-bold text-sm tracking-wider uppercase text-brand-beige border-b border-brand-border/40 pb-3'>
            Datos de Despacho & Pago
          </h3>

          <form onSubmit={handleCheckout} className='space-y-4 text-sm'>
            {/* Full Name */}
            <div className='space-y-1.5'>
              <label htmlFor='buyerName' className='block text-xs font-bold uppercase tracking-wider text-brand-muted'>
                Nombre Completo *
              </label>
              <input
                id='buyerName'
                type='text'
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Ej. Juan Pérez'
                className='w-full bg-brand-black border border-brand-border/60 rounded-sm py-2.5 px-3 text-sm text-brand-white focus:border-brand-beige/50 focus:outline-none transition-colors'
              />
            </div>

            {/* Phone */}
            <div className='space-y-1.5'>
              <label htmlFor='buyerPhone' className='block text-xs font-bold uppercase tracking-wider text-brand-muted'>
                Teléfono de contacto / WhatsApp *
              </label>
              <input
                id='buyerPhone'
                type='tel'
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder='Ej. 315 464 7189'
                className='w-full bg-brand-black border border-brand-border/60 rounded-sm py-2.5 px-3 text-sm text-brand-white focus:border-brand-beige/50 focus:outline-none transition-colors'
              />
            </div>

            {/* City */}
            <div className='space-y-1.5'>
              <label htmlFor='buyerCity' className='block text-xs font-bold uppercase tracking-wider text-brand-muted'>
                Ciudad / Municipio *
              </label>
              <input
                id='buyerCity'
                type='text'
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder='Ej. Medellín, Antioquia'
                className='w-full bg-brand-black border border-brand-border/60 rounded-sm py-2.5 px-3 text-sm text-brand-white focus:border-brand-beige/50 focus:outline-none transition-colors'
              />
            </div>

            {/* Address */}
            <div className='space-y-1.5'>
              <label htmlFor='buyerAddress' className='block text-xs font-bold uppercase tracking-wider text-brand-muted'>
                Dirección Completa (Barrio, Apto, Casa) *
              </label>
              <input
                id='buyerAddress'
                type='text'
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder='Ej. Calle 10 # 34 - 56, Apto 402, El Poblado'
                className='w-full bg-brand-black border border-brand-border/60 rounded-sm py-2.5 px-3 text-sm text-brand-white focus:border-brand-beige/50 focus:outline-none transition-colors'
              />
            </div>

            {/* Summary details */}
            <div className='border-t border-brand-border/40 pt-4 space-y-2 text-xs'>
              <div className='flex items-center justify-between text-brand-muted'>
                <span>Envío (Nacional)</span>
                <span className='font-bold text-brand-white uppercase'>Contra Entrega</span>
              </div>
              <div className='flex items-center justify-between text-base font-extrabold pt-2 border-t border-brand-border/30'>
                <span className='uppercase tracking-wide'>Total Pedido</span>
                <span className='text-brand-beige'>${cartTotal.toLocaleString('es-CO')} COP</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-brand-beige text-brand-black hover:bg-brand-beige-hover disabled:opacity-50 transition-colors font-extrabold text-xs tracking-widest uppercase py-4 rounded-sm flex items-center justify-center gap-2 mt-4'
            >
              <Send className='w-4.5 h-4.5' /> {isSubmitting ? 'Procesando...' : 'Completar por WhatsApp'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
