// Backend serverless (Vercel) — mantiene la clave OCULTA en el servidor.
// Con esto, los usuarios NO necesitan su propia clave.
//
// Para desplegar:
//   1) Sube el repo a Vercel (vercel.com) — detecta este proyecto solo.
//   2) En Vercel → Settings → Environment Variables, añade:
//         ANTHROPIC_API_KEY = sk-ant-...
//   3) Deploy. La web (carpeta web/) y esta función quedan en el mismo dominio,
//      y la app la usa automáticamente (sin pedir clave).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(500).json({ error: "Server missing ANTHROPIC_API_KEY" });
    return;
  }
  try {
    const { messages = [], system = "", model = "claude-sonnet-4-6" } = req.body || {};
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({ model, max_tokens: 1024, system, messages }),
    });
    const data = await r.json();
    if (!r.ok) {
      res.status(r.status).json({ error: data?.error?.message || "AI error" });
      return;
    }
    const reply = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
