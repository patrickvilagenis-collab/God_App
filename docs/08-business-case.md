# Alma — Business Case y Análisis de Competencia

> Documento de referencia. Cifras aproximadas (junio 2026), pensadas para decidir,
> no para contabilidad exacta. Servicios facturados en USD; conversión ~1 $ ≈ 0,95 €.

---

## 1. Resumen ejecutivo

Alma es un **acompañante espiritual con IA, multi-fe y bilingüe**, con voz natural,
notas de voz y diario. Hoy funciona como web app (PWA) gratuita de operar. Llevarla a
"producto completo" (dominio propio + app en tiendas + cuentas y suscripción) es
**barato de arrancar** (cientos de €) y su coste real escala con el **uso de IA y voz**,
no con el desarrollo.

El mercado está **en plena expansión** y validado: el líder cristiano (Hallow) supera
**10 millones de descargas** y ha levantado **~157 M$**. Pero casi todos los grandes son
**mono-religión**. El hueco de Alma: **multi-fe + en español + voz humana**.

---

## 2. Coste de "hacerlo completo"

### 2.1 Costes de arranque (una vez / fijos al año)

| Concepto | Coste | Notas |
|---|---|---|
| Dominio propio (alma.com, etc.) | 12–40 €/año | Imagen profesional |
| Cuenta Apple Developer | 99 $/año | Obligatoria para App Store |
| Cuenta Google Play | 25 $ (pago único) | Obligatoria para Google Play |
| Empaquetar la web para tiendas (Capacitor) | 0 € si lo hacemos nosotros · 3.000–8.000 € si se contrata | Reutiliza ~95 % de lo ya hecho |
| Pulido de marca/diseño (opcional) | 0–3.000 € | Logo, iconos, capturas de tienda |
| **Total realista para empezar** | **~150–400 €/año** (haciéndolo nosotros) | La vía barata y recomendada |

> App nativa **desde cero** (React Native/Flutter o nativo puro): **20.000–60.000 €**.
> No se necesita al principio — solo si el producto crece mucho.

### 2.2 Costes operativos (mensuales, escalan con usuarios)

Los servicios que cuestan dinero al usarse:

| Servicio | Para qué | Coste |
|---|---|---|
| Vercel (hosting) | Servir la web/API | Gratis al inicio → 20 $/mes (Pro) con tráfico |
| Anthropic Claude | Respuestas del chat | ~0,01 $ por respuesta |
| Groq Whisper | Transcribir notas de voz | Muy barato (céntimos) |
| **ElevenLabs (voz)** | Voz neuronal | **El coste principal y variable** |
| Supabase (cuando haya cuentas) | Base de datos + login | Gratis → 25 $/mes (Pro) |
| Stripe (si hay suscripción) | Cobros | 1,5 %–2,9 % + ~0,25 € por cobro |

**La voz es el gran motor de coste.** Cada respuesta hablada (~800 caracteres) consume
crédito de ElevenLabs. Por eso conviene: voz **a demanda** (no en cada mensaje), tier
adecuado, y/o reservar la voz para usuarios de pago.

### 2.3 Coste por usuario activo / mes (estimación)

| Perfil de uso | Chat | Voz (selectiva) | Coste total/usuario/mes |
|---|---|---|---|
| Ligero (≈50 mensajes/mes) | ~0,50 $ | ~1–3 $ | **~1,5–3,5 $** |
| Intensivo (≈300 mensajes/mes, mucha voz) | ~3 $ | ~15–40 $ | **~20–45 $** ⚠️ |

> Conclusión: un usuario **gratuito que abuse de la voz puede costar más que un cliente
> de pago**. Por eso el modelo sano es: chat generoso gratis + **voz como función premium**.

### 2.4 Coste total mensual por escala (uso moderado, voz selectiva)

| Usuarios activos | Coste IA+voz | Infra (Vercel+Supabase) | **Total/mes aprox.** |
|---|---|---|---|
| 100 | ~150–300 $ | 0–20 $ | **~150–320 $** |
| 1.000 | ~1.000–2.500 $ | ~45 $ | **~1.000–2.500 $** |
| 10.000 | ~10.000–25.000 $ | ~100–300 $ | **~10.000–25.000 $** |

---

## 3. Modelo de ingresos y punto de equilibrio

Precio de referencia del sector: **~6 $/mes** o **~60–70 $/año** (igual que Hallow/Abide).

Supuesto conservador: **20 % de los usuarios activos** pasan a pago (freemium típico
ronda 2–5 % en frío, pero apps de fe fidelizan más).

| Usuarios activos | De pago (20 %) | Ingreso/mes (a 6 $) | Coste/mes | **Margen** |
|---|---|---|---|---|
| 1.000 | 200 | ~1.200 $ | ~1.000–2.500 $ | Ajustado / break-even |
| 10.000 | 2.000 | ~12.000 $ | ~10.000–25.000 $ | Positivo si se controla la voz |

> **Palanca clave:** controlar el coste de voz (a demanda + premium) convierte un margen
> ajustado en uno saludable. Es la decisión económica más importante del producto.

---

## 4. Análisis de competencia

### 4.1 Los grandes (mono-religión, sobre todo cristianos)

| App | Enfoque | Precio | Escala / notas |
|---|---|---|---|
| **Hallow** | Católico (rezo, meditación, audio) | ~70 $/año | **+10 M descargas, ~157 M$ levantados.** El gigante. Primer app de fe en top 10 de App Store |
| **Pray.com** | Cristiano, comunidad y donaciones | ~40–70 $/año | Enfoque en congregaciones y livestream |
| **Abide** | Meditación cristiana | ~40–70 $/año | Bien valorada, audio-guías |
| **Glorify** | Cristiano, devocional diario | Similar | Competidor directo de Hallow |

### 4.2 Los nuevos (IA / chat de fe)

| App | Enfoque | Notas |
|---|---|---|
| **Text With Jesus** | Chatbot IA cristiano | Conversas "con Jesús"/personajes bíblicos |
| **Bible Chat / Faith Guide** | IA sobre la Biblia | Chat + estudio bíblico, modelo freemium |
| **QuranGPT / Deen Buddy** | IA islámica | QuranGPT colapsó por demanda el primer día |
| **Vedas AI / AI Buddha** | Hinduismo / budismo | Nichos por religión |
| **Sefaria (IA)** | Judaísmo (Torá) | Resúmenes IA con revisión humana |
| **Sadhguru – Miracle of Mind** | Meditación | +1 M descargas en 15 h en su lanzamiento (2025) |

### 4.3 Adyacentes (no religiosos, pero compiten por el mismo tiempo/dinero)

- **Calm**, **Headspace** — meditación secular, presupuestos enormes. No son fe, pero
  pelean por el mismo usuario que busca calma/bienestar.

---

## 5. Dónde puede ganar Alma (diferenciación)

El mercado está validado **pero fragmentado por religión y dominado por el inglés**. Huecos reales:

1. **Multi-fe de verdad** — la mayoría son mono-religión. Alma acoge cristianismo, islam,
   judaísmo, budismo y "en búsqueda" en un solo lugar. Casi nadie lo hace bien.
2. **Español nativo primero** — la oferta fuerte es anglosajona. Mercado hispano (España +
   Latinoamérica, ~500 M hablantes) **mal atendido**.
3. **Voz humana + notas de voz** — conversación hablada, no solo texto. Más íntimo.
4. **Privacidad radical** — hoy los datos viven en el dispositivo. Es un argumento de venta
   potente frente a apps que recopilan todo.
5. **"En búsqueda"** — acoger a quien duda o no tiene religión definida. Público enorme que
   las apps confesionales ignoran.

**Riesgos a vigilar:** sensibilidad teológica (no inventar textos sagrados — ya cuidado),
moderación en temas delicados, y que un gigante como Hallow añada multi-fe.

---

## 6. Recomendación de orden (cuando avancemos)

1. **Dominio propio** (barato, imagen profesional). 
2. **Empaquetar la web para App Store + Google Play** (Capacitor, reutiliza casi todo).
3. **Cuentas + base de datos** (Supabase) y **suscripción** (Stripe) — con **voz como premium**.
4. App nativa desde cero — solo si el tamaño algún día lo justifica.

> Lo construido hoy (diseño, voz, chat, notas de voz, diario) **se reaprovecha en cada paso**.

---

### Fuentes
- Hallow — precios y escala: help.hallow.com, hallow.com/blog, prnewswire.com, Wikipedia (Hallow)
- Mercado IA + fe: theaitrack.com, textwith.me, faithguide.com, theaisurf.com
- Financiación Hallow: prnewswire.com, crunchbase.com, finsmes.com
