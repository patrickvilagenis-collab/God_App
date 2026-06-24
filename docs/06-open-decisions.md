# Open Decisions

The strategic calls that are genuinely yours to make. Each has my recommendation and the
trade-off, so you can confirm or redirect. Resolving these unlocks detailed design and a
build plan.

| # | Decision | Recommendation | Why / trade-off |
|---|----------|----------------|-----------------|
| 1 | **Launch traditions** | Christianity + Islam, deep & excellent (add Judaism/Buddhism/etc. in P2) | "Deep on a few" earns trust; "shallow on ten" risks doctrinal errors. Pairs well with EN/ES audience. *Confirm which traditions.* |
| 2 | **Minimum age** | Launch **18+** (expand to 13/16+ later with a youth-safety build) | The audience skews young (pulls toward 13+), but minor-safety + COPPA + age-appropriate-design is a large MVP burden. Big risk/scope lever. |
| 3 | **Business model** | Free core + donations + optional supporter tier (premium voice/media); nonprofit or PBC structure; never ads/data-sale | Aligns with the no-judgment, privacy-first mission; unlocks grants. Trade-off: slower revenue than freemium-paywall. |
| 4 | **Human element** | AI-first; humans only as crisis referral + church directory + (P3) vetted volunteer mentors. No staff clinical counselors. | Avoids licensure/liability and scales; keeps the clinical boundary clean. Trade-off: no live human comfort at launch. |
| 5 | **Community scope/timing** | Private 1-on-1 only at MVP; directory + curated testimonies P2; groups/mentors P3 | Trust & safety bar for user-to-user is high; core value is fully deliverable 1-on-1. Trade-off: "connection" goal arrives later. |
| 6 | **Cloned voice in MVP or P2** | **P2**, behind a hard consent gate | Highest-sensitivity feature (biometric, deepfake, consent, cost). MVP ships preset soothing voices. Trade-off: a signature feature waits. |
| 7 | **Journal privacy model** | Standard encrypted by default + optional "extra-private / no-AI" mode; consider E2E later | E2E maximizes trust but limits server-side AI reflection. Offering both lets the user choose. |
| 8 | **Platform first** | Recommend **mobile-first** (the audience lives on phones); responsive web alongside | Where Sofia is. Trade-off: native effort vs. cross-platform framework — an engineering call. |

## Suggested next steps once these are set
1. Confirm decisions 1–8 above (especially traditions, age, and business model).
2. Recruit the **faith advisory board** + a mental-health professional + privacy/ethics
   advisor (gates tradition modules and crisis flows).
3. Clear **scripture licensing** for the chosen traditions in EN **and** ES.
4. Build the **crisis-handling flow** and localized resource directory (it gates launch).
5. Prototype the **first-time flow + core conversation loop** for the primary persona and
   test the *tone* with real young seekers before building breadth.

## Notes / assumptions baked into these docs
- Primary persona is a guarded, bilingual young seeker ("Sofia"); design choices favor
  trust, low pressure, and privacy over engagement maximization.
- "Less alone" and emotional safety are the top goal; when goals conflict, companionship
  wins over correctness or growth metrics.
- The app is explicitly **not** clinical mental-health care and must never be marketed or
  designed as a therapy substitute.
