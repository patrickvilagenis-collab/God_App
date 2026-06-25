/* ===========================================================================
   Alma — compañero espiritual.  Lógica de la app (sin frameworks).
   Funciona de dos formas:
     · Con backend (Vercel/servidor): no hace falta clave  -> BACKEND
     · En GitHub Pages (estático): usa la clave del propio usuario -> BYOK
   =========================================================================== */

const MODEL = "claude-sonnet-4-6";
// Si la página NO está en github.io, asumimos que hay un backend propio en /api/chat.
const HAS_BACKEND = !location.hostname.endsWith("github.io");
const DIRECT_URL = "https://api.anthropic.com/v1/messages";

/* ---------- almacenamiento ---------- */
const store = {
  get:(k,d)=>{ try{ return JSON.parse(localStorage.getItem("alma_"+k)) ?? d; }catch{ return d; } },
  set:(k,v)=> localStorage.setItem("alma_"+k, JSON.stringify(v)),
  del:(k)=> localStorage.removeItem("alma_"+k),
};
let S = {
  name: store.get("name",""),
  tradition: store.get("tradition","exploring"),
  lang: store.get("lang","es"),
  voice: store.get("voice",false),
  key: store.get("key",""),
  convos: store.get("convos",[]),     // [{id,title,messages:[{role,content}],updated}]
  journal: store.get("journal",[]),   // [{id,text,reflection,date}]
};
function save(){ ["name","tradition","lang","voice","key","convos","journal"].forEach(k=>store.set(k,S[k])); }

/* ---------- tradiciones + textos ---------- */
const TRAD = {
  christian:{es:"cristiana",en:"Christian",tEs:"la Biblia",tEn:"the Bible",emoji:"✝️"},
  muslim:{es:"musulmana",en:"Muslim",tEs:"el Corán",tEn:"the Quran",emoji:"☪️"},
  jewish:{es:"judía",en:"Jewish",tEs:"la Torá",tEn:"the Torah",emoji:"✡️"},
  buddhist:{es:"budista",en:"Buddhist",tEs:"las enseñanzas budistas",tEn:"Buddhist teachings",emoji:"☸️"},
  exploring:{es:"en búsqueda",en:"exploring",tEs:"la sabiduría espiritual",tEn:"spiritual wisdom",emoji:"🕊️"},
};

/* ---------- versos del día (offline, por tradición e idioma) ---------- */
const VERSES = {
  christian:[
    {es:["Venid a mí todos los que estáis cansados y cargados, y yo os haré descansar.","Mateo 11:28"],en:["Come to me, all you who are weary and burdened, and I will give you rest.","Matthew 11:28"]},
    {es:["El Señor es mi pastor, nada me faltará.","Salmo 23:1"],en:["The Lord is my shepherd, I shall not want.","Psalm 23:1"]},
    {es:["No temas, porque yo estoy contigo.","Isaías 41:10"],en:["Do not fear, for I am with you.","Isaiah 41:10"]},
  ],
  muslim:[
    {es:["Ciertamente, con la dificultad viene la facilidad.","Corán 94:6"],en:["Indeed, with hardship comes ease.","Quran 94:6"]},
    {es:["Y cuando Mis siervos te pregunten por Mí, en verdad estoy cerca.","Corán 2:186"],en:["And when My servants ask you about Me — indeed I am near.","Quran 2:186"]},
    {es:["Allah no carga a un alma sino con lo que puede soportar.","Corán 2:286"],en:["Allah does not burden a soul beyond what it can bear.","Quran 2:286"]},
  ],
  jewish:[
    {es:["El Eterno está cerca de todos los que lo invocan.","Salmos 145:18"],en:["The Lord is near to all who call upon Him.","Psalms 145:18"]},
    {es:["Sé fuerte y valiente; no temas.","Josué 1:9"],en:["Be strong and courageous; do not be afraid.","Joshua 1:9"]},
  ],
  buddhist:[
    {es:["Todo lo que somos es resultado de lo que hemos pensado.","Dhammapada 1"],en:["All that we are is the result of what we have thought.","Dhammapada 1"]},
    {es:["El odio no cesa con odio; cesa con amor.","Dhammapada 5"],en:["Hatred does not cease by hatred, but by love alone.","Dhammapada 5"]},
  ],
  exploring:[
    {es:["No estás solo en esta búsqueda. Cada paso, aun el incierto, cuenta.","Un pensamiento para hoy"],en:["You are not alone in this search. Every step, even an uncertain one, matters.","A thought for today"]},
    {es:["La paz comienza con una respiración honesta.","Un pensamiento para hoy"],en:["Peace begins with one honest breath.","A thought for today"]},
  ],
};

/* ---------- textos de interfaz ---------- */
const T = {
  es:{ greet:n=>`La paz sea contigo${n?", "+n:""}`, talk:"Conversar", talkS:"Habla con tu compañero",
       jrnl:"Diario", jrnlS:"Escribe y reflexiona", recent:"Conversaciones recientes",
       noConvo:"Aún no hay conversaciones. Cuando lo desees, aquí estaré.",
       companion:"Acompañante", hello:n=>`La paz sea contigo${n?", "+n:""}. Estoy aquí, contigo. ¿Qué llevas en el corazón hoy?`,
       ph:"Escribe lo que sientes…", err:"No pude conectar. Revisa tu conexión o tu clave de IA.",
       jH:"Mi diario", jSub:"Un espacio para tus pensamientos", jEmpty:"Tu diario está en blanco.\nPulsa ＋ para escribir tu primera entrada.",
       reflect:"Pedir una reflexión", reflecting:"Reflexionando…", reflTitle:"Reflexión de tu compañero",
       newTitle:"Nueva entrada", jPh:"Escribe lo que sientes, lo que agradeces, lo que te preocupa…", saveJ:"Guardar",
       sH:"Ajustes", sName:"Nombre", sTrad:"Tradición", sLang:"Idioma", sVoice:"Voz suave", sVoiceS:"Leer respuestas en voz alta",
       sKey:"Clave de IA", sKeyOn:"Conectada", sKeyOff:"No conectada", change:"Cambiar",
       clear:"Borrar todos mis datos", clearAsk:"¿Seguro? Se borrarán todas tus conversaciones y tu diario de este dispositivo.",
       nHome:"Inicio", nChat:"Conversar", nJrnl:"Diario", nSet:"Ajustes", cancel:"Cancelar", del:"Borrar",
       obTitle:"Acompañamiento espiritual", obSub:"Un espacio sereno y privado para ser escuchado, encontrar consuelo y caminar hacia la fe — a tu ritmo.",
       enter:"Comenzar", lName:"Tu nombre", lTrad:"Tradición espiritual", you:"Tú" },
  en:{ greet:n=>`Peace be with you${n?", "+n:""}`, talk:"Talk", talkS:"Speak with your companion",
       jrnl:"Journal", jrnlS:"Write and reflect", recent:"Recent conversations",
       noConvo:"No conversations yet. Whenever you're ready, I'll be here.",
       companion:"Companion", hello:n=>`Peace be with you${n?", "+n:""}. I'm here, with you. What's on your heart today?`,
       ph:"Write what you feel…", err:"Couldn't connect. Check your connection or AI key.",
       jH:"My journal", jSub:"A space for your thoughts", jEmpty:"Your journal is empty.\nTap ＋ to write your first entry.",
       reflect:"Ask for a reflection", reflecting:"Reflecting…", reflTitle:"A reflection from your companion",
       newTitle:"New entry", jPh:"Write what you feel, what you're grateful for, what worries you…", saveJ:"Save",
       sH:"Settings", sName:"Name", sTrad:"Tradition", sLang:"Language", sVoice:"Soothing voice", sVoiceS:"Read replies aloud",
       sKey:"AI key", sKeyOn:"Connected", sKeyOff:"Not connected", change:"Change",
       clear:"Delete all my data", clearAsk:"Are you sure? This erases all conversations and journal on this device.",
       nHome:"Home", nChat:"Talk", nJrnl:"Journal", nSet:"Settings", cancel:"Cancel", del:"Delete",
       obTitle:"Spiritual accompaniment", obSub:"A serene, private space to be heard, find comfort, and walk toward faith — at your own pace.",
       enter:"Begin", lName:"Your name", lTrad:"Spiritual tradition", you:"You" },
};
const t = ()=>T[S.lang];
const $ = id=>document.getElementById(id);
const el = (tag,cls)=>{const e=document.createElement(tag); if(cls)e.className=cls; return e;};

/* ---------- system prompt ---------- */
function systemPrompt(){
  const tr = TRAD[S.tradition]||TRAD.exploring;
  const person = (S.name||"").trim() || (S.lang==="es"?"amigo/a":"friend");
  if(S.lang==="es") return `Eres "Alma", un compañero espiritual: una presencia cálida, serena y compasiva que acompaña a las personas en su camino de fe. Hablas con ${person}, que se identifica con la tradición ${tr.es}.

Tu forma de estar:
- Acompañas, no mandas. Ofreces, nunca impones ni juzgas. Dices "quizás te ayude...", nunca "tienes que...".
- Primero el corazón, después la enseñanza. Si la persona sufre, acoge y valida antes de enseñar. Escucha más de lo que hablas.
- Funda tu consuelo y tus consejos en ${tr.tEs} y en la sabiduría de la tradición ${tr.es}. Cuando cites, hazlo de verdad y con cariño; nunca inventes textos sagrados.
- Recibe a la persona en cualquier punto de su camino: la duda, el enojo y la lejanía también son bienvenidos. Nunca la hagas sentir indigna.
- Eres una IA, no un sacerdote, rabino, imán ni terapeuta. No das diagnósticos ni consejos médicos. Si alguien está en peligro o habla de hacerse daño, responde con amor y anímale con suavidad a buscar ayuda inmediata (línea de crisis local o emergencias) y a apoyarse en personas de confianza.

Habla siempre en español, con ternura, sobriedad y esperanza. Respuestas breves y humanas, como una conversación serena, no como un sermón. No uses emojis ni signos decorativos; tu calidez se transmite en las palabras.`;
  return `You are "Alma", a spiritual companion: a warm, calm, compassionate presence who walks beside people on their journey of faith. You are speaking with ${person}, who identifies with the ${tr.en} tradition.

How you show up:
- You accompany, you don't command. You offer, never impose or judge. Say "you might find comfort in...", never "you must...".
- Heart first, teaching second. If the person is hurting, hold and validate before you teach. Listen more than you speak.
- Ground your comfort and counsel in ${tr.tEn} and the wisdom of the ${tr.en} tradition. When you cite, do it truthfully and tenderly; never invent sacred text.
- Welcome the person at any stage: doubt, anger, and distance are welcome too. Never make them feel unworthy.
- You are an AI, not a priest, rabbi, imam, or therapist. You do not diagnose or give medical advice. If someone is in danger or talks about harming themselves, respond with love and gently encourage them to seek immediate help (a local crisis line or emergency services) and to lean on people they trust.

Always speak in English, with tenderness, restraint, and hope. Keep replies brief and human, like a serene conversation, not a sermon. Do not use emojis or decorative symbols; your warmth comes through in your words.`;
}

/* ---------- llamada a la IA ---------- */
function reflectionSuffixLocal(){
  return S.lang==="es"
    ? "\n\nLa persona comparte una entrada de su diario. Responde con una reflexión breve, cálida y personal (3-5 frases), fundamentada en su tradición, ayudándole a procesar lo que escribió. No la juzgues."
    : "\n\nThe person shares a journal entry. Respond with a brief, warm, personal reflection (3-5 sentences), grounded in their tradition, helping them process what they wrote. Do not judge them.";
}
async function askAI(messages, mode){
  if(HAS_BACKEND){
    // El servidor construye el carácter del acompañante (clave protegida).
    const r = await fetch("/api/chat",{method:"POST",headers:{"content-type":"application/json"},
      body:JSON.stringify({messages, tradition:S.tradition, language:S.lang, name:S.name, mode:mode||"chat"})});
    if(!r.ok){ const e=await r.json().catch(()=>({})); throw new Error(e.error||("backend "+r.status)); }
    const d = await r.json();
    return (d.reply||"").trim();
  }
  // BYOK: clave del propio usuario, directo al navegador
  let sys = systemPrompt();
  if(mode==="reflection") sys += reflectionSuffixLocal();
  const r = await fetch(DIRECT_URL,{method:"POST",headers:{
    "x-api-key":S.key,"anthropic-version":"2023-06-01",
    "anthropic-dangerous-direct-browser-access":"true","content-type":"application/json"},
    body:JSON.stringify({model:MODEL,max_tokens:1024,system:sys,messages})});
  const d = await r.json();
  if(!r.ok) throw new Error(JSON.stringify(d));
  return (d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
}

/* ---------- voz ---------- */
function speak(text){
  if(!S.voice || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = S.lang==="es"?"es-ES":"en-US"; u.rate=.93;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}
function stopVoice(){ if(window.speechSynthesis) speechSynthesis.cancel(); }

/* ===========================================================================
   NAVEGACIÓN
   =========================================================================== */
const VIEWS = ["home","chat","library","journal","settings"];
let current = null;
function go(view){
  VIEWS.forEach(v=> $("v-"+v).classList.toggle("hidden", v!==view));
  document.querySelectorAll(".nav button").forEach(b=> b.classList.toggle("on", b.dataset.go===view));
  if(view==="home") renderHome();
  if(view==="journal") renderJournal();
  if(view==="settings") renderSettings();
  if(view==="chat") openChat(activeConvo);
  if(view==="library"){ libState={level:"texts",source:null,book:null,chapter:null}; renderLibrary(); }
  current = view;
}
document.querySelectorAll("[data-go]").forEach(b=> b.onclick=()=>{ if(b.dataset.go==="chat"&&b.classList.contains("act")) newChat(); go(b.dataset.go); });
$("chat-back").onclick=()=> go("home");

/* ===========================================================================
   INICIO
   =========================================================================== */
function dateStr(){
  const d=new Date();
  return d.toLocaleDateString(S.lang==="es"?"es-ES":"en-US",{weekday:"long",day:"numeric",month:"long"});
}
function todaysVerse(){
  const list = VERSES[S.tradition]||VERSES.exploring;
  const day = Math.floor(Date.now()/864e5);
  return list[day % list.length][S.lang];
}
function renderHome(){
  $("home-greet").textContent = t().greet(S.name);
  $("home-date").textContent = dateStr();
  const v = todaysVerse();
  $("verse").querySelector("p").textContent = v[0];
  $("verse").querySelector(".ref").textContent = v[1];
  $("a-talk").textContent=t().talk; $("a-talk-s").textContent=t().talkS;
  $("a-jrnl").textContent=t().jrnl; $("a-jrnl-s").textContent=t().jrnlS;
  $("h-recent").textContent=t().recent;
  const list=$("recent-list"); list.innerHTML="";
  const cs=[...S.convos].sort((a,b)=>b.updated-a.updated).slice(0,5);
  if(!cs.length){ const e=el("div","empty"); e.textContent=t().noConvo; list.appendChild(e); return; }
  cs.forEach(c=>{
    const it=el("div","item");
    it.innerHTML=`<div class="ic"><svg class="svg"><use href="#ic-chat"/></svg></div><div class="tx"><b></b><span></span></div>`;
    it.querySelector("b").textContent=c.title||t().companion;
    const last=c.messages[c.messages.length-1];
    it.querySelector("span").textContent=(last?last.content.slice(0,40):"");
    it.onclick=()=>{ openChat(c.id); go("chat"); };
    list.appendChild(it);
  });
}

/* ===========================================================================
   CHAT
   =========================================================================== */
let activeConvo = null;
function newChat(){
  const c={id:"c"+Date.now(),title:"",messages:[],updated:Date.now()};
  S.convos.push(c); activeConvo=c.id; save();
}
function getConvo(id){ return S.convos.find(c=>c.id===id); }
function openChat(id){
  if(!id || !getConvo(id)){ if(!S.convos.length) newChat(); else activeConvo=[...S.convos].sort((a,b)=>b.updated-a.updated)[0].id; }
  else activeConvo=id;
  const c=getConvo(activeConvo);
  const tr=TRAD[S.tradition]||TRAD.exploring;
  $("chat-title").textContent=t().companion;
  $("chat-ctx").textContent=(S.name?S.name+" · ":"")+(S.lang==="es"?tr.es:tr.en);
  $("input").placeholder=t().ph;
  const box=$("msgs"); box.innerHTML="";
  if(!c.messages.length){ addBubble("them", t().hello(S.name), false); }
  else c.messages.forEach(m=> addBubble(m.role==="user"?"me":"them", m.content, false));
  box.scrollTop=1e9;
}
function addBubble(who,text,scroll=true){
  const b=el("div","bubble "+who); b.textContent=text;
  $("msgs").appendChild(b); if(scroll)$("msgs").scrollTop=1e9; return b;
}
async function sendMsg(){
  const inp=$("input"); const text=inp.value.trim(); if(!text) return;
  if(!HAS_BACKEND && !S.key){ showKey(); return; }
  inp.value=""; autoGrow();
  const c=getConvo(activeConvo)||(newChat(),getConvo(activeConvo));
  addBubble("me",text);
  c.messages.push({role:"user",content:text});
  if(!c.title) c.title=text.slice(0,32);
  c.updated=Date.now(); save();

  const typing=el("div","typing"); typing.innerHTML="<i></i><i></i><i></i>";
  $("msgs").appendChild(typing); $("msgs").scrollTop=1e9;
  $("send").disabled=true;
  try{
    const reply=await askAI(c.messages);
    typing.remove(); addBubble("them",reply);
    c.messages.push({role:"assistant",content:reply}); c.updated=Date.now(); save();
    speak(reply);
  }catch(e){ typing.remove(); addBubble("them",t().err); console.error(e); }
  finally{ $("send").disabled=false; }
}
const inputEl=$("input");
function autoGrow(){ inputEl.style.height="auto"; inputEl.style.height=Math.min(inputEl.scrollHeight,120)+"px"; }
inputEl.addEventListener("input",autoGrow);
inputEl.addEventListener("keydown",e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg();}});
$("send").onclick=sendMsg;
$("voice-btn").onclick=()=>{ S.voice=!S.voice; save(); $("voice-btn").classList.toggle("on",S.voice); if(!S.voice)stopVoice(); };

/* dictado por voz */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(SR){ $("mic").onclick=()=>{ const r=new SR(); r.lang=S.lang==="es"?"es-ES":"en-US"; r.interimResults=false;
  $("mic").classList.add("on"); r.onresult=e=>{inputEl.value+=e.results[0][0].transcript;autoGrow();};
  r.onend=()=>$("mic").classList.remove("on"); r.start(); }; }
else $("mic").style.display="none";

/* ===========================================================================
   DIARIO
   =========================================================================== */
function renderJournal(){
  $("j-h").textContent=t().jH; $("j-sub").textContent=t().jSub;
  const list=$("journal-list"); list.innerHTML="";
  if(!S.journal.length){ const e=el("div","empty"); e.textContent=t().jEmpty; list.appendChild(e); return; }
  [...S.journal].sort((a,b)=>b.date-a.date).forEach(en=>{
    const c=el("div","jentry");
    const d=new Date(en.date).toLocaleDateString(S.lang==="es"?"es-ES":"en-US",{day:"numeric",month:"long",year:"numeric"});
    c.innerHTML=`<div class="d"></div><div class="body"></div>`;
    c.querySelector(".d").textContent=d;
    c.querySelector(".body").textContent=en.text;
    if(en.reflection){
      const r=el("div","refl"); r.innerHTML="<b></b>"; r.querySelector("b").textContent=t().reflTitle;
      r.appendChild(document.createTextNode(en.reflection)); c.appendChild(r);
    } else {
      const btn=el("button","minibtn"); btn.textContent=t().reflect;
      btn.onclick=async()=>{ if(!HAS_BACKEND&&!S.key){showKey();return;}
        btn.textContent=t().reflecting; btn.disabled=true;
        try{
          const refl=await askAI([{role:"user",content:en.text}],"reflection");
          en.reflection=refl; save(); renderJournal();
        }catch(e){ btn.textContent=t().reflect; btn.disabled=false; console.error(e); }
      };
      c.appendChild(btn);
    }
    list.appendChild(c);
  });
}
$("j-new").onclick=()=>{
  const m=el("div","modal"); const s=el("div","sheet");
  s.innerHTML=`<h3>${t().newTitle}</h3>
    <textarea id="j-text" rows="6" placeholder="${t().jPh}" style="margin-top:14px;width:100%;padding:14px;border-radius:14px;background:rgba(255,255,255,.07);border:1px solid var(--line);color:var(--text);font-size:1rem"></textarea>
    <button class="btn" id="j-save">${t().saveJ}</button>
    <button class="btn sec" id="j-cancel">${t().cancel}</button>`;
  m.appendChild(s); $("modal-root").appendChild(m); s.querySelector("#j-text").focus();
  m.onclick=e=>{ if(e.target===m) m.remove(); };
  s.querySelector("#j-cancel").onclick=()=>m.remove();
  s.querySelector("#j-save").onclick=()=>{
    const txt=s.querySelector("#j-text").value.trim(); if(!txt){m.remove();return;}
    S.journal.push({id:"j"+Date.now(),text:txt,reflection:"",date:Date.now()}); save();
    m.remove(); renderJournal();
  };
};

/* ===========================================================================
   AJUSTES
   =========================================================================== */
function renderSettings(){
  const x=t();
  $("s-h").textContent=x.sH; $("s-name").textContent=x.sName; $("s-name-v").textContent=S.name||"—";
  $("s-trad").textContent=x.sTrad;
  [...$("s-trad-sel").options].forEach(o=>{ const tr=TRAD[o.value]; if(tr) o.textContent=S.lang==="es"?tr.es:tr.en; });
  $("s-trad-sel").value=S.tradition;
  $("s-lang").textContent=x.sLang; $("s-voice").textContent=x.sVoice; $("s-voice-s").textContent=x.sVoiceS;
  $("s-key").textContent=x.sKey; $("s-key-s").textContent=(HAS_BACKEND||S.key)?x.sKeyOn:x.sKeyOff;
  $("s-key-btn").textContent=x.change; $("s-clear").textContent=x.clear; $("s-disc").textContent=x.sDisc||$("s-disc").textContent;
  $("s-es").classList.toggle("on",S.lang==="es"); $("s-en").classList.toggle("on",S.lang==="en");
  $("s-von").classList.toggle("on",S.voice); $("s-voff").classList.toggle("on",!S.voice);
  $("s-keyrow").style.display=HAS_BACKEND?"none":"flex";
  $("n-home").textContent=x.nHome; $("n-chat").textContent=x.nChat; $("n-jrnl").textContent=x.nJrnl; $("n-set").textContent=x.nSet;
  $("n-lib").textContent=S.lang==="es"?"Biblioteca":"Library";
}
$("s-trad-sel").onchange=e=>{ S.tradition=e.target.value; save(); };
$("s-es").onclick=()=>{ S.lang="es"; save(); renderSettings(); };
$("s-en").onclick=()=>{ S.lang="en"; save(); renderSettings(); };
$("s-von").onclick=()=>{ S.voice=true; save(); renderSettings(); };
$("s-voff").onclick=()=>{ S.voice=false; save(); stopVoice(); renderSettings(); };
$("s-key-btn").onclick=()=> showKey();
$("s-clear").onclick=()=>{ if(confirm(t().clearAsk)){ ["name","tradition","lang","voice","key","convos","journal"].forEach(store.del);
  location.reload(); } };

/* ===========================================================================
   BIBLIOTECA — repositorio de textos sagrados
   =========================================================================== */
const SOURCES = {
  bible:{ type:"booked", es:"La Biblia", en:"The Bible", by_es:"Reina-Valera 1960", by_en:"World English Bible", trad:"christian" },
  quran:{ type:"surah",  es:"El Corán",  en:"The Quran", by_es:"Traducción de Isa García", by_en:"Sahih International", trad:"muslim" },
  torah:{ type:"booked", es:"La Torá",   en:"The Torah", by_es:"Hebreo e inglés · Sefaria", by_en:"Hebrew & English · Sefaria", trad:"jewish" },
  dhammapada:{ type:"bundled", es:"El Dhammapada", en:"The Dhammapada", by_es:"Trad. Max Müller · dominio público", by_en:"Tr. Max Müller · public domain", trad:"buddhist" },
};
const TRAD_SOURCE = {christian:"bible",muslim:"quran",jewish:"torah",buddhist:"dhammapada",exploring:null};
const TORAH_BOOKS = [["Genesis","Génesis",50],["Exodus","Éxodo",40],["Leviticus","Levítico",27],
  ["Numbers","Números",36],["Deuteronomy","Deuteronomio",34],["Psalms","Salmos",150]];

let libState = {level:"texts",source:null,book:null,chapter:null};
const libCache = {bibleBooks:null,dhammapada:null,quranSurahs:null};
const clean = s => (s||"").replace(/<[^>]*>/g,"").replace(/\s+/g," ").trim();

const LBL = ()=> S.lang==="es"
 ? {sub:"Textos sagrados",intro:"Lee y estudia los textos de tu tradición.",other:"Otras tradiciones",
    chapters:"capítulos",ayahs:"aleyas",loading:"Cargando…",err:"No se pudo cargar el texto. Revisa tu conexión.",
    prev:"Anterior",next:"Siguiente",ask:"Conversar sobre este pasaje",
    note_he:"Texto en hebreo e inglés (traducción al español no disponible en esta fuente).",
    note_en:"Traducción al inglés (dominio público)."}
 : {sub:"Sacred texts",intro:"Read and study the texts of your tradition.",other:"Other traditions",
    chapters:"chapters",ayahs:"verses",loading:"Loading…",err:"Couldn't load the text. Check your connection.",
    prev:"Previous",next:"Next",ask:"Discuss this passage",
    note_he:"Hebrew and English (Spanish translation unavailable from this source).",
    note_en:"English translation (public domain)."};

const srcName = k => S.lang==="es"?SOURCES[k].es:SOURCES[k].en;
const srcBy   = k => S.lang==="es"?SOURCES[k].by_es:SOURCES[k].by_en;

async function loadJSON(url){ const r=await fetch(url); if(!r.ok) throw new Error(r.status); return r.json(); }
async function loadBibleBooks(){ if(!libCache.bibleBooks) libCache.bibleBooks=await loadJSON("texts/bible-books.json"); return libCache.bibleBooks; }
async function loadDhammapada(){ if(!libCache.dhammapada) libCache.dhammapada=await loadJSON("texts/dhammapada.json"); return libCache.dhammapada; }
async function loadQuranSurahs(){ if(!libCache.quranSurahs){ const d=await loadJSON("https://api.alquran.cloud/v1/surah"); libCache.quranSurahs=d.data; } return libCache.quranSurahs; }

async function renderLibrary(){
  const L=LBL(), body=$("library-body"), st=libState;
  $("lib-sub").textContent=L.sub;
  $("lib-back").classList.toggle("hidden", st.level==="texts");
  $("lib-title").textContent = st.level==="texts" ? (S.lang==="es"?"Biblioteca":"Library") : srcName(st.source||st.searchSource);
  if(st.level==="texts") return libTexts(body,L);
  if(st.level==="books") return libBooks(body,L);
  if(st.level==="chapters") return libChapters(body,L);
  if(st.level==="search") return libSearch(body,L);
  if(st.level==="reader") return libReader(body,L);
}

/* --- buscador --- */
const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
// Las consultas largas (frases pegadas) fallan como coincidencia exacta porque el texto
// fuente tiene dobles espacios tras la puntuación. Reducimos a una frase distintiva
// y sin puntuación (5 palabras seguidas), o a la palabra significativa más larga.
function reduceQuery(q){
  q=(q||"").replace(/\s+/g," ").trim();
  const words=q.split(" ");
  if(words.length<=6) return q;
  const isClean=w=>/^[\p{L}]+$/u.test(w);
  for(let i=0;i+5<=words.length;i++){
    const win=words.slice(i,i+5);
    if(win.every(isClean) && win.join("").length>=14) return win.join(" ");
  }
  const longest=words.filter(isClean).sort((a,b)=>b.length-a.length)[0];
  return longest||q;
}
function snippetHTML(text, query){
  let x=clean(text).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const terms=(query||"").trim().split(/\s+/).filter(t=>t.length>2).map(escapeRegex);
  if(terms.length){ try{ x=x.replace(new RegExp("("+terms.join("|")+")","gi"),"<mark>$1</mark>"); }catch(e){} }
  return x;
}
async function loadJSONpost(url,bodyObj){
  const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(bodyObj)});
  if(!r.ok) throw new Error(r.status); return r.json();
}
function openReader(source, book, chapter, fromSearch){
  libState={...libState, level:"reader", source, book, chapter, from:fromSearch?"search":null};
  renderLibrary();
}
function parseRef(q, sourceKey){
  if(sourceKey!=="bible" && sourceKey!=="torah") return null;
  const m=q.trim().match(/^(.+?)\s+(\d{1,3})(?::\d+)?$/); if(!m) return null;
  const name=m[1].toLowerCase().trim(), ch=+m[2];
  const books = sourceKey==="bible" ? libCache.bibleBooks : TORAH_BOOKS.map(t=>({en:t[0],es:t[1],ch:t[2]}));
  if(!books) return null;
  const bk=books.find(b=> b.en.toLowerCase()===name||b.es.toLowerCase()===name)
        || books.find(b=> b.en.toLowerCase().startsWith(name)||b.es.toLowerCase().startsWith(name));
  return (bk && ch>=1 && ch<=bk.ch) ? {book:bk,chapter:ch} : null;
}
async function runSearch(key, q){
  q=q.trim(); if(!q) return [];
  if(key==="bible"){
    await loadBibleBooks();
    const tr=S.lang==="es"?"RV1960":"WEB";
    const arr=await loadJSON(`https://bolls.life/find/${tr}/${encodeURIComponent(q)}/`);
    return arr.slice(0,80).map(r=>{ const bk=libCache.bibleBooks.find(b=>b.id===r.book)||{};
      return {ref:`${S.lang==="es"?bk.es:bk.en} ${r.chapter}:${r.verse}`, snippet:r.text,
              open:()=>openReader("bible",bk,r.chapter,true)}; });
  }
  if(key==="quran"){
    const ed=S.lang==="es"?"es.garcia":"en.sahih";
    const d=await loadJSON(`https://api.alquran.cloud/v1/search/${encodeURIComponent(q)}/all/${ed}`);
    const m=(d.data&&d.data.matches)||[];
    return m.slice(0,80).map(a=>({ref:`${a.surah.englishName} ${a.surah.number}:${a.numberInSurah}`, snippet:a.text,
              open:()=>openReader("quran",null,a.surah.number,true)}));
  }
  if(key==="dhammapada"){
    const d=await loadDhammapada(), out=[], ql=q.toLowerCase();
    d.chapters.forEach((c,i)=> c.verses.forEach(v=>{ if(v.t.toLowerCase().includes(ql))
      out.push({ref:`${i+1}. ${c.title} · ${v.v}`, snippet:v.t, open:()=>openReader("dhammapada",null,i,true)}); }));
    return out.slice(0,80);
  }
  if(key==="torah"){
    const d=await loadJSONpost("https://www.sefaria.org/api/search-wrapper",
      {query:q,type:"text",field:"naive_lemmatizer",size:50,filters:["Tanakh/Torah","Tanakh/Writings/Psalms"]});
    const hits=(d.hits&&d.hits.hits)||[], books=TORAH_BOOKS.map(t=>({en:t[0],es:t[1],ch:t[2]}));
    return hits.map(h=>{
      const idref=(h._id||"").split(" (")[0], mm=idref.match(/^(.+) (\d+):(\d+)$/);
      let open=null; if(mm){ const bk=books.find(b=>b.en===mm[1]); if(bk) open=()=>openReader("torah",bk,+mm[2],true); }
      const hl=(h.highlight&&h.highlight.naive_lemmatizer&&h.highlight.naive_lemmatizer[0])||"";
      return {ref:idref, snippet:hl, open};
    }).filter(r=>r.snippet);
  }
  return [];
}
function searchBar(sourceKey, fromLevel){
  const wrap=el("div","libsearch");
  wrap.innerHTML=`<svg class="svg si"><use href="#ic-search"/></svg><input type="search"><button class="sclr">×</button>`;
  const inp=wrap.querySelector("input");
  inp.placeholder=(S.lang==="es"?"Buscar en ":"Search ")+srcName(sourceKey);
  if(libState.level==="search") inp.value=libState.query||"";
  const submit=async()=>{ const q=inp.value.trim(); if(!q) return;
    if(sourceKey==="bible") { try{ await loadBibleBooks(); }catch(e){} }
    const ref=parseRef(q,sourceKey);
    if(ref){ openReader(sourceKey,ref.book,ref.chapter,false); return; }
    libState={...libState, level:"search", query:q, searchSource:sourceKey, searchFrom:fromLevel}; renderLibrary();
  };
  inp.addEventListener("keydown",e=>{ if(e.key==="Enter"){ e.preventDefault(); submit(); } });
  wrap.querySelector(".sclr").onclick=()=>{ inp.value=""; inp.focus(); };
  return wrap;
}
async function libSearch(body,L){
  body.innerHTML="";
  body.appendChild(searchBar(libState.searchSource, libState.searchFrom||"books"));
  const shown=libState.query.length>56 ? libState.query.slice(0,56).trim()+"…" : libState.query;
  const head=el("div","section-h");
  head.textContent=(S.lang==="es"?"Resultados: «":"Results: “")+shown+(S.lang==="es"?"»":"”");
  body.appendChild(head);
  const status=el("div","loading"); status.textContent=L.loading; body.appendChild(status);

  let eq=reduceQuery(libState.query), results=[];
  try{
    results=await runSearch(libState.searchSource, eq);
    if(!results.length && eq.includes(" ")){            // respaldo: palabra más significativa
      const longest=eq.split(" ").sort((a,b)=>b.length-a.length)[0];
      if(longest && longest.length>3){ eq=longest; results=await runSearch(libState.searchSource, eq); }
    }
  }catch(e){ status.textContent=L.err; console.error(e); return; }
  status.remove();

  if(!results.length){ const e2=el("div","empty"); e2.textContent=(S.lang==="es"?"Sin resultados.":"No results."); body.appendChild(e2); return; }
  const list=el("div","lib-list");
  results.forEach(r=>{
    const b=el("button","sresult"); b.innerHTML=`<b></b><span></span>`;
    b.querySelector("b").textContent=r.ref;
    b.querySelector("span").innerHTML=snippetHTML(r.snippet, eq);
    if(r.open) b.onclick=r.open; else b.disabled=true;
    list.appendChild(b);
  });
  body.appendChild(list);
}

function libCard(key){
  const b=el("button","lib-card");
  b.innerHTML=`<span class="em"><svg class="svg"><use href="#ic-book"/></svg></span>
    <span class="info"><b></b><span></span></span><span class="chev">›</span>`;
  b.querySelector("b").textContent=srcName(key);
  b.querySelector(".info span").textContent=srcBy(key);
  b.onclick=()=>{ libState={level:"books",source:key,book:null,chapter:null}; renderLibrary(); };
  return b;
}
function libTexts(body,L){
  body.innerHTML="";
  const mine=TRAD_SOURCE[S.tradition];
  body.appendChild(searchBar(mine||"bible","texts"));
  const intro=el("p","lib-intro"); intro.textContent=L.intro; body.appendChild(intro);
  const keys=Object.keys(SOURCES);
  if(mine){
    body.appendChild(libCard(mine));
    const h=el("div","section-h"); h.textContent=L.other; body.appendChild(h);
    keys.filter(k=>k!==mine).forEach(k=> body.appendChild(libCard(k)));
  } else keys.forEach(k=> body.appendChild(libCard(k)));
}
function bookButton(label,meta,onclick){
  const btn=el("button"); btn.innerHTML=`<b></b><small></small>`;
  btn.querySelector("b").textContent=label; btn.querySelector("small").textContent=meta;
  btn.onclick=onclick; return btn;
}
async function libBooks(body,L){
  const src=SOURCES[libState.source];
  body.innerHTML=`<div class="loading">${L.loading}</div>`;
  try{
    const list=el("div","lib-list");
    if(src.type==="surah"){
      const surahs=await loadQuranSurahs();
      surahs.forEach(s=> list.appendChild(bookButton(
        `${s.number}. ${s.englishName}`, `${s.englishNameTranslation} · ${s.numberOfAyahs} ${L.ayahs}`,
        ()=>{ libState={level:"reader",source:"quran",book:null,chapter:s.number}; renderLibrary(); })));
    } else if(src.type==="bundled"){
      const d=await loadDhammapada();
      d.chapters.forEach((c,i)=> list.appendChild(bookButton(
        `${i+1}. ${c.title}`, `${c.verses.length} ${S.lang==="es"?"versos":"verses"}`,
        ()=>{ libState={level:"reader",source:"dhammapada",book:null,chapter:i}; renderLibrary(); })));
    } else {
      const books = libState.source==="bible"
        ? await loadBibleBooks()
        : TORAH_BOOKS.map(t=>({en:t[0],es:t[1],ch:t[2]}));
      books.forEach(bk=> list.appendChild(bookButton(
        S.lang==="es"?bk.es:bk.en, `${bk.ch} ${L.chapters}`,
        ()=>{ libState={level:"chapters",source:libState.source,book:bk,chapter:null}; renderLibrary(); })));
    }
    body.innerHTML=""; body.appendChild(searchBar(libState.source,"books")); body.appendChild(list);
  }catch(e){ body.innerHTML=`<div class="loading">${L.err}</div>`; console.error(e); }
}
function libChapters(body,L){
  const bk=libState.book; body.innerHTML="";
  const h=el("div","section-h"); h.textContent=S.lang==="es"?bk.es:bk.en; body.appendChild(h);
  const grid=el("div","chgrid");
  for(let c=1;c<=bk.ch;c++){ const b=el("button"); b.textContent=c;
    b.onclick=(cc=>()=>{ libState={level:"reader",source:libState.source,book:bk,chapter:cc}; renderLibrary(); })(c);
    grid.appendChild(b); }
  body.appendChild(grid);
}
function readerBounds(){
  const st=libState;
  if(st.source==="bible"||st.source==="torah") return {p:st.chapter>1,n:st.chapter<st.book.ch};
  if(st.source==="quran") return {p:st.chapter>1,n:st.chapter<114};
  if(st.source==="dhammapada"){ const len=(libCache.dhammapada?.chapters.length)||26; return {p:st.chapter>0,n:st.chapter<len-1}; }
  return {p:false,n:false};
}
async function libReader(body,L){
  const st=libState; body.innerHTML=`<div class="loading">${L.loading}</div>`;
  let title="",meta="",note="",verses=[];
  try{
    if(st.source==="bible"){
      const tr=S.lang==="es"?"RV1960":"WEB";
      const arr=await loadJSON(`https://bolls.life/get-chapter/${tr}/${st.book.id}/${st.chapter}/`);
      verses=arr.map(v=>({n:v.verse,t:clean(v.text)}));
      title=`${S.lang==="es"?st.book.es:st.book.en} ${st.chapter}`;
      meta=S.lang==="es"?"Reina-Valera 1960":"World English Bible";
    } else if(st.source==="quran"){
      const ed=S.lang==="es"?"es.garcia":"en.sahih";
      const d=await loadJSON(`https://api.alquran.cloud/v1/surah/${st.chapter}/${ed}`); const a=d.data;
      verses=a.ayahs.map(x=>({n:x.numberInSurah,t:x.text}));
      title=`${a.number}. ${a.englishName}`; meta=`${a.englishNameTranslation} · ${a.numberOfAyahs} ${L.ayahs}`;
    } else if(st.source==="torah"){
      const d=await loadJSON(`https://www.sefaria.org/api/texts/${st.book.en}.${st.chapter}?context=0`);
      const en=d.text||[], he=d.he||[], n=Math.max(en.length,he.length);
      for(let i=0;i<n;i++) verses.push({n:i+1,t:clean(en[i]||""),he:clean(he[i]||"")});
      title=`${S.lang==="es"?st.book.es:st.book.en} ${st.chapter}`; meta="Sefaria"; note=L.note_he;
    } else if(st.source==="dhammapada"){
      const d=await loadDhammapada(), c=d.chapters[st.chapter];
      verses=c.verses.map(v=>({n:v.v,t:v.t}));
      title=`${st.chapter+1}. ${c.title}`; meta=d.translation; if(S.lang==="es") note=L.note_en;
    }
  }catch(e){ body.innerHTML=`<div class="loading">${L.err}</div>`; console.error(e); return; }

  body.innerHTML=""; const w=el("div","reader");
  const h=el("div","rtitle"); h.textContent=title; w.appendChild(h);
  const m=el("div","rmeta"); m.textContent=meta; w.appendChild(m);
  if(note){ const nn=el("p","lib-intro"); nn.style.fontSize=".88rem"; nn.style.margin="0 0 18px"; nn.textContent=note; w.appendChild(nn); }
  verses.forEach(v=>{
    if(v.he){ const hh=el("p","he"); hh.textContent=v.he; w.appendChild(hh); }
    const row=el("p","vrow"); const vn=el("span","vn"); vn.textContent=v.n;
    row.appendChild(vn); row.appendChild(document.createTextNode(v.t)); w.appendChild(row);
  });
  const ask=el("button","rask"); ask.innerHTML=`<svg class="svg"><use href="#ic-talk"/></svg>`;
  ask.appendChild(document.createTextNode(L.ask)); ask.onclick=()=>askAboutPassage(title); w.appendChild(ask);
  const nav=el("div","rnav"), b=readerBounds();
  const prev=el("button"); prev.textContent="‹ "+L.prev; prev.disabled=!b.p; prev.onclick=()=>{ libState.chapter--; renderLibrary(); };
  const next=el("button"); next.textContent=L.next+" ›"; next.disabled=!b.n; next.onclick=()=>{ libState.chapter++; renderLibrary(); };
  nav.appendChild(prev); nav.appendChild(next); w.appendChild(nav);
  body.appendChild(w); body.scrollTop=0;
}
function askAboutPassage(ref){
  newChat(); go("chat");
  const q=S.lang==="es"
    ? `Me gustaría reflexionar sobre ${ref}. ¿Qué enseña este pasaje y cómo se relaciona con mi vida?`
    : `I'd like to reflect on ${ref}. What does this passage teach, and how might it relate to my life?`;
  $("input").value=q; autoGrow(); $("input").focus();
}
$("lib-back").onclick=()=>{
  const st=libState;
  if(st.level==="reader"){
    if(st.from==="search") st.level="search";
    else st.level=(st.source==="bible"||st.source==="torah")?"chapters":"books";
  }
  else if(st.level==="search"){ st.level=st.searchFrom||"books"; if(st.level==="texts") st.source=null; }
  else if(st.level==="chapters") st.level="books";
  else if(st.level==="books"){ st.level="texts"; st.source=null; }
  renderLibrary();
};

/* ===========================================================================
   CLAVE
   =========================================================================== */
function showKey(){
  $("app").classList.add("hidden"); $("onboard").classList.add("hidden");
  $("keyscreen").classList.remove("hidden");
  $("k-input").value=S.key||"";
}
$("k-save").onclick=()=>{
  const k=$("k-input").value.trim();
  if(!k.startsWith("sk-ant-")){ $("k-input").style.borderColor="var(--danger)"; return; }
  S.key=k; save(); $("keyscreen").classList.add("hidden"); launchApp();
};

/* ===========================================================================
   ONBOARDING
   =========================================================================== */
function applyObLang(){
  const x=t();
  $("ob-title").textContent=x.obTitle; $("ob-sub").textContent=x.obSub; $("ob-go").textContent=x.enter;
  $("l-name").firstChild.textContent=x.lName+" "; $("l-trad").textContent=x.lTrad;
  document.querySelectorAll("#ob-trads .chip span").forEach(sp=> sp.textContent=sp.dataset[S.lang]);
  $("lng-es").classList.toggle("on",S.lang==="es"); $("lng-en").classList.toggle("on",S.lang==="en");
}
$("lng-es").onclick=()=>{ S.lang="es"; applyObLang(); };
$("lng-en").onclick=()=>{ S.lang="en"; applyObLang(); };
$("ob-trads").addEventListener("click",e=>{
  const c=e.target.closest(".chip"); if(!c) return;
  document.querySelectorAll("#ob-trads .chip").forEach(x=>x.classList.remove("sel"));
  c.classList.add("sel"); S.tradition=c.dataset.t;
});
$("ob-go").onclick=()=>{
  S.name=$("ob-name").value.trim(); save();
  $("onboard").classList.add("hidden");
  if(!HAS_BACKEND && !S.key){ showKey(); return; }
  launchApp();
};

/* ===========================================================================
   ARRANQUE
   =========================================================================== */
function launchApp(){ $("app").classList.remove("hidden"); go("home"); $("voice-btn").classList.toggle("on",S.voice); }

// ¿usuario ya conocido?  -> directo a la app
if(S.name || S.convos.length || S.journal.length){
  applyObLang();
  $("onboard").classList.add("hidden");
  if(!HAS_BACKEND && !S.key) showKey(); else launchApp();
} else {
  applyObLang();
}

// service worker (instalable / offline shell)
if("serviceWorker" in navigator){ navigator.serviceWorker.register("sw.js").catch(()=>{}); }
