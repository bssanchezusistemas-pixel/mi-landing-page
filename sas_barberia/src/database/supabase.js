import { createClient } from '@supabase/supabase-js';
import { barberosMock, serviciosMock, productosMock } from './mockData';

// Obtener credenciales de variables de entorno de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verificar si las credenciales son válidas
const isSupabaseConfigured = 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '' && 
  supabaseUrl.startsWith('https://');

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// ==========================================
// MÓDULO DE FALLBACK A LOCALSTORAGE (MOCK)
// ==========================================

const initLocalDatabase = () => {
  if (!localStorage.getItem('barberia_barberos')) {
    localStorage.setItem('barberia_barberos', JSON.stringify(barberosMock));
  }
  if (!localStorage.getItem('barberia_servicios')) {
    localStorage.setItem('barberia_servicios', JSON.stringify(serviciosMock));
  }
  if (!localStorage.getItem('barberia_productos')) {
    localStorage.setItem('barberia_productos', JSON.stringify(productosMock));
  }
  if (!localStorage.getItem('barberia_citas')) {
    localStorage.setItem('barberia_citas', JSON.stringify([]));
  }
};

// Inicializar DB Local de inmediato
initLocalDatabase();

// ==========================================
// FUNCIONES DE CONTROL DE BASE DE DATOS
// ==========================================

export const dbService = {
  // Comprobar estado de conexión
  isUsingSupabase: () => isSupabaseConfigured,
  
  getSupabaseConfig: () => ({
    url: supabaseUrl,
    key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : ''
  }),

  // OBTENER BARBEROS
  getBarberos: async () => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('barberos')
          .select('*')
          .order('nombre');
        if (!error && data && data.length > 0) return data;
        console.warn('Tablas no encontradas en Supabase. Usando fallback local.');
      } catch (e) {
        console.error('Error al conectar con Supabase en getBarberos:', e);
      }
    }
    return JSON.parse(localStorage.getItem('barberia_barberos'));
  },

  // OBTENER SERVICIOS
  getServicios: async () => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('servicios')
          .select('*')
          .order('precio');
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.error('Error al conectar con Supabase en getServicios:', e);
      }
    }
    return JSON.parse(localStorage.getItem('barberia_servicios'));
  },

  // OBTENER PRODUCTOS
  getProductos: async () => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .order('nombre');
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.error('Error al conectar con Supabase en getProductos:', e);
      }
    }
    return JSON.parse(localStorage.getItem('barberia_productos'));
  },

  // OBTENER CITAS
  getCitas: async () => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('citas')
          .select('*, barbero:barberos(*), servicio:servicios(*)')
          .order('fecha', { ascending: true })
          .order('hora', { ascending: true });
        if (!error) return data;
      } catch (e) {
        console.error('Error al conectar con Supabase en getCitas:', e);
      }
    }
    
    // Para LocalStorage hacemos una emulación del "join"
    const citas = JSON.parse(localStorage.getItem('barberia_citas')) || [];
    const barberos = JSON.parse(localStorage.getItem('barberia_barberos')) || [];
    const servicios = JSON.parse(localStorage.getItem('barberia_servicios')) || [];
    
    return citas.map(cita => ({
      ...cita,
      barbero: barberos.find(b => b.id === cita.barbero_id) || { nombre: 'Desconocido' },
      servicio: servicios.find(s => s.id === cita.servicio_id) || { nombre: 'Desconocido', precio: 0, duracion: 0 }
    }));
  },

  // CREAR CITA
  crearCita: async (citaInput) => {
    const nuevaCita = {
      id: citaInput.id || `cita_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      barbero_id: citaInput.barbero_id,
      servicio_id: citaInput.servicio_id,
      fecha: citaInput.fecha,
      hora: citaInput.hora,
      cliente_nombre: citaInput.cliente_nombre,
      cliente_telefono: citaInput.cliente_telefono,
      cliente_email: citaInput.cliente_email || '',
      notas: citaInput.notas || '',
      productos: citaInput.productos || [], // Array de productos comprados en la cita
      estado: citaInput.estado || 'pendiente',
      creado_a: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        // En Supabase guardamos la cita. Supabase ignorará o almacenará el JSON de productos si la columna lo permite.
        const { data, error } = await supabase
          .from('citas')
          .insert([nuevaCita])
          .select();
        if (!error) return { success: true, data: data[0] };
        console.error('Error al insertar cita en Supabase:', error);
      } catch (e) {
        console.error('Error al conectar con Supabase en crearCita:', e);
      }
    }

    // Fallback LocalStorage
    const citas = JSON.parse(localStorage.getItem('barberia_citas')) || [];
    citas.push(nuevaCita);
    localStorage.setItem('barberia_citas', JSON.stringify(citas));
    return { success: true, data: nuevaCita };
  },

  // ACTUALIZAR ESTADO DE CITA
  actualizarEstadoCita: async (citaId, nuevoEstado) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('citas')
          .update({ estado: nuevoEstado })
          .eq('id', citaId)
          .select();
        if (!error) return { success: true, data: data[0] };
        console.error('Error al actualizar estado en Supabase:', error);
      } catch (e) {
        console.error('Error al conectar con Supabase en actualizarEstadoCita:', e);
      }
    }

    // Fallback LocalStorage
    const citas = JSON.parse(localStorage.getItem('barberia_citas')) || [];
    const index = citas.findIndex(c => c.id === citaId);
    if (index !== -1) {
      citas[index].estado = nuevoEstado;
      localStorage.setItem('barberia_citas', JSON.stringify(citas));
      return { success: true, data: citas[index] };
    }
    return { success: false, error: 'Cita no encontrada' };
  },

  // REINICIAR BASE DE DATOS LOCAL A VALORES DE MOCK
  resetLocalDb: () => {
    localStorage.removeItem('barberia_barberos');
    localStorage.removeItem('barberia_servicios');
    localStorage.removeItem('barberia_productos');
    localStorage.removeItem('barberia_citas');
    initLocalDatabase();
    window.location.reload();
  }
};
