---
name: viral-growth-lab
description: Diseña loops de crecimiento virales, sistemas de referidos, Product-Led Growth y experimentos de adquisición. Basado en frameworks de Reforge, Andrew Chen y Lenny. Usar cuando el usuario pida "crecimiento", "growth hacking", "viralidad", "programa de referidos", "adquisición de usuarios", "PLG", "aumentar retención", "reducir churn", "conseguir más usuarios", "K-factor" o "funnel de growth". Entrega loops específicos + experimentos priorizados + métricas norte.
---

# Viral Growth Lab

Growth que compone, no hacks que duran una semana. Loops por encima de funnels. Sistemas por encima de tácticas.

## Principios

1. **Los funnels son lineales y se agotan; los loops se autoalimentan**. Cada cliente adquirido genera el siguiente.
2. **Retención es la única métrica que importa a largo plazo**. Sin retención, ni el mejor growth salva.
3. **No hay "growth hacks" universales**. Cada negocio tiene 1-3 canales que escalan. El resto es ruido.
4. **Copia primero, innova después**. Entender qué hacen Notion, Figma, Calendly en tu vertical > reinventar.

## Tipos de loops

### Loop 1 — Viral (UGC / Network)
El producto se comparte por naturaleza de uso.
- Calendly: cada reunión agendada expone el link a un nuevo usuario
- Loom: cada vídeo enviado expone el logo a un nuevo viewer
- Typeform: cada form completado expone la marca al respondedor

**Fórmula**: Usuario → Crea artefacto → Artefacto se comparte → N viewers → X% se registra → Vuelve al inicio

**K-factor** = invitaciones enviadas × tasa de conversión. K > 1 = viralidad real.

### Loop 2 — Contenido SEO
- Zapier: cada integración es una página. 10.000 páginas rankeando = millones de visitas
- G2: reviews de usuarios crean páginas infinitas
- Canva: templates por uso crean landings rankeables

**Fórmula**: Usuario crea contenido → Contenido indexa en Google → Tráfico orgánico → Conversión a signup → Usuario crea más

### Loop 3 — Referidos con incentivo
- Dropbox: +500MB por referido (clásico)
- Airbnb: $25 crédito para ambos
- Wise: £75 tras 3 referidos que transfieran

**Fórmula**: Usuario satisfecho → Incentivo por referir → Amigo se registra → Ambos reciben premio → Amigo se convierte en referidor

**Reglas**:
- Incentivo tiene que ser ≥10% LTV para ser rentable
- Doble incentivo (referidor + referido) convierte 2-3x más que simple
- Fricción baja: link único, un clic
- Medir LTV del referido vs CAC — no todos los referidos son iguales

### Loop 4 — Paid que amortiza
- CAC payback <12 meses
- LTV/CAC >3
- Cada cliente nuevo genera MRR que financia el siguiente
- Escala hasta el techo de intent

### Loop 5 — Comunidad / Creador
- Notion: creators hacen templates → nuevos users llegan por templates
- Webflow: diseñadores construyen sites → clientes llegan pidiendo Webflow
- Figma: comunidad hace plugins → Figma se vuelve insustituible

### Loop 6 — Data Network Effect
Cada usuario mejora el producto para los demás.
- Waze: cada usuario reporta tráfico
- Yelp: cada usuario deja reviews
- TripAdvisor: datos de millones de viajeros

### Loop 7 — Sales-led
- BDR outbound → Demo → Close → Case study → Outbound más fácil
- Cada caso de cliente baja el CAC del siguiente cliente en mismo ICP

## Framework de selección

Pregunta al usuario:

1. **Tipo de producto**: self-serve, sales-led, híbrido
2. **Ticket**: <$50/mes, $50-500, $500-5k, enterprise
3. **Frecuencia de uso**: diaria, semanal, mensual, puntual
4. **Multi-jugador**: se usa con otros o solo
5. **Tiempo a valor**: minutos, días, meses
6. **Segmento**: B2C, SMB, Mid-market, Enterprise

Según combinación, prioriza loops:
- B2C + ticket bajo + frecuente + multi-jugador → **Viral + Referidos**
- B2B SMB + self-serve + diario → **SEO + PLG loops**
- B2B mid + sales-led + enterprise → **Outbound + Case studies**
- Prosumer + templates → **Comunidad + SEO**

## Métricas del modelo

### North Star Metric
Una sola métrica que captura valor entregado al cliente:
- Spotify: tiempo escuchado
- Airbnb: nights booked
- Slack: messages sent
- Shopify: GMV

No confundir con revenue (lagging) ni DAU (vanity si no hay acción).

### Métricas por stage (Pirate AARRR, ya refinado)

- **Acquisition**: CPL, CAC por canal
- **Activation**: % que alcanza "aha moment" en primera sesión
- **Retention**: cohorte D1, D7, D30, M1, M3
- **Revenue**: ARPU, MRR, ARR, LTV
- **Referral**: K-factor, NPS, referidos/cliente

### Growth equation
Define la ecuación que explica tu crecimiento neto:

```
Crecimiento = (Nuevos + Resurrecciones) - (Churned + Dormant)
```

O para PLG:
```
MRR growth = New MRR + Expansion MRR - Churned MRR - Contraction MRR
```

Cada palanca se puede atacar con experimentos.

## Framework de experimentos (ICE + PDCA)

Cada experimento tiene ficha:

```markdown
# Experimento: [nombre]

## Hipótesis
Creemos que si [cambio] ocurre, entonces [métrica] cambiará en [magnitud] porque [razón].

## ICE score
- Impact (1-10): cuánto moverá la métrica
- Confidence (1-10): cuánta evidencia tenemos
- Ease (1-10): cuán fácil de implementar
Score = promedio. Prioriza >7.

## Métrica a mover
[Métrica específica + baseline + target]

## Duración
[Tiempo mínimo para significancia]

## Criterio de éxito
[Qué consideramos ganar]

## Resultado
[Tras el experimento]

## Aprendizaje
[Qué aprendimos, gane o pierda]
```

Corre 4-8 experimentos/mes. El 70% fallará — normal. El 30% que gana, escálalo.

## Playbooks por stage

### Pre-PMF (0-100 usuarios)
- Hacer cosas que no escalan (Paul Graham)
- Onboarding manual 1-a-1 por fundador
- 30 min entrevista a cada cliente
- NO invertir en paid todavía
- NO construir referral program todavía

### Early PMF (100-1.000)
- Identifica canal #1 que funciona y dóblalo
- Primer programa de referidos simple (incentivo doble)
- SEO: pillar + 10 posts cluster
- Lanzamiento en Product Hunt (solo tras tener 500+ usuarios warm)

### Scaling PMF (1.000-10.000)
- Paid funnel si unit economics dan
- Partnerships / integraciones con otros SaaS
- Programa de contenido sistematizado
- CRM y lifecycle emails segmentados
- Onboarding self-serve optimizado

### Growth stage (10k+)
- Ventas outbound si ticket justifica
- Localización a segundos mercados
- PLG + sales híbrido (PLM)
- Comunidad gestionada
- Análisis de cohortes mensual

## Tácticas específicas probadas

### Para activación
- **"Magic moment" in <5 min**: diseña el onboarding para que el usuario vea valor antes del minuto 5
- **Checklist de onboarding**: 3-5 steps con progress bar (Shopify, ClickUp)
- **Empty states productivos**: llena dashboard con sample data + CTA
- **Email día 1, 3, 7**: activación con micro-wins
- **Product tours solo si crítico**: overtour mata; skip-able

### Para retención
- **Habit trigger externo**: notif cuando hay acción del otro lado
- **Streaks / progreso visible**: Duolingo, LinkedIn
- **Nuevos lugares para descubrir valor**: updates mensuales con "qué hay nuevo"
- **Red-flag emails**: si usuario baja uso, email del founder preguntando
- **Win-back**: 30/60/90 días inactivo, secuencia con oferta

### Para referidos
- **Post-aha moment**: pide referido tras primer éxito, no al signup
- **Incentivo de los dos lados**: 2-3x mejor que uno solo
- **Share reasons**: da 3 razones por las que el amigo debería probar
- **Leaderboards / gamificación**: ranking mensual de referidores
- **Partner/affiliate**: 20-30% recurring para super-referidores

### Para reducir churn
- **Cancel flow inteligente**: pregunta motivo + ofrece pausa / descuento / plan menor
- **Success Manager** en cuentas >$500/mes
- **Health score**: uso + soporte tickets + NPS = score. Cuentas en rojo → intervenir
- **Saltos a anual**: 20% descuento en pago anual reduce churn a 1/12

## Anti-patrones

- Correr 30 experimentos a la vez sin significancia
- Optimizar funnel antes de tener PMF
- Referral program antes de retención sólida (referir un mal producto lo mata más rápido)
- Copiar tácticas B2C en B2B enterprise
- Mirar DAU/WAU sin definir acción significativa
- Perseguir vanity metrics (impresiones, likes, registros "falsos")
- Gastar en paid con LTV < CAC

## Checklist

- [ ] North Star Metric definida y medida semanal
- [ ] 1-3 loops principales identificados
- [ ] Growth equation escrita con palancas
- [ ] Cohortes de retención revisadas mensual
- [ ] Pipeline de 4-8 experimentos/mes con ICE score
- [ ] Canal #1 identificado y escalado antes de canal #2
- [ ] Referral program solo si retención <10% monthly churn
- [ ] CAC payback <12 meses si hay paid
- [ ] Unit economics: LTV/CAC >3

## Entregables por engagement

1. Mapa de loops propios (Mermaid)
2. Growth equation del negocio
3. North Star + métricas de stage
4. Top 10 experimentos priorizados por ICE
5. Playbook del loop principal con tácticas específicas
6. Dashboard template (Notion/Airtable/Sheet) con métricas y cohortes
