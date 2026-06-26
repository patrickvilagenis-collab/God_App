// TEMPORAL — busca voces masculinas en español nativo en la biblioteca compartida.
export default async function handler(req, res) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) { res.status(500).json({ error: "no key" }); return; }
  try {
    const url = "https://api.elevenlabs.io/v1/shared-voices?gender=male&language=es&page_size=40&sort=trending";
    const r = await fetch(url, { headers: { "xi-api-key": key } });
    const d = await r.json();
    if (!r.ok) { res.status(r.status).json({ error: d, status: r.status }); return; }
    const voices = (d.voices || []).map(v => ({
      id: v.voice_id, owner: v.public_owner_id, name: v.name,
      accent: v.accent, descriptive: v.descriptive, age: v.age,
      use_case: v.use_case, lang: v.language, locale: v.locale,
      preview: v.preview_url, cloned: v.cloned_by_count, uses: v.usage_character_count_1y,
    }));
    res.status(200).json({ count: voices.length, voices });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
