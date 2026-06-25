// Transcripción de notas de voz (servidor) — usa Groq Whisper (rápido y gratis).
//
// Requiere una variable de entorno en Vercel:
//   GROQ_API_KEY = gsk_...   (gratis en https://console.groq.com/keys)
//
// Recibe { audio: base64, mime, language } y devuelve { text }.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

  const groq = process.env.GROQ_API_KEY;
  if (!groq) { res.status(500).json({ error: "Server missing GROQ_API_KEY" }); return; }

  try {
    const { audio, mime = "audio/webm", language = "es" } = req.body || {};
    if (!audio || typeof audio !== "string") { res.status(400).json({ error: "audio required" }); return; }
    const buffer = Buffer.from(audio, "base64");
    if (buffer.length < 200) { res.status(400).json({ error: "audio too short" }); return; }
    if (buffer.length > 9 * 1024 * 1024) { res.status(413).json({ error: "audio too large" }); return; }

    const ext = mime.includes("mp4") ? "mp4" : mime.includes("mpeg") || mime.includes("mp3") ? "mp3"
      : mime.includes("ogg") ? "ogg" : mime.includes("wav") ? "wav" : "webm";

    const form = new FormData();
    form.append("file", new Blob([buffer], { type: mime }), "note." + ext);
    form.append("model", "whisper-large-v3-turbo");
    if (language === "es" || language === "en") form.append("language", language);
    form.append("response_format", "json");

    const r = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${groq}` },
      body: form,
    });
    const data = await r.json();
    if (!r.ok) { res.status(r.status).json({ error: data?.error?.message || "transcription error" }); return; }
    res.status(200).json({ text: (data.text || "").trim() });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
