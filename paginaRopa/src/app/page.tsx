'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Send } from 'lucide-react';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import ProductCard from '@/components/ProductCard';
import { db, Product, Category } from '@/lib/db';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch categories
    setCategories(db.getCategories());
    
    // Fetch featured products (first 4 items flagged as is_featured)
    const products = db.getProducts({}).filter(p => p.is_featured).slice(0, 4);
    setFeaturedProducts(products);
  }, []);

  return (
    <div className="min-h-screen bg-brand-black">
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/kling_video.mp4"
        bgImageSrc="/gallery-2.jpg"
        title="PIPE EN LA CALLE"
        date="COLECCIÓN 2026"
        scrollToExpand="DESLIZA PARA EXPANDIR"
        textBlend={true}
      >
        {/* Intro / Manifesto */}
        <section className="py-12 md:py-20 border-b border-brand-border/30">
          <div className="max-w-4xl mx-auto text-center px-4">
            <span className="text-brand-beige text-xs tracking-[0.4em] font-extrabold uppercase mb-4 block">
              EL MANIFIESTO
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter uppercase mb-6 text-brand-white">
              LA MODA SE LLEVA EN EL CEMENTO
            </h2>
            <p className="text-brand-muted text-base md:text-xl leading-relaxed mb-8">
              No seguimos tendencias; las dictamos en el asfalto. Pipe en la Calle es diseño oversize, siluetas desestructuradas y la elegancia del lujo oscuro. Cada prenda está pensada para resistir el ritmo urbano con acabados de alta costura y telas de alta resistencia.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/catalog"
                className="bg-brand-beige text-brand-black text-xs font-extrabold tracking-widest uppercase py-4 px-8 rounded-sm hover:bg-brand-beige-hover transition-colors inline-flex items-center gap-2"
              >
                Explorar Catálogo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Grid Section */}
        <section className="py-16 md:py-24 border-b border-brand-border/30">
          <div className="max-w-7xl mx-auto px-4">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-brand-beige text-xs tracking-widest font-extrabold uppercase mb-2 block">
                  COLECCIONES
                </span>
                <h3 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight">
                  CATEGORÍAS DE DISEÑO
                </h3>
              </div>
              <Link href="/catalog" className="text-xs tracking-widest uppercase font-bold text-brand-beige hover:text-brand-white transition-colors inline-flex items-center gap-1.5">
                Ver todo el stock <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((cat, idx) => {
                // Assign backgrounds to categories visually
                const catImages = [
                  '/gallery-1.jpg',
                  '/gallery-2.jpg',
                  'https://images.unsplash.com/photo-1534215754734-18e55d13ce35?q=80&w=600',
                  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600'
                ];
                return (
                  <Link
                    key={cat.id}
                    href={`/catalog?category=${cat.slug}`}
                    className="group relative aspect-[4/5] rounded-xl overflow-hidden border border-brand-border/40 hover:border-brand-beige/50 transition-colors block"
                  >
                    <Image
                      src={catImages[idx]}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent z-10" />
                    <div className="absolute bottom-6 left-6 right-6 z-20">
                      <p className="text-[10px] tracking-widest text-brand-beige uppercase font-bold mb-1">CULTURA CALLEJERA</p>
                      <h4 className="text-xl font-extrabold text-brand-white uppercase group-hover:text-brand-beige transition-colors">
                        {cat.name}
                      </h4>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products Showcase */}
        <section className="py-16 md:py-24 border-b border-brand-border/30">
          <div className="max-w-7xl mx-auto px-4">
            <header className="mb-12 text-center">
              <span className="text-brand-beige text-xs tracking-widest font-extrabold uppercase mb-2 block">
                SELECCIÓN EXCLUSIVA
              </span>
              <h3 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight">
                PRODUCTOS DESTACADOS
              </h3>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Premium Banner */}
        <section className="py-16 md:py-24 relative overflow-hidden rounded-2xl border border-brand-border/40 my-12">
          <div className="absolute inset-0 bg-brand-secondary/90 z-0" />
          {/* Subtle noise/grid decoration overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-6">
            <span className="inline-flex items-center gap-1.5 bg-brand-black border border-brand-beige/25 px-3.5 py-1 text-[10px] tracking-widest text-brand-beige font-extrabold rounded-full uppercase">
              <Sparkles className="w-3 h-3 animate-spin" /> LANZAMIENTO LIMITADO
            </span>
            <h3 className="text-3xl md:text-6xl font-extrabold tracking-tighter uppercase text-brand-white max-w-3xl">
              DROP ACTUAL: HASTA AGOTAR EXISTENCIAS
            </h3>
            <p className="text-brand-muted text-sm md:text-base max-w-xl">
              Nuestros drops son exclusivos. Producimos en lotes limitados de menos de 100 piezas por silueta para garantizar exclusividad y evitar desperdicio. Consigue tus favoritos hoy.
            </p>
            <Link
              href="/catalog"
              className="bg-brand-white text-brand-black text-xs font-extrabold tracking-widest uppercase py-4 px-8 rounded-sm hover:bg-brand-beige hover:text-brand-black transition-colors"
            >
              Comprar Lanzamiento
            </Link>
          </div>
        </section>

        {/* Brand Perks / Trust */}
        <section className="py-12 bg-brand-secondary/30 rounded-xl border border-brand-border/30">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-3 p-4">
              <div className="w-12 h-12 flex items-center justify-center bg-brand-black border border-brand-border rounded-full text-brand-beige mb-1">
                <Truck className="w-6 h-6" />
              </div>
              <h5 className="font-extrabold text-sm uppercase tracking-wider text-brand-white">Envíos Nacionales</h5>
              <p className="text-xs text-brand-muted max-w-xs">Enviamos a toda Colombia de forma segura vía Coordinadora o Servientrega con pago contra entrega disponible.</p>
            </div>
            
            <div className="flex flex-col items-center text-center gap-3 p-4">
              <div className="w-12 h-12 flex items-center justify-center bg-brand-black border border-brand-border rounded-full text-brand-beige mb-1">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h5 className="font-extrabold text-sm uppercase tracking-wider text-brand-white">Calidad Garantizada</h5>
              <p className="text-xs text-brand-muted max-w-xs">Garantía total en costuras, estampados y materiales durante 30 días para que compres con total tranquilidad.</p>
            </div>

            <div className="flex flex-col items-center text-center gap-3 p-4">
              <div className="w-12 h-12 flex items-center justify-center bg-brand-black border border-brand-border rounded-full text-brand-beige mb-1">
                <Send className="w-5 h-5 text-brand-beige" />
              </div>
              <h5 className="font-extrabold text-sm uppercase tracking-wider text-brand-white">Atención Personalizada</h5>
              <p className="text-xs text-brand-muted max-w-xs">Soporte directo por WhatsApp para cambios de talla, asesoramiento de outfit o cualquier duda de tu pedido.</p>
            </div>
          </div>
        </section>
      </ScrollExpandMedia>
    </div>
  );
}
