# Despliegue en Vercel — app sin clave (cualquiera puede acceder)

Objetivo: que **cualquier persona** entre a la app y converse **sin pegar ninguna clave**.
La clave de Anthropic queda **oculta en el servidor** (Vercel), no en el navegador.

Es gratis para empezar (plan Hobby de Vercel). Solo pagas el uso de la API de Anthropic.

---

## Pasos (una sola vez, ~5 minutos)

1. **Crea/entra a Vercel:** ve a <https://vercel.com> y pulsa **Sign Up** / **Log in**,
   eligiendo **Continue with GitHub** (usa la misma cuenta del repositorio).
2. **Importa el proyecto:** pulsa **Add New… → Project**. Verás tu lista de repositorios
   de GitHub. Busca **God_App** y pulsa **Import**.
   - Si no aparece, pulsa **Adjust GitHub App Permissions** y dale acceso al repositorio.
3. **Configuración:** Vercel detecta la configuración por el archivo `vercel.json`
   (sirve la carpeta `web/` como sitio y `api/` como funciones). No cambies nada.
4. **Variable de entorno (lo importante):** despliega la sección **Environment Variables**
   y añade:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** tu clave `sk-ant-...` (de <https://console.anthropic.com/settings/keys>)
   - Pulsa **Add**.
5. **Deploy:** pulsa **Deploy** y espera ~1 minuto.
6. **Listo:** Vercel te da una URL como **`https://god-app.vercel.app`**. Ábrela en el
   móvil — **no pide clave a nadie**. Compártela con quien quieras.

> Cada vez que se actualice `main` en GitHub, Vercel **redespliega solo**.

---

## Cómo funciona (y por qué es seguro)

- La app (`web/`) detecta que **no** está en `github.io`, así que llama a su propio
  backend `/api/chat` (función en `api/chat.js`) en lugar de pedir clave.
- El backend:
  - Guarda la clave en la variable de entorno (**nunca llega al navegador**).
  - **Construye el carácter del acompañante en el servidor** a partir de
    `{tradición, idioma, nombre, modo}`. Así nadie puede usar tu clave como una IA
    genérica: solo responde como el acompañante espiritual.
  - Aplica **límites de tamaño** (longitud de mensajes/conversación) y un **límite de
    peticiones por IP** (best-effort).

---

## Control de costes y abuso (recomendado)

Como la app es pública, cualquiera que tenga la URL puede generar consumo de API.

1. **Pon un límite de gasto** en la consola de Anthropic
   (<https://console.anthropic.com> → Billing / Limits). Es la protección más importante.
2. El backend ya limita ~30 peticiones por IP por minuto. Para algo más robusto en
   producción, considera:
   - **Vercel KV / Upstash Redis** para un límite de peticiones persistente.
   - Un **proveedor de CAPTCHA** o autenticación ligera si hay abuso.
3. Vigila el uso en el panel de Anthropic los primeros días.

---

## Dominio propio (opcional)

En Vercel: **Project → Settings → Domains → Add**. Puedes conectar un dominio que ya
tengas (p. ej. `alma.tudominio.com`) o comprar uno. Vercel configura el HTTPS solo.

---

## Resolución de problemas

- **"Server missing ANTHROPIC_API_KEY":** falta la variable de entorno o se escribió mal
  el nombre. Revisa **Settings → Environment Variables** y vuelve a desplegar
  (**Deployments → ⋯ → Redeploy**).
- **La app pide clave igualmente:** estás abriendo la URL de GitHub Pages, no la de
  Vercel. Usa la URL `…vercel.app`.
- **Error 429 ("demasiadas peticiones"):** es el límite por IP; espera un minuto.
