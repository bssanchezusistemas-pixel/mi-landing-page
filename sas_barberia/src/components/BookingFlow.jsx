import React, { useState, useEffect } from 'react';
import { dbService } from '../database/supabase';
import { barberosMock, productosMock } from '../database/mockData';
import { 
  User, Scissors, Calendar as CalIcon, Clock, Check, 
  ChevronRight, ArrowLeft, Receipt, Phone, AlertCircle,
  HelpCircle, Sparkles, Plus, Trash2, Printer
} from 'lucide-react';

export default function BookingFlow() {
  const [paso, setPaso] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Listas de datos cargados de la base de datos
  const [barberos, setBarberos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [citasExistentes, setCitasExistentes] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);

  // Estado de la selección
  const [reserva, setReserva] = useState({
    barbero: null,
    servicio: null,
    fecha: '',
    hora: '',
    cliente_nombre: '',
    cliente_telefono: '',
    cliente_email: '',
    notas: '',
    productos: [] // productos añadidos a la reserva
  });

  const [ticketConfirmado, setTicketConfirmado] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const b = await dbService.getBarberos();
        const s = await dbService.getServicios();
        const c = await dbService.getCitas();
        const p = await dbService.getProductos();
        setBarberos(b);
        setServicios(s);
        setCitasExistentes(c);
        setProductosDisponibles(p.slice(0, 2)); // Mostrar solo los 2 primeros productos como opcionales
      } catch (err) {
        console.error('Error al cargar datos del flujo de reserva:', err);
        setErrorMsg('Error al conectar con la base de datos.');
      }
    };
    cargarDatos();
  }, [paso]);

  // Generar fechas disponibles (hoy + próximos 13 días)
  const getProximosDias = () => {
    const dias = [];
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    for (let i = 0; i < 14; i++) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + i);
      
      // Excluir domingos (cerrado)
      if (fecha.getDay() !== 0) {
        const diaNum = fecha.getDate();
        const diaSem = diasSemana[fecha.getDay()];
        const mes = meses[fecha.getMonth()];
        const isoString = fecha.toISOString().split('T')[0];
        
        dias.push({
          isoString,
          diaNum,
          diaSem,
          mes,
          dateObj: fecha
        });
      }
    }
    return dias;
  };

  // Generar horas disponibles (9:00 AM a 7:30 PM, cada 30 min)
  const getHorasDisponibles = () => {
    return [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
      '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
    ];
  };

  // Verificar si un slot de hora específico ya está ocupado para el barbero y fecha seleccionados
  const isHoraOcupada = (hora) => {
    if (!reserva.barbero || !reserva.fecha) return false;
    
    return citasExistentes.some(cita => 
      cita.barbero_id === reserva.barbero.id && 
      cita.fecha === reserva.fecha && 
      cita.hora === hora && 
      cita.estado !== 'cancelado'
    );
  };

  const handleSeleccionarBarbero = (barbero) => {
    setReserva({ ...reserva, barbero });
    setPaso(2);
  };

  const handleSeleccionarServicio = (servicio) => {
    setReserva({ ...reserva, servicio });
    setPaso(3);
  };

  const handleSeleccionarFecha = (fechaString) => {
    setReserva({ ...reserva, fecha: fechaString, hora: '' }); // reset hora si cambia fecha
  };

  const handleSeleccionarHora = (horaString) => {
    setReserva({ ...reserva, hora: horaString });
  };

  const handleToggleProducto = (prod) => {
    const existe = reserva.productos.find(p => p.id === prod.id);
    if (existe) {
      setReserva({
        ...reserva,
        productos: reserva.productos.filter(p => p.id !== prod.id)
      });
    } else {
      setReserva({
        ...reserva,
        productos: [...reserva.productos, prod]
      });
    }
  };

  const handleConfirmarReserva = async (e) => {
    e.preventDefault();
    if (!reserva.cliente_nombre || !reserva.cliente_telefono) {
      setErrorMsg('Por favor introduce tu nombre y teléfono.');
      return;
    }

    setCargando(true);
    setErrorMsg(null);

    const citaInput = {
      barbero_id: reserva.barbero.id,
      servicio_id: reserva.servicio.id,
      fecha: reserva.fecha,
      hora: reserva.hora,
      cliente_nombre: reserva.cliente_nombre,
      cliente_telefono: reserva.cliente_telefono,
      cliente_email: reserva.cliente_email,
      notas: reserva.notas,
      productos: reserva.productos.map(p => ({ id: p.id, nombre: p.nombre, precio: p.precio })),
      estado: 'pendiente'
    };

    try {
      const response = await dbService.crearCita(citaInput);
      if (response.success) {
        setTicketConfirmado(response.data);
        setPaso(5);
      } else {
        setErrorMsg('No se pudo guardar la reserva en la base de datos. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Error al guardar cita:', err);
      setErrorMsg('Ocurrió un error inesperado al procesar la cita.');
    } finally {
      setCargando(false);
    }
  };

  const handleReiniciar = () => {
    setReserva({
      barbero: null,
      servicio: null,
      fecha: '',
      hora: '',
      cliente_nombre: '',
      cliente_telefono: '',
      cliente_email: '',
      notas: '',
      productos: []
    });
    setTicketConfirmado(null);
    setPaso(1);
  };

  const handleImprimir = () => {
    window.print();
  };

  // Calcular el total a pagar de la cita
  const totalCita = () => {
    const precioServicio = reserva.servicio ? reserva.servicio.precio : 0;
    const precioProductos = reserva.productos.reduce((sum, p) => sum + p.price || p.precio || 0, 0);
    return precioServicio + precioProductos;
  };

  return (
    <div id="booking-section" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
      
      {/* Encabezado de la Sección */}
      <div className="text-center mb-12">
        <h3 className="text-3xl sm:text-4xl font-serif font-black tracking-wide text-vintage-gold uppercase">
          Portal de Reservas
        </h3>
        <p className="text-vintage-cream/60 text-xs sm:text-sm max-w-lg mx-auto mt-2 leading-relaxed uppercase tracking-wider font-serif">
          Sigue el ritual para apartar tu lugar en nuestro trono de cuero
        </p>
        <div className="flex justify-center mt-4">
          <div className="h-[2px] w-20 bg-vintage-gold/40"></div>
        </div>
      </div>

      {/* Indicador de Pasos (Header del Flujo) */}
      {paso < 5 && (
        <div className="flex items-center justify-between max-w-xl mx-auto mb-10 text-xs sm:text-sm border border-vintage-border bg-[#1C120C] p-4 font-serif font-semibold tracking-wider text-vintage-cream">
          <div className={`flex items-center gap-1.5 ${paso >= 1 ? 'text-vintage-gold' : 'text-vintage-cream/40'}`}>
            <span className="h-5 w-5 flex items-center justify-center rounded-full border border-current text-[10px]">1</span>
            <span>Barbero</span>
          </div>
          <ChevronRight size={14} className="text-vintage-cream/20" />
          <div className={`flex items-center gap-1.5 ${paso >= 2 ? 'text-vintage-gold' : 'text-vintage-cream/40'}`}>
            <span className="h-5 w-5 flex items-center justify-center rounded-full border border-current text-[10px]">2</span>
            <span>Servicio</span>
          </div>
          <ChevronRight size={14} className="text-vintage-cream/20" />
          <div className={`flex items-center gap-1.5 ${paso >= 3 ? 'text-vintage-gold' : 'text-vintage-cream/40'}`}>
            <span className="h-5 w-5 flex items-center justify-center rounded-full border border-current text-[10px]">3</span>
            <span>Fecha</span>
          </div>
          <ChevronRight size={14} className="text-vintage-cream/20" />
          <div className={`flex items-center gap-1.5 ${paso >= 4 ? 'text-vintage-gold' : 'text-vintage-cream/40'}`}>
            <span className="h-5 w-5 flex items-center justify-center rounded-full border border-current text-[10px]">4</span>
            <span>Confirmar</span>
          </div>
        </div>
      )}

      {/* Alerta de Error */}
      {errorMsg && (
        <div className="max-w-2xl mx-auto mb-8 bg-vintage-burgundy/10 border-2 border-vintage-burgundy text-vintage-cream p-4 flex items-center gap-3">
          <AlertCircle size={20} className="text-vintage-gold shrink-0" />
          <p className="text-xs font-semibold leading-relaxed">{errorMsg}</p>
        </div>
      )}

      {/* CUERPO DEL FLUJO DE RESERVA */}
      <div className="relative">
        
        {/* ======================================================== */}
        {/* PASO 1: ELIGE AL BARBERO (PROFESIONAL PRIMERO) */}
        {/* ======================================================== */}
        {paso === 1 && (
          <div className="animate-[fadeIn_0.5s_ease-out]">
            <h4 className="text-2xl font-serif text-center mb-8 text-vintage-cream font-bold">
              1. Selecciona a tu Maestro Barbero
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {barberos.length === 0 ? (
                <div className="col-span-full py-12 text-center text-vintage-cream/60">Cargando barberos disponibles...</div>
              ) : (
                barberos.map(barbero => (
                  <div
                    key={barbero.id}
                    onClick={() => handleSeleccionarBarbero(barbero)}
                    className="group flex flex-col items-center bg-vintage-card border-2 border-vintage-border hover:border-vintage-gold transition-all duration-300 p-6 cursor-pointer relative vintage-inner-border shadow-lg"
                  >
                    {/* Marco redondo para foto de barbero */}
                    <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-vintage-border group-hover:border-vintage-gold transition-all duration-300 mb-5 relative bg-black">
                      <img 
                        src={barbero.foto} 
                        alt={barbero.nombre} 
                        className="w-full h-full object-cover sepia-hover"
                      />
                    </div>
                    
                    {/* Calificación en estrellas */}
                    <div className="flex items-center gap-1 text-vintage-gold text-xs font-serif font-bold tracking-wider mb-2">
                      <span>★</span>
                      <span>{barbero.rating ? barbero.rating.toFixed(1) : '5.0'}</span>
                      <span className="text-vintage-cream/50 text-[10px] ml-0.5">({barbero.opiniones || '80'} opiniones)</span>
                    </div>

                    <h5 className="font-serif font-black text-xl text-vintage-cream group-hover:text-vintage-gold transition-all duration-300">
                      {barbero.nombre}
                    </h5>
                    
                    <p className="text-xs text-vintage-bronze tracking-widest font-serif font-semibold uppercase mt-1">
                      {barbero.especialidad}
                    </p>

                    <p className="text-xs text-vintage-cream/70 text-center leading-relaxed font-sans mt-4 border-t border-vintage-border/50 pt-4 px-2">
                      "{barbero.bio}"
                    </p>

                    <button className="mt-6 border-b border-vintage-gold pb-0.5 font-serif text-xs font-bold text-vintage-gold uppercase tracking-widest group-hover:tracking-[0.15em] transition-all">
                      Elegir Barbero
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PASO 2: ELIGE EL SERVICIO */}
        {/* ======================================================== */}
        {paso === 2 && (
          <div className="animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center justify-between max-w-4xl mx-auto mb-6">
              <button 
                onClick={() => setPaso(1)} 
                className="flex items-center gap-1.5 text-vintage-gold hover:text-vintage-cream transition-colors text-xs font-bold font-serif uppercase tracking-wider"
              >
                <ArrowLeft size={14} /> Volver
              </button>
              <div className="text-right text-xs">
                <span className="text-vintage-cream/50">Barbero elegido: </span>
                <strong className="text-vintage-gold font-serif">{reserva.barbero?.nombre}</strong>
              </div>
            </div>

            <h4 className="text-2xl font-serif text-center mb-8 text-vintage-cream font-bold">
              2. Selecciona el Servicio Clásico
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {servicios.length === 0 ? (
                <div className="col-span-full py-12 text-center text-vintage-cream/60">Cargando servicios de barbería...</div>
              ) : (
                servicios.map(servicio => (
                  <div
                    key={servicio.id}
                    onClick={() => handleSeleccionarServicio(servicio)}
                    className="group bg-vintage-card border border-vintage-border hover:border-vintage-gold transition-all duration-300 p-5 cursor-pointer flex justify-between gap-4 vintage-inner-border shadow-lg"
                  >
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h5 className="font-serif font-black text-lg text-vintage-cream group-hover:text-vintage-gold transition-colors duration-300 flex items-center gap-2">
                          <Scissors size={16} className="text-vintage-gold shrink-0" />
                          {servicio.nombre}
                        </h5>
                        <p className="text-xs text-vintage-cream/70 leading-relaxed font-sans mt-2.5">
                          {servicio.descripcion}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-serif font-semibold tracking-wider text-vintage-bronze uppercase mt-4">
                        <span>🕒 {servicio.duracion} minutos</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between min-w-[80px]">
                      <span className="text-vintage-gold text-2xl font-serif font-black tracking-wider">
                        ${servicio.precio.toFixed(2)}
                      </span>
                      <button className="bg-transparent border border-vintage-borderLight text-vintage-cream group-hover:border-vintage-gold group-hover:bg-vintage-gold group-hover:text-vintage-dark py-1 px-3.5 text-xs font-bold font-serif uppercase tracking-widest transition-all duration-300">
                        Elegir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PASO 3: ELIGE FECHA Y HORA */}
        {/* ======================================================== */}
        {paso === 3 && (
          <div className="animate-[fadeIn_0.5s_ease-out] max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setPaso(2)} 
                className="flex items-center gap-1.5 text-vintage-gold hover:text-vintage-cream transition-colors text-xs font-bold font-serif uppercase tracking-wider"
              >
                <ArrowLeft size={14} /> Volver
              </button>
              <div className="text-right text-xs space-y-1">
                <div><span className="text-vintage-cream/50">Barbero: </span><strong className="text-vintage-gold font-serif">{reserva.barbero?.nombre}</strong></div>
                <div><span className="text-vintage-cream/50">Servicio: </span><strong className="text-vintage-gold font-serif">{reserva.servicio?.nombre}</strong></div>
              </div>
            </div>

            <h4 className="text-2xl font-serif text-center mb-8 text-vintage-cream font-bold">
              3. Aparta tu Turno en el Calendario
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Calendario (Col 5) */}
              <div className="lg:col-span-5 bg-vintage-card border border-vintage-border p-5 rounded-none shadow-lg">
                <h5 className="font-serif font-bold text-vintage-gold text-sm uppercase tracking-wider mb-4 border-b border-vintage-border pb-2 flex items-center gap-1.5">
                  <CalIcon size={16} />
                  Fechas Disponibles
                </h5>
                
                <div className="grid grid-cols-4 gap-2.5">
                  {getProximosDias().map((dia) => (
                    <button
                      key={dia.isoString}
                      onClick={() => handleSeleccionarFecha(dia.isoString)}
                      className={`flex flex-col items-center justify-center p-2 border transition-all duration-200 ${
                        reserva.fecha === dia.isoString
                          ? 'border-vintage-gold bg-vintage-gold/20 text-vintage-gold shadow-gold-sm'
                          : 'border-vintage-border bg-[#150E09] text-vintage-cream/80 hover:border-vintage-bronze hover:text-vintage-cream'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-serif tracking-widest font-semibold">{dia.diaSem}</span>
                      <span className="text-lg font-serif font-bold my-0.5">{dia.diaNum}</span>
                      <span className="text-[9px] text-vintage-bronze/80 font-serif uppercase tracking-wider">{dia.mes}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Horas (Col 7) */}
              <div className="lg:col-span-7 bg-vintage-card border border-vintage-border p-5 rounded-none shadow-lg">
                <h5 className="font-serif font-bold text-vintage-gold text-sm uppercase tracking-wider mb-4 border-b border-vintage-border pb-2 flex items-center gap-1.5">
                  <Clock size={16} />
                  Horarios Disponibles
                </h5>

                {!reserva.fecha ? (
                  <div className="h-48 flex flex-col items-center justify-center text-center text-vintage-cream/40 px-6 border border-dashed border-vintage-border">
                    <CalIcon size={36} className="text-vintage-border mb-3" />
                    <p className="text-xs uppercase tracking-wider font-serif">Selecciona una fecha a la izquierda para visualizar los turnos de corte</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Turno Mañana */}
                    <div>
                      <span className="text-[10px] text-vintage-bronze font-serif font-bold uppercase tracking-widest block mb-2">Turnos de la Mañana</span>
                      <div className="grid grid-cols-4 gap-2">
                        {getHorasDisponibles().filter(h => parseInt(h.split(':')[0]) < 12).map((hora) => {
                          const ocupado = isHoraOcupada(hora);
                          return (
                            <button
                              key={hora}
                              disabled={ocupado}
                              onClick={() => handleSeleccionarHora(hora)}
                              className={`py-2 text-xs font-bold transition-all border ${
                                ocupado
                                  ? 'border-red-950/20 bg-red-950/15 text-vintage-cream/20 line-through cursor-not-allowed'
                                  : reserva.hora === hora
                                    ? 'border-vintage-gold bg-vintage-gold text-vintage-dark font-black shadow-gold-sm'
                                    : 'border-vintage-border bg-[#150E09] text-vintage-cream hover:border-vintage-gold hover:text-vintage-gold'
                              }`}
                            >
                              {hora}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Turno Tarde */}
                    <div>
                      <span className="text-[10px] text-vintage-bronze font-serif font-bold uppercase tracking-widest block mb-2">Turnos de la Tarde / Noche</span>
                      <div className="grid grid-cols-4 gap-2">
                        {getHorasDisponibles().filter(h => parseInt(h.split(':')[0]) >= 12).map((hora) => {
                          const ocupado = isHoraOcupada(hora);
                          return (
                            <button
                              key={hora}
                              disabled={ocupado}
                              onClick={() => handleSeleccionarHora(hora)}
                              className={`py-2 text-xs font-bold transition-all border ${
                                ocupado
                                  ? 'border-red-950/20 bg-red-950/15 text-vintage-cream/20 line-through cursor-not-allowed'
                                  : reserva.hora === hora
                                    ? 'border-vintage-gold bg-vintage-gold text-vintage-dark font-black shadow-gold-sm'
                                    : 'border-vintage-border bg-[#150E09] text-vintage-cream hover:border-vintage-gold hover:text-vintage-gold'
                              }`}
                            >
                              {hora}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Navegación al paso 4 */}
            <div className="mt-8 flex justify-end">
              <button
                disabled={!reserva.fecha || !reserva.hora}
                onClick={() => setPaso(4)}
                className={`px-8 py-3.5 border-2 font-serif text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  reserva.fecha && reserva.hora
                    ? 'border-vintage-gold bg-vintage-gold text-vintage-dark hover:bg-transparent hover:text-vintage-gold cursor-pointer shadow-gold-sm'
                    : 'border-vintage-border text-vintage-cream/20 cursor-not-allowed'
                }`}
              >
                Continuar a Confirmar <ChevronRight size={12} className="inline ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PASO 4: DATOS DEL CLIENTE & ADD-ONS */}
        {/* ======================================================== */}
        {paso === 4 && (
          <div className="animate-[fadeIn_0.5s_ease-out] max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setPaso(3)} 
                className="flex items-center gap-1.5 text-vintage-gold hover:text-vintage-cream transition-colors text-xs font-bold font-serif uppercase tracking-wider"
              >
                <ArrowLeft size={14} /> Volver
              </button>
              <div className="text-right text-xs space-y-1">
                <div><span className="text-vintage-cream/50">Corte: </span><strong className="text-vintage-gold font-serif">{reserva.servicio?.nombre}</strong></div>
                <div><span className="text-vintage-cream/50">Fecha: </span><strong className="text-vintage-gold font-serif">{reserva.fecha} ({reserva.hora})</strong></div>
              </div>
            </div>

            <h4 className="text-2xl font-serif text-center mb-8 text-vintage-cream font-bold">
              4. Confirma tus Datos de Reserva
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Formulario (Col 7) */}
              <form onSubmit={handleConfirmarReserva} className="md:col-span-7 bg-vintage-card border border-vintage-border p-6 shadow-lg space-y-4 vintage-inner-border">
                <h5 className="font-serif font-bold text-vintage-gold text-sm uppercase tracking-wider mb-4 border-b border-vintage-border pb-2 flex items-center gap-1.5">
                  <User size={16} />
                  Ficha de Registro
                </h5>

                {/* Nombre */}
                <div>
                  <label htmlFor="cliente_nombre" className="block text-[10px] text-vintage-bronze font-serif font-bold uppercase tracking-widest mb-1.5">
                    Nombre del Caballero / Dama *
                  </label>
                  <input
                    type="text"
                    id="cliente_nombre"
                    required
                    value={reserva.cliente_nombre}
                    onChange={(e) => setReserva({ ...reserva, cliente_nombre: e.target.value })}
                    className="w-full bg-[#150E09] border border-vintage-border text-vintage-cream px-3 py-2 text-sm focus:outline-none focus:border-vintage-gold"
                    placeholder="Ej. Santiago Sánchez"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="cliente_telefono" className="block text-[10px] text-vintage-bronze font-serif font-bold uppercase tracking-widest mb-1.5">
                    Número de Contacto *
                  </label>
                  <input
                    type="tel"
                    id="cliente_telefono"
                    required
                    value={reserva.cliente_telefono}
                    onChange={(e) => setReserva({ ...reserva, cliente_telefono: e.target.value })}
                    className="w-full bg-[#150E09] border border-vintage-border text-vintage-cream px-3 py-2 text-sm focus:outline-none focus:border-vintage-gold"
                    placeholder="Ej. +57 312 345 6789"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="cliente_email" className="block text-[10px] text-vintage-bronze font-serif font-bold uppercase tracking-widest mb-1.5">
                    Correo Electrónico (Opcional)
                  </label>
                  <input
                    type="email"
                    id="cliente_email"
                    value={reserva.cliente_email}
                    onChange={(e) => setReserva({ ...reserva, cliente_email: e.target.value })}
                    className="w-full bg-[#150E09] border border-vintage-border text-vintage-cream px-3 py-2 text-sm focus:outline-none focus:border-vintage-gold"
                    placeholder="santiago@ejemplo.com"
                  />
                </div>

                {/* Notas */}
                <div>
                  <label htmlFor="notas" className="block text-[10px] text-vintage-bronze font-serif font-bold uppercase tracking-widest mb-1.5">
                    Notas Especiales (Opcional)
                  </label>
                  <textarea
                    id="notas"
                    value={reserva.notas}
                    onChange={(e) => setReserva({ ...reserva, notas: e.target.value })}
                    rows={3}
                    className="w-full bg-[#150E09] border border-vintage-border text-vintage-cream px-3 py-2 text-sm focus:outline-none focus:border-vintage-gold resize-none"
                    placeholder="Ej. Prefiero corte con navaja libre / Cerveza de cortesía nacional, etc."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={cargando}
                    className="w-full py-4 bg-vintage-gold hover:bg-vintage-goldLight text-vintage-dark font-serif text-sm font-black uppercase tracking-widest transition-all duration-300 shadow-gold-sm flex justify-center items-center gap-2"
                  >
                    {cargando ? (
                      <span className="h-4 w-4 border-2 border-vintage-dark border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Receipt size={16} /> Emitir Boleto de Reserva
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Add-ons (Col 5) */}
              <div className="md:col-span-5 space-y-6">
                
                {/* Caja de productos adicionales */}
                <div className="bg-vintage-card border border-vintage-border p-5 shadow-lg">
                  <h5 className="font-serif font-bold text-vintage-gold text-sm uppercase tracking-wider mb-2 border-b border-vintage-border pb-2 flex items-center gap-1.5">
                    <Sparkles size={16} />
                    Ritual Adicional
                  </h5>
                  <p className="text-[10px] text-vintage-cream/60 leading-relaxed uppercase mb-4 tracking-wide font-serif">
                    Llévate tu estilo a casa. Selecciona pomadas o aceites y agrégalos a tu cita:
                  </p>

                  <div className="space-y-3">
                    {productosDisponibles.map(prod => {
                      const agregado = reserva.productos.some(p => p.id === prod.id);
                      return (
                        <div
                          key={prod.id}
                          onClick={() => handleToggleProducto(prod)}
                          className={`flex items-center justify-between p-3 border transition-all duration-200 cursor-pointer ${
                            agregado
                              ? 'border-vintage-gold bg-vintage-gold/10'
                              : 'border-vintage-border bg-[#150E09] hover:border-vintage-bronze'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="h-10 w-10 overflow-hidden border border-vintage-border bg-black shrink-0">
                              <img src={prod.foto} alt={prod.nombre} className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <h6 className="font-serif font-bold text-xs text-vintage-cream">{prod.nombre}</h6>
                              <span className="text-[10px] text-vintage-gold font-serif">${prod.precio.toFixed(2)}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className={`p-1.5 rounded-none ${
                              agregado
                                ? 'bg-vintage-gold text-vintage-dark'
                                : 'bg-transparent text-vintage-cream/60 border border-vintage-borderLight hover:border-vintage-gold'
                            }`}
                          >
                            {agregado ? <Check size={14} /> : <Plus size={14} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Resumen Fijo */}
                <div className="bg-vintage-card border border-vintage-border p-5 shadow-lg vintage-inner-border">
                  <h5 className="font-serif font-bold text-vintage-cream text-xs uppercase tracking-wider mb-3 pb-2 border-b border-vintage-border/50">
                    Resumen del Ritual
                  </h5>
                  <div className="space-y-2 text-xs font-serif leading-relaxed">
                    <div className="flex justify-between">
                      <span className="text-vintage-cream/60">Maestro Barbero:</span>
                      <span className="text-vintage-gold font-bold">{reserva.barbero?.nombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-vintage-cream/60">Servicio de Corte:</span>
                      <span className="text-vintage-cream font-semibold">{reserva.servicio?.nombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-vintage-cream/60">Precio Servicio:</span>
                      <span className="text-vintage-gold font-bold">${reserva.servicio?.precio.toFixed(2)}</span>
                    </div>

                    {reserva.productos.length > 0 && (
                      <div className="border-t border-vintage-border/40 pt-2 space-y-1">
                        <span className="text-[10px] text-vintage-bronze font-bold uppercase tracking-widest block">Productos Añadidos:</span>
                        {reserva.productos.map(p => (
                          <div key={p.id} className="flex justify-between text-[11px] font-sans">
                            <span className="text-vintage-cream/70">• {p.nombre}</span>
                            <span className="text-vintage-gold font-semibold">${p.precio.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="border-t border-vintage-border pt-3 flex justify-between items-center text-sm">
                      <span className="text-vintage-cream font-bold uppercase tracking-wider">Monto Estimado:</span>
                      <span className="text-vintage-gold text-xl font-serif font-black tracking-wider">
                        ${totalCita().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PASO 5: TICKET DE CONFIRMACIÓN VINTAGE */}
        {/* ======================================================== */}
        {paso === 5 && ticketConfirmado && (
          <div className="animate-[fadeIn_0.5s_ease-out] max-w-lg mx-auto print:mx-0 print:my-0 print:border-none print:shadow-none">
            
            {/* Mensaje de Felicitación (No Imprimible) */}
            <div className="text-center mb-8 print:hidden">
              <div className="h-16 w-16 bg-vintage-gold/20 border-2 border-vintage-gold flex items-center justify-center rounded-full mx-auto mb-4 animate-bounce">
                <Check size={32} className="text-vintage-gold" />
              </div>
              <h4 className="text-3xl font-serif font-bold text-vintage-cream uppercase tracking-wide">
                ¡Turno Asegurado!
              </h4>
              <p className="text-xs text-vintage-cream/70 mt-2 leading-relaxed">
                Tu cita ha sido guardada en los libros de registro. <br />
                Presenta el boleto físico o digital al llegar a la barbería.
              </p>
            </div>

            {/* Boleto de Corte Vintage (Tipo Recibo de Papel Roto) */}
            <div className="ticket-container p-8 border border-amber-900 rounded-none relative text-black">
              
              {/* Bordes dentados decorativos */}
              <div className="ticket-top-border"></div>
              <div className="ticket-bottom-border"></div>

              {/* Contenido del Ticket */}
              <div className="text-center font-serif mt-4">
                <h5 className="text-xl font-bold tracking-[0.2em]">EL IMPERIO</h5>
                <p className="text-[9px] tracking-widest text-vintage-burgundy uppercase font-semibold mt-0.5">
                  💈 Barbería Clásica & Club 💈
                </p>
                <p className="text-[8px] font-sans text-gray-500 uppercase mt-1 tracking-wider">
                  Carrera 12 #4-56 • Zarzal, Valle
                </p>
                <p className="text-[8px] font-sans text-gray-500 uppercase mt-0.5">
                  Tel: +57 315 555 1920
                </p>
              </div>

              {/* Divisor */}
              <div className="ticket-divider my-5"></div>

              {/* Detalles en Tipografía Monospace de Máquina de Escribir */}
              <div className="font-mono text-[11px] leading-loose space-y-1 pb-4">
                <div className="flex justify-between">
                  <span>REGISTRO ID:</span>
                  <span className="font-bold">{ticketConfirmado.id?.substring(0, 15).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>FECHA CITA:</span>
                  <span className="font-bold">{ticketConfirmado.fecha}</span>
                </div>
                <div className="flex justify-between">
                  <span>HORA CITA:</span>
                  <span className="font-bold">{ticketConfirmado.hora}</span>
                </div>
                <div className="flex justify-between">
                  <span>MAESTRO:</span>
                  <span className="font-bold">
                    {barberos.find(b => b.id === ticketConfirmado.barbero_id)?.nombre || 'BARBERO SELECCIONADO'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>CABALLERO:</span>
                  <span className="font-bold">{ticketConfirmado.cliente_nombre.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>TELÉFONO:</span>
                  <span className="font-bold">{ticketConfirmado.cliente_telefono}</span>
                </div>

                <div className="ticket-divider my-4"></div>

                <div className="flex justify-between font-bold text-xs">
                  <span>SERVICIO DE CORTE:</span>
                  <span>${reserva.servicio?.precio.toFixed(2)}</span>
                </div>
                <div className="text-[10px] text-gray-600 pl-4">
                  - {reserva.servicio?.nombre} ({reserva.servicio?.duracion} Min)
                </div>

                {ticketConfirmado.productos && ticketConfirmado.productos.length > 0 && (
                  <div className="space-y-1 pt-2">
                    <span className="font-bold">PRODUCTOS ADICIONALES:</span>
                    {ticketConfirmado.productos.map((p, idx) => (
                      <div key={idx} className="flex justify-between pl-4 text-[10px]">
                        <span>• {p.nombre}</span>
                        <span>${p.precio.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="ticket-divider my-4"></div>

                <div className="flex justify-between font-serif font-black text-sm border-t border-b border-gray-400 py-1.5 my-2 uppercase">
                  <span>TOTAL ESTIMADO:</span>
                  <span>
                    ${totalCita().toFixed(2)}
                  </span>
                </div>
                
                {ticketConfirmado.notas && (
                  <div className="bg-amber-100/60 p-2.5 border border-dashed border-amber-300 text-[10px] mt-3 font-sans italic text-gray-700 whitespace-pre-line">
                    <strong>Comentarios:</strong> "{ticketConfirmado.notas}"
                  </div>
                )}
              </div>

              {/* Código de barras simulado retro */}
              <div className="text-center font-mono tracking-[0.25em] text-sm text-gray-800 mt-6 select-none opacity-85">
                ||||||| | ||||| ||| | ||| ||||||
                <p className="text-[8px] font-sans text-gray-500 tracking-normal uppercase mt-1">
                  Gracias por tu confianza • Estilo Eterno
                </p>
              </div>

            </div>

            {/* Acciones del Boleto (No Imprimible) */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 print:hidden">
              <button
                onClick={handleImprimir}
                className="flex-1 py-3 border-2 border-vintage-gold bg-transparent text-vintage-gold hover:bg-vintage-gold hover:text-vintage-dark font-serif text-xs font-bold uppercase tracking-widest transition-all duration-300 flex justify-center items-center gap-1.5 shadow-gold-sm"
              >
                <Printer size={14} /> Imprimir Recibo
              </button>
              
              <button
                onClick={handleReiniciar}
                className="flex-1 py-3 border-2 border-vintage-borderLight bg-[#23170F] text-vintage-cream hover:bg-vintage-card font-serif text-xs font-semibold uppercase tracking-widest transition-all duration-300 text-center"
              >
                Nueva Reservación
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
