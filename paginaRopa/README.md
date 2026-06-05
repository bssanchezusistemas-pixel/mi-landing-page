# Pipe en la Calle — Streetwear Online Store

Tienda online premium para **Pipe en la Calle**. Construida con Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion y soporte para Supabase.

## Stack tecnológico

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Animaciones:** Framer Motion 12
- **Icons:** Lucide React
- **Base de datos:** Supabase (opcional) / LocalStorage fallback
- **Deploy:** Vercel

---

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Home con hero de video scroll-expandible |
| `/catalog` | Catálogo con búsqueda y filtros en tiempo real |
| `/product/[id]` | Detalle de producto con variantes talla/color |
| `/cart` | Carrito + checkout por WhatsApp |
| `/admin` | Panel administrativo protegido |

---

## Deploy en Vercel (paso a paso)

### Opción A — Desde el dashboard de Vercel (recomendado)

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio de GitHub
3. En **"Root Directory"** escribe: `paginaRopa`
4. Vercel detecta automáticamente que es Next.js
5. Haz clic en **"Deploy"**

> ⚠️ El paso 3 es clave. Si no configuras el Root Directory, el deploy fallará.

### Opción B — Desde la CLI de Vercel

```bash
# Dentro de la carpeta paginaRopa
cd paginaRopa

# Login (si no lo has hecho)
vercel login

# Deploy (primera vez — configura el proyecto)
vercel

# Deploy a producción
vercel --prod
```

Cuando la CLI pregunte, responde:
- **Set up and deploy?** → `Y`
- **Which scope?** → Tu cuenta/organización
- **Link to existing project?** → `N` (es un proyecto nuevo)
- **Project name?** → `pipe-en-la-calle`
- **In which directory is your code located?** → `./` (ya estás dentro de paginaRopa)

---

## Variables de entorno (opcionales)

La tienda funciona sin Supabase usando LocalStorage del navegador.
Para conectar la base de datos real, configura en Vercel Dashboard → Settings → Environment Variables:

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública anon de Supabase |

Copia `.env.example` como `.env.local` para desarrollo local.

---

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev
# → http://localhost:3000

# Build de producción (verificación)
npm run build
```

## Admin Panel

Ruta: `/admin`  
Contraseñas de acceso: `admin123` o `pipecalle2026`

---

## Contacto / WhatsApp checkout

El checkout genera automáticamente un mensaje de WhatsApp al número **+57 315 464 7189** con el resumen del pedido.
