// TEMPORAL — busca voces masculinas MAYORES en inglés (equivalente a Rafael).
export default async function handler(req, res) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) { res.status(500).json({ error: "no key" }); return; }
  const headers = { "xi-api-key": key };
  const queries = [
    "gender=male&language=en&age=old&page_size=60&sort=trending",
    "gender=male&language=en&age=middle_aged&page_size=60&sort=trending",
  ];
  const seen = {}, all = [];
  try {
    for (const q of queries) {
      const r = await fetch("https://api.elevenlabs.io/v1/shared-voices?" + q, { headers });
      const d = await r.json();
      if (!r.ok) { res.status(r.status).json({ error: d }); return; }
      for (const v of (d.voices || [])) {
        if (seen[v.voice_id]) continue;
        seen[v.voice_id] = 1;
        all.push({
          id: v.voice_id, owner: v.public_owner_id, name: v.name,
          accent: v.accent, descriptive: v.descriptive, age: v.age,
          use_case: v.use_case, preview: v.preview_url, cloned: v.cloned_by_count,
        });
      }
    }
    res.status(200).json({ total: all.length, voices: all });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
