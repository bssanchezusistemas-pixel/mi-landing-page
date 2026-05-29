import React, { useState, useEffect } from 'react';
import { dbService } from '../database/supabase';
import { 
  Calendar, DollarSign, Award, Users, ShieldAlert,
  ClipboardList, CheckCircle, XCircle, RotateCcw, Copy, 
  Database, HelpCircle, Check, KeyRound, Eye, EyeOff
} from 'lucide-react';

export default function BarberDashboard({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [citas, setCitas] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [copied, setCopied] = useState(false);
  const [dbStatus, setDbStatus] = useState(false);

  // Cargar citas cuando se autentica
  useEffect(() => {
    if (isAuthenticated) {
      cargarCitas();
      setDbStatus(dbService.isUsingSupabase());
    }
  }, [isAuthenticated]);

  const cargarCitas = async () => {
    try {
      const data = await dbService.getCitas();
      setCitas(data);
    } catch (err) {
      console.error('Error al cargar citas en el dashboard:', err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'imperio' || password === '1234' || password === 'admin') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleCambiarEstado = async (citaId, nuevoEstado) => {
    if (window.confirm(`¿Seguro que deseas marcar esta cita como "${nuevoEstado}"?`)) {
      const res = await dbService.actualizarEstadoCita(citaId, nuevoEstado);
      if (res.success) {
        cargarCitas(); // Recargar agenda
      } else {
        alert('Error al actualizar el estado en el servidor.');
      }
    }
  };

  const handleCopiarSQL = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filtrar citas según el estado
  const citasFiltradas = citas.filter(cita => {
    if (filtro === 'todos') return true;
    return cita.estado === filtro;
  });

  // Estadísticas del Día (Proyectadas e Ingresos reales de Completadas)
  const totalCitas = citas.length;
  const citasPendientes = citas.filter(c => c.estado === 'pendiente').length;
  const citasCompletadas = citas.filter(c => c.estado === 'completado').length;
  
  const calcularIngresos = (completadasSolo = false) => {
    const citasInteres = completadasSolo 
      ? citas.filter(c => c.estado === 'completado')
      : citas.filter(c => c.estado !== 'cancelado');
      
    return citasInteres.reduce((sum, cita) => {
      const precioServicio = cita.servicio?.precio || 0;
      const precioProductos = cita.productos?.reduce((pSum, p) => pSum + (p.precio || 0), 0) || 0;
      return sum + precioServicio + precioProductos;
    }, 0);
  };

  // SQL Script para que creen sus tablas en Supabase
  const sqlScript = `-- SCRIPT DE INICIALIZACIÓN PARA BARBERÍA EL IMPERIO
-- Pega esto en el SQL Editor de tu proyecto de Supabase

-- 1. Tabla de Barberos
CREATE TABLE IF NOT EXISTS public.barberos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    especialidad TEXT NOT NULL,
    foto TEXT NOT NULL,
    rating NUMERIC DEFAULT 5.0,
    opiniones INTEGER DEFAULT 0,
    bio TEXT,
    creado_a TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabla de Servicios
CREATE TABLE IF NOT EXISTS public.servicios (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    duracion INTEGER NOT NULL,
    precio NUMERIC NOT NULL,
    descripcion TEXT,
    creado_a TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabla de Citas/Reservas
CREATE TABLE IF NOT EXISTS public.citas (
    id TEXT PRIMARY KEY,
    barbero_id TEXT REFERENCES public.barberos(id) ON DELETE CASCADE,
    servicio_id TEXT REFERENCES public.servicios(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora TEXT NOT NULL,
    cliente_nombre TEXT NOT NULL,
    cliente_telefono TEXT NOT NULL,
    cliente_email TEXT,
    notas TEXT,
    productos JSONB DEFAULT '[]'::jsonb,
    estado TEXT DEFAULT 'pendiente',
    creado_a TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Tabla de Productos de Tienda
CREATE TABLE IF NOT EXISTS public.productos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    precio NUMERIC NOT NULL,
    foto TEXT NOT NULL,
    descripcion TEXT,
    categoria TEXT NOT NULL,
    stock INTEGER DEFAULT 10,
    creado_a TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Insertar Datos de Prueba Iniciales (Barberos)
INSERT INTO public.barberos (id, nombre, especialidad, foto, rating, opiniones, bio) VALUES
('1', 'Alex "The Blade"', 'Master Fade & Beards', 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 4.9, 124, 'Especialista en degradados modernos y esculpido de barba con navaja clásica. Combina precisión quirúrgica con el arte tradicional de la barbería.'),
('2', 'Carlos "Vintage"', 'Classic Cuts & Shaves', 'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 4.8, 98, 'Amante de la estética de los años 50. Experto en afeitado de toalla caliente tradicional, cortes Pompadour y revivir el estilo de los caballeros de época.'),
('3', 'Marcus "Whiskey"', 'Beard Grooming & Styling', 'https://images.pexels.com/photos/1453008/pexels-photo-1453008.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 5.0, 86, 'El maestro del cuidado de la barba. Mezcla técnicas clásicas con aceites esenciales artesanales para ofrecer una experiencia de relajación total.')
ON CONFLICT (id) DO NOTHING;

-- 6. Insertar Datos de Prueba Iniciales (Servicios)
INSERT INTO public.servicios (id, nombre, duracion, precio, descripcion) VALUES
('s1', 'Corte Clásico Caballero', 35, 22.00, 'Corte tradicional realizado con tijera y máquina, lavado premium con tónico refrescante y peinado final con pomada artesanal.'),
('s2', 'Afeitado Imperial Navaja', 30, 18.00, 'Experiencia tradicional con toallas calientes al vapor, espuma de afeitar batida a brocha, afeitado a navaja libre y bálsamo hidratante.'),
('s3', 'Arreglo de Barba Royale', 25, 15.00, 'Recorte detallado de barba y bigote, delineado preciso con navaja libre, masaje facial y aplicación de aceites de madera de cedro.'),
('s4', 'Combo Imperial Club', 60, 32.00, 'Nuestro servicio insignia. Incluye Corte Clásico Caballero, Afeitado Imperial o Arreglo de Barba, lavado de cabello premium y una bebida de cortesía.')
ON CONFLICT (id) DO NOTHING;

-- 7. Habilitar lecturas públicas / desactivar RLS de forma simple para desarrollo rápido
ALTER TABLE public.barberos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.citas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos DISABLE ROW LEVEL SECURITY;
`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto animate-[fadeIn_0.25s_ease-out]">
      
      {/* Caja del Contenedor de Consola Dashboard */}
      <div className="bg-vintage-card border-2 border-vintage-gold w-full max-w-5xl rounded-none shadow-2xl p-6 sm:p-8 relative text-vintage-cream vintage-inner-border max-h-[90vh] overflow-y-auto">
        
        {/* Encabezado General */}
        <div className="flex justify-between items-center border-b-2 border-vintage-border pb-4 mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-black tracking-widest text-vintage-gold uppercase">
              Consola del Maestro Barbero
            </h3>
            <p className="text-[9px] sm:text-[10px] tracking-widest text-vintage-cream/60 uppercase font-serif">
              Libro de Registros, Contabilidad & Conectividad Supabase
            </p>
          </div>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setPassword('');
              onClose();
            }}
            className="text-vintage-cream/60 hover:text-vintage-cream p-1.5 border border-vintage-border"
          >
            Cerrar Consola
          </button>
        </div>

        {/* ======================================================== */}
        {/* CONTROL DE ACCESO (LOGIN CON CONTRASENA VINTAGE) */}
        {/* ======================================================== */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto py-12 text-center animate-[fadeIn_0.4s_ease-out]">
            <div className="h-16 w-16 border-2 border-vintage-border bg-[#1C120C] rounded-full flex items-center justify-center mx-auto mb-6 text-vintage-gold">
              <KeyRound size={28} strokeWidth={1.5} />
            </div>

            <h4 className="font-serif font-bold text-lg text-vintage-cream uppercase tracking-wider mb-2">
              Verificación de Identidad
            </h4>
            <p className="text-xs text-vintage-cream/70 leading-relaxed mb-6 px-4 uppercase tracking-wide text-[10px] font-serif">
              Introduce la llave del club para acceder a las citas y configuraciones
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#150E09] border border-vintage-border text-vintage-cream text-center font-bold tracking-widest px-4 py-3 text-sm focus:outline-none focus:border-vintage-gold"
                  placeholder="LLAVE SECRETA (1234 O IMPERIO)"
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-vintage-cream/50 hover:text-vintage-gold"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {loginError && (
                <p className="text-xs text-vintage-burgundy font-bold uppercase tracking-wider">
                  ⚠️ Llave denegada. Inténtalo de nuevo.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-vintage-gold hover:bg-vintage-goldLight text-vintage-dark font-serif text-xs font-black uppercase tracking-widest transition-all shadow-gold-sm"
              >
                Abrir Libro de Turnos
              </button>
            </form>
          </div>
        ) : (
          /* ======================================================== */
          /* PANELES DE ADMINISTRACIÓN Y CONTABILIDAD */
          /* ======================================================== */
          <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            
            {/* GRID DE ESTADÍSTICAS FINANCIERAS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Citas Totales */}
              <div className="bg-[#1C120C] border border-vintage-border p-4 text-center">
                <Users className="text-vintage-gold mx-auto mb-1.5" size={20} />
                <span className="text-[9px] text-vintage-cream/50 uppercase tracking-widest font-serif block">Total Citas</span>
                <span className="text-2xl font-serif font-black text-vintage-cream">{totalCitas}</span>
              </div>

              {/* Citas Pendientes */}
              <div className="bg-[#1C120C] border border-vintage-border p-4 text-center">
                <Calendar className="text-amber-500 mx-auto mb-1.5" size={20} />
                <span className="text-[9px] text-vintage-cream/50 uppercase tracking-widest font-serif block">Pendientes</span>
                <span className="text-2xl font-serif font-black text-amber-500">{citasPendientes}</span>
              </div>

              {/* Ingresos Estimados (No Cancelados) */}
              <div className="bg-[#1C120C] border border-vintage-border p-4 text-center">
                <DollarSign className="text-emerald-500 mx-auto mb-1.5" size={20} />
                <span className="text-[9px] text-vintage-cream/50 uppercase tracking-widest font-serif block">Caja Proyectada</span>
                <span className="text-2xl font-serif font-black text-emerald-500">${calcularIngresos(false).toFixed(2)}</span>
              </div>

              {/* Ingresos Reales (Completados) */}
              <div className="bg-[#1C120C] border border-vintage-border p-4 text-center">
                <Award className="text-vintage-gold mx-auto mb-1.5" size={20} />
                <span className="text-[9px] text-vintage-cream/50 uppercase tracking-widest font-serif block">Caja Cobrada</span>
                <span className="text-2xl font-serif font-black text-vintage-gold">${calcularIngresos(true).toFixed(2)}</span>
              </div>

            </div>

            {/* CUERPO CENTRAL DE LA CONSOLA (AGENDA IZQ - SQL DER) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Agenda de Citas (Col 7) */}
              <div className="lg:col-span-7 bg-[#150E09] border border-vintage-border p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-vintage-border pb-3 mb-4">
                  <h4 className="font-serif font-bold text-vintage-cream text-base uppercase tracking-wider flex items-center gap-1.5">
                    <ClipboardList size={18} className="text-vintage-gold" />
                    Agenda de Turnos
                  </h4>

                  {/* Filtro Agenda */}
                  <div className="flex gap-1.5">
                    {['todos', 'pendiente', 'completado', 'cancelado'].map(f => (
                      <button
                        key={f}
                        onClick={() => setFiltro(f)}
                        className={`px-2.5 py-1 text-[9px] font-bold font-serif uppercase border transition-all ${
                          filtro === f
                            ? 'border-vintage-gold bg-vintage-gold/15 text-vintage-gold'
                            : 'border-vintage-border text-vintage-cream/60 hover:text-vintage-cream'
                        }`}
                      >
                        {f === 'todos' ? 'Todos' : f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lista de Turnos */}
                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                  {citasFiltradas.length === 0 ? (
                    <div className="text-center py-16 text-xs text-vintage-cream/40 border border-dashed border-vintage-border font-serif uppercase tracking-wider">
                      Ningún turno agendado en este listado.
                    </div>
                  ) : (
                    citasFiltradas.map(cita => (
                      <div
                        key={cita.id}
                        className={`p-3.5 border flex justify-between gap-4 transition-all ${
                          cita.estado === 'completado'
                            ? 'border-vintage-green/30 bg-vintage-green/5 opacity-80'
                            : cita.estado === 'cancelado'
                              ? 'border-vintage-burgundy/30 bg-vintage-burgundy/5 opacity-60'
                              : 'border-vintage-border bg-[#1C120C]'
                        }`}
                      >
                        <div className="space-y-1 text-xs">
                          {/* Info Cita */}
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-vintage-gold uppercase tracking-wider">{cita.hora}</span>
                            <span className="text-vintage-cream/45">•</span>
                            <span className="font-sans font-semibold text-vintage-cream/80">{cita.fecha}</span>
                            
                            {/* Badge Estado */}
                            <span className={`text-[8px] font-serif font-black uppercase tracking-wider py-0.5 px-2.5 ml-2 border ${
                              cita.estado === 'completado'
                                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                                : cita.estado === 'cancelado'
                                  ? 'bg-red-950/40 border-red-500/40 text-red-400'
                                  : 'bg-amber-950/40 border-amber-500/40 text-amber-400 animate-pulse'
                            }`}>
                              {cita.estado}
                            </span>
                          </div>

                          {/* Info Cliente */}
                          <p className="font-serif font-semibold text-vintage-cream text-sm pt-1">
                            {cita.cliente_nombre}
                          </p>
                          
                          <p className="text-[10px] text-vintage-cream/60 flex items-center gap-1 font-sans">
                            📞 {cita.cliente_telefono} {cita.cliente_email && `| ✉️ ${cita.cliente_email}`}
                          </p>

                          {/* Info Barber y Servicio */}
                          <p className="text-[10px] text-vintage-bronze font-serif font-bold uppercase tracking-wider pt-1">
                            💈 {cita.barbero?.nombre} ➔ ✂️ {cita.servicio?.nombre} (${cita.servicio?.precio.toFixed(2)})
                          </p>

                          {/* Productos Adicionales */}
                          {cita.productos && cita.productos.length > 0 && (
                            <div className="text-[9px] text-emerald-400/80 pt-1.5 font-sans">
                              🎁 Prod. Adicionados: {cita.productos.map(p => p.nombre).join(', ')}
                            </div>
                          )}

                          {/* Comentarios */}
                          {cita.notas && (
                            <p className="text-[9px] text-vintage-cream/50 bg-black/30 p-1.5 italic font-sans border-l border-vintage-gold border-dashed mt-1.5 max-w-sm">
                              "{cita.notas}"
                            </p>
                          )}
                        </div>

                        {/* Acciones Cita */}
                        {cita.estado === 'pendiente' && (
                          <div className="flex flex-col gap-1.5 justify-center">
                            <button
                              onClick={() => handleCambiarEstado(cita.id, 'completado')}
                              className="p-1.5 bg-emerald-900/30 hover:bg-emerald-800 border border-emerald-700/50 hover:border-emerald-500 text-emerald-400 transition-all rounded"
                              title="Marcar cita como completada"
                            >
                              <CheckCircle size={15} />
                            </button>
                            <button
                              onClick={() => handleCambiarEstado(cita.id, 'cancelado')}
                              className="p-1.5 bg-red-900/30 hover:bg-red-800 border border-red-700/50 hover:border-red-500 text-red-400 transition-all rounded"
                              title="Cancelar cita"
                            >
                              <XCircle size={15} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Supabase Console & SQL (Col 5) */}
              <div className="lg:col-span-5 bg-[#150E09] border border-vintage-border p-5 space-y-5 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-vintage-gold text-base uppercase tracking-wider border-b border-vintage-border pb-3 mb-4 flex items-center gap-1.5">
                    <Database size={18} />
                    Integración a Supabase
                  </h4>

                  {/* Estado Badge */}
                  <div className={`p-3.5 border text-xs font-serif uppercase tracking-wider ${
                    dbStatus 
                      ? 'bg-emerald-950/20 border-vintage-gold text-vintage-gold' 
                      : 'bg-amber-950/20 border-vintage-borderLight text-amber-400'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">MODO DE BASE DE DATOS:</span>
                      <strong className="text-sm underline">{dbStatus ? 'SUPABASE NUBE' : 'FALLBACK LOCAL'}</strong>
                    </div>
                    <p className="text-[9px] text-vintage-cream/60 mt-2 normal-case leading-relaxed font-sans font-semibold">
                      {dbStatus 
                        ? 'Tu aplicación web está sincronizando los datos en tiempo real con tu base de datos Supabase en la nube.'
                        : 'El sistema está guardando todo localmente en tu navegador de forma segura. Sigue los pasos de abajo para conectar Supabase.'
                      }
                    </p>
                  </div>

                  {/* Copiar SQL instructions */}
                  <div className="mt-5 space-y-2">
                    <h5 className="font-serif font-bold text-vintage-cream text-xs uppercase tracking-wider flex justify-between items-center">
                      <span>1. Configurar Tablas SQL</span>
                      <button
                        onClick={handleCopiarSQL}
                        className="flex items-center gap-1 text-vintage-gold hover:text-vintage-cream text-[10px] uppercase font-bold tracking-widest border border-vintage-borderLight px-2 py-0.5"
                      >
                        {copied ? <Check size={11} /> : <Copy size={11} />}
                        {copied ? '¡Copiado!' : 'Copiar Script'}
                      </button>
                    </h5>

                    <p className="text-[10px] text-vintage-cream/70 font-sans leading-relaxed">
                      Haz clic en "Copiar Script", ve a tu panel de **Supabase ➔ SQL Editor ➔ New Query**, pega el código y haz clic en **Run**. Esto creará automáticamente las tablas <code className="bg-black/70 text-vintage-gold px-1 rounded">barberos</code>, <code className="bg-black/70 text-vintage-gold px-1 rounded">servicios</code>, <code className="bg-black/70 text-vintage-gold px-1 rounded">citas</code> y <code className="bg-black/70 text-vintage-gold px-1 rounded">productos</code>.
                    </p>
                  </div>

                  <div className="mt-4">
                    <h5 className="font-serif font-bold text-vintage-cream text-xs uppercase tracking-wider mb-1">
                      2. Configurar Entorno
                    </h5>
                    <p className="text-[10px] text-vintage-cream/70 font-sans leading-relaxed">
                      Crea un archivo <code className="bg-black/70 text-vintage-gold px-1 rounded font-bold">.env</code> en la raíz de tu proyecto e ingresa tus llaves. Ejemplo:
                    </p>
                    <pre className="bg-black/80 p-2.5 rounded font-mono text-[9px] text-amber-200 mt-1.5 select-all overflow-x-auto whitespace-pre">
{`VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase`}
                    </pre>
                  </div>
                </div>

                {/* Botón de Reset DB local (si está en local fallback) */}
                {!dbStatus && (
                  <div className="border-t border-vintage-border pt-4 mt-4">
                    <button
                      onClick={() => {
                        if (window.confirm('¿Seguro de reiniciar localStorage? Se borrarán citas y estados locales.')) {
                          dbService.resetLocalDb();
                        }
                      }}
                      className="w-full py-2 bg-vintage-burgundy/10 hover:bg-vintage-burgundy hover:text-white border border-vintage-burgundy text-vintage-cream font-serif text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1"
                    >
                      <RotateCcw size={12} /> Reiniciar DB Local / Cargar Dummies
                    </button>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
