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

## 🌐 Página web pública (probar desde el móvil)

La carpeta [`web/`](./web) es una **página pública** que funciona desde el teléfono.
Llama a la IA directamente desde el navegador con tu propia clave de Anthropic, guardada
solo en tu dispositivo (ideal para un prototipo; en la app real la clave irá en un servidor).

**Para publicarla gratis con GitHub Pages (una sola vez):**
1. En GitHub, entra al repositorio → **Settings** → **Pages**.
2. En **Source**, elige **GitHub Actions**.
3. Espera a que termine la acción "Deploy webpage to GitHub Pages" (pestaña **Actions**).
4. Tu página quedará en: **https://patrickvilagenis-collab.github.io/god_app/**
5. Ábrela en el móvil, pega tu clave de Anthropic una vez, y listo.

> Nota: si la acción no se ejecuta desde esta rama, fusiona la rama a `main` y se publicará.

La versión con servidor (clave oculta en el backend) está en [`app/`](./app) para desarrollo local.
