# FP.047 — Programa de comandos personalizados para el SO
## Preguntas NUEVAS de práctica (basadas en los enunciados de los productos 1–5)

> Preguntas inéditas creadas siguiendo el estilo y los temas de los exámenes anteriores, pero apoyadas en los enunciados actuales de los productos.
> Mismo formato que el examen real: 2,5 puntos por pregunta, respuesta breve. Rellena y pásame el documento para corregir.
>
> Los productos actuales usan **Python**; he incluido variantes en Python y en C para que estés cubierto en ambos.

---

## BLOQUE 1 — Producto 1: Entorno y depuración

**N1.** Describe el proceso completo para crear, compilar/ejecutar y depurar una aplicación de consola en Visual Studio Code. ¿Qué pasos seguirías para inducir y luego localizar un error de ejecución? *(2,5 p — ~6 líneas)*

Respuesta:


**N2.** Diferencia entre un punto de interrupción normal y un **punto de interrupción condicional**. Pon un ejemplo de cuándo usarías cada uno. *(2,5 p — ~5 líneas)*

Respuesta:


**N3.** ¿Qué diferencia hay entre un error de **sintaxis**, un error de **ejecución** (runtime) y un error de **lógica**? ¿Cuáles de ellos detectan las herramientas de depuración? *(2,5 p — ~5 líneas)*

Respuesta:


---

## BLOQUE 2 — Producto 2: Ping, MAC y archivos de IPs

**N4.** Escribe una función en C que lea un archivo de texto que contiene una dirección IP por línea, muestre cada IP por pantalla y lance un ping a cada una, informando cuáles responden afirmativamente. *(2,5 p — ~10 líneas)*

Respuesta:


**N5.** ¿Qué comando del sistema usarías para obtener la dirección MAC de los adaptadores de red instalados y cómo redirigirías esa información al archivo `informacionlocal.txt`? Muestra la llamada desde C (o Python). *(2,5 p — ~2 líneas)*

Respuesta:


**N6.** Explica cómo, a partir de la salida de `ipconfig` redirigida a un fichero, extraerías únicamente la IP, máscara y puerta de enlace de un adaptador concreto. ¿Qué funciones de cadena usarías? *(2,5 p — ~6 líneas)*

Respuesta:


---

## BLOQUE 3 — Producto 3: DNS, velocidad y saltos

**N7.** Explica el algoritmo del producto 3: cómo determinas cuál es el servidor DNS más rápido de entre una lista y qué haces si el DNS actual no es el más rápido. *(2,5 p — ~7 líneas)*

Respuesta:


**N8.** ¿Qué utilidad/comando usarías para medir el número de saltos (hops) hasta un servidor y por qué sirve como criterio de desempate entre dos DNS con la misma velocidad? *(2,5 p — ~3 líneas)*

Respuesta:


**N9.** Muestra la línea de código que reconfiguraría el servidor DNS de un adaptador de red llamado "Ethernet" para que use `8.8.8.8` (función de C/Python + comando lanzado). *(2,5 p — 1 línea)*

Respuesta:


---

## BLOQUE 4 — Producto 4: XML bien formado

**N10.** Enumera las reglas que hacen que un documento XML esté "bien formado". Da un ejemplo de un fragmento XML mal formado y corrígelo. *(2,5 p — ~6 líneas)*

Respuesta:


**N11.** Escribe el fragmento de código que generaría un archivo XML con la etiqueta raíz `<adaptador>` que contenga IP, máscara y puerta de enlace de un adaptador. *(2,5 p — ~8 líneas)*

Respuesta:


---

## BLOQUE 5 — Producto 5: HTML/CSS/JavaScript/XSLT

**N12.** Explica brevemente qué es una hoja de estilo XSLT y en qué se diferencia de una hoja CSS a la hora de transformar/presentar un XML. *(2,5 p — ~5 líneas)*

Respuesta:


**N13.** Describe cómo, mediante JavaScript, cargarías un archivo XML al pulsar un botón en una página web y lo mostrarías formateado. *(2,5 p — ~6 líneas)*

Respuesta:


---

## BLOQUE 6 — C transversal (trazas y completar código)

**N14.** ¿Qué imprime el siguiente código y por qué? *(2,5 p)*
```c
int main() {
    char ruta[40] = "C:/datos/red";
    int n = strlen(ruta);
    strcat(ruta, "/info.txt");
    printf("%s tiene %d caracteres\n", ruta, n);
    return 0;
}
```
Respuesta:


**N15.** Completa los huecos para que el programa pida una IP al usuario, le haga ping y guarde el resultado en `resultado.txt`: *(2,5 p)*
```c
#include <stdio.h>
#include <string.h>
int main() {
    char ip[20];
    char comando[100] = ______________;
    printf("Introduce la IP: ");
    scanf("%s", ip);
    ______________________________      // construir "ping <ip> > resultado.txt"
    strcat(comando, " > resultado.txt");
    ______________________________      // lanzar el comando
    return 0;
}
```
Respuesta:
