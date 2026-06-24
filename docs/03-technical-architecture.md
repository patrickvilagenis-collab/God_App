# Technical Architecture (Reference)

A pragmatic, privacy-first architecture. This is a strategy-level reference, not final
engineering — it exists to make the privacy, voice, and grounding decisions concrete.

## 1. High-level shape

```
            ┌─────────────────────────────────────────────┐
 Clients    │  iOS · Android · Web  (EN/ES, accessible)    │
            └───────────────┬─────────────────────────────┘
                            │ HTTPS / authenticated API
            ┌───────────────▼─────────────────────────────┐
 Backend    │  API gateway · Auth · Rate limiting          │
            ├──────────────────────────────────────────────┤
            │  Companion service  (orchestration)          │
            │   ├─ prompt assembly (charter+tradition+lang)│
            │   ├─ RAG retrieval over text corpus          │
            │   ├─ LLM call (Claude)                       │
            │   ├─ safety guardrails (in + out)            │
            │   └─ crisis classifier                       │
            │  Journaling service                          │
            │  Library/search service                      │
            │  Voice service (STT, TTS, voice models)      │
            │  Community service (P2+)                      │
            └───────────────┬─────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────────────┐
  Data  │ User DB (encrypted) · Journal store (encrypted)│
        │ Vector store (scripture/resource embeddings)   │
        │ Object store (media, voice models — encrypted) │
        │ Audit log (safety events)                      │
        └────────────────────────────────────────────────┘
```

## 2. Private user data — the security model

Spiritual + mental-health + biometric (voice) data is among the most sensitive
categories there is. Treat it accordingly.

- **Encryption everywhere:** TLS in transit; encryption at rest for all stores; separate
  envelope/field-level encryption for the most sensitive fields (journal bodies, voice
  models, chat transcripts).
- **Least privilege & isolation:** per-user data scoping enforced at the data layer; no
  cross-user reads; strict internal access controls and audit logging for any human
  access (which should be near-zero and consented).
- **Data minimization:** collect only what the experience needs. No selling data, no ad
  tracking, no third-party analytics on sensitive content.
- **No training on private content by default.** Chats/journals are **not** used to train
  models unless the user explicitly opts in. Ensure the LLM provider path is configured
  for **no-retention / no-training** on user content (zero-data-retention where
  available).
- **User self-service:** in-app **export** and **hard delete** of all data, including
  voice models; account deletion purges within a defined window.
- **Consider client-side / E2E encryption for journals** as a premium trust feature
  (trade-off: limits server-side AI reflection unless processed ephemerally — decide per
  feature; an "extra-private journal" mode that forgoes AI feedback is a clean option).
- **Compliance posture:** GDPR (and CCPA) data-subject rights; if any users may be under
  18, **COPPA / age-appropriate-design** obligations apply — see safety doc on minors.
  Because we are explicitly *not* a healthcare provider, we avoid HIPAA scope, but we
  should still hold mental-health-adjacent data to a high bar.

## 3. RAG / grounding corpus

- Ingest **licensed/public-domain** scripture and resources per tradition × language.
- Chunk, embed, and store with rich metadata (tradition, denomination, language,
  book/chapter/verse, source/translation, license).
- At query time, retrieve filtered by the user's tradition + language; pass passages to
  the companion for grounded, cited answers; verify quoted text against source before it
  reaches the user.
- This same corpus powers the **library search** feature — one source of truth.

## 4. Voice features

### MVP — preset soothing voices
- High-quality TTS with a small curated set of calm voices; per-message + global
  voice/text toggle; cache synthesized audio per response.

### P2 — personalized / cloned voice (high-sensitivity)
- Flow: user records sample(s) → **explicit consent capture** → voice model created →
  responses synthesized in that timbre → user can preview, revoke, and **delete** the
  model at any time.
- **Consent & anti-abuse (mandatory):**
  - The voice owner must consent. For a *third party's* voice (e.g., a family member),
    require documented, verifiable consent from that person — not just the uploader's
    say-so. Deceased loved ones are an especially sensitive case: require attestation and
    apply extra care/messaging.
  - Provider/vendor choice must support consented voice cloning with abuse protections;
    avoid enabling deepfake misuse. Watermark/label synthesized audio internally.
  - Voice models are biometric data: encrypted, access-controlled, deletable, never
    shared or sold, never used beyond generating that user's responses.
  - Rate-limit and monitor for misuse; provide clear takedown.
- Treat as **premium** (it carries real per-use cost). See business model.

## 5. Cost & scaling notes

- LLM + TTS + STT are the main variable costs; cache aggressively (TTS audio, common
  retrievals), use lighter model tiers for non-sensitive utility tasks, and gate the
  expensive media features (video, cloned voice, unlimited audio) behind the supporter
  tier to keep the free core sustainable.
- Stateless services + managed datastores for horizontal scale; the vector corpus is
  read-heavy and cacheable.

## 6. Build vs. buy (recommendation)

- **Buy/managed** for: LLM (Claude), STT/TTS, auth, infra. Don't build foundation models.
- **Build** for: prompt/charter orchestration, tradition modules, guardrails + crisis
  classifier, RAG pipeline, journaling, and the privacy controls — these *are* the
  product and its differentiation.
- Start with a lean managed stack to reach MVP fast; revisit E2E-encryption and
  self-hosting trade-offs as scale and trust requirements grow.
