// TEMPORAL — diagnóstico para elegir una buena voz en español.
// Lista las voces propias y voces compartidas (español, hombre).
export default async function handler(req, res) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) { res.status(500).json({ error: "no key" }); return; }
  const out = {};
  try {
    const r1 = await fetch("https://api.elevenlabs.io/v1/voices", { headers: { "xi-api-key": key } });
    const d1 = await r1.json();
    out.mine = (d1.voices || []).map(v => ({
      id: v.voice_id, name: v.name, cat: v.category,
      labels: v.labels, lang: v.fine_tuning?.language,
    }));
  } catch (e) { out.mineErr = String(e); }
  try {
    const r2 = await fetch("https://api.elevenlabs.io/v1/shared-voices?gender=male&language=es&page_size=25", { headers: { "xi-api-key": key } });
    const d2 = await r2.json();
    out.shared = (d2.voices || []).map(v => ({
      id: v.voice_id, public_owner_id: v.public_owner_id, name: v.name,
      accent: v.accent, lang: v.language, descriptive: v.descriptive,
      use_case: v.use_case, preview: v.preview_url,
    }));
  } catch (e) { out.sharedErr = String(e); }
  res.status(200).json(out);
}
