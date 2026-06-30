// TEMPORAL — busca voces masculinas MAYORES en castellano (España).
export default async function handler(req, res) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) { res.status(500).json({ error: "no key" }); return; }
  const headers = { "xi-api-key": key };
  const queries = [
    "gender=male&language=es&age=old&page_size=60",
    "gender=male&language=es&age=middle_aged&page_size=60",
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
          use_case: v.use_case, locale: v.locale, preview: v.preview_url,
          cloned: v.cloned_by_count,
        });
      }
    }
    // solo acento de España (peninsular/castellano)
    const spain = all.filter(v => {
      const a = (v.accent || "").toLowerCase();
      const l = (v.locale || "").toLowerCase();
      return a.includes("peninsular") || a.includes("castil") || a.includes("spain") || a === "spanish" || l.startsWith("es-es");
    });
    res.status(200).json({ total: all.length, spainCount: spain.length, spain });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
