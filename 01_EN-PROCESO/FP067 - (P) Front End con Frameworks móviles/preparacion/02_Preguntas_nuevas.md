# FP067 — Front End con Frameworks móviles
## Preguntas NUEVAS de práctica (basadas en los enunciados de los Productos 1–4)

> Preguntas inéditas con el formato del examen real (2,5 p, respuesta breve), siguiendo el patrón del examen anterior: estructura de ficheros, detectar errores en código, conceptos de Angular/Firebase/React Native/Cloud Functions.
> Rellena y pásame el documento para corregir.

---

## BLOQUE 1 — Producto 1: Angular

**N1.** Explica la diferencia entre las directivas `*ngFor` y `*ngIf`. Escribe un ejemplo correcto de cada una. *(2,5 p)*

Respuesta:


**N2.** ¿Qué es un **componente** en Angular y de qué tres ficheros principales se compone? ¿Para qué sirve el decorador `@Component`? *(2,5 p)*

Respuesta:


**N3.** ¿Cómo se comunican dos componentes en Angular (padre→hijo e hijo→padre)? Explica `@Input()` y `@Output()`. *(2,5 p)*

Respuesta:


**N4.** ¿Qué es un **pipe** en Angular? Escribe cómo usarías un pipe para filtrar una lista de jugadores por nombre. *(2,5 p)*

Respuesta:


**N5.** Detecta el/los error(es) en este código: *(2,5 p)*
```html
<div *ngIf="players.length > 0">
  <p *ngFor="player of players">{{ player.name }}</p>
</div>
```
Respuesta:


**N6.** ¿Qué diferencia hay entre **interpolación** `{{ }}`, **property binding** `[ ]` y **event binding** `( )`? Un ejemplo de cada uno. *(2,5 p)*

Respuesta:


---

## BLOQUE 2 — Producto 2: Firebase / Firestore

**N7.** ¿Qué es Firebase y por qué se usa en este proyecto para "hacer persistente" la información? ¿Qué es una **colección** en Firestore? *(2,5 p)*

Respuesta:


**N8.** ¿Qué pasos hay que seguir para conectar una app Angular a Firebase (paquetes, configuración, módulo)? *(2,5 p)*

Respuesta:


**N9.** Explica qué es una **suscripción** (`subscribe`) a un Observable al leer datos de Firestore y por qué se usa en lugar de cargar un array local. *(2,5 p)*

Respuesta:


**N10.** ¿Por qué es importante **no** subir el fichero `environment.ts` con las claves a un repositorio público y cómo se gestiona normalmente? *(2 p)*

Respuesta:


---

## BLOQUE 3 — Producto 3: React Native

**N11.** ¿Qué es **React Native** y en qué se diferencia de Angular? ¿Qué es un **FlatList** y para qué se usa? *(2,5 p)*

Respuesta:


**N12.** Explica para qué sirve el **Stack de navegación** y cómo se configuran varias pantallas en `App.js`. *(2,5 p)*

Respuesta:


**N13.** ¿Qué hace el método `componentDidMount` y por qué se usa para la llamada inicial a la base de datos? *(2 p)*

Respuesta:


---

## BLOQUE 4 — Producto 4: Notificaciones push / Cloud Functions

**N14.** ¿Qué es **Firebase Cloud Messaging (FCM)** y qué es una **Cloud Function**? ¿Cómo se relacionan para enviar una notificación push? *(2,5 p)*

Respuesta:


**N15.** Diferencia entre los triggers `onWrite()`, `onUpdate()`, `onCreate()` y `onDelete()` de Cloud Functions. *(2,5 p)*

Respuesta:


**N16.** Describe el flujo completo: un usuario edita un jugador en la app → ¿qué ocurre hasta que llega la notificación push al dispositivo? *(2,5 p)*

Respuesta:
