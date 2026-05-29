import React from 'react';
import { Landmark, Mail, Phone, MapPin, Landmark as ClubIcon, HelpCircle } from 'lucide-react';

export default function Footer({ setActiveSection }) {
  return (
    <footer className="bg-[#0F0A06] border-t-4 border-vintage-border text-vintage-cream pt-16 pb-8 relative overflow-hidden">
      
      {/* Detalle decorativo de fondo */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-vintage-gold/5 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-vintage-border/50 pb-12">
        
        {/* Col 1: Branding (Col 5) */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center space-x-2.5">
            <ClubIcon size={28} className="text-vintage-gold" />
            <h4 className="text-2xl font-serif font-black tracking-widest uppercase">EL IMPERIO</h4>
          </div>
          <p className="text-xs tracking-[0.2em] text-vintage-gold font-serif uppercase font-semibold">
            Barbería Clásica & Club de Caballeros
          </p>
          <p className="text-xs text-vintage-cream/70 font-sans leading-relaxed max-w-sm">
            Desde 2018, preservamos el arte original del afeitado clásico y los cortes con historia. Creamos un espacio donde la tradición se encuentra con la camaradería. Ven por un gran corte, quédate por la experiencia.
          </p>
        </div>

        {/* Col 2: Enlaces Rápidos (Col 3) */}
        <div className="md:col-span-3 space-y-4">
          <h5 className="font-serif font-bold text-vintage-gold text-sm uppercase tracking-wider border-b border-vintage-border pb-1.5">
            Enlaces del Club
          </h5>
          <ul className="space-y-2.5 text-xs font-serif font-semibold tracking-wide uppercase">
            <li>
              <button onClick={() => setActiveSection('inicio')} className="hover:text-vintage-gold transition-colors">Inicio</button>
            </li>
            <li>
              <button onClick={() => setActiveSection('reservar')} className="hover:text-vintage-gold transition-colors">Reservar Turno</button>
            </li>
            <li>
              <button onClick={() => setActiveSection('tienda')} className="hover:text-vintage-gold transition-colors">Tienda Premium</button>
            </li>
            <li>
              <button onClick={() => setActiveSection('cortes')} className="hover:text-vintage-gold transition-colors">Galería de Cortes</button>
            </li>
          </ul>
        </div>

        {/* Col 3: Contacto & Registro (Col 4) */}
        <div className="md:col-span-4 space-y-4">
          <h5 className="font-serif font-bold text-vintage-gold text-sm uppercase tracking-wider border-b border-vintage-border pb-1.5">
            Contacto Imperial
          </h5>
          
          <div className="space-y-3.5 text-xs">
            <div className="flex items-start gap-2.5 leading-relaxed">
              <MapPin size={16} className="text-vintage-gold shrink-0 mt-0.5" />
              <span>Carrera 12 #4-56, Sector Plaza Principal, Zarzal, Valle del Cauca, Colombia</span>
            </div>
            
            <div className="flex items-center gap-2.5">
              <Phone size={15} className="text-vintage-gold shrink-0" />
              <span>+57 315 555 1920</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail size={15} className="text-vintage-gold shrink-0" />
              <span>contacto@elimperiobarberia.com</span>
            </div>
          </div>
        </div>

      </div>

      {/* Copy y Derechos */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-center gap-4 text-xs text-vintage-cream/50">
        <div>
          <p>© 2026 EL IMPERIO. Zarzal, Valle del Cauca, Colombia. Estilo Eterno, Citas Rápidas.</p>
        </div>
        <div className="flex space-x-4 font-serif uppercase tracking-wider text-[10px]">
          <a href="#" className="hover:text-vintage-gold">Políticas del Club</a>
          <span>•</span>
          <a href="#" className="hover:text-vintage-gold">Términos de Reservas</a>
        </div>
      </div>
    </footer>
  );
}
