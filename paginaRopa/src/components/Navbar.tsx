'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { site } from '@/lib/site';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Catálogo', path: '/catalog' },
  ];

  // Hide Navbar completely on Admin panel to allow full dashboard view
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-black/90 backdrop-blur-md py-4 border-b border-brand-border/50'
          : 'bg-transparent py-6'
      }`}
    >
      <div className='container mx-auto px-4 flex items-center justify-between'>
        {/* Logo */}
        <Link href='/' className='flex flex-col'>
          <span className='font-extrabold text-2xl tracking-tighter text-brand-white uppercase leading-none'>
            PIPE <span className='text-brand-beige'>EN LA</span> CALLE
          </span>
          <span className='text-[8px] tracking-[0.3em] text-brand-muted uppercase font-light mt-0.5'>
            STREETWEAR STUDIO
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-8'>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm tracking-widest uppercase font-medium transition-colors ${
                pathname === link.path
                  ? 'text-brand-beige'
                  : 'text-brand-white/70 hover:text-brand-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions (Cart & Admin) */}
        <div className='flex items-center gap-4'>
          {/* Admin panel link */}
          <Link
            href='/admin'
            className='hidden md:flex items-center text-brand-white/70 hover:text-brand-beige transition-colors'
            title='Admin Dashboard'
          >
            <User className='w-5 h-5' />
          </Link>

          {/* Cart Icon */}
          <Link
            href='/cart'
            className='relative p-2 text-brand-white/70 hover:text-brand-white transition-colors'
            aria-label='Carrito de compras'
          >
            <ShoppingBag className='w-6 h-6' />
            {cartCount > 0 && (
              <span className='absolute -top-1 -right-1 bg-brand-beige text-brand-black font-extrabold text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-brand-black animate-pulse'>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='md:hidden p-2 text-brand-white/70 hover:text-brand-white'
            aria-label='Menu'
          >
            {mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className='md:hidden fixed inset-0 top-[76px] bg-brand-black z-40 border-t border-brand-border/50 flex flex-col justify-between py-12 px-6 animate-fade-in'>
          <nav className='flex flex-col gap-6'>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-2xl tracking-widest uppercase font-bold ${
                  pathname === link.path ? 'text-brand-beige' : 'text-brand-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href='/admin'
              className='text-2xl tracking-widest uppercase font-bold text-brand-white/70 hover:text-brand-beige flex items-center gap-2 mt-4'
            >
              <User className='w-6 h-6' /> Panel Admin
            </Link>
          </nav>

          {/* Brand footer details */}
          <div className='border-t border-brand-border/40 pt-6 text-brand-muted text-xs flex flex-col gap-2'>
            <p className='font-bold uppercase tracking-wider text-brand-beige'>Contacto</p>
            <p>{site.phoneDisplay}</p>
            <p>{site.email}</p>
            <p className='mt-2'>© {new Date().getFullYear()} Pipe en la Calle.</p>
          </div>
        </div>
      )}
    </header>
  );
}
