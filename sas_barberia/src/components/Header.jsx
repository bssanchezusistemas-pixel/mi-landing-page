import React, { useState } from 'react';
import { dbService } from '../database/supabase';
import { Database, ShieldCheck, DatabaseZap, RotateCcw, Menu, X, Landmark } from 'lucide-react';

export default function Header({ activeSection, setActiveSection, onOpenAdmin }) {
  const [showDbInfo, setShowDbInfo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isSupabase = dbService.isUsingSupabase();
  const config = dbService.getSupabaseConfig();

  const handleResetDb = () => {
    if (window.confirm('¿Deseas reiniciar la base de datos local a los valores iniciales? Esto borrará tus citas de prueba en localStorage.')) {
      dbService.resetLocalDb();
    }
  };

  const navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'reservar', label: 'Reservar Cita' },
    { id: 'tienda', label: 'Tienda Premium' },
    { id: 'cortes', label: 'Últimos Cortes' },
  ];

  return (
    <header className="relative bg-[#1A110A] border-b-2 border-vintage-border z-40">
      {/* Barra de decoración de oro clásica */}
      <div className="h-1 w-full bg-vintage-gold"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        
        {/* Branding Izquierda */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveSection('inicio')}>
          <div className="text-vintage-gold hidden sm:block">
            <Landmark size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-widest text-vintage-cream hover:text-vintage-gold transition-colors duration-300">
              EL IMPERIO
            </h1>
            <p className="text-[10px] tracking-[0.25em] text-vintage-gold uppercase font-serif">
              Barbería Clásica & Club
            </p>
          </div>
        </div>

        {/* Navegación Escritorio */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`font-serif text-sm font-semibold tracking-wider uppercase transition-all duration-300 ${
                activeSection === item.id 
                  ? 'text-vintage-gold border-b border-vintage-gold pb-1'
                  : 'text-vintage-cream hover:text-vintage-gold'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={onOpenAdmin}
            className="border border-vintage-borderLight bg-[#23170F] text-vintage-gold hover:bg-vintage-gold hover:text-vintage-dark px-4 py-1.5 rounded font-serif text-xs font-bold uppercase tracking-widest transition-all duration-300"
          >
            Consola Barbero
          </button>
        </nav>

        {/* Estado Base de Datos (Supabase Badge) */}
        <div className="relative">
          <button
            onClick={() => setShowDbInfo(!showDbInfo)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold font-serif tracking-wider uppercase transition-all duration-300 ${
              isSupabase
                ? 'bg-vintage-green/20 border-vintage-gold text-vintage-gold hover:bg-vintage-green/30'
                : 'bg-amber-950/40 border-amber-600/50 text-amber-400 hover:bg-amber-950/60'
            }`}
          >
            {isSupabase ? <DatabaseZap size={14} /> : <Database size={14} />}
            <span className="hidden sm:inline">{isSupabase ? 'Supabase' : 'DB Local'}</span>
          </button>

          {showDbInfo && (
            <div className="absolute right-0 mt-3 w-72 bg-vintage-card border-2 border-vintage-border rounded-lg shadow-2xl p-4 z-50 text-vintage-cream">
              <div className="flex justify-between items-center border-b border-vintage-border pb-2 mb-3">
                <h4 className="font-serif font-bold text-vintage-gold flex items-center gap-1.5">
                  {isSupabase ? <ShieldCheck size={18} /> : <Database size={18} />}
                  Estado del Servidor
                </h4>
                <button 
                  onClick={() => setShowDbInfo(false)}
                  className="text-vintage-cream/60 hover:text-vintage-cream"
                >
                  <X size={16} />
                </button>
              </div>

              {isSupabase ? (
                <div className="text-xs space-y-2">
                  <p className="text-vintage-cream/80">Conectado exitosamente al servidor en la nube de Supabase.</p>
                  <div className="bg-black/40 p-2 rounded text-[10px] font-mono select-all">
                    URL: {config.url}
                  </div>
                  <p className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                    Sincronización Activa
                  </p>
                </div>
              ) : (
                <div className="text-xs space-y-3">
                  <p className="text-vintage-cream/80 leading-relaxed">
                    Operando en modo de **Resiliencia Local (Offline/LocalStorage)**.
                  </p>
                  <p className="text-[11px] text-amber-300">
                    Las citas y compras se guardarán en tu navegador. Puedes configurar tu URL y Anon Key en el archivo <code className="bg-black/60 px-1 py-0.5 rounded text-amber-200">.env</code> de tu app para activar Supabase.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleResetDb}
                      className="flex-1 flex items-center justify-center gap-1 bg-[#3A261A] hover:bg-vintage-burgundy hover:text-white text-vintage-cream py-1.5 px-2 rounded border border-vintage-border transition-all duration-200"
                    >
                      <RotateCcw size={12} />
                      Reiniciar Local
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botón Menú Móvil */}
        <div className="flex md:hidden items-center ml-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-vintage-cream hover:text-vintage-gold focus:outline-none"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1A110A] border-t border-vintage-border px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left font-serif text-sm font-bold tracking-wider uppercase py-2 transition-all ${
                activeSection === item.id ? 'text-vintage-gold pl-2 border-l-2 border-vintage-gold' : 'text-vintage-cream'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onOpenAdmin();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-center mt-4 border border-vintage-borderLight bg-[#23170F] text-vintage-gold hover:bg-vintage-gold hover:text-vintage-dark py-2.5 rounded font-serif text-xs font-bold uppercase tracking-widest transition-all"
          >
            Consola Barbero
          </button>
        </div>
      )}
    </header>
  );
}
