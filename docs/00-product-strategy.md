# Product Strategy — Spiritual Companion App ("God App", working title)

> This document is the north star. Features, designs, and engineering decisions
> downstream should trace back to the vision, principles, and priorities here.

---

## 1. Vision

A private, multi-faith spiritual companion that helps people — especially younger,
spiritually searching generations — feel **less alone** and find a gentle path toward
faith. The app is an *accompanist*, not an authority. It meets people wherever they
are on their journey, in their language and their tradition, with compassion rather
than judgment.

**One-sentence positioning:**
> "A confidential companion that walks beside you — offering comfort, spiritual
> wisdom, and connection, never a verdict."

## 2. The three goals, in priority order

| # | Goal | What it means in the product | Primary success signal |
|---|------|------------------------------|------------------------|
| 1 | **Mental health support & emotional companionship** | The user always feels heard, safe, and accompanied. Crisis-aware, but explicitly *not* a clinical or therapeutic service. | Retention, sense of being understood (in-app sentiment), safe handling of distress |
| 2 | **Religious education & spiritual guidance** | Accurate, tradition-authentic teaching and resources; intro-to-faith on-ramps. | Resource engagement, self-reported spiritual growth |
| 3 | **Community connection & peer support** | Connecting users to each other and to real faith communities/churches. | Connections made, referrals to local communities |

> The ordering matters for trade-offs: when goals conflict, **emotional safety and
> companionship win**. Example: if a teaching is doctrinally "correct" but would shame
> a hurting user, we soften toward accompaniment.

## 3. The accompaniment promise (the soul of the product)

Every interaction is governed by five non-negotiable principles. These are not
marketing copy — they are product constraints that show up in the AI's system
prompt, the content guidelines, and the UX.

1. **Accompaniment, not authority.** We walk *with*, we don't rule *over*. We offer,
   we don't prescribe. We use "you might consider…" not "you must…".
2. **No judgment, ever.** No shame, no condemnation, no gatekeeping of who is "faithful
   enough." All stages of the journey are welcome — including doubt and unbelief.
3. **Tradition-authentic.** Guidance is grounded in references genuine to the user's
   selected faith. We never blend traditions unless the user asks, and we never
   invent scripture.
4. **Companionship over correctness.** A person in pain needs presence first, teaching
   second. We comfort before we instruct.
5. **Humility about our limits.** We are not a priest, rabbi, imam, therapist, or
   doctor. We say so, and we hand off to humans and emergency resources when needed.

## 4. Who we serve (personas)

- **Searching Sofia (19, bilingual, nominally raised Catholic, lapsed).** Anxious,
  lonely, curious about faith but allergic to being preached at. Wants a safe, private
  place to ask "dumb questions" without judgment. *The primary persona.*
- **Returning Marcus (34, was Protestant, drifted, wants back in).** Needs scaffolding
  to rebuild a practice and eventually reconnect with a local church.
- **Grieving Amina (50s, devout Muslim).** Wants comfort grounded in the Quran and a
  soothing presence during a hard season — not education, accompaniment.
- **Curious Newcomer (any age, no tradition).** Exploring faith for the first time;
  needs gentle, pressure-free intro-to-faith content and help choosing a path.

Design for **Sofia first**. If the app earns the trust of a guarded, skeptical young
seeker, it will serve the others well.

## 5. Scope decisions (recommendations)

These are the high-leverage strategic choices. Each has a recommendation and a
rationale; final calls are flagged in `docs/06-open-decisions.md`.

### 5.1 Community: yes, but *phased and curated* — not a social network at launch
- **MVP = 1-on-1 only.** The trust and safety bar for user-to-user interaction is high,
  and the core value (companionship + guidance) is fully deliverable 1-on-1. Shipping a
  social layer early dilutes focus and multiplies risk.
- **Phase 2 = curated, low-risk community:** a **moderated church/community directory**
  (find a real congregation near you) and **opt-in, anonymized testimonies** (read-only,
  human-reviewed). This delivers "connection" without a DM firehose.
- **Phase 3 = facilitated peer support:** topic-based, moderated group spaces and
  optional mentor matching — only after moderation tooling is mature.

### 5.2 Human element: AI-first, with human *safety net* and *referral*, not human counseling
- The product is **AI-driven companionship**. We do **not** staff clinical counselors
  (that creates licensure, liability, and scaling problems and risks conflating us with
  therapy).
- We **do** build (a) crisis escalation to professional hotlines/emergency services, and
  (b) a vetted directory of real clergy and faith communities for human spiritual care.
- Phase 3 may add **vetted volunteer faith mentors** (peer, not clinical) under strict
  safeguarding — see safety doc.

### 5.3 Business model: free core, donation + optional supporter tier (mission-first)
- A judgment-free spiritual companion should **never paywall comfort**. The emotional-
  support core and basic resources stay **free**.
- **Sustainability via:** (1) **donations** (one-time + recurring "supporter"), (2) an
  optional **supporter tier** for premium-cost features (custom/cloned voice, unlimited
  voice minutes, advanced journaling insights), (3) **faith-org / nonprofit grants and
  partnerships** (churches, dioceses, foundations).
- **Never** advertising or selling user data. Privacy is the product; ad-targeting on
  spiritual/mental-health data would be a betrayal of the promise.
- Recommended legal posture: explore **nonprofit or PBC (public-benefit) structure** to
  align incentives and unlock grant funding.

### 5.4 The mental-health boundary (critical)
We provide **emotional and spiritual companionship**, explicitly **not** clinical mental-
health treatment. This boundary protects users and the organization:
- Clear, recurring disclosure ("I'm a spiritual companion, not a therapist or doctor").
- **No diagnosis, no treatment plans, no medication advice.**
- **Crisis detection** that surfaces professional resources (988 / local equivalents,
  emergency services) and, where appropriate, human clergy.
- Framed in onboarding, ToS, and at the moment of risk. See `docs/04-safety-...`.

## 6. What "good" looks like (guardrail metrics)

We optimize for **trust and wellbeing**, not raw engagement (engagement-maximizing
patterns are ethically wrong for this audience). Track:
- **Felt-supported rate** (lightweight in-session check-ins).
- **Safe-handling rate** for distress/crisis interactions (audited).
- **Healthy-use signals** (we actively discourage compulsive overuse; e.g., gentle
  nudges to rest, pray, or connect with real people).
- **Real-world connection** (referrals to local communities accepted).
- Retention and resource depth — secondary to the above.

## 7. Differentiation

- **Privacy-first** spiritual space (vs. public social/forum apps).
- **Multi-faith and bilingual** from day one (vs. single-tradition apps).
- **Accompaniment tone** — explicitly non-judgmental, seeker-friendly (vs. apps that
  assume you're already devout).
- **Companion + library + journal + community on-ramp** in one place.
