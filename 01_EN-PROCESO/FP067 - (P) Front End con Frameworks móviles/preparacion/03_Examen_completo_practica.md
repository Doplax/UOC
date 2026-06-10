# FP067 — Front End con Frameworks móviles
## SÚPER DOCUMENTO DE PRÁCTICA (años anteriores + nuevas)

> Documento único para entrenar a fondo. Recorre las preguntas **en orden**, rellena cada **Respuesta:** y devuélveme el documento: te corregiré, puntuaré y te daré la respuesta modelo de lo que falles.
>
> **Cómo usarlo:** TEORÍA por producto (Angular → Firebase → React Native → Push) → CÓDIGO (detectar errores) → 3 SIMULACROS cronometrados (30 min, 4 preguntas × 2,5 p).
>
> **Examen real:** 4 preguntas mezclando estructura de ficheros, detección de errores en código y conceptos de Angular/Firebase/React Native/Cloud Functions.

---

# PARTE 1 — ANGULAR (Producto 1)

1. ¿Para qué sirven `main.ts`, `app.routing.module.ts` y `detailItem.component.html`? *(2,5 p)*

   Respuesta:

2. ¿Qué es un componente y de qué ficheros se compone? ¿Para qué sirve `@Component`? *(2,5 p)*

   Respuesta:

3. Diferencia entre `*ngFor` y `*ngIf` con un ejemplo correcto de cada una. *(2,5 p)*

   Respuesta:

4. ¿Qué es un pipe? Ejemplo para filtrar jugadores por nombre. *(2,5 p)*

   Respuesta:

5. Comunicación entre componentes: `@Input()` y `@Output()`. *(2,5 p)*

   Respuesta:

6. Diferencia entre interpolación `{{ }}`, property binding `[ ]` y event binding `( )`. *(2,5 p)*

   Respuesta:

---

# PARTE 2 — FIREBASE / FIRESTORE (Producto 2)

7. ¿Para qué sirve `environment.ts` y su relación con Firebase? *(2,5 p)*

   Respuesta:

8. ¿Qué es Firebase y qué es una colección en Firestore? *(2,5 p)*

   Respuesta:

9. Pasos para conectar Angular a Firebase. *(2,5 p)*

   Respuesta:

10. ¿Qué es suscribirse (`subscribe`) a un Observable y por qué se usa? *(2,5 p)*

    Respuesta:

---

# PARTE 3 — REACT NATIVE (Producto 3)

11. ¿Qué es React Native y en qué se diferencia de Angular? ¿Qué es un FlatList? *(2,5 p)*

    Respuesta:

12. ¿Para qué sirve el Stack de navegación y cómo se configura en `App.js`? *(2,5 p)*

    Respuesta:

13. ¿Qué hace `componentDidMount` y por qué se usa para la carga inicial? *(2 p)*

    Respuesta:

---

# PARTE 4 — NOTIFICACIONES PUSH (Producto 4)

14. ¿Para qué sirven `onWrite()` y `onUpdate()` de Cloud Messaging? *(2,5 p)*

    Respuesta:

15. ¿Qué es FCM y qué es una Cloud Function? ¿Cómo se relacionan? *(2,5 p)*

    Respuesta:

16. Diferencia entre `onWrite()`, `onUpdate()`, `onCreate()` y `onDelete()`. *(2,5 p)*

    Respuesta:

17. Flujo completo: editar un jugador → notificación push en el dispositivo. *(2,5 p)*

    Respuesta:

---

# PARTE 5 — DETECTAR ERRORES EN CÓDIGO

18. ¿Qué error hay y cómo se corrige? *(2,5 p)*
```html
<ul>
  <li *ngFor="let items from item">
    <span class="badge">{{item.id}}</span>{{item.name}}
  </li>
</ul>
```
Respuesta:

19. ¿Qué error hay? *(2,5 p)*
```html
<div *ngIf="players.length > 0">
  <p *ngFor="player of players">{{ player.name }}</p>
</div>
```
Respuesta:

20. ¿Qué falla en este binding y cómo se arregla? *(2,5 p)*
```html
<img src="{{ player.photo }}" (click)="seleccionar(player)">
<button [click]="borrar(player)">Borrar</button>
```
Respuesta:

---

# PARTE 6 — SIMULACROS CRONOMETRADOS (30 min · 4 preguntas · 10 p)

## SIMULACRO 1 (réplica del examen real)
1. (2,5 p) ¿Para qué sirven `main.ts`, `app.routing.module.ts` y `detailItem.component.html`?
2. (2,5 p) Detecta el error en el `*ngFor="let items from item"`.
3. (2,5 p) ¿Para qué sirven `onWrite()` y `onUpdate()`?
4. (2,5 p) ¿Para qué sirve `environment.ts` y su relación con Firebase?

Respuestas:


## SIMULACRO 2
1. (2,5 p) ¿Qué es un componente Angular y de qué ficheros se compone?
2. (2,5 p) ¿Qué es Firebase y una colección en Firestore?
3. (2,5 p) ¿Qué es React Native y un FlatList?
4. (2,5 p) Diferencia entre `onCreate`, `onUpdate`, `onDelete`, `onWrite`.

Respuestas:


## SIMULACRO 3
1. (2,5 p) Diferencia entre `*ngFor` y `*ngIf` con ejemplos.
2. (2,5 p) `@Input()` y `@Output()`: comunicación entre componentes.
3. (2,5 p) Pasos para conectar Angular a Firebase.
4. (2,5 p) Flujo completo de una notificación push al editar un dato.

Respuestas:
