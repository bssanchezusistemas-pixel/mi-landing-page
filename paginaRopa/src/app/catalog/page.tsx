'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { db, Product, Category, STATIC_CATEGORIES } from '@/lib/db';

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial values from URL params
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  // Catalog states
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 600000 });
  const [sortBy, setSortBy] = useState('newest');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // List of all available sizes and colors for filter buttons
  const allSizes = ['S', 'M', 'L', 'XL', '38', '39', '40', '41', '42', '43', 'Única'];
  const allColors = ['Negro', 'Beige', 'Blanco', 'Gris Oscuro'];

  // Sync category state with URL parameter changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Query products when any filter changes
  useEffect(() => {
    const filtered = db.getProducts({
      search: searchTerm,
      categorySlug: selectedCategory || undefined,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      sort: sortBy,
    });
    setProducts(filtered);
  }, [searchTerm, selectedCategory, selectedSize, selectedColor, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSize('');
    setSelectedColor('');
    setPriceRange({ min: 0, max: 600000 });
    setSortBy('newest');
    router.push('/catalog'); // clear URL parameters
  };

  const handleCategoryClick = (slug: string) => {
    const nextCat = selectedCategory === slug ? '' : slug;
    setSelectedCategory(nextCat);
    if (nextCat) {
      router.push(`/catalog?category=${nextCat}`);
    } else {
      router.push('/catalog');
    }
  };

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 bg-brand-black min-h-[75vh]'>
      {/* Header */}
      <header className='mb-8 border-b border-brand-border/30 pb-6'>
        <h1 className='text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-brand-white mb-2'>
          CATÁLOGO COMPLETO
        </h1>
        <p className='text-brand-muted text-sm'>
          Explora nuestra selección streetwear. Mostrando {products.length} productos exclusivos.
        </p>
      </header>

      {/* Main Grid: Filters + Products */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-8 items-start'>
        {/* Sidebar Filters (Desktop) */}
        <aside className={`lg:block ${showFiltersMobile ? 'block' : 'hidden'} bg-brand-secondary border border-brand-border/40 p-6 rounded-xl space-y-8 z-30`}>
          <div className='flex items-center justify-between border-b border-brand-border/40 pb-4'>
            <span className='font-bold text-sm tracking-wider uppercase text-brand-beige inline-flex items-center gap-2'>
              <SlidersHorizontal className='w-4 h-4' /> Filtros
            </span>
            <button
              onClick={handleResetFilters}
              className='text-brand-muted hover:text-brand-beige text-xs flex items-center gap-1 transition-colors font-bold uppercase tracking-wider'
            >
              <RotateCcw className='w-3 h-3' /> Limpiar
            </button>
          </div>

          {/* Search Filter */}
          <div className='space-y-2.5'>
            <label className='block text-xs font-bold uppercase tracking-wider text-brand-white'>Buscar Prenda</label>
            <div className='relative'>
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Escribe ej. Oversize...'
                className='w-full bg-brand-black border border-brand-border/50 rounded-sm py-2.5 pl-10 pr-4 text-sm text-brand-white placeholder-brand-muted focus:border-brand-beige/50 focus:outline-none transition-colors'
              />
              <Search className='absolute left-3.5 top-3 w-4 h-4 text-brand-muted' />
            </div>
          </div>

          {/* Categories Filter */}
          <div className='space-y-2.5'>
            <label className='block text-xs font-bold uppercase tracking-wider text-brand-white'>Categorías</label>
            <div className='flex flex-col gap-1.5'>
              {STATIC_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`text-left text-sm py-2 px-3 rounded transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-brand-beige text-brand-black font-bold'
                      : 'text-brand-white/80 hover:text-brand-beige hover:bg-brand-black/40'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className='space-y-2.5'>
            <label className='block text-xs font-bold uppercase tracking-wider text-brand-white'>Tallas disponibles</label>
            <div className='flex flex-wrap gap-2'>
              {allSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                  className={`text-xs font-bold px-3 py-2 border transition-colors ${
                    selectedSize === size
                      ? 'bg-brand-beige border-brand-beige text-brand-black'
                      : 'border-brand-border/60 text-brand-white/80 hover:border-brand-beige/50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className='space-y-2.5'>
            <label className='block text-xs font-bold uppercase tracking-wider text-brand-white'>Colores</label>
            <div className='flex flex-wrap gap-2'>
              {allColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                  className={`text-xs font-bold px-3 py-2 border transition-colors ${
                    selectedColor === color
                      ? 'bg-brand-beige border-brand-beige text-brand-black'
                      : 'border-brand-border/60 text-brand-white/80 hover:border-brand-beige/50'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className='space-y-2.5'>
            <label className='block text-xs font-bold uppercase tracking-wider text-brand-white'>Precio Máximo</label>
            <div className='space-y-2'>
              <input
                type='range'
                min='0'
                max='600000'
                step='10000'
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                className='w-full accent-brand-beige bg-brand-black border border-brand-border'
              />
              <div className='flex justify-between text-xs font-mono text-brand-muted'>
                <span>$0 COP</span>
                <span className='text-brand-beige font-bold'>${priceRange.max.toLocaleString('es-CO')} COP</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid & Sorting */}
        <section className='lg:col-span-3 space-y-6'>
          {/* Controls Bar */}
          <div className='flex flex-wrap items-center justify-between gap-4 bg-brand-secondary border border-brand-border/40 p-4 rounded-xl'>
            {/* Mobile filters toggle */}
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className='lg:hidden bg-brand-black border border-brand-border px-4 py-2 text-xs font-bold tracking-widest uppercase text-brand-white hover:border-brand-beige transition-colors inline-flex items-center gap-2'
            >
              <SlidersHorizontal className='w-4 h-4' /> {showFiltersMobile ? 'Cerrar Filtros' : 'Filtrar'}
            </button>

            <div className='text-xs text-brand-muted font-bold uppercase'>
              Modelos encontrados: <span className='text-brand-beige'>{products.length}</span>
            </div>

            {/* Sort selection */}
            <div className='flex items-center gap-2'>
              <label htmlFor='sortBy' className='text-xs text-brand-muted font-bold uppercase shrink-0'>Ordenar por:</label>
              <select
                id='sortBy'
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='bg-brand-black border border-brand-border/50 text-brand-white text-xs font-bold tracking-wider uppercase py-2.5 px-3 focus:outline-none focus:border-brand-beige/50 rounded-sm'
              >
                <option value='newest'>Más Recientes</option>
                <option value='price-asc'>Precio: Menor a Mayor</option>
                <option value='price-desc'>Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>

          {/* Products Grid Display */}
          {products.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className='bg-brand-secondary border border-brand-border/40 rounded-xl p-12 text-center max-w-lg mx-auto mt-12'>
              <h3 className='text-xl font-bold uppercase tracking-tight text-brand-white mb-2'>
                No se encontraron productos
              </h3>
              <p className='text-brand-muted text-sm mb-6'>
                Intenta cambiando los términos de búsqueda o limpiando los filtros activos.
              </p>
              <button
                onClick={handleResetFilters}
                className='bg-brand-beige text-brand-black text-xs font-extrabold tracking-widest uppercase py-3.5 px-7 rounded-sm hover:bg-brand-beige-hover transition-colors'
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center bg-brand-black text-brand-white">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-brand-beige border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs tracking-widest uppercase font-bold text-brand-muted">Cargando catálogo...</p>
        </div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
