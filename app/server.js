'use strict';
/*
 * Servidor de exámenes UOC — sin dependencias (solo Node nativo).
 * Arranque:  node app/server.js   (o   npm start  desde la carpeta app)
 *
 * Sirve el front-end estático de /public y expone una pequeña API REST que
 * lee y escribe ficheros JSON en /data. No usa ninguna librería externa.
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const EXAMS_DIR = path.join(ROOT, 'data', 'exams');
const ATTEMPTS_DIR = path.join(ROOT, 'data', 'attempts');
const CONFIG_FILE = path.join(ROOT, 'data', 'config.json');

const PORT = process.env.PORT || 3939;

// Modelos de Claude disponibles para corregir (ids reales de la API).
const MODELS = [
  { id: 'claude-opus-4-8', label: 'Claude Opus 4.8 (el más capaz)' },
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6 (equilibrado)' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 (rápido y económico)' }
];
const DEFAULT_MODEL = 'claude-opus-4-8';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.woff2': 'font/woff2'
};

// ---------- helpers ----------

function send(res, status, body, headers) {
  const h = Object.assign({ 'Cache-Control': 'no-store' }, headers || {});
  res.writeHead(status, h);
  res.end(body);
}

function sendJson(res, status, obj) {
  send(res, status, JSON.stringify(obj, null, 2), { 'Content-Type': 'application/json; charset=utf-8' });
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(obj, null, 2), 'utf8');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

// Evita path traversal: ids alfanuméricos, guiones y puntos, pero NUNCA
// '.', '..' ni secuencias de traversal.
function safeId(id) {
  return typeof id === 'string' && id !== '.' && id !== '..' &&
    !id.includes('..') && /^[A-Za-z0-9._-]+$/.test(id);
}

// Defensa en profundidad: resuelve una ruta y comprueba que queda DENTRO de baseDir.
function resolveInside(baseDir, ...segments) {
  const baseAbs = path.resolve(baseDir);
  const target = path.resolve(baseDir, ...segments);
  if (target !== baseAbs && !target.startsWith(baseAbs + path.sep)) return null;
  return target;
}

function nowStamp() {
  // 2026-06-11T10-30-00-123Z  -> sirve como id de fichero ordenable
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function listExams() {
  if (!fs.existsSync(EXAMS_DIR)) return [];
  return fs.readdirSync(EXAMS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      try {
        const exam = readJson(path.join(EXAMS_DIR, f));
        const questions = (exam.sections || []).reduce((a, s) => a + (s.questions || []).length, 0);
        return {
          id: exam.id,
          subject: exam.subject,
          title: exam.title,
          intro: exam.intro || '',
          maxScore: exam.maxScore || null,
          examFormat: exam.examFormat || null,
          sectionCount: (exam.sections || []).length,
          questionCount: questions
        };
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);
}

function getExam(id) {
  const file = path.join(EXAMS_DIR, id + '.json');
  if (!fs.existsSync(file)) return null;
  return readJson(file);
}

function flatQuestions(exam) {
  const out = [];
  (exam.sections || []).forEach(sec => (sec.questions || []).forEach(q => out.push(q)));
  return out;
}

function attemptDir(examId) {
  return path.join(ATTEMPTS_DIR, examId);
}

function listAttempts(examId) {
  const dir = attemptDir(examId);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      try {
        const a = readJson(path.join(dir, f));
        const qids = new Set(a.questionIds || []);
        const answered = Object.entries(a.answers || {})
          .filter(([k, v]) => qids.has(k) && String(v || '').trim() !== '').length;
        const corrSum = a.corrections
          ? Object.values(a.corrections).reduce((s, c) => s + ((c && c.score) || 0), 0) : 0;
        const effTotal = (a.totalScore != null) ? a.totalScore
          : (a.status === 'corrected' ? corrSum : null);
        return {
          attemptId: a.attemptId,
          examId: a.examId,
          mode: a.mode || 'completo',
          scope: a.scope || 'todas',
          title: a.title || '',
          createdAt: a.createdAt,
          submittedAt: a.submittedAt || null,
          correctedAt: a.correctedAt || null,
          status: a.status,
          totalScore: effTotal,
          maxScore: a.maxScore,
          answeredCount: answered,
          questionCount: (a.questionIds || []).length
        };
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean)
    .sort((x, y) => String(y.createdAt).localeCompare(String(x.createdAt)));
}

function getAttempt(examId, attemptId) {
  const file = resolveInside(ATTEMPTS_DIR, examId, attemptId + '.json');
  if (!file || !fs.existsSync(file)) return null;
  return readJson(file);
}

function createAttempt(examId, opts) {
  const exam = getExam(examId);
  if (!exam) return null;
  const all = flatQuestions(exam);
  const mode = (opts && opts.mode) === 'simulacro' ? 'simulacro' : 'completo';
  const scope = (opts && (opts.scope === 'anterior' || opts.scope === 'nueva')) ? opts.scope : 'todas';

  // Filtra por origen: 'anterior' (de exámenes pasados), 'nueva' o 'todas'.
  let pool = all;
  if (scope !== 'todas') {
    const f = all.filter(q => (q.origin || 'anterior') === scope);
    if (f.length) pool = f; // si el examen no tuviera de ese tipo, no lo dejamos vacío
  }
  let ids = pool.map(q => q.id);

  if (mode === 'simulacro') {
    // Selecciona 4 preguntas al azar (como el examen real).
    const n = Math.min(4, ids.length);
    const shuffled = ids.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = t;
    }
    ids = shuffled.slice(0, n);
    // Mantén el orden original del examen para que se lean coherentes.
    const order = new Map(all.map((q, i) => [q.id, i]));
    ids.sort((a, b) => order.get(a) - order.get(b));
  }

  const pointMap = new Map(all.map(q => [q.id, q.points || 0]));
  // El máximo del intento es la suma de los puntos de las preguntas incluidas
  // (todas en "completo", las 4 elegidas en "simulacro"). La nota /10 se
  // calcula como totalScore / maxScore * 10.
  const maxScore = ids.reduce((a, id) => a + (pointMap.get(id) || 0), 0);

  const scopeLabel = scope === 'anterior' ? 'exámenes anteriores' : scope === 'nueva' ? 'nuevas' : 'todas';

  const attempt = {
    attemptId: nowStamp(),
    examId: examId,
    examSubject: exam.subject,
    title: (mode === 'simulacro' ? 'Simulacro (4 preguntas)' : 'Examen completo') + ' · ' + scopeLabel,
    mode: mode,
    scope: scope,
    durationMin: mode === 'simulacro' ? (exam.examFormat && exam.examFormat.minutes || 30) : null,
    createdAt: new Date().toISOString(),
    submittedAt: null,
    correctedAt: null,
    status: 'draft',
    questionIds: ids,
    answers: {},
    corrections: {},
    totalScore: null,
    maxScore: Math.round(maxScore * 100) / 100,
    globalFeedback: ''
  };
  const file = resolveInside(ATTEMPTS_DIR, examId, attempt.attemptId + '.json');
  if (!file) return null;
  writeJson(file, attempt);
  return attempt;
}

function updateAttempt(examId, attemptId, patch) {
  const current = getAttempt(examId, attemptId);
  if (!current) return null;
  // Solo se permiten estos campos desde el cliente (las correcciones las pone el profesor editando el JSON).
  if (patch.answers && typeof patch.answers === 'object') {
    current.answers = Object.assign({}, current.answers, patch.answers);
  }
  if (patch.status === 'submitted') {
    current.status = 'submitted';
    current.submittedAt = new Date().toISOString();
  }
  if (patch.status === 'draft') {
    current.status = 'draft';
  }
  const file = resolveInside(ATTEMPTS_DIR, examId, attemptId + '.json');
  if (!file) return null;
  writeJson(file, current);
  return current;
}

function deleteAttempt(examId, attemptId) {
  const file = resolveInside(ATTEMPTS_DIR, examId, attemptId + '.json');
  if (!file || !fs.existsSync(file)) return false;
  fs.unlinkSync(file);
  return true;
}

// ---------- config (API key de Claude, guardada solo en local) ----------

function readConfig() {
  try { return readJson(CONFIG_FILE); } catch (e) { return {}; }
}
function writeConfig(cfg) { writeJson(CONFIG_FILE, cfg); }
function publicConfig() {
  const cfg = readConfig();
  return { hasKey: !!cfg.apiKey, model: cfg.model || DEFAULT_MODEL, models: MODELS };
}

// ---------- llamada a la API de Claude (https nativo, sin SDK) ----------

function anthropicMessages(apiKey, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        let json;
        try { json = JSON.parse(data); } catch (e) { return reject(new Error('Respuesta no válida de la API')); }
        if (res.statusCode >= 400) {
          const msg = (json && json.error && json.error.message) || ('HTTP ' + res.statusCode);
          return reject(new Error(msg));
        }
        resolve(json);
      });
    });
    req.setTimeout(290000, () => req.destroy(new Error('Tiempo de espera agotado al llamar a la API')));
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

const CORRECTION_TOOL = {
  name: 'entregar_correccion',
  description: 'Entrega la corrección del examen: una puntuación, feedback y respuesta modelo por cada pregunta, más una nota y comentario global.',
  input_schema: {
    type: 'object',
    properties: {
      totalScore: { type: 'number', description: 'Suma de los puntos obtenidos en todas las preguntas.' },
      globalFeedback: { type: 'string', description: 'Comentario general del examen en español: puntos fuertes y áreas a mejorar.' },
      corrections: {
        type: 'array',
        description: 'Una entrada por cada pregunta corregida.',
        items: {
          type: 'object',
          properties: {
            questionId: { type: 'string', description: 'El id exacto de la pregunta (p. ej. "q3").' },
            score: { type: 'number', description: 'Puntos otorgados, entre 0 y el máximo de la pregunta.' },
            feedback: { type: 'string', description: 'Feedback breve y constructivo en español: qué está bien, qué falta y errores.' },
            modelAnswer: { type: 'string', description: 'Respuesta modelo correcta y concisa en español.' }
          },
          required: ['questionId', 'score', 'feedback', 'modelAnswer']
        }
      }
    },
    required: ['totalScore', 'globalFeedback', 'corrections']
  }
};

const CORRECTION_SYSTEM =
  'Eres un profesor de Formación Profesional (UOC) que corrige exámenes de informática. ' +
  'Para CADA pregunta: asigna una puntuación entre 0 y el máximo indicado, da un feedback breve y ' +
  'constructivo en español (qué está bien, qué falta, errores concretos) y proporciona una respuesta ' +
  'modelo correcta y concisa. Sé justo pero riguroso: si la respuesta está vacía, puntúa 0 y explica la ' +
  'solución. Valora la corrección técnica, no la redacción. Usa exactamente el id de cada pregunta. ' +
  'Devuelve TODO mediante la herramienta entregar_correccion.';

async function correctAttempt(examId, attemptId) {
  const exam = getExam(examId);
  const attempt = getAttempt(examId, attemptId);
  if (!exam || !attempt) return { code: 404, error: 'intento no encontrado' };

  const cfg = readConfig();
  if (!cfg.apiKey) return { code: 400, error: 'No hay API key configurada. Ve a Ajustes y añade tu clave de Claude.' };

  const qmap = {};
  exam.sections.forEach(s => (s.questions || []).forEach(q => { qmap[q.id] = q; }));
  const qs = (attempt.questionIds || []).map(id => qmap[id]).filter(Boolean);
  if (!qs.length) return { code: 400, error: 'El intento no tiene preguntas' };

  let userText = 'Asignatura: ' + exam.subject + '\n';
  userText += 'Corrige las siguientes ' + qs.length + ' respuestas del estudiante. ';
  userText += 'Cada pregunta indica su puntuación máxima.\n\n';
  qs.forEach(q => {
    userText += '=== Pregunta ' + (q.n || '') + ' (id: ' + q.id + ') — máximo ' + (q.points || 0) + ' puntos ===\n';
    userText += 'Enunciado: ' + q.prompt + '\n';
    if (q.codeLines && q.codeLines.length) {
      userText += 'Código de la pregunta (' + (q.codeLang || '') + '):\n' + q.codeLines.join('\n') + '\n';
    }
    const ans = (attempt.answers && attempt.answers[q.id]) || '';
    userText += 'Respuesta del estudiante: ' + (String(ans).trim() ? ans : '(SIN RESPONDER)') + '\n\n';
  });

  const resp = await anthropicMessages(cfg.apiKey, {
    model: cfg.model || DEFAULT_MODEL,
    max_tokens: 16000,
    system: CORRECTION_SYSTEM,
    tools: [CORRECTION_TOOL],
    tool_choice: { type: 'tool', name: 'entregar_correccion' },
    messages: [{ role: 'user', content: userText }]
  });

  const toolBlock = (resp.content || []).find(b => b.type === 'tool_use');
  if (!toolBlock || !toolBlock.input) return { code: 502, error: 'La IA no devolvió una corrección válida' };
  const out = toolBlock.input;

  const corrections = {};
  let sum = 0;
  (out.corrections || []).forEach(c => {
    const q = qmap[c.questionId];
    if (!q) return;
    const max = q.points || 0;
    let score = Number(c.score);
    if (!isFinite(score)) score = 0;
    score = Math.max(0, Math.min(max, score));
    corrections[c.questionId] = {
      score: Math.round(score * 100) / 100,
      feedback: String(c.feedback || ''),
      modelAnswer: String(c.modelAnswer || '')
    };
    sum += score;
  });

  attempt.corrections = corrections;
  attempt.totalScore = Math.round(sum * 100) / 100;
  attempt.globalFeedback = String(out.globalFeedback || '');
  attempt.status = 'corrected';
  attempt.correctedAt = new Date().toISOString();
  attempt.correctedBy = 'ia:' + (cfg.model || DEFAULT_MODEL);

  const file = resolveInside(ATTEMPTS_DIR, examId, attemptId + '.json');
  if (!file) return { code: 400, error: 'bad id' };
  writeJson(file, attempt);
  return { code: 200, attempt };
}

// ---------- static ----------

function serveStatic(req, res, pathname) {
  let rel = pathname === '/' ? '/index.html' : pathname;
  try { rel = decodeURIComponent(rel); } catch (e) { return send(res, 400, 'Bad request'); }
  const filePath = path.normalize(path.join(PUBLIC_DIR, rel));
  const base = PUBLIC_DIR + path.sep;
  if (filePath !== PUBLIC_DIR && !filePath.startsWith(base)) {
    return send(res, 403, 'Forbidden');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA: cualquier ruta desconocida cae al index.
      return fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (e2, html) => {
        if (e2) return send(res, 404, 'Not found');
        send(res, 200, html, { 'Content-Type': MIME['.html'] });
      });
    }
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, data, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  });
}

// ---------- body ----------

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', c => {
      raw += c;
      if (raw.length > 5 * 1024 * 1024) { req.destroy(); reject(new Error('body too large')); }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); }
      catch (e) { reject(new Error('invalid json')); }
    });
    req.on('error', reject);
  });
}

// ---------- router ----------

async function handleApi(req, res, parts) {
  // parts = segmentos tras /api
  const method = req.method;

  // /api/config
  if (parts[0] === 'config' && parts.length === 1) {
    if (method === 'GET') return sendJson(res, 200, publicConfig());
    if (method === 'POST') {
      const body = await readBody(req).catch(() => null);
      if (body === null) return sendJson(res, 400, { error: 'invalid body' });
      const cfg = readConfig();
      if (typeof body.apiKey === 'string') {
        if (body.apiKey.trim() === '') delete cfg.apiKey;
        else cfg.apiKey = body.apiKey.trim();
      }
      if (typeof body.model === 'string' && MODELS.some(m => m.id === body.model)) {
        cfg.model = body.model;
      }
      writeConfig(cfg);
      return sendJson(res, 200, publicConfig());
    }
  }

  // /api/attempts/:examId/:attemptId/correct  -> corrección con IA
  if (parts[0] === 'attempts' && parts.length === 4 && parts[3] === 'correct' && method === 'POST') {
    if (!safeId(parts[1]) || !safeId(parts[2])) return sendJson(res, 400, { error: 'bad id' });
    try {
      const r = await correctAttempt(parts[1], parts[2]);
      if (r.error) return sendJson(res, r.code || 500, { error: r.error });
      return sendJson(res, 200, r.attempt);
    } catch (e) {
      return sendJson(res, 502, { error: 'Error al corregir con IA: ' + (e && e.message || e) });
    }
  }

  // /api/exams
  if (parts[0] === 'exams' && parts.length === 1 && method === 'GET') {
    return sendJson(res, 200, listExams());
  }
  // /api/exams/:id
  if (parts[0] === 'exams' && parts.length === 2 && method === 'GET') {
    if (!safeId(parts[1])) return sendJson(res, 400, { error: 'bad id' });
    const exam = getExam(parts[1]);
    return exam ? sendJson(res, 200, exam) : sendJson(res, 404, { error: 'exam not found' });
  }

  // /api/attempts/:examId
  if (parts[0] === 'attempts' && parts.length === 2) {
    if (!safeId(parts[1])) return sendJson(res, 400, { error: 'bad id' });
    if (method === 'GET') return sendJson(res, 200, listAttempts(parts[1]));
    if (method === 'POST') {
      const body = await readBody(req).catch(() => null);
      if (body === null) return sendJson(res, 400, { error: 'invalid body' });
      const created = createAttempt(parts[1], body);
      return created ? sendJson(res, 201, created) : sendJson(res, 404, { error: 'exam not found' });
    }
  }

  // /api/attempts/:examId/:attemptId
  if (parts[0] === 'attempts' && parts.length === 3) {
    if (!safeId(parts[1]) || !safeId(parts[2])) return sendJson(res, 400, { error: 'bad id' });
    if (method === 'GET') {
      const a = getAttempt(parts[1], parts[2]);
      return a ? sendJson(res, 200, a) : sendJson(res, 404, { error: 'attempt not found' });
    }
    if (method === 'PUT') {
      const body = await readBody(req).catch(() => null);
      if (body === null) return sendJson(res, 400, { error: 'invalid body' });
      const upd = updateAttempt(parts[1], parts[2], body);
      return upd ? sendJson(res, 200, upd) : sendJson(res, 404, { error: 'attempt not found' });
    }
    if (method === 'DELETE') {
      const okDel = deleteAttempt(parts[1], parts[2]);
      return okDel ? sendJson(res, 200, { ok: true }) : sendJson(res, 404, { error: 'attempt not found' });
    }
  }

  // Ruta conocida pero método no permitido -> 405 con cabecera Allow.
  const allows =
    (parts[0] === 'config' && parts.length === 1) ? 'GET, POST' :
    (parts[0] === 'exams' && parts.length === 1) ? 'GET' :
    (parts[0] === 'exams' && parts.length === 2) ? 'GET' :
    (parts[0] === 'attempts' && parts.length === 2) ? 'GET, POST' :
    (parts[0] === 'attempts' && parts.length === 3) ? 'GET, PUT, DELETE' :
    (parts[0] === 'attempts' && parts.length === 4 && parts[3] === 'correct') ? 'POST' : null;
  if (allows) {
    return send(res, 405, JSON.stringify({ error: 'method not allowed' }),
      { 'Content-Type': 'application/json; charset=utf-8', 'Allow': allows });
  }
  return sendJson(res, 404, { error: 'unknown endpoint' });
}

const server = http.createServer(async (req, res) => {
  try {
    const parsed = url.parse(req.url);
    const pathname = parsed.pathname || '/';

    if (pathname.startsWith('/api/')) {
      const parts = pathname.replace(/^\/api\//, '').replace(/\/+$/, '').split('/').filter(Boolean);
      return await handleApi(req, res, parts);
    }
    if (req.method !== 'GET') return send(res, 405, 'Method not allowed');
    return serveStatic(req, res, pathname);
  } catch (e) {
    console.error('Error del servidor:', e);
    sendJson(res, 500, { error: 'internal server error' });
  }
});

ensureDir(EXAMS_DIR);
ensureDir(ATTEMPTS_DIR);

// Abre el navegador en la URL del servidor (Windows / macOS / Linux).
// Se puede desactivar con  NO_OPEN=1 npm start
function openBrowser(targetUrl) {
  if (process.env.NO_OPEN === '1' || process.env.OPEN === '0') return;
  const { exec } = require('child_process');
  let cmd;
  if (process.platform === 'win32') cmd = 'start "" "' + targetUrl + '"';
  else if (process.platform === 'darwin') cmd = 'open "' + targetUrl + '"';
  else cmd = 'xdg-open "' + targetUrl + '"';
  exec(cmd, () => {}); // si falla, no pasa nada: la URL se imprime igualmente
}

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('\n  ⚠️  El puerto ' + PORT + ' ya está en uso.');
    console.error('  Seguramente ya tienes el servidor abierto: prueba  http://localhost:' + PORT);
    console.error('  O arráncalo en otro puerto:   $env:PORT=4000 ; npm start\n');
    process.exit(1);
  }
  throw e;
});

server.listen(PORT, () => {
  const localUrl = 'http://localhost:' + PORT;
  console.log('\n  Examenes UOC — servidor en marcha');
  console.log('  ▶  ' + localUrl + '\n');
  console.log('  Exámenes cargados:');
  listExams().forEach(e => console.log('   · ' + e.id + '  ' + e.subject + '  (' + e.questionCount + ' preguntas)'));
  console.log('\n  Abriendo el navegador… (desactívalo con NO_OPEN=1)');
  console.log('  Ctrl+C para parar.\n');
  openBrowser(localUrl);
});
