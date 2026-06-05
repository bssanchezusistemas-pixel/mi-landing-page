'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/lib/db';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  // Extract unique sizes and colors from variants
  const sizes = Array.from(new Set(product.variants?.map((v) => v.size) || []));
  const colors = Array.from(new Set(product.variants?.map((v) => v.color) || []));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className='group relative flex flex-col bg-brand-secondary border border-brand-border/40 rounded-xl overflow-hidden hover:border-brand-beige/35 transition-colors duration-300'
    >
      {/* Product Image */}
      <Link href={`/product/${product.slug}`} className='relative aspect-[3/4] w-full overflow-hidden bg-brand-black block'>
        {discount > 0 && (
          <span className='absolute top-3 left-3 z-10 bg-brand-beige text-brand-black text-[10px] tracking-widest font-extrabold py-1 px-2.5 rounded-sm uppercase'>
            -{discount}% OFF
          </span>
        )}
        
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className='object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105'
          loading='lazy'
        />

        {/* Hover overlay details */}
        <div className='absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
          <span className='bg-brand-white text-brand-black text-xs font-bold tracking-widest uppercase py-3 px-6 rounded-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300'>
            Ver Detalle
          </span>
        </div>
      </Link>

      {/* Info Body */}
      <div className='flex flex-col p-4 flex-grow justify-between gap-3'>
        <div>
          {/* Category */}
          <span className='text-[10px] tracking-widest uppercase text-brand-muted font-semibold mb-1 block'>
            {product.category?.name}
          </span>
          {/* Title */}
          <Link href={`/product/${product.slug}`} className='block'>
            <h3 className='font-bold text-base text-brand-white hover:text-brand-beige transition-colors line-clamp-1 uppercase tracking-tight'>
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Specs (Sizes & Colors preview) */}
        <div className='flex flex-col gap-1.5 border-t border-brand-border/30 pt-3'>
          {/* Sizes listing */}
          <div className='flex items-center gap-1.5 flex-wrap'>
            <span className='text-[9px] tracking-wider uppercase text-brand-muted font-bold'>Tallas:</span>
            {sizes.map((size) => (
              <span key={size} className='text-[9px] font-bold bg-brand-black px-1.5 py-0.5 rounded border border-brand-border/40 text-brand-white/80'>
                {size}
              </span>
            ))}
          </div>

          {/* Pricing */}
          <div className='flex items-baseline gap-2 mt-1'>
            <span className='font-extrabold text-brand-beige text-lg tracking-tight'>
              ${product.price.toLocaleString('es-CO')} COP
            </span>
            {product.compare_at_price && (
              <span className='text-xs text-brand-muted line-through tracking-tight'>
                ${product.compare_at_price.toLocaleString('es-CO')}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
