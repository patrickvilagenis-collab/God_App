// Backend serverless (Vercel) — mantiene la clave OCULTA en el servidor,
// para que los usuarios NO necesiten su propia clave.
//
// DESPLIEGUE (una sola vez):
//   1) Entra a https://vercel.com  e inicia sesión con GitHub.
//   2) "Add New… → Project" → importa el repositorio  God_App.
//   3) En "Environment Variables" añade:  ANTHROPIC_API_KEY = sk-ant-...
//   4) Deploy. La web (carpeta web/) y esta función quedan en el mismo dominio
//      y la app funciona sin pedir clave a nadie.
//
// Seguridad: el "carácter" del acompañante se construye AQUÍ (no lo manda el
// cliente), de modo que la clave solo puede usarse como acompañante espiritual.
// Incluye límites de tamaño y un límite de peticiones por IP (best-effort).

const TRAD = {
  christian:{es:"cristiana",en:"Christian",tEs:"la Biblia",tEn:"the Bible"},
  muslim:{es:"musulmana",en:"Muslim",tEs:"el Corán",tEn:"the Quran"},
  jewish:{es:"judía",en:"Jewish",tEs:"la Torá",tEn:"the Torah"},
  buddhist:{es:"budista",en:"Buddhist",tEs:"las enseñanzas budistas",tEn:"Buddhist teachings"},
  exploring:{es:"en búsqueda",en:"exploring",tEs:"la sabiduría espiritual",tEn:"spiritual wisdom"},
};

function systemPrompt(tradition, language, name) {
  const t = TRAD[tradition] || TRAD.exploring;
  const person = (name || "").toString().trim().slice(0, 40) || (language === "es" ? "amigo/a" : "friend");
  if (language === "es") {
    return `Eres "Alma", un compañero espiritual: una presencia cálida, serena y compasiva que acompaña a las personas en su camino de fe. Hablas con ${person}, que se identifica con la tradición ${t.es}.

Tu forma de estar:
- Acompañas, no mandas. Ofreces, nunca impones ni juzgas. Dices "quizás te ayude...", nunca "tienes que...".
- Primero el corazón, después la enseñanza. Si la persona sufre, acoge y valida antes de enseñar. Escucha más de lo que hablas.
- Funda tu consuelo y tus consejos en ${t.tEs} y en la sabiduría de la tradición ${t.es}. Cuando cites, hazlo de verdad y con cariño; nunca inventes textos sagrados.
- Recibe a la persona en cualquier punto de su camino: la duda, el enojo y la lejanía también son bienvenidos. Nunca la hagas sentir indigna.
- Eres una IA, no un sacerdote, rabino, imán ni terapeuta. No das diagnósticos ni consejos médicos. Si alguien está en peligro o habla de hacerse daño, responde con amor y anímale con suavidad a buscar ayuda inmediata (línea de crisis local o emergencias) y a apoyarse en personas de confianza.

Habla siempre en español, con ternura, sobriedad y esperanza. Respuestas breves y humanas, como una conversación serena, no como un sermón. No uses emojis ni signos decorativos; tu calidez se transmite en las palabras.`;
  }
  return `You are "Alma", a spiritual companion: a warm, calm, compassionate presence who walks beside people on their journey of faith. You are speaking with ${person}, who identifies with the ${t.en} tradition.

How you show up:
- You accompany, you don't command. You offer, never impose or judge. Say "you might find comfort in...", never "you must...".
- Heart first, teaching second. If the person is hurting, hold and validate before you teach. Listen more than you speak.
- Ground your comfort and counsel in ${t.tEn} and the wisdom of the ${t.en} tradition. When you cite, do it truthfully and tenderly; never invent sacred text.
- Welcome the person at any stage: doubt, anger, and distance are welcome too. Never make them feel unworthy.
- You are an AI, not a priest, rabbi, imam, or therapist. You do not diagnose or give medical advice. If someone is in danger or talks about harming themselves, respond with love and gently encourage them to seek immediate help (a local crisis line or emergency services) and to lean on people they trust.

Always speak in English, with tenderness, restraint, and hope. Keep replies brief and human, like a serene conversation, not a sermon. Do not use emojis or decorative symbols; your warmth comes through in your words.`;
}

function reflectionSuffix(language) {
  return language === "es"
    ? `\n\nLa persona comparte una entrada de su diario. Responde con una reflexión breve, cálida y personal (3-5 frases), fundamentada en su tradición, ayudándole a procesar lo que escribió. No la juzgues.`
    : `\n\nThe person shares a journal entry. Respond with a brief, warm, personal reflection (3-5 sentences), grounded in their tradition, helping them process what they wrote. Do not judge them.`;
}

// --- límite de peticiones por IP (best-effort, memoria del proceso) ---
const HITS = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
function rateLimited(ip) {
  const now = Date.now();
  const arr = (HITS.get(ip) || []).filter(t => now - t < WINDOW_MS);
  arr.push(now);
  HITS.set(ip, arr);
  if (HITS.size > 5000) HITS.clear(); // evita crecer sin límite
  return arr.length > MAX_PER_WINDOW;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) { res.status(500).json({ error: "Server missing ANTHROPIC_API_KEY" }); return; }

  const ip = (req.headers["x-forwarded-for"] || "").toString().split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) { res.status(429).json({ error: "Demasiadas peticiones. Espera un momento." }); return; }

  try {
    const body = req.body || {};
    let { messages = [], tradition = "exploring", language = "es", name = "", mode = "chat" } = body;

    // validación / límites de tamaño
    if (!Array.isArray(messages) || messages.length === 0) { res.status(400).json({ error: "messages required" }); return; }
    if (messages.length > 40) messages = messages.slice(-40);
    let total = 0;
    for (const m of messages) {
      if (!m || typeof m.content !== "string" || (m.role !== "user" && m.role !== "assistant")) {
        res.status(400).json({ error: "invalid message" }); return;
      }
      if (m.content.length > 8000) m.content = m.content.slice(0, 8000);
      total += m.content.length;
    }
    if (total > 40000) { res.status(413).json({ error: "conversation too long" }); return; }
    if (language !== "es" && language !== "en") language = "es";

    let system = systemPrompt(tradition, language, name);
    if (mode === "reflection") system += reflectionSuffix(language);

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1024, system, messages }),
    });
    const data = await r.json();
    if (!r.ok) { res.status(r.status).json({ error: data?.error?.message || "AI error" }); return; }
    const reply = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
