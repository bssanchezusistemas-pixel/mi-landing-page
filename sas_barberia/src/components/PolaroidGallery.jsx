import React from 'react';
import { fotosInstagramMock } from '../database/mockData';
import { Camera } from 'lucide-react';

const InstagramIcon = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function PolaroidGallery() {
  // Rotaciones predefinidas para dar sensación de fotos tiradas de forma natural en la mesa
  const rotaciones = [
    '-rotate-3 translate-y-1',
    'rotate-2 -translate-y-1',
    '-rotate-1 translate-y-2',
    'rotate-3 translate-y-0',
    '-rotate-2 -translate-y-2',
    'rotate-1 translate-y-1',
    '-rotate-3 translate-y-0',
    'rotate-2 translate-y-2',
  ];

  return (
    <div id="cortes-section" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
      
      {/* Encabezado */}
      <div className="text-center mb-12">
        <h3 className="text-3xl sm:text-4xl font-serif font-black tracking-wide text-vintage-gold uppercase">
          Últimos Cortes del Club
        </h3>
        <p className="text-vintage-cream/60 text-xs sm:text-sm max-w-lg mx-auto mt-2 leading-relaxed uppercase tracking-wider font-serif">
          Retratos genuinos de nuestros clientes luciendo el sello imperial
        </p>
        <div className="flex justify-center mt-4">
          <div className="h-[2px] w-20 bg-vintage-gold/40"></div>
        </div>
      </div>

      {/* Grid de Polaroid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 max-w-5xl mx-auto px-2">
        {fotosInstagramMock.map((foto, index) => {
          const rotacionClase = rotaciones[index % rotaciones.length];
          return (
            <div
              key={foto.id}
              className={`polaroid-card ${rotacionClase} cursor-pointer relative group`}
            >
              {/* Contenedor Imagen */}
              <div className="aspect-square bg-neutral-900 border border-neutral-300/40 overflow-hidden relative shadow-inner">
                <img
                  src={foto.url}
                  alt={foto.corte}
                  className="w-full h-full object-cover transition-all duration-700 sepia-hover"
                />
                
                {/* Icono de Instagram Hover Overlay */}
                <div className="absolute inset-0 bg-vintage-burgundy/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <div className="bg-[#fdfaf2] text-vintage-burgundy p-2.5 rounded-full border border-vintage-border shadow-lg">
                    <InstagramIcon size={18} />
                  </div>
                </div>
              </div>

              {/* Pie de foto manuscrito */}
              <div className="mt-4 text-center">
                <p className="font-handwritten text-[11px] font-bold text-vintage-dark tracking-wide uppercase truncate leading-relaxed">
                  #{foto.corte}
                </p>
                <div className="flex justify-center items-center gap-1 mt-1.5 opacity-60">
                  <Camera size={10} className="text-vintage-dark" />
                  <span className="text-[8px] font-mono text-vintage-dark font-semibold">EL IMPERIO CLUB</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feed Instagram Conexión Banner */}
      <div className="mt-16 max-w-xl mx-auto border border-vintage-border bg-vintage-card/60 p-6 text-center vintage-inner-border shadow-lg">
        <InstagramIcon size={24} className="text-vintage-gold mx-auto mb-3" />
        <h5 className="font-serif font-bold text-vintage-cream text-sm uppercase tracking-wider">
          Síguenos en Redes Sociales
        </h5>
        <p className="text-xs text-vintage-cream/70 mt-2 leading-relaxed">
          Comparte tu experiencia con el tag <strong className="text-vintage-gold font-mono">#ElImperioBarberClub</strong> para aparecer en nuestra cartelera de honor del club clásico.
        </p>
        
        <button
          onClick={() => alert('Integración de Instagram API en modo demostración. En producción, la API de Instagram Basic Display cargará las fotos en tiempo real.')}
          className="mt-4 px-6 py-2 border border-vintage-borderLight bg-[#23170F] text-vintage-gold hover:bg-vintage-gold hover:text-vintage-dark font-serif text-[10px] font-bold uppercase tracking-widest transition-all duration-300"
        >
          Conectar cuenta oficial
        </button>
      </div>

    </div>
  );
}
