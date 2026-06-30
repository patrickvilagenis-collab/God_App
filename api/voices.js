// TEMPORAL — añade la voz elegida (Rafael) a la cuenta y devuelve su voice_id usable.
export default async function handler(req, res) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) { res.status(500).json({ error: "no key" }); return; }
  const PUBLIC_OWNER = "ec53e0f9bc0b2d72ff4c9d4d62e2c25b9ce81dd49f1d6c4f3a0b1f0e9a"; // placeholder, se ignora
  // Datos reales de Rafael (peninsular, mayor):
  const voiceId = "orF2qy9215xjwqqxqsWW";
  const ownerId = req.query.owner; // se pasa por query para no hardcodear mal
  const name = "Rafael Alma";
  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/voices/add/${ownerId}/${voiceId}`, {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ new_name: name }),
    });
    const d = await r.json();
    res.status(r.status).json(d);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
