'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Send, MapPin, Phone, Mail } from 'lucide-react';
import { site } from '@/lib/site';
import { STATIC_CATEGORIES } from '@/lib/db';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on Admin panel
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className='bg-brand-secondary border-t border-brand-border/60 text-brand-white pt-16 pb-8 z-10 relative'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-12'>
          {/* Brand Col */}
          <div className='flex flex-col gap-4'>
            <Link href='/' className='flex flex-col'>
              <span className='font-extrabold text-2xl tracking-tighter text-brand-white uppercase leading-none'>
                PIPE <span className='text-brand-beige'>EN LA</span> CALLE
              </span>
              <span className='text-[8px] tracking-[0.3em] text-brand-muted uppercase font-light mt-0.5'>
                STREETWEAR STUDIO
              </span>
            </Link>
            <p className='text-brand-muted text-sm max-w-xs'>
              Concepto de moda urbana premium y dark-luxury. Siluetas oversize, cortes estructurados y materiales seleccionados en Colombia.
            </p>
            <div className='flex items-center gap-4 mt-2'>
              <a
                href={site.instagram}
                target='_blank'
                rel='noopener noreferrer'
                className='text-brand-muted hover:text-brand-beige transition-colors'
                aria-label='Instagram'
              >
                <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <rect x='2' y='2' width='20' height='20' rx='5' ry='5' />
                  <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
                  <line x1='17.5' y1='6.5' x2='17.51' y2='6.5' />
                </svg>
              </a>
              <a
                href={site.whatsapp}
                target='_blank'
                rel='noopener noreferrer'
                className='text-brand-muted hover:text-brand-beige transition-colors'
                aria-label='WhatsApp'
              >
                <Send className='w-5 h-5' />
              </a>
            </div>
          </div>

          {/* Links Col */}
          <div>
            <h4 className='font-bold text-sm tracking-wider uppercase text-brand-beige mb-4'>Explorar</h4>
            <ul className='flex flex-col gap-2.5 text-brand-muted text-sm'>
              <li>
                <Link href='/' className='hover:text-brand-white transition-colors'>Inicio</Link>
              </li>
              <li>
                <Link href='/catalog' className='hover:text-brand-white transition-colors'>Catálogo Completo</Link>
              </li>
              <li>
                <Link href='/cart' className='hover:text-brand-white transition-colors'>Ver Carrito</Link>
              </li>
              <li>
                <Link href='/admin' className='hover:text-brand-white transition-colors'>Panel Administrativo</Link>
              </li>
            </ul>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className='font-bold text-sm tracking-wider uppercase text-brand-beige mb-4'>Categorías</h4>
            <ul className='flex flex-col gap-2.5 text-brand-muted text-sm'>
              {STATIC_CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/catalog?category=${cat.slug}`} className='hover:text-brand-white transition-colors'>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Col */}
          <div>
            <h4 className='font-bold text-sm tracking-wider uppercase text-brand-beige mb-4'>Contacto</h4>
            <ul className='flex flex-col gap-3 text-brand-muted text-sm'>
              <li className='flex items-center gap-2'>
                <MapPin className='w-4 h-4 text-brand-beige shrink-0' />
                <span>{site.address}, {site.city}</span>
              </li>
              <li className='flex items-center gap-2'>
                <Phone className='w-4 h-4 text-brand-beige shrink-0' />
                <a href={`tel:${site.phone}`} className='hover:text-brand-white transition-colors'>
                  {site.phoneDisplay}
                </a>
              </li>
              <li className='flex items-center gap-2'>
                <Mail className='w-4 h-4 text-brand-beige shrink-0' />
                <a href={`mailto:${site.email}`} className='hover:text-brand-white transition-colors'>
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className='border-t border-brand-border/40 pt-8 flex flex-col md:flex-row items-center justify-between text-brand-muted text-xs gap-4'>
          <p>© {new Date().getFullYear()} Pipe en la Calle. Todos los derechos reservados.</p>
          <div className='flex gap-6'>
            <a href='#' className='hover:text-brand-white transition-colors'>Términos de Servicio</a>
            <a href='#' className='hover:text-brand-white transition-colors'>Políticas de Envío</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
