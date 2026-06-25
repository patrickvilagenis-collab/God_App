# God App — Spiritual Companion (working title)

A private, multi-faith **spiritual companion** that helps people — especially younger,
spiritually searching generations — feel less alone and find a gentle path toward faith.
The app is an *accompanist, not an authority*: compassionate, non-judgmental, grounded in
each user's own faith tradition, and available in English and Spanish.

**Goals (in priority order):** ① mental-health support & emotional companionship ·
② religious education & spiritual guidance · ③ community connection & peer support.

> Not a therapist, doctor, or clergy. A companion that walks beside you — never a verdict.

## Product specification & strategy

The full strategy lives in [`/docs`](./docs):

| Doc | What's inside |
|-----|---------------|
| [00 — Product Strategy](./docs/00-product-strategy.md) | Vision, accompaniment principles, personas, scope & business-model recommendations |
| [01 — Features & Roadmap](./docs/01-features-and-roadmap.md) | Every feature tagged MVP / P2 / P3, with rationale |
| [02 — AI Companion Design](./docs/02-ai-companion-design.md) | Persona, tone consistency, doctrinal accuracy, multilingual design |
| [03 — Technical Architecture](./docs/03-technical-architecture.md) | Privacy/security model, RAG grounding, voice features, build-vs-buy |
| [04 — Safety, Ethics & Compliance](./docs/04-safety-ethics-and-compliance.md) | Mental-health boundary, crisis handling, minors, voice consent, community safety |
| [05 — UX Flows](./docs/05-ux-flows.md) | First-time onboarding, core conversation loop, journaling, library, settings |
| [06 — Open Decisions](./docs/06-open-decisions.md) | The strategic calls that need your sign-off, each with a recommendation |

**Start with [00 — Product Strategy](./docs/00-product-strategy.md), then
[06 — Open Decisions](./docs/06-open-decisions.md)** to confirm direction.

## MVP in one sentence
A bilingual seeker can sign up privately, pour out what they're feeling by voice or text,
receive a compassionate scripture-grounded response in a soothing voice or text, journal
about it, look up a passage, and be safely caught if they're in crisis — all without ever
feeling judged.

## 🌐 Dos formas de publicar la app

La app vive en la carpeta [`web/`](./web). Detecta sola dónde está alojada:

- **En Vercel** (con backend `api/chat.js`) → **sin clave**: cualquiera entra y conversa.
- **En GitHub Pages** (solo estático) → cada usuario pega su propia clave (guardada solo
  en su dispositivo). Útil como respaldo o para pruebas.

### ✅ Opción recomendada — Vercel (sin clave, cualquiera puede acceder)

Guía completa en **[docs/08 — Despliegue en Vercel](./docs/08-deploy-vercel.md)**. Resumen:

1. Entra a **https://vercel.com** e inicia sesión con **GitHub**.
2. **Add New… → Project** → importa el repositorio **God_App**.
3. En **Environment Variables** añade:  `ANTHROPIC_API_KEY = sk-ant-...`
4. **Deploy**. Tu app quedará en algo como `https://god-app.vercel.app` — **lista para
   cualquiera, sin pedir clave**.

> La clave queda **oculta en el servidor**. El backend construye el carácter del
> acompañante ahí mismo (no lo manda el navegador), e incluye límites de tamaño y de
> peticiones por IP. Aun así, define un **límite de gasto** en tu consola de Anthropic.

### GitHub Pages (respaldo, con clave propia)

Ya configurado: cada push a `main` publica `web/` en
**https://patrickvilagenis-collab.github.io/God_App/** (workflow en
`.github/workflows/deploy-pages.yml`). Pide la clave de Anthropic una vez por dispositivo.

La versión con servidor para **desarrollo local** está en [`app/`](./app)
(`python3 app/server.py`).
