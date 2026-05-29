import React from 'react';
import { Calendar, Clock, MapPin, Award, Shield } from 'lucide-react';

export default function Hero({ onStartBooking }) {
  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden wood-overlay border-b-4 border-vintage-border">
      
      {/* Luz cálida ambiental de fondo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Contenedor Vintage Principal */}
      <div className="max-w-4xl w-full text-center relative z-10 p-8 sm:p-12 vintage-double-border bg-vintage-card/90 rounded-sm vintage-inner-border shadow-2xl backdrop-blur-sm">
        
        {/* Adorno superior vintage */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="h-[1px] w-12 sm:w-20 bg-vintage-gold/50"></div>
          <span className="text-vintage-gold text-lg sm:text-2xl font-serif">EST. 2018</span>
          <div className="h-[1px] w-12 sm:w-20 bg-vintage-gold/50"></div>
        </div>

        {/* Eslogan Clásico */}
        <p className="text-xs sm:text-sm tracking-[0.3em] text-vintage-bronze uppercase font-serif font-semibold mb-3">
          El Refugio del Verdadero Caballero
        </p>

        {/* Título Principal */}
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-wide text-vintage-cream mb-6 leading-tight uppercase font-serif">
          Cortes Clásicos, <br className="hidden sm:inline" />
          <span className="text-vintage-gold gold-glow-text">Estilo Eterno</span>
        </h2>

        {/* Descripción Breve */}
        <p className="max-w-2xl mx-auto text-sm sm:text-lg text-vintage-cream/80 font-sans leading-relaxed mb-10">
          En **El Imperio**, recuperamos el arte tradicional de la barbería. Navajas de afeitar libres, toallas calientes al vapor, pomadas de sándalo y manos expertas que esculpen tu identidad. Ven a vivir el ritual del afeitado clásico.
        </p>

        {/* Botón de Llamado a la Acción */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-12">
          <button
            onClick={onStartBooking}
            className="w-full sm:w-auto px-10 py-4 border-2 border-vintage-gold rounded-none text-vintage-gold hover:text-vintage-dark font-serif text-sm font-black uppercase tracking-widest transition-all duration-300 shimmer-btn hover:border-vintage-gold shadow-gold-sm hover:shadow-gold-md"
          >
            Reservar Cita Online
          </button>
          
          <a
            href="#tienda"
            className="w-full sm:w-auto px-10 py-4 border-2 border-vintage-borderLight bg-[#23170F] hover:bg-vintage-card text-vintage-cream font-serif text-sm font-semibold uppercase tracking-widest transition-all duration-300 text-center"
          >
            Ver Productos
          </a>
        </div>

        {/* Adorno Divisor Decorativo */}
        <div className="flex items-center justify-center space-x-2 mb-10">
          <span className="text-vintage-gold text-lg">✦</span>
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-vintage-gold to-transparent"></div>
          <span className="text-vintage-gold text-lg">✦</span>
        </div>

        {/* Grid de Información: Ubicación, Horarios y Calidad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left text-vintage-cream/90 border-t border-vintage-border/60 pt-8">
          
          {/* Horario */}
          <div className="flex items-start space-x-3.5">
            <div className="text-vintage-gold mt-1">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="font-serif font-bold text-vintage-gold text-sm tracking-wide uppercase">Horarios de Honor</h4>
              <p className="text-xs text-vintage-cream/70 mt-1 leading-relaxed">
                Lunes a Sábado: 8:00 AM - 8:00 PM <br />
                Domingos: Cerrado por Descanso
              </p>
            </div>
          </div>

          {/* Ubicación */}
          <div className="flex items-start space-x-3.5">
            <div className="text-vintage-gold mt-1">
              <MapPin size={20} />
            </div>
            <div>
              <h4 className="font-serif font-bold text-vintage-gold text-sm tracking-wide uppercase">El Club</h4>
              <p className="text-xs text-vintage-cream/70 mt-1 leading-relaxed">
                Carrera 12 #4-56, Centro Histórico <br />
                Zarzal, Valle del Cauca, Colombia
              </p>
            </div>
          </div>

          {/* Calidad Garantizada */}
          <div className="flex items-start space-x-3.5">
            <div className="text-vintage-gold mt-1">
              <Award size={20} />
            </div>
            <div>
              <h4 className="font-serif font-bold text-vintage-gold text-sm tracking-wide uppercase">Artesanía de Corte</h4>
              <p className="text-xs text-vintage-cream/70 mt-1 leading-relaxed">
                Cada servicio incluye lavado con agua purificada, toalla caliente y bebida Premium gratis.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
