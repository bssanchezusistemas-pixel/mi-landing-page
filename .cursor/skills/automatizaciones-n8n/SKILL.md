---
name: automatizaciones-n8n
description: "Crea, revisa y gestiona workflows de automatización en n8n. Conecta con tu instancia de n8n para crear workflows directamente, revisar los existentes, y automatizar cualquier proceso de negocio. Usa esta skill cuando el usuario quiera automatizar procesos, crear workflows en n8n, revisar automatizaciones existentes, conectar herramientas, o cualquier cosa relacionada con n8n. Triggers: 'automatiza esto', 'workflow de n8n', 'automatización', 'conectar herramientas', 'automatizar emails/leads/redes', 'revisa mis workflows', 'crea una automatización', 'n8n'."
---

# Automatizaciones n8n (Cursor)

Creas workflows de automatización profesionales en n8n. Puedes conectarte a la instancia del usuario para crear workflows directamente, revisar los existentes, y generar documentación visual.

**Regla fundamental: pregunta antes de ejecutar.** No crees ni modifiques workflows en la instancia del usuario sin su confirmación explícita.

**Plataforma:** Cursor (no Claude Code). Usa `.cursor/mcp.json`, `.cursor/skills/` y recarga la ventana tras cambios de MCP.

---

## Paso 0 — Verificar e instalar dependencias

Antes de empezar, verifica que el MCP de n8n y las skills auxiliares están disponibles. Si no lo están, instálalos automáticamente.

### Verificar MCP n8n

Comprueba si las herramientas del MCP de n8n están disponibles (busca tools como `get_node`, `search_nodes`, `list_workflows`, etc.). Si no están:

> "Para trabajar con n8n necesito instalar un par de cosas. Dame un momento (30-60 segundos la primera vez)."

```bash
node --version 2>/dev/null || echo "NO_NODE"
```

Si no hay Node.js, indica al usuario que instale la versión LTS desde https://nodejs.org. Sin Node.js solo puedes generar JSONs importables (modo offline).

Configura el MCP del proyecto en `.cursor/mcp.json` (ya incluido). Este kit usa el **MCP nativo de n8n**:

- URL: `http://localhost:5678/mcp-server/http`
- Auth: `Authorization: Bearer` + API key

La API key va en variable de entorno `N8N_API_KEY` (nunca en el repo):

```bash
cp .env.example .env
export N8N_API_KEY="tu_api_key"   # el MCP HTTP no lee .env automáticamente
```

Tras configurar, pide **recargar la ventana de Cursor** (Command Palette → "Developer: Reload Window").

**Importante:** `localhost` solo es accesible en la máquina del usuario. Un Cloud Agent remoto no puede conectarse a su n8n local.

### Verificar skills de n8n

Comprueba si las skills auxiliares de n8n están instaladas (`n8n-expression-syntax`, `n8n-workflow-patterns`, etc.) en `.cursor/skills/`. Si no:

```bash
git clone --depth 1 https://github.com/czlonkowski/n8n-skills.git /tmp/n8n-skills
mkdir -p .cursor/skills
cp -r /tmp/n8n-skills/skills/* .cursor/skills/
rm -rf /tmp/n8n-skills
```

Cada skill copiada debe tener su carpeta con `SKILL.md` dentro de `.cursor/skills/`.

---

## Paso 1 — Conectar con n8n (opcional pero recomendado)

Pregunta al usuario si tiene una instancia de n8n y quiere conectarla:

> "¿Tienes una instancia de n8n funcionando? Si me das la URL y tu API key, puedo:
> - Crear workflows directamente en tu n8n
> - Revisar y mejorar tus workflows existentes
> - Ver qué credenciales tienes configuradas
>
> Si no tienes n8n o prefieres no conectarlo, puedo generar los workflows como archivo JSON para que los importes manualmente.
>
> **¿Tu URL de n8n?** (ej: https://mi-n8n.dominio.com o http://localhost:5678)
> **¿Tu API key?** (Settings → API → Create API Key en tu n8n)"

Si el usuario proporciona URL + API key:

1. Escribe los valores en `.env` (no en `.cursor/mcp.json` ni en commits):

```env
N8N_API_URL=https://tu-n8n.dominio.com/api/v1
N8N_API_KEY=tu_api_key
N8N_WEBHOOK_URL=https://tu-n8n.dominio.com
```

2. Pide recargar la ventana de Cursor.

3. Una vez conectado, verifica listando los workflows existentes con el MCP.

**Si el usuario no quiere conectar n8n:** trabaja en modo offline — genera JSONs importables y documentación.

---

## Paso 2 — Entender qué automatizar

### Si el usuario tiene n8n conectado

Primero explora lo que ya tiene:

- Lista sus workflows existentes
- Revisa las credenciales configuradas (indica qué herramientas usa)
- Pregunta qué quiere mejorar, crear, o qué procesos manuales tiene

### Si trabaja desde cero

Pregunta:

- **¿Qué quieres automatizar?** — describe el proceso manual actual
- **¿Qué herramientas usas?** — Gmail, Google Sheets, Slack, Notion, CRM, Stripe, WhatsApp, Instagram, WordPress, etc.
- **¿Cuál es el disparador?** — email, formulario, cron, pago, DM de Instagram, etc.
- **¿Qué debe pasar paso a paso?** — el flujo completo

Si el usuario no sabe qué automatizar, proponle ideas según su negocio:

**Agencias / consultorías:** leads → CRM + email + Slack; follow-up a 3 días; onboarding tras pago.

**Ecommerce:** pedido → stock + email; review negativa → alerta; carrito abandonado → recordatorio.

**Creadores:** calendario en Sheets → publicar en redes; nuevo suscriptor → bienvenida + lista.

**Redes sociales (Instagram):** DM entrante → consulta BD → LLM → respuesta (respetar políticas Meta: ventana 24 h, aviso de bot, escalación humana).

---

## Paso 3 — Diseñar y crear el workflow

### Usa las herramientas del MCP

Si el MCP de n8n está disponible, úsalo para:

- **Buscar nodos** (`search_nodes`)
- **Consultar documentación** de cada nodo (`get_node`)
- **Buscar templates** (`search_templates`)
- **Validar** el workflow antes de crearlo

### Usa las skills auxiliares de n8n

Si están instaladas en `.cursor/skills/`, aplícalas:

- **n8n-expression-syntax** — expresiones (`{{ $json.field }}`)
- **n8n-workflow-patterns** — patrones arquitectónicos
- **n8n-node-configuration** — configuración de nodos
- **n8n-validation-expert** — errores de validación
- **n8n-code-javascript** / **n8n-code-python** — nodos de código

### Crear el workflow

**Con n8n conectado:** crea el workflow en su instancia vía API. Muestra el resultado y pregunta si quiere activarlo.

**Sin n8n conectado:** genera `workflows/workflow-[nombre].json` válido para importar.

En ambos casos:

- Nodos de izquierda a derecha (~250 px entre nodos)
- Nombres descriptivos (no "HTTP Request" sino "Obtener datos del lead")
- Sticky notes en partes clave
- Manejo de errores (Error Trigger + notificación)

---

## Paso 4 — Documentar el workflow

Genera documentación visual en `workflows/docs/[nombre].html`:

1. Nombre y descripción
2. Diagrama del flujo (HTML/CSS, cajas y flechas)
3. Configuración paso a paso por nodo
4. Credenciales necesarias
5. Datos de ejemplo (entrada/salida)
6. Cómo importar en n8n (si es JSON)

---

## Paso 5 — Revisar workflows existentes

Si el usuario pide revisar un workflow:

1. Léelo desde su instancia
2. Analiza: nodos, expresiones, errores, eficiencia, seguridad (keys en texto plano, webhooks sin auth)
3. Propón mejoras concretas
4. Si acepta, aplica los cambios

---

## Paso 6 — Presentar el resultado

Muestra:

1. Nombre del workflow creado o modificado
2. Diagrama resumido (texto)
3. Credenciales a configurar
4. Si está conectado: enlace al workflow en n8n
5. Si es JSON: ruta del archivo + instrucciones de importación
6. Documentación generada
7. Pregunta si quiere ajustar algo

No muestres precios sugeridos ni consejos de venta.
