# Kit de automatizaciones n8n para Cursor

## Requisitos

1. **Cursor** instalado
2. **Node.js** LTS (https://nodejs.org)
3. **Instancia de n8n** (opcional pero recomendado)

## Paso 1 — Abrir el proyecto

Abre esta carpeta en Cursor. La skill y el MCP ya están en `.cursor/`.

## Paso 2 — Configurar n8n

```bash
cp .env.example .env
```

Edita `.env` con tu API key de n8n:

- **N8N_API_KEY** — Settings → API → Create API Key

Para **n8n local** (puerto 5678), el MCP ya apunta a:

`http://localhost:5678/mcp-server/http`

Exporta la variable para que Cursor la lea (el MCP HTTP no usa `envFile`):

```bash
export N8N_API_KEY="tu_api_key"
```

O en Windows (PowerShell): `$env:N8N_API_KEY="tu_api_key"`

Recarga Cursor: **Command Palette → Developer: Reload Window**.

Verifica en **Settings → Tools & MCP** que el servidor `n8n` aparece en verde.

### Probar conexión en tu máquina

```bash
curl -s http://localhost:5678/healthz
curl -s http://localhost:5678/mcp-server/http \
  -H "Authorization: Bearer TU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1,"params":{}}'
```

> **Nota:** `localhost` solo funciona en tu PC. Un agente en la nube no puede conectarse a tu n8n local.

## Paso 3 — Usar la skill

En el chat del agente, escribe por ejemplo:

> "Quiero automatizar Instagram: cuando llegue un DM, consultar Supabase y responder con un LLM"

O invoca la skill directamente:

> `/automatizaciones-n8n`

El agente puede:

1. Instalar dependencias MCP (`n8n-mcp`) y skills auxiliares si faltan
2. Conectar con tu n8n vía `.env`
3. Diseñar y crear workflows (con tu confirmación)
4. Generar JSON para importar si trabajas offline
5. Documentar el flujo en HTML

## Estructura

```
.cursor/
├── mcp.json                              # MCP de n8n (usa variables de .env)
└── skills/
    └── automatizaciones-n8n/
        └── SKILL.md                      # Skill principal
.env.example                              # Plantilla de credenciales
kit-automatizaciones-n8n/
└── INSTRUCCIONES.md                      # Este archivo
workflows/                                # JSONs y docs generados (al usar la skill)
```

## Sin n8n local

Puedes arrancar n8n en tu máquina:

```bash
npx n8n
```

Abre http://localhost:5678 y usa esa URL en `.env`.

## Seguridad

- La API key solo vive en `.env` (ignorado por git)
- No pegues keys en el chat ni en archivos versionados
- Rota la key si se expuso accidentalmente
