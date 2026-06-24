# Compañero espiritual — prototipo del espacio privado

Este es el **espacio privado donde la persona conversa con el compañero de IA**
(la primera prioridad del proyecto). Funciona en español e inglés, fundamentado
en la tradición de fe que la persona elija, con voz suave opcional.

## Qué hace
- 🔒 **Espacio privado**: cada persona entra a su propio espacio y conversa.
- ✝️☪️✡️☸️ **Multi-fe**: cristiana, musulmana, judía, budista o "en búsqueda".
- 🌐 **Bilingüe**: español / inglés (botón arriba a la derecha).
- 🔊 **Voz suave**: lee las respuestas en voz alta (botón del altavoz).
- 🎙️ **Hablar en vez de escribir**: dictado por voz (botón del micrófono, en Chrome).
- 💜 **Tono**: acompaña, nunca juzga; consuela primero, enseña después; cita los
  textos sagrados de verdad; y ante una crisis responde con amor y anima a buscar ayuda.

## Cómo ejecutarlo

Necesitas Python 3 y una clave de la API de Anthropic.

```bash
pip install requests                 # única dependencia
export ANTHROPIC_API_KEY=sk-ant-...  # tu clave
python3 app/server.py                # arranca el servidor
```

Luego abre **http://localhost:8000** en el navegador.

### Variables opcionales
- `PORT` — puerto (por defecto 8000)
- `COMPANION_MODEL` — modelo de IA (por defecto `claude-sonnet-4-6`)

## Estructura
```
app/
  server.py        # servidor + personalidad del compañero + llamada a la IA
  public/
    index.html     # interfaz del espacio privado y el chat
```

## Nota importante
Es un **prototipo**. El "espacio privado" guarda la sesión solo en el navegador
(aún no hay login real ni base de datos). Antes de usarse con personas reales hay
que añadir: cuentas seguras, almacenamiento cifrado, y el flujo de seguridad para
crisis con líneas de ayuda locales. Ver los documentos de estrategia en `../docs`.
