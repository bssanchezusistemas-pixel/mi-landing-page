# TODO - Integración Cinematic Scroll + Branding Gourmet (Flavor House)

## Paso 1: Diagnóstico y plan
- [x] Inspeccionar estructura actual: `index.html`, `css/style.css`, `js/main.js`, `vercel.json`.
- [x] Confirmar que el componente provisto es Next.js/Framer Motion (TSX) y requiere migración.
- [x] Aceptar migración a Next.js **App Router**.

## Paso 2: Preparación del proyecto Next.js
- [ ] Crear/instalar Next.js (App Router) en el repo existente.
- [ ] Generar `package.json`, `next.config.js` y estructura `app/`.

## Paso 3: Integración del layout
- [ ] Crear `app/layout.tsx` con `<head>`/fuentes y wrapper global.
- [ ] Crear `app/globals.css` integrando/ajustando el CSS actual.
- [ ] Convertir `index.html` a `app/page.tsx` manteniendo secciones y reemplazando el hero.

## Paso 4: Integrar componente cinematográfico
- [ ] Crear `components/ui/scroll-expansion-hero.tsx` (con el TSX provisto, corrigiendo imports y fragmentos incompletos).
- [ ] Crear/ajustar el hero de restaurante (reemplazo de Branding: texto, imágenes) con props.
- [ ] Optimizar animaciones y respetar `prefers-reduced-motion`.

## Paso 5: Migrar lógica de scroll/interacciones
- [ ] Reemplazar `js/main.js` por un componente cliente en Next (ej. `components/ScrollEffects.tsx`) o hooks.
- [ ] Verificar que no colisiona con animaciones del hero cinematográfico.
- [ ] Asegurar responsiveness.

## Paso 6: Dependencias y limpieza
- [ ] Instalar dependencias: `framer-motion`, `lucide-react`.
- [ ] Revisar y eliminar scripts/archivos que ya no apliquen.

## Paso 7: Producción y despliegue (Vercel)
- [ ] Ajustar `vercel.json` para Next.
- [ ] Ejecutar `npm run build`.
- [ ] Verificar build sin errores y listo para Vercel.

