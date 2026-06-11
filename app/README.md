# 📝 Entrenador de exámenes UOC

Una pequeña web para **leer, contestar, corregir y comparar** exámenes de práctica.
Sin dependencias externas (solo Node nativo) → se commitea limpio al repositorio y funciona offline.

## Arrancar

```bash
cd app
node server.js
```

Luego abre **http://localhost:3939** en el navegador.

> Cambiar el puerto: `PORT=4000 node server.js` (en PowerShell: `$env:PORT=4000; node server.js`).

## Cómo se usa (flujo completo)

1. **Inicio** → elige una asignatura.
2. **Nuevo intento (completo)** = todas las preguntas · **Simulacro** = 4 preguntas al azar con cronómetro de 30 min (como el examen real).
3. Contesta. Se **autoguarda** solo (también con `Ctrl+S`). El código aparece **resaltado con colores**. Pulsa **Entregar**.
4. Corrige el intento. Dos opciones:
   - **✨ Corregir con IA (Claude)** — botón en el intento entregado. Requiere configurar tu API key en **⚙️ Ajustes** (ver abajo). Sale una pantalla de carga y, al terminar, ves la corrección con nota, feedback y respuesta modelo por pregunta.
   - **Manual** — avísame (*"corrige el intento `<fecha>` de FP055"*) y edito su JSON a mano.
5. **Refresca** / vuelve al intento → verás la corrección con colores y la nota sobre 10.
6. **Historial**: cada examen guarda todos tus intentos. Selecciona 2+ con las casillas y pulsa **Comparar** para verlos lado a lado.

Como todo son ficheros dentro del repo, al hacer `git commit` queda guardado tu historial de respuestas y las correcciones.

## Corrección con IA (Claude) — configurar la API key

1. Abre **⚙️ Ajustes** (icono arriba a la derecha) o ve a `http://localhost:3939/#/settings`.
2. Pega tu API key de Anthropic (de **console.anthropic.com** → API Keys → Create Key) y elige modelo.
3. Guarda. A partir de ahí, el botón **✨ Corregir con IA** de cada intento entregado lo corrige al momento.

> 🔒 La clave se guarda **solo en este equipo** en `app/data/config.json`, que está en `.gitignore` — **nunca se sube al repositorio** ni se muestra de vuelta en la interfaz. El servidor es quien llama a la API de Anthropic (la clave no viaja al navegador).
>
> Modelos disponibles: Opus 4.8 (el más capaz), Sonnet 4.6 (equilibrado), Haiku 4.5 (rápido y económico). Corregir un examen cuesta unos céntimos.

## Estructura

```
app/
├── server.js              # servidor Node sin dependencias (estático + API REST)
├── package.json           # solo el script "start"
├── public/                # front-end (vanilla)
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── data/
    ├── exams/             # definición de cada examen (FUENTE DE LA VERDAD)
    │   ├── FP047.json
    │   ├── FP055.json
    │   ├── FP056.json
    │   └── FP067.json
    └── attempts/          # tus intentos (uno por fichero) → historial
        └── <examId>/<fecha>.json
```

## API REST (por si quieres trastear)

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/exams` | lista de exámenes |
| GET | `/api/exams/:examId` | definición de un examen |
| GET | `/api/attempts/:examId` | historial de intentos |
| POST | `/api/attempts/:examId` | crea un intento `{ "mode": "completo" \| "simulacro" }` |
| GET | `/api/attempts/:examId/:attemptId` | un intento |
| PUT | `/api/attempts/:examId/:attemptId` | guarda respuestas / entrega `{ answers?, status? }` |
| DELETE | `/api/attempts/:examId/:attemptId` | borra un intento |
| POST | `/api/attempts/:examId/:attemptId/correct` | corrige el intento con Claude |
| GET | `/api/config` | `{ hasKey, model, models }` (nunca devuelve la clave) |
| POST | `/api/config` | guarda `{ apiKey?, model? }` en `data/config.json` |

## Formato de un examen (para añadir exámenes futuros)

Para preparar otra asignatura el próximo semestre, basta con **crear un fichero `data/exams/MIID.json`** con esta forma. La web lo detecta automáticamente.

```jsonc
{
  "id": "FP046",
  "subject": "FP.046 — Diseño y programación de una base de datos",
  "title": "Examen completo de práctica",
  "intro": "Texto introductorio / formato del examen real.",
  "maxScore": 10,
  "examFormat": { "questions": 4, "minutes": 30, "pointsPerQuestion": 2.5, "passScore": 5 },
  "sections": [
    {
      "title": "Parte 1 — ...",
      "questions": [
        {
          "id": "q1",                 // único dentro del examen
          "n": "1",                   // número visible
          "prompt": "Enunciado…",
          "points": 2.5,
          "type": "text",             // "text" | "code"
          "hint": "",                 // opcional
          "codeLang": "sql",          // opcional (c, sql, java, html, typescript…)
          "codeLines": ["línea 1", "línea 2"]   // opcional, código que acompaña a la pregunta
        }
      ]
    }
  ]
}
```

Reglas:
- Cada pregunta necesita un `id` **único** dentro del examen (se usa para guardar respuestas y correcciones).
- `type: "code"` muestra el editor en monoespaciado.
- `codeLines` es un array de líneas (evita problemas de escape); la web las une con saltos de línea.

## Formato de una corrección (lo relleno yo)

Cuando corrijo, edito el fichero del intento (`data/attempts/<examId>/<fecha>.json`) y añado:

```jsonc
{
  "status": "corrected",
  "correctedAt": "2026-06-11T12:00:00.000Z",
  "totalScore": 7.5,
  "globalFeedback": "Comentario general del examen…",
  "corrections": {
    "q1": { "score": 2.0, "feedback": "Bien, pero te falta…", "modelAnswer": "Respuesta modelo…" },
    "q2": { "score": 1.0, "feedback": "…", "modelAnswer": "…" }
  }
}
```
