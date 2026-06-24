# Safety, Ethics & Compliance

This is the most important document in the set. For an app touching faith, mental health,
minors, and biometric voice data, safety is not a feature — it is a license to operate.

## 1. The mental-health boundary (companionship, not clinical care)

- **Position clearly and repeatedly:** "I'm a spiritual companion — not a therapist,
  counselor, or doctor." Shown in onboarding, ToS, settings, and *at the moment of
  clinical/risk topics*.
- **Prohibited:** diagnosis, treatment plans, medication advice, claims to treat mental
  illness.
- **Permitted:** emotional support, active listening, validation, spiritual practices
  (prayer, reflection, scripture), and **encouraging** professional help when warranted.
- Why this matters: conflating spiritual companionship with clinical care is both
  dangerous to users and legally hazardous. The boundary protects both.

## 2. Crisis detection & escalation (MVP — non-negotiable)

- **Detect** signals of self-harm, suicidal ideation, abuse, or danger to others via a
  dedicated classifier on user input (text + transcribed voice), in both languages.
- **Respond** with a calm, caring, non-judgmental safety flow that:
  - Stays present and compassionate (does not coldly deflect).
  - Surfaces **localized professional resources** (e.g., 988 Suicide & Crisis Lifeline in
    the US, 911/emergency; country- and language-appropriate equivalents for ES/other
    locales).
  - Offers to help the user reach a trusted person or local clergy.
  - Never attempts to "handle" acute crisis alone as if it were a therapist.
- **Log** crisis events (privately, securely) for safety auditing and continuous
  improvement of the flow.
- Build a vetted, localized **crisis resource directory** before launch.

## 3. Spiritual / theological safety

- **No spiritual harm:** no condemnation, shaming, fearmongering, or telling users they
  are damned/unworthy. No coercion toward a tradition.
- **No extremism / no harmful religious content:** guardrails against content promoting
  violence, hatred, or dangerous practices framed as faith. Tradition modules are vetted
  to exclude extremist sources.
- **Respect autonomy:** the goal is gentle accompaniment toward faith *if the user
  wants it* — never manipulation, never exploiting vulnerability or grief to push belief.
- **Interfaith respect:** never disparage other traditions.
- **Accurate sourcing:** no invented scripture (enforced by RAG + citation verification).

## 4. Minors

- **Decide the age policy explicitly** (open decision). Options: 18+ only; 13+ with
  protections; or under-13 with verifiable parental consent (COPPA). The audience skews
  young, so this is consequential.
- If minors are allowed: age-appropriate design code compliance, stronger default
  privacy, heightened crisis safeguards, parental-consent flows where required, and
  extra caution on community and voice features (likely **disable** cloned voice and
  user-to-user community for minors).
- Recommendation: **launch 18+** (or 16+/13+ only with a dedicated youth-safety review),
  to ship MVP without the full minor-safety apparatus, then expand deliberately.

## 5. Voice / biometric consent (P2)

- Voice models are **biometric personal data** (special-category under GDPR; biometric
  privacy laws like BIPA may apply). Requires:
  - Explicit, informed, revocable consent from the **voice owner**.
  - For a third party's voice: documented consent from that person; do not rely solely on
    the uploader's claim. Extra care for voices of the deceased.
  - Encryption, strict access control, deletion on request, no sharing/sale, use limited
    to generating that user's responses.
  - Anti-deepfake/abuse monitoring and clear takedown.
- See architecture doc §4 for the technical flow.

## 6. Community safety (P2/P3 — prerequisites for any user-to-user feature)

Community ships **only** when these exist:
- **Church/community directory:** vet listed organizations; clear that listing ≠
  endorsement; report/flag mechanism; avoid sending vulnerable users to unvetted or
  predatory groups.
- **Testimonies:** opt-in, anonymizable, **human-reviewed before publish**, reportable.
- **Groups / mentor matching (P3):** moderation tooling, code of conduct, reporting +
  response SLA, **safeguarding for vulnerable users**, background-style vetting for
  mentors, no unsupervised minor↔adult contact, and abuse/grooming detection.
- General: blocking, reporting, rate limits, anti-spam, and a real moderation team/
  process before any of this is enabled.

## 7. Privacy & data ethics (summary; detail in architecture doc)

- Privacy is the product. Encryption, data minimization, no ads, no data sale, no
  training on private content without explicit opt-in, full export/delete.
- Transparent, plain-language privacy policy in EN/ES. Just-in-time disclosures at
  sensitive moments (recording voice, enabling AI journal feedback, crisis logging).

## 8. AI transparency

- Always clear the companion is **AI**. Disclose limits and uncertainty.
- Provide source citations so spiritual claims are verifiable.
- Give users control over memory/personalization (view, edit, clear).

## 9. Governance

- **Advisory board** spanning the supported faith traditions + a mental-health
  professional + a privacy/ethics expert. Reviews tradition modules, crisis flows, and
  sensitive features before launch.
- **Incident response** plan for safety events and data incidents.
- **Pre-launch checklist per tradition and per language:** module reviewed, golden tests
  pass (tone + safety), crisis resources localized, scripture licensing cleared.

## 10. Disclaimers (surfaced, not buried)

- "Spiritual companion, not a substitute for professional medical, psychological, or
  clergy care."
- "In an emergency, contact local emergency services / a crisis line."
- "Responses are AI-generated and grounded in [tradition] texts; verify and consult
  trusted human guides for important decisions."
