# Feature Specification & Roadmap

This translates the requested features into a prioritized build plan. Each feature is
tagged **MVP**, **P2** (Phase 2), or **P3** (Phase 3), with rationale and the key
decisions/risks it carries.

## Prioritization philosophy

MVP must deliver the *complete core loop* for the primary persona (Sofia):
**arrive → feel safe → select faith → talk to the companion → receive grounded,
compassionate guidance → reflect (journal) → come back.** Everything that isn't on
that critical path, or that carries heavy cost/risk (voice cloning, community, live
humans), is deferred.

---

## Feature-by-feature

### 1. Private user access & authentication — **MVP**
- Email + password and OAuth (Apple/Google); passwordless/magic-link optional.
- Each user gets a private dashboard ("home space"). All data is per-user confidential.
- **MVP:** secure auth, encrypted storage, private dashboard, account/data controls
  (export, delete). See architecture doc for the data-protection model.
- Sensitive nature of data (faith, mental state) → **encryption and access control are
  MVP, not later.**

### 2. Faith tradition selection — **MVP**
- At signup, choose one or more traditions: Christianity, Islam, Judaism, Buddhism,
  Hinduism, "Exploring / Not sure," "Spiritual but not religious," etc.
- **Progressive denominational depth, user-controlled:** start broad (e.g.,
  Christianity), optionally refine (Catholic / Protestant / Orthodox →
  Baptist / Methodist…), and choose how strictly to apply it.
- Adjustable anytime from settings; changing it re-tailors resources, tone, and library.
- **MVP scope decision:** ship **2–3 traditions deep and excellent** (recommend
  Christianity + Islam, given the bilingual EN/ES focus and likely audience) rather than
  10 traditions shallow. Add traditions as P2/P3 with proper sourcing per tradition.
- "Exploring / Not sure" is a first-class option that routes to intro-to-faith content.

### 3. Communication & expression tools (multi-format) — **phased**
- **MVP:** text + **voice notes** (record, transcribe, respond) + photo upload. These
  cover the most emotionally expressive, lowest-complexity formats.
- **P2:** video messages, freehand written notes (image/handwriting), richer attachments.
- The companion should accept any combination and respond naturally. Multimodal input
  (image/audio understanding) is available via current models; gate heavier media on cost.

### 4. Voice responses — **phased, with a hard consent gate on cloning**
- **MVP — Option A (preset soothing voices):** a small set of calm, meditative TTS
  voices the user can pick; toggle voice ⇄ text per message and globally.
- **P2 — Option B (personalized / cloned voice):** user records their own or (with
  documented consent) a loved one's voice; AI replies in that timbre.
  - **This is the single highest-sensitivity feature.** It requires: explicit, verifiable
    consent from the voice owner; abuse/deepfake safeguards; the ability to revoke and
    delete the voice model; and clear disclosure. Treated as a premium (cost-bearing)
    feature. Full treatment in the safety + architecture docs.
- Always allow falling back to text; never force audio.

### 5. Spiritual resource library — **MVP (core), enriched in P2**
- Searchable access to the user's tradition's primary text(s): Bible / Quran / Tanakh /
  etc., plus curated supporting resources and **intro-to-faith** content.
- **MVP:** primary text(s) for the launch traditions, full-text search, clean reading/
  study UI, and intro-to-faith tracks. Licensed/public-domain translations only — see
  legal note below.
- **P2:** broader theological libraries, commentaries, devotionals, study plans, audio
  readings, cross-references, daily verse/passage.
- **Licensing matters:** scripture *translations* are often copyrighted. MVP should use
  clearly licensed or public-domain translations per tradition/language (e.g., public-
  domain Bible translations; properly licensed Quran translations). Track provenance.
- The library doubles as the **grounding corpus** for the AI (RAG) so guidance can cite
  real passages — see AI design doc.

### 6. Journaling & reflective feedback — **MVP**
- Free-form and guided ("prompted") spiritual journal.
- AI offers **optional**, gentle, tradition-grounded reflections on entries — never
  unsolicited grading; the user requests or opts into feedback.
- **MVP:** create/edit entries, optional AI reflection grounded in the user's tradition,
  privacy controls (entries are deeply personal — encrypted, never used for ads/training
  without explicit opt-in).
- **P2:** mood/growth tracking over time, themed journeys, streak-free gentle nudges.

### 7. Language support (EN/ES) — **MVP, cross-cutting**
- Full bilingual UI, resources, and AI responses from launch. Spanish is **not** a
  translation afterthought — it's a launch-day first-class language given the audience.
- The AI must maintain identical tone, safety, and doctrinal accuracy across languages
  (see AI design doc). Resource content needs ES equivalents (e.g., Spanish-language
  scripture translations) sourced up front.
- **MVP:** language switch; all core flows, safety messaging, and companion responses in
  both languages. **P2:** localized community/content, more languages.

### 8. Community vs. private balance — **mostly P2/P3** (see strategy §5.1)
- **MVP:** entirely private 1-on-1 companionship. No user-to-user features.
- **P2:** moderated **church/community directory** (find real local congregations) +
  curated, anonymized, human-reviewed **testimonies** (read-only).
- **P3:** moderated topic groups, optional vetted mentor matching.
- Safeguards (moderation, reporting, minor protection, directory vetting) are
  prerequisites — see safety doc. Community ships only when safety tooling is ready.

---

## Roadmap summary

### MVP (the trustworthy core)
Auth + private dashboard · Faith selection (2–3 traditions deep, EN/ES) · Text + voice-
note + photo chat with the companion · Preset soothing voice responses (toggle) · Core
resource library + intro-to-faith · Journaling with optional AI reflection · Crisis
detection + resource hand-off · Full bilingual EN/ES · Privacy/security baseline
(encryption, export, delete).

**MVP definition of done:** Sofia can sign up in Spanish or English, privately pour out
what she's feeling by voice or text, receive a compassionate Quran-/Bible-grounded
response in a soothing voice or text, journal about it, look up a passage, and be safely
caught if she's in crisis — all without ever feeling judged.

### Phase 2 (deepen + first connection)
Cloned/personalized voice (with consent gate) · Video + handwritten notes · Church
directory + curated testimonies · Richer library (commentaries, study plans, daily
content) · More traditions · Journaling insights over time.

### Phase 3 (community + humans-in-the-loop)
Moderated peer groups · Vetted volunteer faith-mentor matching · Deeper church
partnerships/integrations · Additional languages.

## Cross-phase non-negotiables (ship in MVP, never deferred)
- The accompaniment tone and no-judgment guarantee.
- Crisis safety handling and the "not a therapist/doctor" boundary.
- Per-user privacy, encryption, and data self-service (export/delete).
- Doctrinal grounding (no invented scripture) for any tradition we claim to support.
