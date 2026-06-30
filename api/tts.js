// Voz neuronal (servidor) — ElevenLabs. Suena natural y cálida, ideal para
// un acompañante espiritual. La clave queda OCULTA en el servidor.
//
// Requiere una variable de entorno en Vercel:
//   ELEVENLABS_API_KEY = ...   (plan gratuito en https://elevenlabs.io)
//
// Opcionales (tienen valores por defecto sensatos):
//   ELEVENLABS_VOICE_ID  = id de la voz (por defecto: "Sarah", cálida y serena)
//   ELEVENLABS_MODEL     = modelo (por defecto: eleven_multilingual_v2, gran español)
//
// Recibe { text, language } y devuelve audio/mpeg (mp3).

const DEFAULT_VOICE = "orF2qy9215xjwqqxqsWW"; // "Rafael" — hombre mayor, castellano de España, maduro y con presencia
const DEFAULT_MODEL = "eleven_multilingual_v2";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) { res.status(500).json({ error: "Server missing ELEVENLABS_API_KEY" }); return; }

  try {
    let { text } = req.body || {};
    if (!text || typeof text !== "string") { res.status(400).json({ error: "text required" }); return; }
    text = text.trim().slice(0, 1500); // límite de seguridad/coste; las respuestas son breves
    if (!text) { res.status(400).json({ error: "text empty" }); return; }

    const reqVoice = (req.body && typeof req.body.voice === "string") ? req.body.voice.trim() : "";
    const voice = /^[A-Za-z0-9]{15,40}$/.test(reqVoice) ? reqVoice
      : (process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE);
    const model = process.env.ELEVENLABS_MODEL || DEFAULT_MODEL;

    const r = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/mpeg" },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: {
            stability: 0.62,        // sereno y sosegado (evita el tono teatral)
            similarity_boost: 0.85,
            style: 0.18,            // calidez contenida, sin dramatizar
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!r.ok) {
      let msg = "tts error";
      try { const e = await r.json(); msg = e?.detail?.message || e?.error || msg; } catch {}
      res.status(r.status).json({ error: msg });
      return;
    }

    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(buf);
  } catch (e) {
    res.status(500).json({ error: "tts failed" });
  }
}
