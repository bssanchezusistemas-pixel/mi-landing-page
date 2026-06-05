export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string; // e.g., 'S', 'M', 'L', 'XL', '38', '40', 'Única'
  color: string; // e.g., 'Negro', 'Beige', 'Blanco', 'Gris'
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  category_id: string;
  images: string[];
  is_featured: boolean;
  variants?: ProductVariant[];
  category?: Category;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_details: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_city: string;
  buyer_address: string;
  total_amount: number;
  status: string; // 'pendiente' | 'enviado' | 'entregado' | 'cancelado'
  created_at: string;
  items?: OrderItem[];
}

// 7 Required Categories
export const STATIC_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Camisetas Oversize', slug: 'camisetas-oversize' },
  { id: 'cat-2', name: 'Camisetas Estampadas', slug: 'camisetas-estampadas' },
  { id: 'cat-3', name: 'Gorras', slug: 'gorras' },
  { id: 'cat-4', name: 'Sneakers/Tenis', slug: 'sneakers-tenis' },
  { id: 'cat-5', name: 'Pantalones Cargo', slug: 'pantalones-cargo' },
  { id: 'cat-6', name: 'Hoodies', slug: 'hoodies' },
  { id: 'cat-7', name: 'Accesorios', slug: 'accesorios' },
];

// High-quality unsplash images matching the streetwear aesthetic (black, beige, white, urban)
const UNSPLASH_IMAGES = {
  'camisetas-oversize': [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=800&auto=format&fit=crop',
    '/gallery-1.jpg',
  ],
  'camisetas-estampadas': [
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop',
    '/gallery-2.jpg',
  ],
  'gorras': [
    'https://images.unsplash.com/photo-1534215754734-18e55d13ce35?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=800&auto=format&fit=crop',
  ],
  'sneakers-tenis': [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop',
  ],
  'pantalones-cargo': [
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
  ],
  'hoodies': [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop',
  ],
  'accesorios': [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509695507497-903c140c43b0?q=80&w=800&auto=format&fit=crop',
  ],
};

const BASE_DESCRIPTIONS = {
  'camisetas-oversize': 'Camiseta con corte oversized de alta densidad (Heavyweight Cotton - 240g/m²). Silueta recta, hombros caídos y cuello ajustado tipo rib de 3cm. Costura reforzada y lavado ácido premium. Perfecta para un outfit urbano relajado y minimalista.',
  'camisetas-estampadas': 'Camiseta streetwear estampada en serigrafía textil de alta definición en pecho y espalda. 100% algodón preencogido de 200g/m². Diseño streetwear exclusivo inspirado en el arte grunge urbano, graffitis y el espíritu callejero.',
  'gorras': 'Gorra estructurada premium con bordado frontal en alto relieve. Visera semicurva, cierre snapback ajustable y banda interna antisudor. Diseñada para complementar tu look urbano en cualquier momento del día.',
  'sneakers-tenis': 'Tenis urbanos premium con suela track de alta durabilidad y absorción de impacto. Combinación de cuero genuino, gamuza y malla transpirable. Cordones de algodón reforzado y detalles reflectivos en talón y lengüeta.',
  'pantalones-cargo': 'Pantalón cargo de corte baggy confeccionado en gabardina de alta resistencia. Cuenta con 6 bolsillos utilitarios (2 frontales, 2 traseros y 2 de fuelle laterales), ajustadores de correa en tobillo y costura de triple refuerzo.',
  'hoodies': 'Hoodie oversized térmico de algodón perchado pesado (Fleece - 350g/m²). Capucha de doble panel sin cordones para un aspecto limpio, bolsillo tipo canguro reforzado y puños acanalados anchos. Ideal para el clima frío de la calle.',
  'accesorios': 'Accesorio streetwear esencial con diseño táctico de alta gama. Cadena de acero inoxidable de eslabón cubano o bolso de hombro (shoulder bag) de cordura impermeable con cremalleras termoselladas y herrajes metálicos.',
};

// Programmatically generate 250 high quality streetwear products
const generateMockProducts = (): Product[] => {
  const productsList: Product[] = [];
  let idCounter = 1;

  STATIC_CATEGORIES.forEach((cat) => {
    const imagesList = UNSPLASH_IMAGES[cat.slug as keyof typeof UNSPLASH_IMAGES] || [];
    const description = BASE_DESCRIPTIONS[cat.slug as keyof typeof BASE_DESCRIPTIONS] || '';

    // Generate ~35 products per category to reach ~245 products total
    for (let pNum = 1; pNum <= 36; pNum++) {
      const id = `prod-${idCounter++}`;
      const name = getProductName(cat.slug, pNum);
      const slug = `${cat.slug}-${pNum}-${Math.random().toString(36).substr(2, 4)}`;
      const price = getProductPrice(cat.slug, pNum);
      
      // Select main and secondary image from our stock
      const prodImages = [
        imagesList[pNum % imagesList.length],
        imagesList[(pNum + 1) % imagesList.length],
      ];

      // Setup standard streetwear variants
      const variants: ProductVariant[] = [];
      const sizes = getSizesForCategory(cat.slug);
      const colors = ['Negro', 'Beige', 'Blanco', 'Gris Oscuro'];

      let vIdCounter = 1;
      sizes.forEach((size) => {
        colors.forEach((color) => {
          variants.push({
            id: `${id}-var-${vIdCounter++}`,
            product_id: id,
            size,
            color,
            stock: Math.floor(Math.random() * 25) + 5, // 5 to 30 items in stock
            sku: `PE-${cat.slug.slice(0, 3).toUpperCase()}-${pNum}-${size}-${color.slice(0, 3).toUpperCase()}`,
          });
        });
      });

      productsList.push({
        id,
        name,
        slug,
        description: `${description} Esta es la edición limitada #${pNum} de la colección actual de Pipe en la Calle.`,
        price,
        compare_at_price: pNum % 3 === 0 ? Math.floor(price * 1.25 / 1000) * 1000 : undefined,
        category_id: cat.id,
        images: prodImages,
        is_featured: pNum <= 3, // first 3 in each category are featured
        variants,
        category: cat,
      });
    }
  });

  return productsList;
};

// Helper to generate premium streetwear product names
const getProductName = (slug: string, num: number): string => {
  const numberStr = num < 10 ? `0${num}` : `${num}`;
  switch (slug) {
    case 'camisetas-oversize':
      const oversizedPrefixes = ['Tee Oversize "Gothic"', 'Tee Heavyweight "Retro"', 'Tee Acid Wash "Cyber"', 'Tee Minimalist "Core"', 'Tee Boxy "Industries"'];
      return `${oversizedPrefixes[num % oversizedPrefixes.length]} #${numberStr}`;
    case 'camisetas-estampadas':
      const printedPrefixes = ['Camiseta Graphic "Skull"', 'Camiseta "Tokyo Neon"', 'Camiseta Print "Flame"', 'Camiseta "Broken Heart"', 'Camiseta "Street Tag"'];
      return `${printedPrefixes[num % printedPrefixes.length]} #${numberStr}`;
    case 'gorras':
      const capPrefixes = ['Gorra Trucker "Street"', 'Snapback "Calle Classic"', 'Beanie "Ribbed Knit"', 'Dad Hat "Pipe Retro"'];
      return `${capPrefixes[num % capPrefixes.length]} #${numberStr}`;
    case 'sneakers-tenis':
      const shoePrefixes = ['Sneakers "Runner V1"', 'Sneakers "Chunk Platform"', 'Sneakers "Low-Top Desert"', 'Sneakers "Vortex Black"'];
      return `${shoePrefixes[num % shoePrefixes.length]} #${numberStr}`;
    case 'pantalones-cargo':
      const cargoPrefixes = ['Pantalón Cargo "Tactical"', 'Cargo Baggy "Utility"', 'Cargo Jogger "Streets"', 'Cargo Wide-Leg "Beige"'];
      return `${cargoPrefixes[num % cargoPrefixes.length]} #${numberStr}`;
    case 'hoodies':
      const hoodiePrefixes = ['Hoodie Heavyweight "Acid"', 'Hoodie Zip-Up "Script"', 'Hoodie Oversized "Core"', 'Hoodie Pullover "Dark"'];
      return `${hoodiePrefixes[num % hoodiePrefixes.length]} #${numberStr}`;
    case 'accesorios':
    default:
      const accPrefixes = ['Shoulder Bag "Utility"', 'Socks "Street Pack"', 'Cadena "Silver Cuban"', 'Cinturón "Industrial Belt"'];
      return `${accPrefixes[num % accPrefixes.length]} #${numberStr}`;
  }
};

// Generate pricing in Colombian Pesos (COP) for streetwear shop
const getProductPrice = (slug: string, num: number): number => {
  const base = num * 1234;
  switch (slug) {
    case 'camisetas-oversize':
    case 'camisetas-estampadas':
      return 85000 + (base % 35000); // 85k - 120k COP
    case 'gorras':
      return 55000 + (base % 25000); // 55k - 80k COP
    case 'sneakers-tenis':
      return 280000 + (base % 150000); // 280k - 430k COP
    case 'pantalones-cargo':
      return 145000 + (base % 45000); // 145k - 190k COP
    case 'hoodies':
      return 165000 + (base % 55000); // 165k - 220k COP
    case 'accesorios':
    default:
      return 35000 + (base % 45000); // 35k - 80k COP
  }
};

// Size selection based on category
const getSizesForCategory = (slug: string): string[] => {
  if (slug === 'sneakers-tenis') return ['38', '39', '40', '41', '42', '43'];
  if (slug === 'gorras' || slug === 'accesorios') return ['Única'];
  return ['S', 'M', 'L', 'XL'];
};

// DB class simulating Database operations locally using LocalStorage
class MockDatabase {
  private products: Product[] = [];
  private orders: Order[] = [];

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') {
      this.products = generateMockProducts();
      return;
    }

    const storedProducts = localStorage.getItem('pe_products');
    const storedOrders = localStorage.getItem('pe_orders');

    if (storedProducts) {
      try {
        this.products = JSON.parse(storedProducts);
      } catch {
        this.products = generateMockProducts();
        localStorage.setItem('pe_products', JSON.stringify(this.products));
      }
    } else {
      this.products = generateMockProducts();
      localStorage.setItem('pe_products', JSON.stringify(this.products));
    }

    if (storedOrders) {
      try {
        this.orders = JSON.parse(storedOrders);
      } catch {
        this.orders = [];
      }
    } else {
      this.orders = [];
      localStorage.setItem('pe_orders', JSON.stringify(this.orders));
    }
  }

  private persistProducts() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pe_products', JSON.stringify(this.products));
    }
  }

  private persistOrders() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pe_orders', JSON.stringify(this.orders));
    }
  }

  // Get list of categories
  getCategories(): Category[] {
    return STATIC_CATEGORIES;
  }

  // Search, filter, and sort products
  getProducts(filters: {
    search?: string;
    categorySlug?: string;
    size?: string;
    color?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Product[] {
    let list = [...this.products];

    // Filter by category
    if (filters.categorySlug) {
      const category = STATIC_CATEGORIES.find(c => c.slug === filters.categorySlug);
      if (category) {
        list = list.filter(p => p.category_id === category.id);
      }
    }

    // Filter by search term
    if (filters.search) {
      const term = filters.search.toLowerCase();
      list = list.filter(
        p => p.name.toLowerCase().includes(term) || 
             p.description.toLowerCase().includes(term)
      );
    }

    // Filter by size
    if (filters.size) {
      list = list.filter(p => 
        p.variants?.some(v => v.size === filters.size && v.stock > 0)
      );
    }

    // Filter by color
    if (filters.color) {
      list = list.filter(p => 
        p.variants?.some(v => v.color.toLowerCase() === filters.color?.toLowerCase() && v.stock > 0)
      );
    }

    // Filter by price range
    if (filters.minPrice !== undefined) {
      list = list.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      list = list.filter(p => p.price <= filters.maxPrice!);
    }

    // Sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'price-asc':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
        default:
          // Just keep original mock order which simulates newer additions
          break;
      }
    }

    return list;
  }

  // Fetch product by slug
  getProductBySlug(slug: string): Product | undefined {
    return this.products.find(p => p.slug === slug);
  }

  // Fetch product by ID
  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  // Create order and update stock
  createOrder(
    buyerData: Omit<Order, 'id' | 'created_at' | 'total_amount' | 'status'>,
    items: Array<{ productId: string; variantId: string; quantity: number }>
  ): Order | null {
    let total = 0;
    const orderItemsList: OrderItem[] = [];

    // Check stock availability and calculate total
    for (const item of items) {
      const product = this.getProductById(item.productId);
      if (!product) return null;
      
      const variant = product.variants?.find(v => v.id === item.variantId);
      if (!variant || variant.stock < item.quantity) return null;

      total += product.price * item.quantity;
    }

    // Generate Order
    const newOrderId = `order-${Date.now()}`;
    
    // Deduct stock and compile items
    for (const item of items) {
      const product = this.getProductById(item.productId)!;
      const variant = product.variants!.find(v => v.id === item.variantId)!;
      
      variant.stock -= item.quantity;

      orderItemsList.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        order_id: newOrderId,
        product_id: product.id,
        variant_id: variant.id,
        product_name: product.name,
        variant_details: `Talla: ${variant.size}, Color: ${variant.color}`,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const newOrder: Order = {
      id: newOrderId,
      buyer_name: buyerData.buyer_name,
      buyer_phone: buyerData.buyer_phone,
      buyer_city: buyerData.buyer_city,
      buyer_address: buyerData.buyer_address,
      total_amount: total,
      status: 'pendiente',
      created_at: new Date().toISOString(),
      items: orderItemsList,
    };

    this.orders.unshift(newOrder);
    this.persistProducts();
    this.persistOrders();
    return newOrder;
  }

  // Update stock of variant (Admin tool)
  updateStock(variantId: string, newStock: number): boolean {
    let updated = false;
    this.products.forEach((p) => {
      p.variants?.forEach((v) => {
        if (v.id === variantId) {
          v.stock = Math.max(0, newStock);
          updated = true;
        }
      });
    });

    if (updated) {
      this.persistProducts();
    }
    return updated;
  }

  // Update product details (Admin tool)
  updateProductPrice(productId: string, newPrice: number): boolean {
    const product = this.getProductById(productId);
    if (product) {
      product.price = Math.max(0, newPrice);
      this.persistProducts();
      return true;
    }
    return false;
  }

  // Fetch all orders (Admin tool)
  getOrders(): Order[] {
    return this.orders;
  }

  // Update order status (Admin tool)
  updateOrderStatus(orderId: string, status: string): boolean {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      this.persistOrders();
      return true;
    }
    return false;
  }
}

export const db = new MockDatabase();
