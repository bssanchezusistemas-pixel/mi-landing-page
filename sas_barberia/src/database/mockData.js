export const barberosMock = [
  {
    id: '1',
    nombre: 'Alex "The Blade"',
    especialidad: 'Master Fade & Beards',
    foto: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4.9,
    opiniones: 124,
    bio: 'Especialista en degradados modernos y esculpido de barba con navaja clásica. Combina precisión quirúrgica con el arte tradicional de la barbería.'
  },
  {
    id: '2',
    nombre: 'Carlos "Vintage"',
    especialidad: 'Classic Cuts & Shaves',
    foto: 'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4.8,
    opiniones: 98,
    bio: 'Amante de la estética de los años 50. Experto en afeitado de toalla caliente tradicional, cortes Pompadour y revivir el estilo de los caballeros de época.'
  },
  {
    id: '3',
    nombre: 'Marcus "Whiskey"',
    especialidad: 'Beard Grooming & Styling',
    foto: 'https://images.pexels.com/photos/1453008/pexels-photo-1453008.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5.0,
    opiniones: 86,
    bio: 'El maestro del cuidado de la barba. Mezcla técnicas clásicas con aceites esenciales artesanales para ofrecer una experiencia de relajación total.'
  }
];

export const serviciosMock = [
  {
    id: 's1',
    nombre: 'Corte Clásico Caballero',
    duracion: 35,
    precio: 22.00,
    descripcion: 'Corte tradicional realizado con tijera y máquina, lavado premium con tónico refrescante y peinado final con pomada artesanal.'
  },
  {
    id: 's2',
    nombre: 'Afeitado Imperial Navaja',
    duracion: 30,
    precio: 18.00,
    descripcion: 'Experiencia tradicional con toallas calientes al vapor, espuma de afeitar batida a brocha, afeitado a navaja libre y bálsamo hidratante.'
  },
  {
    id: 's3',
    nombre: 'Arreglo de Barba Royale',
    duracion: 25,
    precio: 15.00,
    descripcion: 'Recorte detallado de barba y bigote, delineado preciso con navaja libre, masaje facial y aplicación de aceites de madera de cedro.'
  },
  {
    id: 's4',
    nombre: 'Combo Imperial Club',
    duracion: 60,
    precio: 32.00,
    descripcion: 'Nuestro servicio insignia. Incluye Corte Clásico Caballero, Afeitado Imperial o Arreglo de Barba, lavado de cabello premium y una bebida de cortesía.'
  }
];

export const productosMock = [
  {
    id: 'p1',
    nombre: 'Pomada Fijación Fuerte "1920"',
    precio: 18.00,
    foto: 'https://images.pexels.com/photos/3998418/pexels-photo-3998418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    descripcion: 'Pomada a base de agua con fijación firme durante todo el día y brillo medio. Aroma clásico a sándalo y madera.',
    categoria: 'Fijación',
    stock: 15
  },
  {
    id: 'p2',
    nombre: 'Aceite de Barba "Royal Oak"',
    precio: 22.00,
    foto: 'https://images.pexels.com/photos/4046316/pexels-photo-4046316.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    descripcion: 'Hidratación profunda para la piel y suavizado de vello facial. Con aceites de argán, jojoba y esencia de cedro noble.',
    categoria: 'Cuidado',
    stock: 10
  },
  {
    id: 'p3',
    nombre: 'Jabón de Afeitar Vintage Cup',
    precio: 15.00,
    foto: 'https://images.pexels.com/photos/4210339/pexels-photo-4210339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    descripcion: 'Jabón de afeitar tradicional que genera una espuma cremosa y rica. Diseñado para usar con brocha, protegiendo pieles sensibles.',
    categoria: 'Afeitado',
    stock: 8
  },
  {
    id: 'p4',
    nombre: 'Brocha de Afeitar de Tejón',
    precio: 28.00,
    foto: 'https://images.pexels.com/photos/8468065/pexels-photo-8468065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    descripcion: 'Brocha clásica con mango de madera curada y cerdas suaves de pelo de tejón sintético premium para una exfoliación perfecta.',
    categoria: 'Accesorios',
    stock: 5
  }
];

export const fotosInstagramMock = [
  { id: 1, url: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=600', corte: 'Classic Executive Pompadour' },
  { id: 2, url: 'https://images.pexels.com/photos/2805870/pexels-photo-2805870.jpeg?auto=compress&cs=tinysrgb&w=600', corte: 'Mid Skin Fade + Beard Shaping' },
  { id: 3, url: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=600', corte: 'Razor Edge Taper Fade' },
  { id: 4, url: 'https://images.pexels.com/photos/3998429/pexels-photo-3998429.jpeg?auto=compress&cs=tinysrgb&w=600', corte: 'Beard Trim & Hot Towel Shave' },
  { id: 5, url: 'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=600', corte: 'High & Tight Vintage Military' },
  { id: 6, url: 'https://images.pexels.com/photos/3998418/pexels-photo-3998418.jpeg?auto=compress&cs=tinysrgb&w=600', corte: 'Classic Side Part & Styling' },
  { id: 7, url: 'https://images.pexels.com/photos/4210339/pexels-photo-4210339.jpeg?auto=compress&cs=tinysrgb&w=600', corte: 'Clean Shave & Facial Hydration' },
  { id: 8, url: 'https://images.pexels.com/photos/8468065/pexels-photo-8468065.jpeg?auto=compress&cs=tinysrgb&w=600', corte: 'Scissor Cut Texturized' }
];
