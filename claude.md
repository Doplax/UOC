# CLAUDE.md — Entrenador de exámenes UOC

## Propósito
Este proyecto sirve para preparar los exámenes de la UOC del usuario (doplax@gmail.com).
Mi función es ayudarle a estudiar y aprobar: crear/ampliar exámenes de práctica a partir de
enunciados y exámenes de años anteriores, **corregir** sus intentos y mantener la app de estudio.
La carpeta importante del material fuente es `01_EN-PROCESO/`.

## Estructura del repositorio
- `01_EN-PROCESO/<asignatura>/` — material fuente de las asignaturas EN CURSO:
  - `Enunciados/`, `ejercicios/` — enunciados y ejercicios de los productos.
  - `Examenes/` — **exámenes REALES** de convocatorias anteriores (.docx y .pdf).
  - `preparacion/*.md` — bancos de preguntas (01 anteriores, 02 nuevas, 03 examen práctica).
- `app/` — **la aplicación web de entrenamiento** (lo que el usuario usa para estudiar).
- `0_HECHOS/`, `02_xHACER/`, `03_CONVALIDADAS/`, `04_OTROS/` — otras asignaturas por estado.

## Asignaturas en curso (4)
| ID | Asignatura | Tecnología | Tipo |
|----|------------|-----------|------|
| FP047 | Programa de comandos personalizados para el SO | Python (exámenes históricos en **C**) | Práctico |
| FP055 | Introducción a las bases de datos | SQL / modelo E-R | Síntesis |
| FP056 | Programación orientada a objetos | Java | Síntesis |
| FP067 | Front End con Frameworks móviles | Angular / Firebase / React Native / Cloud Functions | Práctico |

**Formato real de examen:** 4 preguntas × 2,5 p · 30 min · aprobado ≥ 5/10 · sin material.
(Nota FP047: los enunciados actuales están migrados a Python pero los exámenes históricos usan C;
las respuestas de los exámenes anteriores van en C con una línea de "Equivalente en Python".)

## La app (`app/`)
SPA vanilla JS + servidor Node nativo, **sin dependencias externas**.
- Arranque: `npm start` desde `app/` (o `node app/server.js`). Puerto **3939**. Abre el navegador solo
  (desactivable con `NO_OPEN=1`).
- `app/server.js` — API REST + sirve los estáticos de `public/`. Lee/escribe JSON en `app/data/`.
- `app/public/` — `index.html`, `app.js` (router por hash, sin build), `styles.css`.

⚠️ **Node NO recarga el código al editarlo.** Si cambio `server.js` (p. ej. una ruta nueva), hay que
**REINICIAR** el servidor (Ctrl+C y `npm start`) o devolverá 404. Los `.json` de `data/` sí se leen
frescos en cada petición (editar datos NO requiere reinicio).

## Modelo de datos (`app/data/`)
- `exams/FPxxx.json` — **banco** de preguntas por asignatura:
  `{ id, subject, title, intro, maxScore, examFormat, sections:[{ title, questions:[{
     id, n, prompt, points, type:'text'|'code', codeLang?, codeLines?, hint,
     origin:'anterior'|'nueva', difficulty:'facil'|'media'|'dificil', answer }] }] }`
  - `answer` = solución canónica de estudio; termina con un anexo **"🧠 EN SIMPLE (para recordar)"**.
  - `difficulty` = nivel catalogado (badge de color en la UI).
- `pastexams/FPxxx.json` — **exámenes reales de años anteriores** reconstruidos y agrupados por convocatoria:
  `{ id, subject, exams:[{ id, title, date, source, questions:[{ n, prompt, points, type,
     codeLang?, codeLines?, answer, difficulty }] }] }`
- `attempts/FPxxx/<timestamp>.json` — cada intento del usuario:
  `{ attemptId, examId, mode:'completo'|'simulacro', scope:'todas'|'anterior'|'nueva',
     status:'draft'|'submitted'|'corrected', questionIds,
     answers:{qid:texto}, doubts:{qid:texto},
     corrections:{qid:{score, feedback, modelAnswer}}, doubtResponses:{qid:texto},
     totalScore, maxScore, globalFeedback, correctedAt }`
- `config.json` — API key de Claude (solo local, excluido de git).

## Funciones de la app
- **Dashboard → asignatura →** Nuevo intento (completo) · Simulacro (4 preg/30 min) ·
  📚 Solucionario (estudiar) · 🗓️ Exámenes anteriores.
- **Solucionario** (`#/study/:id`): todas las preguntas con su respuesta; filtros por origen y por
  dificultad; desplegar/plegar.
- **Exámenes anteriores** (`#/pastexams/:id` y `#/pastexam/:id/:pid`): cada convocatoria real aislada,
  con sus 4 preguntas, respuesta y dificultad.
- **Runner** (intento): autoguardado; por pregunta "🔍 Ver solución correcta" y "💬 Anotar una duda".
- **Vista corregida**: nota global (anillo) + por cada pregunta su **nota (score/points)** + **feedback**
  (✓ bien / ✗ mal) + "Ver respuesta modelo" + tu duda y su resolución + sección final "Respuestas correctas".

## Corrección de exámenes (dos vías)
1. **Con IA dentro de la app** (botón "Corregir con IA"): usa la API de Claude (`config.json`) y rellena
   `corrections` + `doubtResponses` automáticamente.
2. **Manual por mí** (lo habitual): el usuario entrega el examen (`status:'submitted'`) y me pide corregirlo.
   Edito el attempt JSON:
   - Por cada pregunta respondida: `score` (0..points) + `feedback` (empezando por lo que está BIEN y luego
     lo que FALTA/está MAL, en frases claras) + `modelAnswer` concisa.
   - Preguntas sin responder → `score: 0` + explicar la solución.
   - Cada duda no vacía → resolución en `doubtResponses[qid]`.
   - `totalScore` = suma de scores; nota /10 = `totalScore / maxScore * 10`; aprobado ≥ 5.
   - `status:'corrected'`, `correctedAt`. (NO poner `correctedBy:'ia:...'` en correcciones manuales.)

## Convenciones / detalles que importan
- Todo el contenido **en español**.
- Las respuestas se renderizan en `<pre>` monoespaciado; el código va bien indentado.
- Anexo **"🧠 EN SIMPLE (para recordar)"** al final de cada `answer`: la idea comprimida y memorizable
  (1-3 frases, con regla de oro o analogía). Guardia anti-duplicados por el marcador `EN SIMPLE`.
- **Tareas masivas de contenido** (generar respuestas, dificultad, anexos, parsear exámenes): uso
  **agentes en background** (Agent tool, uno por asignatura/fichero) que escriben un JSON temporal
  (`_diff_*`, `_simple_*`, `_src/*`), y luego **fusiono con un script Python** y borro los temporales.
  NO uso el Workflow tool salvo que el usuario lo pida explícitamente (ultracode off).
- Extracción de exámenes: `.docx` con `zipfile` + regex sobre `word/document.xml`; `.pdf` con
  `pymupdf` (fitz) o `pdftotext`.
- Consola de Windows en **cp1252**: al verificar, evitar imprimir emojis/`—` o usar `PYTHONIOENCODING=utf-8`
  (los ficheros se guardan correctamente en UTF-8).
- Los cambios son **locales**; NO hago `git commit` salvo que el usuario lo pida.
- Plataforma: Windows 11, PowerShell + Bash. Working dir: `d:\01_CODE\UOC\examenes`.

## Estado actual (2026-06-12)
- **176** preguntas de banco + **128** de exámenes anteriores (**32** exámenes reales), todas con
  respuesta detallada + anexo "EN SIMPLE" + dificultad catalogada.
- Diseño optimizado para lectura en **iPad** (contenedor ancho, tipografía y espaciado mayores).
- Funciones vivas: solucionario, exámenes anteriores aislados, dudas con resolución, dificultad con
  filtro, corrección manual y con IA.
- Sin commit a git (a la espera de que el usuario lo pida).
