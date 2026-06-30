// TEMPORAL — añade la voz Spuds (inglés, mayor) a la cuenta.
export default async function handler(req, res) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) { res.status(500).json({ error: "no key" }); return; }
  const voiceId = "NOpBlnGInO9m6vDvFkFC";
  const ownerId = req.query.owner;
  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/voices/add/${ownerId}/${voiceId}`, {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ new_name: "Spuds Alma" }),
    });
    const d = await r.json();
    res.status(r.status).json(d);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
