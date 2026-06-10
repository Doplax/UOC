# FP.047 — Programa de comandos personalizados para el SO
## Banco de preguntas de exámenes de años anteriores

> Recopilación de TODAS las preguntas aparecidas en las pruebas de validación / síntesis de semestres anteriores (2020–2023).
> Rellena cada bloque **Respuesta:** y pásame el documento para corregirlo.
>
> **Formato de examen:** 4 preguntas, 2,5 puntos cada una. 30 minutos. Nota mínima 5/10. Sin material de consulta.
> **Nota:** Los exámenes históricos usan **lenguaje C** (`system()`, `string.h`, `FILE*`...). Los enunciados actuales de los productos están migrados a **Python**, pero las preguntas de examen siguen el patrón en C. Prepárate sobre todo en C.

---

## BLOQUE A — Herramientas de depuración (Producto 1 / Visual Studio)

**A1.** Según lo documentado en el producto 1, ¿con qué herramientas de depuración contamos en Visual Studio y cuál es la utilidad de cada una de ellas? *(2,5 p — máx. 10 líneas)*

Respuesta:


**A2.** Según lo documentado en el producto 1, ¿qué herramienta usarías para detectar un error de programación que aparece en un bucle cuando la variable contador `i`, que se incrementa desde 0 con paso 1, tiene un valor mayor a 100? *(2,5 p — máx. 10 líneas)*

Respuesta:


**A3.** ¿Qué herramienta de depuración de Visual Studio usarás si quieres inspeccionar los valores que toman las variables, solo si el valor de la variable `n` (que se inicializa en 1 y se incrementa en una unidad a cada vuelta de un bucle hasta llegar a 300) es mayor a 250? *(2,5 p — ~5 líneas)*

Respuesta:


**A4.** Si en un código realizamos una depuración del mismo, explica para qué se usan los puntos de interrupción. Pon un ejemplo de cómo usarlo para completar la explicación. *(2,5 p — ~5 líneas)*

Respuesta:


**A5.** Si en un código cometemos un error como escribir una instrucción sin finalizarla con punto y coma, ¿podremos usar las herramientas de depuración para encontrar ese error? Justifica la respuesta. *(2,5 p — ~5 líneas)*

Respuesta:


**A6.** ¿Se pueden usar las herramientas de depuración para encontrar un error de sintaxis? *(2,5 p — ~3 líneas)*

Respuesta:


**A7.** ¿Qué tipo de errores podemos solventar usando las herramientas de depuración? *(2,5 p — ~3 líneas)*

Respuesta:


---

## BLOQUE B — Trazas de código C (cadenas, strlen, bucles)

**B1.** ¿Qué imprimirá el siguiente código y por qué? Recuerda que `strlen()` devuelve la longitud ocupada de una cadena. *(2,5 p)*
```c
int main() {
    char cadena[50] = "La cadena es mia\n";
    cadena[strlen("La cadena")] = '\0';
    printf("CADENA: %s \n", cadena);
    return 0;
}
```
Respuesta:


**B2.** Variante: mismo programa pero con `cadena[strlen("es mia")] = 'E';`. ¿Qué mostrará y por qué? *(2,5 p — ~1 línea)*
```c
char cadena[50] = "La cadena es mia\n";
cadena[strlen("es mia")] = 'E';
printf("CADENA: %s \n", cadena);
```
Respuesta:


**B3.** Indica qué mostrará el siguiente código y explica por qué. *(2,5 p — ~3 líneas)*
```c
int main() {
    char cadena[50] = "La\ncadena\nes\nmia\n";
    printf("CADENA: %s \n", cadena);
    for (int i = 0; i < strlen(cadena); i++) {
        if (cadena[i] == '\n') cadena[i] = ' ';
    }
    printf("CADENA: %s \n", cadena);
    return 0;
}
```
Respuesta:


**B4.** Indica qué estamos haciendo en el siguiente código: *(2,5 p)*
```c
int longi = strlen(cad);
cad[longi-2] = '\0';
```
Respuesta:


**B5.** ¿Qué se está contando gracias a la variable `i` en el siguiente código? *(2,5 p)*
```c
int main() {
    FILE* fp;
    char c;
    int i = 0;
    fp = fopen("c:/a/ips.txt", "r");
    if (fp != NULL) {
        while (!feof(fp)) {
            c = fgetc(fp);
            printf("%c", c);
            if (c == '\n') { i++; };
        }
    }
    fclose(fp);
    return 0;
}
```
Respuesta:


**B6.** ¿Qué está realizando el siguiente código? *(2,5 p)*
```c
#include <stdio.h>
#define MAX 16
int main() {
    FILE* fp;
    char c;
    int i = 0;
    fp = fopen("c:/a/ips.txt", "r");
    if (fp != NULL) {
        while (!feof(fp)) {
            c = fgetc(fp);
            printf("%c", c);
            if (c == '\n') { i++; };
            char aux[MAX];
            fgets(aux, MAX, fp);
        }
    }
    fclose(fp);
    return 0;
}
```
Respuesta:


---

## BLOQUE C — Librerías, ficheros .h y funciones de string.h

**C1.** En una aplicación programada en C, explica cómo se crea una librería de funciones y comenta tanto cómo la enlazaremos (link) a un proyecto como cuál sería su utilidad. *(2,5 p)*

Respuesta:


**C2.** Este es el inicio de tu archivo `Proyecto.c`. Indica qué representa la siguiente estructura de código, para qué se usa y qué información debe ir incluida en `Proyecto.h`. *(2,5 p)*
```c
#include <stdio.h>
#include "Proyecto.h"
#include "Ping.h"
```
Respuesta:


**C3.** ¿Qué funciones de la librería `string.h` has utilizado en los productos 2 y 3, y con qué propósito? *(2,5 p — máx. 10 líneas)*

Respuesta:


**C4.** ¿Qué función para cadenas usarás para construir un comando formado por diferentes partes que se encuentran en dos variables distintas? ¿A qué biblioteca pertenece esa función? *(2,5 p — ~1 línea)*

Respuesta:


**C5.** ¿Qué función de C convierte una cadena compuesta por los símbolos que representan los números a un entero? ¿En qué casos la has usado? *(2,5 p — ~2 líneas)*

Respuesta:


---

## BLOQUE D — Ficheros de texto (apertura, lectura, marcas)

**D1.** ¿Qué modos de apertura de archivos existen y para qué usaremos cada uno de ellos? *(2,5 p — ~4 líneas)*

Respuesta:


**D2.** ¿Qué modos de apertura existen para un archivo de texto y dónde se sitúa el cursor o indicador de posición corriente en un primer momento en cada uno de ellos? *(2,5 p)*

Respuesta:


**D3.** Cita al menos dos marcas importantes relacionadas con el trabajo con ficheros de texto. *(2,5 p — ~4 líneas)*

Respuesta:


---

## BLOQUE E — Redirección de la salida estándar / `system()`

**E1.** Aplicando lo tratado en los productos 2 y 3, muestra la línea de código que permitiría a una aplicación en C listar los archivos y directorios contenidos en `d:/archivos` y escribir ese listado en el archivo `c:/listado.txt`. Muestra tanto la función de C que lo lanzaría como el comando lanzado por esta. *(2,5 p — ~1 línea)*

Respuesta:


**E2.** Muestra la línea de código programado en C que permite lanzar un ping y redirigir su salida estándar hacia un archivo de texto situado en `D:/redirección` de nombre `comandoredirección.txt`. *(2,5 p — 1 línea)*

Respuesta:


**E3.** ¿En qué consiste la redirección de la salida estándar de un comando y qué utilidad ha tenido en nuestro proyecto? Explica brevemente en qué consiste y en qué casos se ha usado en el proyecto. *(2,5 p — ~7 líneas)*

Respuesta:


**E4.** Muestra la línea de código que permitiría a una aplicación en C almacenar/guardar en el archivo `c:/adaptadores.txt` la lista de nombres de adaptadores de red que se pasan a dicha aplicación. *(2,5 p — 1 línea)*

Respuesta:


**E5.** Indica las instrucciones que se deberían usar para guardar la fecha, hora y versión del sistema operativo en un archivo `actualidad.txt`. *(2,5 p)*

Respuesta:


---

## BLOQUE F — Análisis de ficheros / búsqueda de patrones (productos 2 y 3)

**F1.** Muestra el código en C (máx. 5 líneas) que permite analizar el archivo creado por el lanzamiento de un ping redirigido hacia un archivo de texto en `D:/redirección/comandoredirección.txt`. Muestra únicamente cómo la aplicación abre y analiza el archivo en busca de un patrón que indique si el ping fue exitoso o no. *(2,5 p — máx. 10 líneas)*

Respuesta:


**F2.** Si en el archivo `archivos.txt` (en `d:/archivos`) tenemos la redirección de la salida estándar del comando `dir d:\data`, muestra el código (máx. 5 líneas) que permite analizar si en el directorio `data` se encuentra un archivo llamado `alumnos.txt`. Muestra únicamente cómo la aplicación abre y analiza el archivo. *(2,5 p)*

Respuesta:


**F3.** Muestra un código en C que pida al usuario que introduzca una IP y ejecute el comando necesario para comprobar la conectividad a dicha IP, mostrando el mensaje "hay conectividad" o "no hay conectividad" en función de la respuesta obtenida. *(2,5 p — ~8 líneas)*

Respuesta:


**F4.** ¿Cómo y mediante qué funciones, comandos o utilidades podemos detectar en una aplicación en C que tenemos conectividad entre una máquina y otra referenciada por su dirección IP? Explica la utilidad de cada función de C o comando y cómo determinamos si hay o no conectividad. *(2,5 p)*

Respuesta:


---

## BLOQUE G — Configuración de red (productos 3 y 4)

**G1.** En una aplicación en C, ¿cómo podrías realizar la reconfiguración de un adaptador de red? Muestra únicamente la línea de código que la produciría (función de C + comando lanzado). *(2,5 p — 1 línea)*

Respuesta:


**G2.** ¿Qué comando se ha usado en el producto 3 para desempatar en caso de que los dos DNS más rápidos hubiesen pasado el test de velocidad en el mismo tiempo? ¿En qué se basaba ese desempate? *(2,5 p — ~2 líneas)*

Respuesta:


---

## BLOQUE H — XML / completar código

**H1.** Cita algunas de las reglas que has tenido que cumplir al construirlo, de forma que en el producto 4 el XML generado fuese bien formado. *(2,5 p — ~5 líneas)*

Respuesta:


**H2.** Completa los espacios (subrayados) para que el siguiente código liste por pantalla el directorio que introduzca por teclado el usuario. *(2,5 p)*
```c
#include <stdio.h>
int main() {
    char directorio[20];
    // Inicializar comando
    char comando[30] = __________________;
    printf("Introduce el directorio a listar.\n");
    scanf("%s", directorio);
    // Construir el comando completo a partir de la ruta introducida
    __________________________________
    printf("%s", comando);
    // Lanzar el comando
    __________________________________
    return 0;
}
```
Respuesta:
