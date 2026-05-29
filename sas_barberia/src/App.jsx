import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import BookingFlow from './components/BookingFlow';
import ProductCatalog from './components/ProductCatalog';
import PolaroidGallery from './components/PolaroidGallery';
import BarberDashboard from './components/BarberDashboard';
import Footer from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Efecto para escuchar el scroll de la página y actualizar la sección activa
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      const inicioSec = 0;
      const bookingSec = document.getElementById('booking-section')?.offsetTop || 0;
      const tiendaSec = document.getElementById('tienda-section')?.offsetTop || 0;
      const cortesSec = document.getElementById('cortes-section')?.offsetTop || 0;

      if (scrollPosition >= cortesSec - 50) {
        setActiveSection('cortes');
      } else if (scrollPosition >= tiendaSec - 50) {
        setActiveSection('tienda');
      } else if (scrollPosition >= bookingSec - 50) {
        setActiveSection('reservar');
      } else {
        setActiveSection('inicio');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToSection = (sectionId) => {
    setActiveSection(sectionId);
    
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const idMap = {
        'reservar': 'booking-section',
        'tienda': 'tienda-section',
        'cortes': 'cortes-section'
      };
      
      const targetId = idMap[sectionId];
      const element = document.getElementById(targetId);
      
      if (element) {
        // Scroll suave con offset para compensar el header pegajoso
        const yOffset = -80; 
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#120C08] text-[#F4EAD4] font-sans selection:bg-vintage-gold selection:text-vintage-dark">
      
      {/* 1. HEADER (Pegajoso en la parte superior) */}
      <div className="sticky top-0 z-30 shadow-xl">
        <Header 
          activeSection={activeSection} 
          setActiveSection={navigateToSection}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      </div>

      {/* 2. DASHBOARD MODAL DE BARBERO */}
      <BarberDashboard 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />

      {/* 3. HERO (SECCIÓN DE BIENVENIDA) */}
      <Hero onStartBooking={() => navigateToSection('reservar')} />

      {/* 4. SECCIÓN DE FLUJO DE RESERVAS */}
      <section className="bg-[#1C120C] border-b border-vintage-border relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.02)_0%,_transparent_70%)] pointer-events-none"></div>
        <BookingFlow />
      </section>

      {/* 5. TIENDA PREMIUM */}
      <section className="bg-[#120C08] border-b border-vintage-border relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.01)_0%,_transparent_70%)] pointer-events-none"></div>
        <ProductCatalog />
      </section>

      {/* 6. GALERÍA POLAROID (CORTES) */}
      <section className="bg-[#1C120C] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.02)_0%,_transparent_70%)] pointer-events-none"></div>
        <PolaroidGallery />
      </section>

      {/* 7. FOOTER */}
      <Footer setActiveSection={navigateToSection} />

    </div>
  );
}
