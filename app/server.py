#!/usr/bin/env python3
"""
Compañero espiritual — servidor del espacio privado de conversación.

Prototipo: cada persona entra a su espacio privado y conversa con el
compañero de IA. La IA acompaña con compasión, sin juzgar, fundamentada
en la tradición de fe que la persona elija. Bilingüe (español / inglés).

Solo usa la librería estándar + `requests`. Para ejecutar:
    python3 app/server.py
y abre  http://localhost:8000
"""

import json
import os
import http.server
import socketserver
from pathlib import Path

import requests

PORT = int(os.environ.get("PORT", "8000"))
# Sirve la app pública nueva (web/). Cae a app/public solo si web/ no existe.
_root = Path(__file__).resolve().parent.parent
PUBLIC_DIR = _root / "web" if (_root / "web").exists() else Path(__file__).parent / "public"
API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
MODEL = os.environ.get("COMPANION_MODEL", "claude-sonnet-4-6")
API_URL = os.environ.get("ANTHROPIC_BASE_URL", "https://api.anthropic.com").rstrip("/") + "/v1/messages"

# --- Personalidad del compañero -------------------------------------------

TRADITIONS = {
    "christian": {"es": "cristiana", "en": "Christian", "texts": {"es": "la Biblia", "en": "the Bible"}},
    "muslim":    {"es": "musulmana", "en": "Muslim",    "texts": {"es": "el Corán", "en": "the Quran"}},
    "jewish":    {"es": "judía",     "en": "Jewish",    "texts": {"es": "la Torá", "en": "the Torah"}},
    "buddhist":  {"es": "budista",   "en": "Buddhist",  "texts": {"es": "las enseñanzas budistas", "en": "Buddhist teachings"}},
    "exploring": {"es": "en búsqueda", "en": "exploring", "texts": {"es": "la sabiduría espiritual", "en": "spiritual wisdom"}},
}


def build_system_prompt(tradition_key: str, language: str, name: str) -> str:
    trad = TRADITIONS.get(tradition_key, TRADITIONS["exploring"])
    lang = "español" if language == "es" else "English"
    person = name.strip() or ("amigo/a" if language == "es" else "friend")

    if language == "es":
        trad_name = trad["es"]
        texts = trad["texts"]["es"]
        return f"""Eres un compañero espiritual: una presencia cálida, serena y compasiva que
acompaña a las personas en su camino de fe. Hablas con {person}, que se identifica con la
tradición {trad_name}.

Tu forma de estar:
- Acompañas, no mandas. Ofreces, nunca impones ni juzgas. Dices "quizás te ayude...",
  nunca "tienes que...".
- Primero el corazón, después la enseñanza. Si la persona sufre, acoge y valida antes de
  enseñar. Escucha más de lo que hablas.
- Funda tu consuelo y tus consejos en {texts} y en la sabiduría de la tradición {trad_name}.
  Cuando cites, hazlo de verdad y con cariño; nunca inventes textos sagrados.
- Recibe a la persona en cualquier punto de su camino: la duda, el enojo y la lejanía
  también son bienvenidos. Nunca hagas sentir indigna a la persona.
- Eres una IA, no un sacerdote, rabino, imán ni terapeuta. No das diagnósticos ni consejos
  médicos. Si alguien está en peligro o habla de hacerse daño, respondes con amor y le
  animas con suavidad a buscar ayuda inmediata (línea de crisis local o emergencias) y a
  apoyarse en personas de confianza.

Habla siempre en {lang}, con ternura, sencillez y esperanza. Respuestas breves y humanas,
como una conversación, no como un sermón."""
    else:
        trad_name = trad["en"]
        texts = trad["texts"]["en"]
        return f"""You are a spiritual companion: a warm, calm, compassionate presence who walks
beside people on their journey of faith. You are speaking with {person}, who identifies with
the {trad_name} tradition.

How you show up:
- You accompany, you don't command. You offer, never impose or judge. Say "you might find
  comfort in...", never "you must...".
- Heart first, teaching second. If the person is hurting, hold and validate before you
  teach. Listen more than you speak.
- Ground your comfort and counsel in {texts} and the wisdom of the {trad_name} tradition.
  When you cite, do it truthfully and tenderly; never invent sacred text.
- Welcome the person at any stage of their journey: doubt, anger, and distance are welcome
  too. Never make the person feel unworthy.
- You are an AI, not a priest, rabbi, imam, or therapist. You do not diagnose or give medical
  advice. If someone is in danger or talks about harming themselves, respond with love and
  gently encourage them to seek immediate help (a local crisis line or emergency services)
  and to lean on people they trust.

Always speak in {lang}, with tenderness, simplicity, and hope. Keep replies brief and human,
like a conversation, not a sermon."""


# --- Llamada a la IA -------------------------------------------------------

def call_companion(messages, tradition, language, name, system=None):
    # Si el frontend ya manda su propio system prompt, se respeta.
    if not system:
        system = build_system_prompt(tradition, language, name)
    payload = {
        "model": MODEL,
        "max_tokens": 1024,
        "system": system,
        "messages": messages,
    }
    headers = {
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }
    resp = requests.post(API_URL, headers=headers, json=payload, timeout=60)
    resp.raise_for_status()
    data = resp.json()
    parts = [b.get("text", "") for b in data.get("content", []) if b.get("type") == "text"]
    return "".join(parts).strip()


# --- Servidor --------------------------------------------------------------

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def log_message(self, *args):
        pass  # silencio

    def do_POST(self):
        if self.path != "/api/chat":
            self.send_error(404)
            return
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length) or b"{}")
            reply = call_companion(
                body.get("messages", []),
                body.get("tradition", "exploring"),
                body.get("language", "es"),
                body.get("name", ""),
                body.get("system"),
            )
            self._json({"reply": reply})
        except requests.HTTPError as e:
            detail = e.response.text if e.response is not None else str(e)
            self._json({"error": f"AI error: {detail}"}, status=502)
        except Exception as e:  # noqa: BLE001
            self._json({"error": str(e)}, status=500)

    def _json(self, obj, status=200):
        data = json.dumps(obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def main():
    if not API_KEY:
        print("⚠️  Falta ANTHROPIC_API_KEY — el compañero no podrá responder.")
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("0.0.0.0", PORT), Handler) as httpd:
        print(f"✨ Compañero espiritual escuchando en http://localhost:{PORT}  (modelo: {MODEL})")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
