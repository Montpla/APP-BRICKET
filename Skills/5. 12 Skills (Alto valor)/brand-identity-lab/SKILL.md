---
name: brand-identity-lab
description: Diseña una identidad de marca completa: naming, posicionamiento, paleta de colores, tipografías, tono de voz, moodboard conceptual y guidelines. Usar cuando el usuario pida "ayúdame con la marca", "branding", "identidad visual", "nombre para mi proyecto", "tono de voz", "guía de estilo" o esté lanzando un producto y necesite diferenciación. Entrega un brandbook en Markdown + tokens CSS.
---

# Brand Identity Lab

Marca que vende, no marca que gusta al founder. Construye identidades desde el posicionamiento, no desde el Pinterest.

## Principio

La marca no son los colores. La marca es **la respuesta a "¿qué pasa en la cabeza del cliente cuando oye tu nombre?"**. Diseñamos de dentro hacia afuera: primero posicionamiento, luego verbal, luego visual.

## Fases

### Fase 1 — Posicionamiento (verbal)

Llena esta matriz con el usuario:

| Bloque | Pregunta | Ejemplo |
|---|---|---|
| Categoría | ¿En qué mercado compites? | CRMs para equipos remotos |
| Enemigo | ¿Qué hábito o competidor matas? | Excel + Slack para ventas |
| Audiencia | ¿Quién eres tú para tu cliente? | El copiloto del founder solitario |
| Promesa | ¿Qué transformación prometes? | Cerrar la primera venta en 7 días |
| Mecanismo | ¿Por qué tú lo consigues y otros no? | IA entrenada con 10.000 llamadas reales |
| Prueba | ¿Qué te da credibilidad ahora? | 3 founders lo usaron y facturaron X |

De ahí sale el **statement de posicionamiento**:

> Para [audiencia] que [problema], [marca] es el [categoría] que [promesa] gracias a [mecanismo]. A diferencia de [enemigo], nosotros [diferenciador].

### Fase 2 — Naming

Criterios obligatorios:
- Pronunciable por un no nativo en <2 intentos
- .com o .ai disponible (o variante clara)
- No colisiona con marca registrada (búsqueda EUIPO/USPTO rápida)
- Búsqueda en Google con <10M resultados del término
- Usernames disponibles en Twitter/X, Instagram, LinkedIn

Entrega **12 nombres** clasificados por tipo:
1. **Descriptivos** (Formstack, Mailchimp): claros, SEO-friendly, poco memorables
2. **Evocativos** (Stripe, Notion, Linear): sugieren sensación, fáciles de marca
3. **Inventados** (Xero, Zapier): sin significado, huecos legales libres
4. **Acrónimos/portmanteaus** (Intercom, Dropbox): combinan conceptos

Para cada uno: dominio sugerido, pronunciación, connotaciones, risk-check legal básico.

### Fase 3 — Tono de voz

Define 4 ejes, cada uno en escala 1-5:

- **Formal 1 ←→ 5 Coloquial**
- **Serio 1 ←→ 5 Humorístico**
- **Respetuoso 1 ←→ 5 Irreverente**
- **Técnico 1 ←→ 5 Divulgativo**

Entrega:
- 3 principios de voz ("Siempre hablamos como..., nunca como...")
- 10 palabras del vocabulario (sí)
- 10 palabras prohibidas (no)
- Ejemplos "Antes vs Después" en 3 contextos: landing, email de onboarding, error 404

### Fase 4 — Sistema visual

**Paleta**: 1 color primario + 1 acento + 5 neutros + 4 de estado (success/warning/error/info). Siempre con versiones dark/light y ratios de contraste WCAG AA.

**Tipografía**: Máximo 2 familias. Usa Google Fonts o pares probados:
- Serif + Sans: Fraunces + Inter, Playfair + Source Sans
- Sans moderno: Inter + Geist Mono, Satoshi + JetBrains Mono
- Editorial: GT Walsheim, PP Editorial New, Söhne

**Escala tipográfica**: basada en ratio (1.125 / 1.25 / 1.333). Entrega tokens.

**Espaciado**: escala 4px (4, 8, 12, 16, 24, 32, 48, 64, 96).

**Iconografía**: una sola familia (Lucide, Heroicons, Phosphor). Nunca mezclar.

**Estilo de imagen**: fotografía / ilustración / 3D / abstracto. Elige UNO y mantenlo.

### Fase 5 — Entregables

Genera estos archivos en la carpeta `brand/`:

#### `brandbook.md`
```markdown
# [Marca]
## Posicionamiento
[Statement]

## Misión, visión, valores
...

## Tono de voz
- Principios
- Vocabulario sí/no
- Ejemplos

## Sistema visual
- Paleta con HEX, RGB, HSL
- Tipografía y escala
- Espaciado
- Usos correctos e incorrectos del logo
```

#### `tokens.css`
```css
:root {
  /* Colors */
  --color-primary-50: #f5f3ff;
  --color-primary-500: #6366f1;
  --color-primary-900: #1e1b4b;

  --color-neutral-0: #ffffff;
  --color-neutral-950: #0a0a0a;

  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Typography */
  --font-display: "Fraunces", serif;
  --font-body: "Inter", sans-serif;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}

[data-theme="dark"] {
  --color-neutral-0: #0a0a0a;
  --color-neutral-950: #ffffff;
}
```

#### `tailwind.config.ts` (fragmento)
Genera el config con los tokens mapeados.

#### `logo-concepts.md`
3 direcciones conceptuales descritas en prosa (no generamos imágenes). Cada dirección:
- Concepto central
- Referencias (marcas existentes que resuelven parecido)
- Briefing para el diseñador o para generarlo con Midjourney/DALL-E

## Anti-patrones

- Paletas con 12 colores primarios
- Usar Comic Sans, Papyrus, o cualquier default de Word
- Logo con degradado + sombra + trazo + 5 colores
- Tagline de más de 8 palabras
- Tono "disruptivo, innovador, sinérgico" (vacío)
- Tipografías gratis desconocidas sin licencia clara
- Copiar literalmente la marca referencia

## Checklist

- [ ] Statement de posicionamiento en una frase memorable
- [ ] 12 nombres con check de dominio y legal básico
- [ ] Paleta con contraste WCAG AA verificado
- [ ] Máximo 2 familias tipográficas con licencia clara
- [ ] Tokens CSS exportables y reutilizables en todo producto
- [ ] Brandbook en Markdown, versionable en Git
- [ ] Ejemplos de "correcto/incorrecto" visuales
