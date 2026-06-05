'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingBag, ArrowLeft, Send, Sparkles, AlertTriangle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { db, Product, ProductVariant } from '@/lib/db';
import { site } from '@/lib/site';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const idParam = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch product details
  useEffect(() => {
    if (idParam) {
      const foundProduct = db.getProductBySlug(idParam) || db.getProductById(idParam);
      if (foundProduct) {
        setProduct(foundProduct);
        // Pre-select first available color and size
        if (foundProduct.variants && foundProduct.variants.length > 0) {
          const firstInStock = foundProduct.variants.find(v => v.stock > 0) || foundProduct.variants[0];
          setSelectedColor(firstInStock.color);
          setSelectedSize(firstInStock.size);
        }
      }
    }
  }, [idParam]);

  if (!product) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center text-center bg-brand-black text-brand-white px-4 gap-4'>
        <AlertTriangle className='w-12 h-12 text-brand-beige animate-bounce' />
        <h2 className='text-2xl font-bold uppercase tracking-widest text-brand-white'>
          Producto no encontrado
        </h2>
        <p className='text-brand-muted text-sm max-w-sm'>
          El artículo que buscas no existe o ha sido retirado de nuestra colección exclusiva.
        </p>
        <button
          onClick={() => router.push('/catalog')}
          className='bg-brand-beige text-brand-black text-xs font-extrabold tracking-widest uppercase py-3.5 px-8 rounded-sm hover:bg-brand-beige-hover transition-colors inline-flex items-center gap-2 mt-2'
        >
          <ArrowLeft className='w-4 h-4' /> Volver al Catálogo
        </button>
      </div>
    );
  }

  // Extract unique sizes and colors available for this product
  const availableColors = Array.from(new Set(product.variants?.map((v) => v.color) || []));
  
  // Filter sizes based on selected color (show sizes that belong to selectedColor)
  const sizesForColor = product.variants
    ?.filter((v) => v.color === selectedColor)
    .map((v) => ({ size: v.size, stock: v.stock })) || [];

  // Get current active variant matching selections
  const currentVariant = product.variants?.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Por favor selecciona una talla y un color.');
      return;
    }

    if (!currentVariant) {
      alert('Esta combinación de talla y color no está disponible.');
      return;
    }

    if (currentVariant.stock <= 0) {
      alert('Esta combinación se encuentra agotada.');
      return;
    }

    addToCart(product, currentVariant, quantity);
    
    // Quick confirmation action
    const confirmRedirect = confirm('¡Producto agregado al carrito! ¿Quieres ver tu carrito ahora?');
    if (confirmRedirect) {
      router.push('/cart');
    }
  };

  const handleQuantityChange = (val: number) => {
    const limit = currentVariant ? currentVariant.stock : 1;
    const nextVal = quantity + val;
    if (nextVal >= 1 && nextVal <= limit) {
      setQuantity(nextVal);
    }
  };

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 bg-brand-black text-brand-white'>
      {/* Back Link */}
      <button
        onClick={() => router.push('/catalog')}
        className='inline-flex items-center gap-2 text-xs tracking-widest font-extrabold uppercase text-brand-muted hover:text-brand-white mb-8 transition-colors'
      >
        <ArrowLeft className='w-4.5 h-4.5' /> Volver al catálogo
      </button>

      {/* Main product detail grid */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12'>
        {/* Images Column */}
        <div className='lg:col-span-7 flex flex-col md:flex-row gap-4'>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className='flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto shrink-0 md:w-20'>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setQuantity(1);
                  }}
                  className={`relative aspect-[3/4] w-16 md:w-20 border rounded-lg overflow-hidden shrink-0 transition-colors ${
                    activeImageIndex === idx ? 'border-brand-beige' : 'border-brand-border/60'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes='80px'
                    className='object-cover w-full h-full'
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Display Image */}
          <div className='relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-brand-border/40 bg-brand-secondary order-1 md:order-2 flex-grow'>
            {discount > 0 && (
              <span className='absolute top-4 left-4 z-10 bg-brand-beige text-brand-black text-[10px] tracking-widest font-extrabold py-1.5 px-3.5 rounded-sm uppercase'>
                -{discount}% OFF
              </span>
            )}
            <Image
              src={product.images[activeImageIndex]}
              alt={product.name}
              fill
              sizes='(max-width: 1024px) 100vw, 50vw'
              className='object-cover w-full h-full'
              priority
            />
          </div>
        </div>

        {/* Details Column */}
        <div className='lg:col-span-5 flex flex-col justify-between gap-6'>
          {/* Info Details Header */}
          <div className='space-y-4'>
            <span className='inline-flex items-center gap-1.5 bg-brand-secondary border border-brand-border px-3 py-1 text-[9px] tracking-widest text-brand-beige font-extrabold rounded-full uppercase'>
              <Sparkles className='w-3 h-3 text-brand-beige' /> DROP ORIGINAL
            </span>
            
            <h1 className='text-3xl md:text-5xl font-extrabold tracking-tight uppercase text-brand-white leading-none'>
              {product.name}
            </h1>
            
            <p className='text-xs text-brand-muted font-bold tracking-widest uppercase border-b border-brand-border/30 pb-4'>
              Colección: <span className='text-brand-white'>{product.category?.name}</span>
            </p>

            <div className='flex items-baseline gap-3'>
              <span className='text-3xl font-extrabold text-brand-beige tracking-tight'>
                ${product.price.toLocaleString('es-CO')} COP
              </span>
              {product.compare_at_price && (
                <span className='text-base text-brand-muted line-through tracking-tight'>
                  ${product.compare_at_price.toLocaleString('es-CO')}
                </span>
              )}
            </div>

            <p className='text-brand-muted text-sm leading-relaxed pt-2'>
              {product.description}
            </p>
          </div>

          {/* Configuration Form (Colors, Sizes, Add to Cart) */}
          <div className='space-y-6 border-t border-brand-border/30 pt-6'>
            {/* Color Selector */}
            <div className='space-y-2.5'>
              <span className='block text-xs font-bold uppercase tracking-wider text-brand-muted'>
                Selecciona Color: <strong className='text-brand-white'>{selectedColor}</strong>
              </span>
              <div className='flex gap-2.5'>
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      // Pre-select first size in stock for this color if possible
                      const availableSizes = product.variants?.filter(v => v.color === color) || [];
                      const inStockSize = availableSizes.find(v => v.stock > 0) || availableSizes[0];
                      if (inStockSize) {
                        setSelectedSize(inStockSize.size);
                      }
                      setQuantity(1);
                    }}
                    className={`text-xs font-bold tracking-wide uppercase px-4 py-2 border transition-all ${
                      selectedColor === color
                        ? 'bg-brand-beige border-brand-beige text-brand-black scale-102 font-extrabold'
                        : 'border-brand-border/60 hover:border-brand-beige/50 text-brand-white'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className='space-y-2.5'>
              <span className='block text-xs font-bold uppercase tracking-wider text-brand-muted'>
                Selecciona Talla: <strong className='text-brand-white'>{selectedSize}</strong>
              </span>
              <div className='flex flex-wrap gap-2.5'>
                {sizesForColor.map(({ size, stock }) => {
                  const isOutOfStock = stock <= 0;
                  return (
                    <button
                      key={size}
                      disabled={isOutOfStock}
                      onClick={() => {
                        setSelectedSize(size);
                        setQuantity(1);
                      }}
                      className={`text-xs font-bold px-4 py-2.5 border transition-all ${
                        isOutOfStock
                          ? 'opacity-25 border-brand-border/20 text-brand-muted cursor-not-allowed line-through'
                          : selectedSize === size
                          ? 'bg-brand-beige border-brand-beige text-brand-black font-extrabold'
                          : 'border-brand-border/60 hover:border-brand-beige/50 text-brand-white'
                      }`}
                    >
                      {size} {isOutOfStock && '(Agotado)'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Stock Info */}
            {currentVariant && currentVariant.stock > 0 ? (
              <div className='space-y-3 pt-2'>
                <div className='flex items-center gap-6'>
                  {/* Plus/Minus quantity buttons */}
                  <div className='flex items-center border border-brand-border/60 rounded overflow-hidden'>
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className='px-3.5 py-2 hover:bg-brand-secondary transition-colors text-lg font-bold'
                    >
                      -
                    </button>
                    <span className='px-4 font-mono font-bold text-sm'>{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className='px-3.5 py-2 hover:bg-brand-secondary transition-colors text-lg font-bold'
                    >
                      +
                    </button>
                  </div>

                  <span className='text-xs font-bold text-brand-muted uppercase'>
                    Disponible: <span className='text-brand-beige'>{currentVariant.stock} unidades</span>
                  </span>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  className='w-full bg-brand-white text-brand-black hover:bg-brand-beige hover:text-brand-black transition-colors font-extrabold text-xs tracking-widest uppercase py-4 rounded-sm flex items-center justify-center gap-2.5 shadow-lg shadow-brand-black/50'
                >
                  <ShoppingBag className='w-4.5 h-4.5' /> Agregar al Carrito
                </button>
              </div>
            ) : (
              <div className='bg-brand-secondary border border-brand-border/50 rounded-lg p-4 text-center mt-2'>
                <p className='text-brand-muted font-bold text-xs uppercase tracking-wider mb-2'>
                  Combinación Agotada
                </p>
                <p className='text-[10px] text-brand-muted leading-relaxed mb-3'>
                  Esta variante se encuentra agotada temporalmente.
                </p>
                <a
                  href={`${site.whatsapp}&text=Hola,%20quisiera%20saber%20si%20habrá%20restock%20del%20modelo%20${product.name}%20en%20talla%20${selectedSize}%20y%20color%20${selectedColor}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-xs font-bold uppercase tracking-widest text-brand-beige hover:text-brand-white transition-colors inline-flex items-center gap-1.5'
                >
                  Consultar restock por WhatsApp <Send className='w-3 h-3' />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
