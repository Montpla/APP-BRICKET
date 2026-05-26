---
name: seo-content-machine
description: Motor de contenido SEO optimizado para rankear en Google y convertir. Incluye investigación de keywords, cluster topical, briefs, generación de artículos largos (2.000+ palabras), meta tags, schema markup y calendario editorial. Usar cuando el usuario pida "contenido SEO", "artículo de blog", "posicionar en Google", "estrategia de contenido", "keywords", "escribir un post" o quiera atraer tráfico orgánico.
---

# SEO Content Machine

Contenido que rankea Y convierte. Ni granjas de IA ni artículos preciosos que nadie lee. SEO moderno: intent + depth + E-E-A-T + conversión interna.

## Filosofía

Google 2025 no premia contenido: premia **resolución del intent**. Un post de 500 palabras que responde perfecto vence a 3.000 palabras de paja. Pero un post de 3.000 palabras con entidades, experiencia y enlaces profundos vence a ambos si el tema lo pide.

## Flujo completo

### Fase 1 — Investigación

Pregunta al usuario:
1. Nicho exacto (más específico = más rankeable): "marketing digital" → "email marketing para ecommerce con Shopify"
2. Buyer persona (1 solo, con dolor y momento del funnel)
3. Producto/servicio que promociona (para CTAs internos)
4. URL del sitio (si existe) para analizar dominio
5. Top 3 competidores directos en contenido

### Fase 2 — Cluster topical (no keywords sueltas)

Rechaza la petición "hazme un post sobre X" y contrapropón un **cluster**:
- **1 Pillar page** (guía definitiva, 3.000-5.000 palabras, keyword cabeza)
- **8-15 Cluster posts** (profundizan sub-temas, linkan al pillar)
- **Interlinking** bidireccional

Ejemplo para nicho "email marketing Shopify":
- **Pillar**: "Guía completa de email marketing para Shopify en 2026"
- **Clusters**: "Welcome series Shopify", "Abandoned cart emails", "Post-purchase flows", "Segmentación Klaviyo", "Template design", "A/B testing emails", "Deliverability Shopify", etc.

### Fase 3 — Keyword research sin herramientas de pago

Técnicas:

1. **Google Autocomplete**: escribe "[keyword]" + letra A-Z
2. **People Also Ask**: recoge las 4-8 preguntas del SERP
3. **Related searches**: bottom del SERP
4. **Reddit + Quora**: busca `site:reddit.com [keyword]` para intents reales
5. **Amazon reviews**: para dolores concretos en productos
6. **Answer the Public** gratis (3 búsquedas/día)
7. **Google Search Console** (si el usuario tiene sitio): queries ya ranqueando en posición 5-20 (fruta madura)

Para cada keyword entrega:
- Volumen estimado (bajo/medio/alto)
- Intent (informacional, comercial, transaccional, navegacional)
- Dificultad estimada (observa longitud + dominios en top 10)
- Oportunidad: intent alto + dificultad baja = prioridad

### Fase 4 — Brief de artículo

Antes de escribir, genera el brief:

```markdown
# Brief: [Título del artículo]

## Keyword principal
[keyword exacta]

## Keywords secundarias
- [LSI 1]
- [LSI 2]
- [long-tail 1]

## Intent
[Informacional | Comercial | Transaccional]

## Buyer persona
[Persona específica + momento del funnel]

## Ángulo único
[Qué dice este post que no dicen los 10 del SERP]

## Estructura H2-H3
1. H2: ...
   - H3: ...
   - H3: ...
2. H2: ...

## Entidades a incluir
[Personas, marcas, conceptos, herramientas que Google espera ver]

## Fuentes a citar
[3-5 fuentes autoridad para linkar out]

## CTA interno
[Producto/lead magnet que enlazamos]

## Meta title (≤60 chars)
## Meta description (≤155 chars)
## URL slug
## Featured snippet target
[Definición <50 palabras, lista, o tabla para intentar capturar posición 0]
```

### Fase 5 — Escritura

Reglas no negociables:

**Primeros 100 palabras**:
- Responde la pregunta principal inmediatamente (reverse pyramid)
- Incluye la keyword en primera frase
- Promete beneficio específico del post
- Evita "En este artículo te contaré..." (filler)

**Estructura**:
- H1 único con keyword
- H2 cada 300 palabras máximo
- Listas, tablas, callouts cada 400 palabras
- Párrafos de 2-3 frases máximo
- Bold en términos clave (no abuso)

**Profundidad**:
- Cada H2 responde una sub-intent completa
- Ejemplos concretos con números reales
- Al menos 1 tabla comparativa o 1 framework original
- 1 caso real o anécdota propia (E-E-A-T: experiencia)

**Enlaces**:
- 3-5 enlaces internos a posts relacionados y a pillar
- 2-4 enlaces externos a autoridades (Wikipedia, research, .edu, .gov)
- 0 enlaces externos sin `rel="noopener"` si aplica

**Conversión**:
- 1 CTA blando arriba (lead magnet)
- 1 CTA medio a mitad (herramienta, template)
- 1 CTA duro al final (producto, demo)

### Fase 6 — On-page SEO técnico

Genera junto al artículo:

```html
<!-- Meta tags -->
<title>[Meta title ≤60]</title>
<meta name="description" content="[Meta desc ≤155]">
<link rel="canonical" href="[URL]">

<!-- Open Graph -->
<meta property="og:title" content="[Título para compartir]">
<meta property="og:description" content="[Desc para compartir]">
<meta property="og:image" content="[Imagen 1200x630]">
<meta property="og:type" content="article">

<!-- Schema Article -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "author": { "@type": "Person", "name": "..." },
  "datePublished": "...",
  "dateModified": "...",
  "image": "...",
  "publisher": { "@type": "Organization", "name": "..." }
}
</script>

<!-- Schema FAQ si hay FAQ -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [ ... ]
}
</script>
```

### Fase 7 — Calendario editorial

Entrega un plan de 12 semanas:
- Semana 1-2: pillar page
- Semanas 3-12: 2 cluster posts / semana
- Día de publicación fijo (martes o miércoles funcionan mejor B2B)
- Refresh de posts antiguos cada 6 meses (más ROI que crear nuevos)

## Anti-patrones

- Spinning de IA sin edición humana
- Meter keyword 40 veces (keyword stuffing)
- Artículos de 5.000 palabras para keyword de 500 búsquedas
- Publicar sin linking interno al resto del cluster
- Ignorar intent: escribir guía cuando Google muestra productos
- No refrescar contenido viejo
- Subir imágenes sin alt text ni compresión
- Copiar H2s del top 3 del SERP literalmente

## Checklist por artículo

- [ ] Keyword principal en: H1, primera frase, URL, meta title, meta desc
- [ ] 3-5 enlaces internos, 2-4 externos a autoridades
- [ ] Al menos 1 tabla, 1 lista, 1 callout
- [ ] Meta title ≤60 chars, meta desc ≤155 chars
- [ ] URL slug corta (3-5 palabras)
- [ ] Schema Article + FAQ si aplica
- [ ] Imagen destacada 1200x630 con alt
- [ ] Featured snippet target escrito (definición o lista compacta)
- [ ] 1 CTA blando + 1 CTA duro
- [ ] Pasado por Hemingway o similar (readability 60+)

## Métricas que importan

Ignora page views al principio. Mide:
- **CTR desde SERP** (Search Console): si <3%, el meta title está mal
- **Posición media** por query: si estanca >20, falta profundidad o backlinks
- **Tiempo en página**: si <1 min, el primer párrafo no engancha
- **Conversiones del post**: si 0 tras 500 visitas, el CTA no casa con intent
