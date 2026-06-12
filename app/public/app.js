'use strict';
/* ===== Exámenes UOC — SPA (vanilla JS) ===== */

const appEl = document.getElementById('app');
const crumbEl = document.getElementById('breadcrumb');
const toastEl = document.getElementById('toast');
const overlayEl = document.getElementById('overlay');

function showOverlay(msg) {
  if (msg) overlayEl.querySelector('.overlay-msg').textContent = msg;
  overlayEl.classList.add('show');
}
function hideOverlay() { overlayEl.classList.remove('show'); }

// ---------- utilidades ----------
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function dec(x) { try { return decodeURIComponent(x); } catch (e) { return x; } }
async function api(path, opts) {
  const res = await fetch('/api' + path, Object.assign({ headers: { 'Content-Type': 'application/json' } }, opts));
  if (!res.ok) {
    let msg = 'Error ' + res.status;
    try { const j = await res.json(); if (j.error) msg += ': ' + j.error; } catch (e) {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}
let toastTimer = null;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1900);
}
function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function fmtScore(v) {
  if (v == null) return '–';
  return (Math.round(v * 100) / 100).toString().replace('.', ',');
}
// Nota efectiva de un intento (el servidor ya la deriva en los listados; aquí
// cubrimos también el detalle, que trae las correcciones completas).
function effectiveScore(a) {
  if (!a) return null;
  if (a.totalScore != null) return a.totalScore;
  if (a.status === 'corrected' && a.corrections) {
    return Object.values(a.corrections).reduce((s, c) => s + ((c && c.score) || 0), 0);
  }
  return null;
}
function grade10(score, max) {
  if (score == null || !max) return null;
  return Math.max(0, Math.min(10, score / max * 10));
}
function scoreClass(score, max) {
  if (score == null || !max) return 'score-none';
  const r = score / max;
  if (r >= 0.7) return 'score-good';
  if (r >= 0.5) return 'score-mid';
  return 'score-bad';
}
function qBorderClass(score, max) {
  if (score == null || !max) return '';
  const r = score / max;
  if (r >= 0.7) return 'good';
  if (r >= 0.5) return 'mid';
  return 'bad';
}
function statusChip(status) {
  const map = { draft: ['s-draft', 'Borrador'], submitted: ['s-submitted', 'Entregado · pendiente'], corrected: ['s-corrected', 'Corregido'] };
  const m = map[status] || map.draft;
  return `<span class="status-chip ${m[0]}">${m[1]}</span>`;
}
// ---------- resaltado de sintaxis (ligero, sin dependencias) ----------
const KEYWORDS = {
  c: new Set(['int','char','float','double','void','return','if','else','for','while','do','switch','case','break','continue','struct','sizeof','const','unsigned','signed','long','short','static','include','define','typedef','enum','goto','default','extern','volatile']),
  java: new Set(['public','private','protected','class','interface','extends','implements','abstract','void','int','double','float','boolean','char','long','short','byte','new','return','if','else','for','while','do','switch','case','break','continue','this','super','static','final','import','package','try','catch','finally','throw','throws','instanceof','enum','default','null','true','false']),
  sql: new Set(['select','from','where','inner','left','right','outer','join','on','group','by','order','having','count','sum','avg','min','max','as','and','or','not','insert','into','values','update','set','delete','create','table','primary','key','foreign','references','grant','revoke','to','drop','alter','add','column','distinct','union','like','in','between','is','null','default','constraint','format','asc','desc','truncate','commit','rollback','savepoint','view']),
  python: new Set(['def','return','if','elif','else','for','while','in','not','and','or','import','from','as','with','try','except','finally','class','lambda','is','pass','break','continue','global','True','False','None','print','input','open','range','len','int','str','list','dict']),
  js: new Set(['function','return','if','else','for','while','const','let','var','new','class','extends','implements','import','from','export','default','async','await','try','catch','finally','this','typeof','instanceof','of','in','switch','case','break','continue','interface','type','public','private','null','undefined','true','false','void'])
};
const TYPES = {
  c: new Set(['FILE','size_t','NULL','bool']),
  java: new Set(['String','System','ArrayList','List','Integer','Double','Boolean','Object','Math']),
  js: new Set(['console','document','window','Math','JSON','Array','Object','Promise','String','Number'])
};
function highlightClike(code, lang) {
  const kw = KEYWORDS[lang] || KEYWORDS.c;
  const ty = TYPES[lang] || new Set();
  const sql = lang === 'sql';
  const lineC = sql ? '--[^\\n]*' : lang === 'python' ? '#[^\\n]*' : '\\/\\/[^\\n]*';
  const re = new RegExp(
    '(' + lineC + '|\\/\\*[\\s\\S]*?\\*\\/)' +
    '|("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\')' +
    '|(#[A-Za-z_]+)' +
    '|(\\b\\d+(?:\\.\\d+)?\\b)' +
    '|([A-Za-z_]\\w*)', 'g');
  let out = '', last = 0, m;
  while ((m = re.exec(code)) !== null) {
    out += esc(code.slice(last, m.index));
    let cls = '';
    if (m[1]) cls = 'c-com';
    else if (m[2]) cls = 'c-str';
    else if (m[3]) cls = 'c-pre';
    else if (m[4]) cls = 'c-num';
    else if (m[5]) {
      const hit = sql ? kw.has(m[5].toLowerCase()) : kw.has(m[5]);
      if (hit) cls = 'c-kw';
      else if (ty.has(m[5])) cls = 'c-typ';
      else if (/^\s*\(/.test(code.slice(m.index + m[0].length))) cls = 'c-fn';
    }
    out += cls ? `<span class="${cls}">${esc(m[0])}</span>` : esc(m[0]);
    last = m.index + m[0].length;
  }
  return out + esc(code.slice(last));
}
function highlightHtml(code) {
  const re = /(<!--[\s\S]*?-->)|(<\/?)([a-zA-Z][\w:-]*)|([a-zA-Z_:][\w:.-]*)(?=\s*=)|("(?:[^"]*)"|'(?:[^']*)')|(\{\{[^}]*\}\})/g;
  let out = '', last = 0, m;
  while ((m = re.exec(code)) !== null) {
    out += esc(code.slice(last, m.index));
    if (m[1]) out += `<span class="h-com">${esc(m[1])}</span>`;
    else if (m[2]) out += `<span class="h-punct">${esc(m[2])}</span><span class="h-tag">${esc(m[3])}</span>`;
    else if (m[4]) out += `<span class="h-attr">${esc(m[4])}</span>`;
    else if (m[5]) out += `<span class="h-str">${esc(m[5])}</span>`;
    else if (m[6]) out += `<span class="h-interp">${esc(m[6])}</span>`;
    last = m.index + m[0].length;
  }
  return out + esc(code.slice(last));
}
function highlight(codeLines, lang) {
  const code = codeLines.join('\n');
  if (lang === 'html' || lang === 'xml') return highlightHtml(code);
  if (lang === 'sql' || lang === 'java' || lang === 'c' || lang === 'cpp' || lang === 'python') return highlightClike(code, lang);
  if (lang === 'javascript' || lang === 'typescript' || lang === 'js' || lang === 'ts') return highlightClike(code, 'js');
  return esc(code);
}
function codeBlock(q) {
  if (!q.codeLines || !q.codeLines.length) return '';
  const lang = q.codeLang ? `<div class="code-lang">${esc(q.codeLang)}</div>` : '';
  return `${lang}<pre class="code">${highlight(q.codeLines, q.codeLang)}</pre>`;
}

// ---------- router + ciclo de vida de la vista ----------
function parseHash() {
  let h = location.hash.replace(/^#/, '') || '/';
  let query = {};
  const qi = h.indexOf('?');
  if (qi >= 0) {
    h.slice(qi + 1).split('&').forEach(p => {
      const [k, v] = p.split('=');
      if (k) query[dec(k)] = dec(v || '');
    });
    h = h.slice(0, qi);
  }
  const parts = h.split('/').filter(Boolean);
  return { parts, query };
}

let activeTimers = [];
let viewCleanups = [];
let deletingAttempt = false;
function addCleanup(fn) { viewCleanups.push(fn); }
function teardownView() {
  activeTimers.forEach(t => clearInterval(t)); activeTimers = [];
  viewCleanups.forEach(fn => { try { fn(); } catch (e) {} }); viewCleanups = [];
}

async function route() {
  teardownView();
  deletingAttempt = false;
  const { parts, query } = parseHash();
  appEl.innerHTML = '<div class="loading">Cargando…</div>';
  try {
    if (parts.length === 0) { crumb([]); return viewDashboard(); }
    if (parts[0] === 'exam' && parts[1]) return viewExam(parts[1]);
    if (parts[0] === 'study' && parts[1]) return viewStudy(parts[1]);
    if (parts[0] === 'attempt' && parts[1] && parts[2]) return viewAttempt(parts[1], parts[2]);
    if (parts[0] === 'compare' && parts[1]) return viewCompare(parts[1], (query.ids || '').split(',').filter(Boolean));
    if (parts[0] === 'settings') return viewSettings();
    crumb([]); return viewDashboard();
  } catch (e) {
    appEl.innerHTML = `<div class="empty-state">⚠️ ${esc(e.message)}</div>`;
  }
}

function crumb(items) {
  const home = `<a href="#/">Inicio</a>`;
  const rest = items.map((it, i) => {
    const sep = `<span class="sep">/</span>`;
    if (i === items.length - 1) return `${sep}<span>${esc(it.label)}</span>`;
    return `${sep}<a href="${esc(it.href)}">${esc(it.label)}</a>`;
  }).join('');
  crumbEl.innerHTML = home + rest;
}

// ---------- vista: dashboard ----------
async function viewDashboard() {
  const exams = await api('/exams');
  const withStats = await Promise.all(exams.map(async ex => {
    let attempts = [];
    try { attempts = await api('/attempts/' + ex.id); } catch (e) {}
    const corrected = attempts.filter(a => a.status === 'corrected' && a.totalScore != null && a.maxScore > 0);
    const best = corrected.length ? Math.max.apply(null, corrected.map(a => grade10(a.totalScore, a.maxScore))) : null;
    return { ex, count: attempts.length, best };
  }));

  appEl.innerHTML = `
    <h1>Tus exámenes</h1>
    <p class="subtitle">Elige una asignatura para practicar. Cada intento se guarda y puedes repetirlo las veces que quieras.</p>
    <div class="grid">
      ${withStats.map(({ ex, count, best }) => `
        <a class="card" href="#/exam/${esc(ex.id)}">
          <span class="card-code">${esc(ex.id)}</span>
          <h2>${esc(ex.subject.replace(/^FP[^—-]*[—-]\s*/, ''))}</h2>
          <div class="card-meta">
            <span><b>${ex.questionCount}</b> preguntas</span>
            <span><b>${ex.sectionCount}</b> bloques</span>
          </div>
          <div class="best">
            ${count ? `${count} intento${count !== 1 ? 's' : ''}` : 'Sin intentos aún'}
            ${best != null ? ` · mejor nota <b>${fmtScore(best)}/10</b>` : ''}
          </div>
        </a>`).join('')}
    </div>`;
}

// ---------- vista: examen (overview + historial) ----------
async function viewExam(examId) {
  const [exam, attempts] = await Promise.all([api('/exams/' + examId), api('/attempts/' + examId)]);
  crumb([{ label: exam.id, href: '#/exam/' + exam.id }]);
  const fmt = exam.examFormat || {};
  let cAnt = 0, cNue = 0;
  exam.sections.forEach(s => s.questions.forEach(q => (q.origin === 'nueva' ? cNue++ : cAnt++)));
  const cTot = cAnt + cNue;

  appEl.innerHTML = `
    <a class="back" href="#/">← Inicio</a>
    <div class="panel">
      <div class="spread">
        <div>
          <span class="card-code">${esc(exam.id)}</span>
          <h1 style="margin-top:8px">${esc(exam.subject)}</h1>
        </div>
      </div>
      <p class="panel-intro">${esc(exam.intro || '')}</p>
      <div class="chips">
        <span class="chip">${exam.sections.reduce((a, s) => a + s.questions.length, 0)} preguntas</span>
        <span class="chip">${exam.sections.length} bloques</span>
        ${fmt.questions ? `<span class="chip">Examen real: ${fmt.questions} preguntas / ${fmt.minutes} min</span>` : ''}
        ${fmt.passScore ? `<span class="chip">Aprobado ≥ ${fmt.passScore}/10</span>` : ''}
      </div>
      <div class="scope-pick" id="scopePick">
        <span class="scope-lbl">Preguntas:</span>
        <button class="scope-opt active" data-scope="todas">Todas <b>${cTot}</b></button>
        <button class="scope-opt" data-scope="anterior">De exámenes anteriores <b>${cAnt}</b></button>
        <button class="scope-opt" data-scope="nueva">Nuevas <b>${cNue}</b></button>
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" id="newComplete">▶ Nuevo intento (completo)</button>
        <button class="btn" id="newSim">🎲 Simulacro (4 preguntas · ${fmt.minutes || 30} min)</button>
        <a class="btn btn-study" href="#/study/${esc(exam.id)}">📚 Solucionario (estudiar)</a>
      </div>
    </div>

    <div class="spread" style="margin:24px 0 12px">
      <h2>Historial de intentos</h2>
      <div class="btn-row">
        <button class="btn btn-sm" id="compareBtn" disabled>Comparar seleccionados</button>
        ${attempts.length ? `<button class="btn btn-sm btn-danger" id="deleteAllBtn">🗑 Borrar todos</button>` : ''}
      </div>
    </div>
    <div id="historyList"></div>`;

  let scope = 'todas';
  const pick = document.getElementById('scopePick');
  pick.querySelectorAll('.scope-opt').forEach(b => b.onclick = () => {
    scope = b.dataset.scope;
    pick.querySelectorAll('.scope-opt').forEach(x => x.classList.toggle('active', x === b));
  });
  document.getElementById('newComplete').onclick = () => startAttempt(examId, 'completo', scope);
  document.getElementById('newSim').onclick = () => startAttempt(examId, 'simulacro', scope);

  const delAll = document.getElementById('deleteAllBtn');
  if (delAll) delAll.onclick = async () => {
    if (!confirm(`¿Borrar los ${attempts.length} intentos de ${exam.id}? No se puede deshacer.`)) return;
    for (const a of attempts) {
      await api('/attempts/' + examId + '/' + a.attemptId, { method: 'DELETE' }).catch(() => {});
    }
    toast('Intentos eliminados');
    viewExam(examId);
  };

  renderHistory(examId, attempts);
}

function renderHistory(examId, attempts) {
  const list = document.getElementById('historyList');
  if (!attempts.length) {
    list.className = '';
    list.innerHTML = `<div class="empty-state">Todavía no has hecho ningún intento. ¡Empieza uno arriba!</div>`;
    return;
  }
  list.className = 'attempt-list';
  list.innerHTML = attempts.map(a => {
    const g = grade10(a.totalScore, a.maxScore);
    const scopeShort = a.scope === 'anterior' ? 'anteriores' : a.scope === 'nueva' ? 'nuevas' : 'todas';
    return `
      <div class="attempt-row">
        <input type="checkbox" class="cb" data-id="${esc(a.attemptId)}" title="Seleccionar para comparar">
        <a class="grow" href="#/attempt/${esc(examId)}/${esc(a.attemptId)}" style="text-decoration:none;color:inherit">
          <div class="when">${fmtDate(a.createdAt)}</div>
          <div class="sub">${a.mode === 'simulacro' ? '🎲 Simulacro' : '📋 Completo'} · ${scopeShort} · ${a.answeredCount}/${a.questionCount} respondidas</div>
        </a>
        ${statusChip(a.status)}
        <span class="score-pill ${scoreClass(a.totalScore, a.maxScore)}">${g != null ? fmtScore(g) + '/10' : '–'}</span>
        <button class="btn btn-sm btn-danger" data-del="${esc(a.attemptId)}" title="Eliminar intento">🗑</button>
      </div>`;
  }).join('');

  const cbs = Array.from(list.querySelectorAll('.cb'));
  const compareBtn = document.getElementById('compareBtn');
  function refreshCompare() {
    const sel = cbs.filter(c => c.checked).map(c => c.dataset.id);
    compareBtn.disabled = sel.length < 2;
    compareBtn.textContent = sel.length >= 2 ? `Comparar (${sel.length})` : 'Comparar seleccionados';
    compareBtn.onclick = () => { location.hash = `#/compare/${examId}?ids=${sel.join(',')}`; };
  }
  cbs.forEach(c => c.onchange = refreshCompare);
  refreshCompare();

  list.querySelectorAll('[data-del]').forEach(b => {
    b.onclick = async (ev) => {
      ev.preventDefault();
      if (!confirm('¿Eliminar este intento? No se puede deshacer.')) return;
      await api('/attempts/' + examId + '/' + b.dataset.del, { method: 'DELETE' });
      toast('Intento eliminado');
      const fresh = await api('/attempts/' + examId);
      renderHistory(examId, fresh);
    };
  });
}

async function startAttempt(examId, mode, scope) {
  try {
    const attempt = await api('/attempts/' + examId, { method: 'POST', body: JSON.stringify({ mode, scope: scope || 'todas' }) });
    location.hash = `#/attempt/${examId}/${attempt.attemptId}`;
  } catch (e) {
    toast('No se pudo crear el intento: ' + e.message);
  }
}

// ---------- vista: solucionario (estudiar) ----------
async function viewStudy(examId) {
  const exam = await api('/exams/' + examId);
  crumb([{ label: exam.id, href: '#/exam/' + exam.id }, { label: 'Solucionario', href: '#' }]);

  let scope = 'todas';

  function render() {
    const sections = exam.sections.map(sec => {
      const qs = sec.questions.filter(q => scope === 'todas' || (q.origin || 'anterior') === scope);
      if (!qs.length) return '';
      return `
        <div class="study-section">
          <div class="section-title">${esc(sec.title)}</div>
          ${qs.map(renderStudyCard).join('')}
        </div>`;
    }).join('');

    let cAnt = 0, cNue = 0, cAns = 0, cTot = 0;
    exam.sections.forEach(s => s.questions.forEach(q => {
      cTot++; (q.origin === 'nueva' ? cNue++ : cAnt++); if (q.answer) cAns++;
    }));

    appEl.innerHTML = `
      <a class="back" href="#/exam/${esc(examId)}">← ${esc(exam.id)}</a>
      <div class="panel">
        <span class="card-code">${esc(exam.id)}</span>
        <h1 style="margin-top:8px">📚 Solucionario · ${esc(exam.subject)}</h1>
        <p class="panel-intro">Todas las preguntas con su respuesta correcta y detallada para estudiar. Léelas y repásalas; cuando estés listo, haz un intento y luego pídeme que lo corrija.</p>
        <div class="chips">
          <span class="chip">${cTot} preguntas</span>
          <span class="chip">${cAns} con solución</span>
        </div>
        <div class="scope-pick" id="studyScope">
          <span class="scope-lbl">Ver:</span>
          <button class="scope-opt ${scope === 'todas' ? 'active' : ''}" data-scope="todas">Todas <b>${cTot}</b></button>
          <button class="scope-opt ${scope === 'anterior' ? 'active' : ''}" data-scope="anterior">Anteriores <b>${cAnt}</b></button>
          <button class="scope-opt ${scope === 'nueva' ? 'active' : ''}" data-scope="nueva">Nuevas <b>${cNue}</b></button>
        </div>
        <div class="btn-row">
          <button class="btn btn-sm" id="expandAll">Desplegar todo</button>
          <button class="btn btn-sm" id="collapseAll">Plegar todo</button>
        </div>
      </div>
      ${sections}`;

    const pick = document.getElementById('studyScope');
    pick.querySelectorAll('.scope-opt').forEach(b => b.onclick = () => { scope = b.dataset.scope; render(); });
    document.getElementById('expandAll').onclick = () => appEl.querySelectorAll('details.study-card').forEach(d => d.open = true);
    document.getElementById('collapseAll').onclick = () => appEl.querySelectorAll('details.study-card').forEach(d => d.open = false);
  }

  render();
}

function renderStudyCard(q) {
  const hasAns = q.answer && String(q.answer).trim();
  return `
    <details class="study-card q">
      <summary class="study-summary">
        <span class="q-num">${esc(q.n || '?')}</span>
        ${q.origin ? `<span class="q-origin q-${esc(q.origin)}">${q.origin === 'nueva' ? 'nueva' : 'examen anterior'}</span>` : ''}
        <span class="q-points">${fmtScore(q.points)} p</span>
        <span class="study-prompt">${esc(q.prompt)}</span>
      </summary>
      <div class="study-body">
        ${codeBlock(q)}
        ${hasAns
          ? `<pre class="model-body">${esc(q.answer)}</pre>`
          : `<div class="answer-readonly empty">⏳ Solución en preparación. Vuelve a cargar en unos minutos.</div>`}
      </div>
    </details>`;
}

// ---------- vista: intento (runner / corregido) ----------
async function viewAttempt(examId, attemptId) {
  const [exam, attempt] = await Promise.all([api('/exams/' + examId), api('/attempts/' + examId + '/' + attemptId)]);
  crumb([{ label: exam.id, href: '#/exam/' + exam.id }, { label: 'Intento', href: '#' }]);

  const qmap = {};
  exam.sections.forEach(s => s.questions.forEach(q => { qmap[q.id] = q; }));
  const ids = attempt.questionIds && attempt.questionIds.length ? attempt.questionIds : Object.keys(qmap);

  const sectionsView = exam.sections.map(s => ({
    title: s.title,
    questions: s.questions.filter(q => ids.includes(q.id))
  })).filter(s => s.questions.length);

  // preguntas del intento que ya no existen en el examen (examen editado después)
  const orphanIds = ids.filter(id => !qmap[id]);

  const isCorrected = attempt.status === 'corrected';
  const readOnly = attempt.status !== 'draft';

  // cabecera
  let head = '';
  if (isCorrected) {
    const score = effectiveScore(attempt);
    const g = grade10(score, attempt.maxScore);
    const pct = (score != null && attempt.maxScore) ? Math.max(0, Math.min(100, score / attempt.maxScore * 100)) : 0;
    const ringColor = pct >= 70 ? 'var(--ok)' : pct >= 50 ? 'var(--warn)' : 'var(--bad)';
    head = `
      <div class="result-hero">
        <div class="ring" style="--p:${pct.toFixed(0)};--ring-color:${ringColor}"><span>${g != null ? fmtScore(g) : '–'}</span></div>
        <div class="grow">
          <h1 style="margin-bottom:4px">Corregido</h1>
          <div class="sub" style="color:var(--muted)">${esc(exam.subject)} · ${fmtDate(attempt.correctedAt || attempt.submittedAt)}</div>
          <div><span class="score-pill ${scoreClass(score, attempt.maxScore)}">${fmtScore(score)} / ${fmtScore(attempt.maxScore)} puntos</span></div>
          ${attempt.globalFeedback ? `<div class="global-feedback">${esc(attempt.globalFeedback)}</div>` : ''}
          ${attempt.correctedBy && attempt.correctedBy.indexOf('ia:') === 0 ? `<div class="correctedby">Corregido por <span class="ai-badge">✨ IA · ${esc(attempt.correctedBy.slice(3))}</span></div>` : ''}
        </div>
      </div>`;
  } else {
    head = `
      <div class="runner-head">
        <div class="grow">
          <h2>${esc(attempt.title || 'Intento')} · <span style="color:var(--muted);font-weight:500">${esc(exam.subject)}</span></h2>
          <div class="progress"><i id="progbar"></i></div>
        </div>
        ${attempt.mode === 'simulacro' && attempt.status === 'draft' ? `<div class="timer" id="timer">--:--</div>` : ''}
        <div class="save-state" id="saveState">Guardado ✓</div>
      </div>
      ${readOnly ? `<div class="banner banner-warn">Entregado. Pendiente de corrección. Pásame el fichero del intento y lo corrijo.</div>` : ''}`;
  }

  // cuerpo
  let body = sectionsView.map(sec => `
    <div class="section-title">${esc(sec.title)}</div>
    ${sec.questions.map(q => renderQuestion(q, attempt, isCorrected, readOnly)).join('')}
  `).join('');

  if (orphanIds.length) {
    body += `
      <div class="section-title">Preguntas no encontradas en el examen actual</div>
      <div class="banner banner-warn">Estas preguntas formaban parte del intento pero el examen se ha modificado después. Se muestran tu respuesta y su corrección.</div>
      ${orphanIds.map(id => renderOrphan(id, attempt, isCorrected)).join('')}`;
  }

  // sección de respuestas correctas (solo en intento corregido)
  let answersSection = '';
  if (isCorrected) {
    const answerCards = sectionsView.flatMap(sec =>
      sec.questions.map(q => {
        const corr = attempt.corrections && attempt.corrections[q.id];
        // Prioriza la solución canónica de estudio; si no, la respuesta modelo de la IA.
        const ma = (q.answer && String(q.answer).trim()) || (corr && corr.modelAnswer);
        if (!ma) return '';
        return `
          <div class="model-answer-card">
            <div class="q-head" style="flex-wrap:wrap;gap:6px">
              <span class="q-num">${esc(q.n || '?')}</span>
              ${q.origin ? `<span class="q-origin q-${esc(q.origin)}">${q.origin === 'nueva' ? 'nueva' : 'examen anterior'}</span>` : ''}
              <span class="q-points">${fmtScore(q.points)} p</span>
              <div class="model-q-prompt" style="flex:1 1 100%;font-weight:600;margin-top:4px">${esc(q.prompt)}</div>
            </div>
            ${codeBlock(q)}
            <pre class="model-body" style="white-space:pre-wrap;word-break:break-word">${esc(ma)}</pre>
          </div>`;
      })
    ).filter(Boolean);

    if (answerCards.length) {
      answersSection = `
        <details class="answers-section" style="margin-top:32px">
          <summary style="cursor:pointer;list-style:none;outline:none">
            <div class="section-title" style="margin:0;display:flex;align-items:center;gap:10px">
              📚 Respuestas correctas
              <span style="font-size:0.8rem;font-weight:400;color:var(--muted)">(${answerCards.length} preguntas — pulsa para expandir)</span>
            </div>
          </summary>
          <div style="padding-top:8px">${answerCards.join('')}</div>
        </details>`;
    }
  }

  // pie
  const deleteBtnHtml = `<button class="btn btn-danger" id="deleteBtn">🗑 Eliminar intento</button>`;
  let foot = '';
  if (attempt.status === 'draft') {
    foot = `<div class="btn-row" style="margin-top:24px">
      <button class="btn btn-primary" id="submitBtn">✔ Entregar examen</button>
      <a class="btn btn-ghost" href="#/exam/${esc(examId)}">Guardar y salir</a>
      ${deleteBtnHtml}
    </div>`;
  } else {
    const correctLabel = isCorrected ? '🔁 Re-corregir con IA' : '✨ Corregir con IA (Claude)';
    foot = `<div class="btn-row" style="margin-top:24px">
      <button class="btn btn-primary" id="correctBtn">${correctLabel}</button>
      <a class="btn" href="#/exam/${esc(examId)}">← Volver al historial</a>
      <button class="btn" id="retryBtn">🔁 Hacer otro intento</button>
      ${deleteBtnHtml}
    </div>`;
  }

  appEl.innerHTML = `<a class="back" href="#/exam/${esc(examId)}">← ${esc(exam.id)}</a>${head}${body}${answersSection}${foot}`;

  if (attempt.status === 'draft') {
    setupRunner(examId, attemptId, attempt);
  }
  const retry = document.getElementById('retryBtn');
  if (retry) retry.onclick = () => startAttempt(examId, attempt.mode);
  const correctBtn = document.getElementById('correctBtn');
  if (correctBtn) correctBtn.onclick = () => correctWithAI(examId, attemptId);
  const delBtn = document.getElementById('deleteBtn');
  if (delBtn) delBtn.onclick = async () => {
    if (!confirm('¿Eliminar este intento? No se puede deshacer.')) return;
    deletingAttempt = true; // evita que el autoguardado lo recree al navegar
    try {
      await api('/attempts/' + examId + '/' + attemptId, { method: 'DELETE' });
      toast('Intento eliminado');
      location.hash = '#/exam/' + examId;
    } catch (e) {
      deletingAttempt = false;
      alert('No se pudo eliminar: ' + e.message);
    }
  };
}

async function correctWithAI(examId, attemptId) {
  let cfg = null;
  try { cfg = await api('/config'); } catch (e) {}
  if (!cfg || !cfg.hasKey) {
    toast('Configura tu API key de Claude primero');
    location.hash = '#/settings';
    return;
  }
  showOverlay('Corrigiendo con Claude…');
  try {
    await api('/attempts/' + examId + '/' + attemptId + '/correct', { method: 'POST' });
    hideOverlay();
    toast('¡Examen corregido!');
    route();
  } catch (e) {
    hideOverlay();
    alert('No se pudo corregir: ' + e.message);
  }
}

// ---------- vista: ajustes ----------
async function viewSettings() {
  crumb([{ label: 'Ajustes', href: '#/settings' }]);
  const cfg = await api('/config');
  const models = cfg.models || [];
  appEl.innerHTML = `
    <a class="back" href="#/">← Inicio</a>
    <h1>Ajustes</h1>
    <div class="panel">
      <h2 style="margin-bottom:6px">Corrección automática con Claude</h2>
      <p class="panel-intro">Pega tu API key de Anthropic y Claude corregirá tus exámenes al instante. La clave se guarda <b>solo en este equipo</b> (<code>app/data/config.json</code>, excluido de git) y nunca se muestra de vuelta ni se sube al repositorio.</p>
      <div style="margin:18px 0">
        <label class="lbl2" for="apiKey">API key de Claude</label>
        <input type="password" id="apiKey" class="input" autocomplete="off" spellcheck="false"
          placeholder="${cfg.hasKey ? '•••••••••• (ya configurada — escribe para cambiarla)' : 'sk-ant-...'}">
        <div class="hint-row">${cfg.hasKey ? '<span class="ok-dot">●</span> Hay una clave configurada' : '<span class="muted">No hay clave configurada todavía</span>'}</div>
      </div>
      <div style="margin:18px 0">
        <label class="lbl2" for="model">Modelo</label>
        <select id="model" class="input">
          ${models.map(m => `<option value="${esc(m.id)}" ${m.id === cfg.model ? 'selected' : ''}>${esc(m.label)}</option>`).join('')}
        </select>
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" id="saveCfg">Guardar</button>
        ${cfg.hasKey ? '<button class="btn btn-danger" id="clearKey">Borrar clave</button>' : ''}
      </div>
      <p class="panel-intro" style="margin-top:20px">
        <b>¿Cómo consigo una API key?</b> Entra en <b>console.anthropic.com</b> → <i>API Keys</i> → <i>Create Key</i>.
        Tu cuenta necesita saldo. Corregir un examen cuesta solo unos céntimos.
      </p>
    </div>`;

  document.getElementById('saveCfg').onclick = async () => {
    const apiKey = document.getElementById('apiKey').value;
    const model = document.getElementById('model').value;
    const body = { model };
    if (apiKey.trim()) body.apiKey = apiKey.trim();
    try {
      await api('/config', { method: 'POST', body: JSON.stringify(body) });
      toast('Ajustes guardados');
      route();
    } catch (e) { alert('No se pudo guardar: ' + e.message); }
  };
  const clear = document.getElementById('clearKey');
  if (clear) clear.onclick = async () => {
    if (!confirm('¿Borrar la API key guardada?')) return;
    await api('/config', { method: 'POST', body: JSON.stringify({ apiKey: '' }) });
    toast('Clave borrada');
    route();
  };
}

function renderQuestion(q, attempt, isCorrected, readOnly) {
  const ans = (attempt.answers && attempt.answers[q.id]) || '';
  const corr = isCorrected ? (attempt.corrections && attempt.corrections[q.id]) : null;
  const borderCls = corr ? qBorderClass(corr.score, q.points) : (String(ans).trim() ? 'answered' : '');
  const isCode = q.type === 'code';

  let answerArea;
  if (readOnly) {
    answerArea = `<div class="answer-readonly ${String(ans).trim() ? '' : 'empty'}">${String(ans).trim() ? esc(ans) : 'Sin responder'}</div>`;
  } else {
    answerArea = `<textarea class="answer ${isCode ? 'code' : ''}" data-qid="${esc(q.id)}" placeholder="${isCode ? 'Escribe tu código aquí…' : 'Escribe tu respuesta aquí…'}">${esc(ans)}</textarea>`;
  }

  // Solución canónica (estudio): disponible siempre que la pregunta la tenga.
  // Oculta tras un desplegable para poder contrastar "al momento" sin chivarse.
  let solutionBlock = '';
  if (q.answer && String(q.answer).trim()) {
    solutionBlock = `
      <details class="solution">
        <summary>🔍 Ver solución correcta</summary>
        <pre class="model-body">${esc(q.answer)}</pre>
      </details>`;
  }

  let correctionBlock = '';
  if (corr) {
    correctionBlock = `
      <div class="correction">
        <div class="correction-head">
          <span class="lbl">Corrección</span>
          <span class="score-pill ${scoreClass(corr.score, q.points)}">${fmtScore(corr.score)} / ${fmtScore(q.points)}</span>
        </div>
        ${corr.feedback ? `<div class="feedback">${esc(corr.feedback)}</div>` : ''}
        ${corr.modelAnswer ? `<details class="model"><summary>Ver respuesta modelo</summary><div class="model-body answer-readonly">${esc(corr.modelAnswer)}</div></details>` : ''}
      </div>`;
  }

  return `
    <div class="q ${borderCls}" data-qcard="${esc(q.id)}">
      <div class="q-head">
        <span class="q-num">${esc(q.n || '?')}</span>
        ${q.origin ? `<span class="q-origin q-${esc(q.origin)}">${q.origin === 'nueva' ? 'nueva' : 'examen anterior'}</span>` : ''}
        <span class="q-points">${fmtScore(q.points)} p</span>
      </div>
      <div class="q-prompt">${esc(q.prompt)}</div>
      ${q.hint ? `<div class="q-hint">${esc(q.hint)}</div>` : ''}
      ${codeBlock(q)}
      ${answerArea}
      ${solutionBlock}
      ${correctionBlock}
    </div>`;
}

function renderOrphan(id, attempt, isCorrected) {
  const ans = (attempt.answers && attempt.answers[id]) || '';
  const corr = isCorrected ? (attempt.corrections && attempt.corrections[id]) : null;
  let correctionBlock = '';
  if (corr) {
    correctionBlock = `
      <div class="correction">
        <div class="correction-head">
          <span class="lbl">Corrección</span>
          <span class="score-pill ${scoreClass(corr.score, corr.score)}">${fmtScore(corr.score)} p</span>
        </div>
        ${corr.feedback ? `<div class="feedback">${esc(corr.feedback)}</div>` : ''}
        ${corr.modelAnswer ? `<details class="model"><summary>Ver respuesta modelo</summary><div class="model-body answer-readonly">${esc(corr.modelAnswer)}</div></details>` : ''}
      </div>`;
  }
  return `
    <div class="q">
      <div class="q-head"><span class="q-num">${esc(id)}</span></div>
      <div class="answer-readonly ${String(ans).trim() ? '' : 'empty'}">${String(ans).trim() ? esc(ans) : 'Sin responder'}</div>
      ${correctionBlock}
    </div>`;
}

function setupRunner(examId, attemptId, attempt) {
  const textareas = Array.from(appEl.querySelectorAll('textarea.answer'));
  const saveState = document.getElementById('saveState');
  const progbar = document.getElementById('progbar');
  const ac = new AbortController();
  let dirty = {};
  let saveTimer = null;
  let submitted = false;

  function updateProgress() {
    const answered = textareas.filter(t => t.value.trim() !== '').length;
    if (progbar) progbar.style.width = (answered / Math.max(1, textareas.length) * 100) + '%';
    textareas.forEach(t => {
      const card = appEl.querySelector(`[data-qcard="${CSS.escape(t.dataset.qid)}"]`);
      if (card) card.classList.toggle('answered', t.value.trim() !== '');
    });
  }

  async function flush() {
    const payload = {};
    Object.keys(dirty).forEach(qid => { payload[qid] = dirty[qid]; });
    if (!Object.keys(payload).length) return;
    dirty = {};
    if (saveState) saveState.textContent = 'Guardando…';
    try {
      await api('/attempts/' + examId + '/' + attemptId, { method: 'PUT', body: JSON.stringify({ answers: payload }) });
      if (saveState) saveState.textContent = 'Guardado ✓';
    } catch (e) {
      if (saveState) saveState.textContent = '⚠️ sin guardar';
      // Reponer SOLO las preguntas que el usuario no haya vuelto a tocar
      // (no pisar lo más reciente escrito durante el envío), y reintentar.
      Object.keys(payload).forEach(qid => { if (!(qid in dirty)) dirty[qid] = payload[qid]; });
      clearTimeout(saveTimer);
      saveTimer = setTimeout(flush, 2500);
    }
  }

  // Guarda lo pendiente al abandonar la página (cierre/recarga/navegación externa).
  function persistNow(keepalive) {
    const payload = {};
    Object.keys(dirty).forEach(qid => { payload[qid] = dirty[qid]; });
    if (!Object.keys(payload).length) return;
    try {
      fetch('/api/attempts/' + examId + '/' + attemptId, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: payload }), keepalive: !!keepalive
      }).catch(() => {});
    } catch (e) {}
  }

  textareas.forEach(t => {
    t.addEventListener('input', () => {
      dirty[t.dataset.qid] = t.value;
      if (saveState) saveState.textContent = 'Escribiendo…';
      updateProgress();
      clearTimeout(saveTimer);
      saveTimer = setTimeout(flush, 700);
    }, { signal: ac.signal });
  });
  updateProgress();

  // Ctrl+S guarda
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      clearTimeout(saveTimer);
      flush().then(() => toast('Guardado'));
    }
  }, { signal: ac.signal });

  // Persistir al cerrar/recargar/ocultar la pestaña
  const onLeave = () => persistNow(true);
  window.addEventListener('beforeunload', onLeave, { signal: ac.signal });
  window.addEventListener('pagehide', onLeave, { signal: ac.signal });

  // Limpieza al cambiar de vista (SPA): quita listeners, cancela el debounce
  // y persiste de forma síncrona lo que quede pendiente.
  addCleanup(() => {
    ac.abort();
    clearTimeout(saveTimer);
    if (!submitted && !deletingAttempt) persistNow(false);
  });

  // entregar
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.onclick = async () => {
      clearTimeout(saveTimer);
      await flush();
      const unanswered = textareas.filter(t => t.value.trim() === '').length;
      const msg = unanswered ? `Quedan ${unanswered} preguntas sin responder. ¿Entregar igualmente?` : '¿Entregar el examen?';
      if (!confirm(msg)) return;
      submitted = true;
      await api('/attempts/' + examId + '/' + attemptId, { method: 'PUT', body: JSON.stringify({ status: 'submitted' }) });
      toast('¡Examen entregado!');
      route();
    };
  }

  // temporizador (simulacro)
  if (attempt.mode === 'simulacro' && attempt.durationMin) {
    const timerEl = document.getElementById('timer');
    const end = new Date(attempt.createdAt).getTime() + attempt.durationMin * 60000;
    const tick = setInterval(async () => {
      const left = end - Date.now();
      if (!timerEl) return;
      if (left <= 0) {
        timerEl.textContent = '00:00';
        clearInterval(tick);
        clearTimeout(saveTimer);
        await flush();
        submitted = true;
        await api('/attempts/' + examId + '/' + attemptId, { method: 'PUT', body: JSON.stringify({ status: 'submitted' }) }).catch(() => {});
        toast('⏰ Tiempo agotado — entregado');
        route();
        return;
      }
      const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
      timerEl.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      timerEl.classList.toggle('danger', left < 5 * 60000);
    }, 1000);
    activeTimers.push(tick);
  }
}

// ---------- vista: comparar ----------
async function viewCompare(examId, attemptIds) {
  if (attemptIds.length < 2) { location.hash = '#/exam/' + examId; return; }
  const exam = await api('/exams/' + examId);
  const attempts = await Promise.all(attemptIds.map(id => api('/attempts/' + examId + '/' + id).catch(() => null)));
  const valid = attempts.filter(Boolean);
  crumb([{ label: exam.id, href: '#/exam/' + exam.id }, { label: 'Comparar', href: '#' }]);

  const qmap = {};
  exam.sections.forEach(s => s.questions.forEach(q => { qmap[q.id] = q; }));
  const allIds = [];
  exam.sections.forEach(s => s.questions.forEach(q => {
    if (valid.some(a => (a.questionIds || []).includes(q.id))) allIds.push(q.id);
  }));

  const header = valid.map(a => {
    const g = grade10(effectiveScore(a), a.maxScore);
    return `<th>${fmtDate(a.createdAt)}<br><span class="sub" style="font-weight:500;color:var(--muted)">${a.mode === 'simulacro' ? '🎲' : '📋'} ${statusChip(a.status)} ${g != null ? fmtScore(g) + '/10' : '–'}</span></th>`;
  }).join('');

  const rows = allIds.map(qid => {
    const q = qmap[qid];
    const cells = valid.map(a => {
      const inAttempt = (a.questionIds || []).includes(qid);
      if (!inAttempt) return `<td style="color:var(--muted);font-style:italic">—</td>`;
      const ans = (a.answers && a.answers[qid]) || '';
      const corr = a.corrections && a.corrections[qid];
      return `<td>
        <div class="cell-ans">${String(ans).trim() ? esc(ans) : '<span style="color:var(--muted);font-style:italic">Sin responder</span>'}</div>
        ${corr ? `<div class="cell-score"><span class="score-pill ${scoreClass(corr.score, q.points)}">${fmtScore(corr.score)}/${fmtScore(q.points)}</span></div>` : ''}
      </td>`;
    }).join('');
    return `<tr><td class="qcol"><b>${esc(q.n)}.</b> ${esc(q.prompt)}</td>${cells}</tr>`;
  }).join('');

  appEl.innerHTML = `
    <a class="back" href="#/exam/${esc(examId)}">← ${esc(exam.id)}</a>
    <h1>Comparar intentos</h1>
    <p class="subtitle">${esc(exam.subject)} · ${valid.length} intentos</p>
    <div class="compare-wrap">
      <table class="compare">
        <thead><tr><th class="qcol">Pregunta</th>${header}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ---------- tema ----------
function initTheme() {
  const saved = localStorage.getItem('theme');
  const theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggle');
  btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  btn.onclick = () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.textContent = next === 'dark' ? '☀️' : '🌙';
  };
}

// ---------- arranque ----------
initTheme();
window.addEventListener('hashchange', route);
route();
