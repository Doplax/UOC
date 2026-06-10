# FP.047 — Programa de comandos personalizados para el SO
## SÚPER DOCUMENTO DE PRÁCTICA (preguntas de años anteriores + nuevas)

> Documento único para entrenar a fondo. Recorre las preguntas **en orden**, rellena cada **Respuesta:** y devuélveme el documento: te corregiré, puntuaré (sobre 10 simulando exámenes de 4 preguntas × 2,5 p) y te daré la respuesta modelo de lo que falles.
>
> **Cómo usarlo:**
> 1. Empieza por la sección de TEORÍA RÁPIDA (preguntas cortas) para calentar.
> 2. Sigue con las de CÓDIGO (trazas y completar).
> 3. Termina con los 3 SIMULACROS cronometrados (30 min, 4 preguntas).
>
> Recuerda: examen real = **C** (aunque los productos actuales sean en Python). Sin material de consulta.

---

# PARTE 1 — TEORÍA RÁPIDA (depuración, ficheros, librerías)

1. ¿Con qué herramientas de depuración cuenta Visual Studio y para qué sirve cada una? *(2,5 p)*

   Respuesta:

2. ¿Para qué se usan los puntos de interrupción? Pon un ejemplo. *(2,5 p)*

   Respuesta:

3. ¿Qué es un punto de interrupción **condicional** y cuándo lo usarías (ej.: variable `n` que va de 1 a 300, solo cuando `n>250`)? *(2,5 p)*

   Respuesta:

4. ¿Pueden las herramientas de depuración detectar un error de **sintaxis** (ej.: falta un `;`)? Justifícalo. *(2,5 p)*

   Respuesta:

5. ¿Qué tipos de errores se pueden solventar con las herramientas de depuración? *(2,5 p)*

   Respuesta:

6. ¿Qué modos de apertura de ficheros existen y dónde se sitúa el cursor en cada uno? *(2,5 p)*

   Respuesta:

7. Cita al menos dos "marcas" importantes al trabajar con ficheros de texto (ej.: EOF, salto de línea). *(2,5 p)*

   Respuesta:

8. ¿Cómo se crea una librería de funciones en C, cómo se enlaza al proyecto y para qué sirve? *(2,5 p)*

   Respuesta:

9. Dado `#include "Proyecto.h"` `#include "Ping.h"`: ¿qué representan estos includes y qué debe contener un `.h`? *(2,5 p)*

   Respuesta:

10. ¿Qué funciones de `string.h` conoces y para qué sirve cada una (`strlen`, `strcat`, `strcpy`, `strstr`, `strtok`)? *(2,5 p)*

    Respuesta:

11. ¿Qué función convierte una cadena de dígitos a entero? ¿Cuándo la usarías? *(2,5 p)*

    Respuesta:

12. ¿En qué consiste la redirección de la salida estándar (`>`) y para qué la has usado en el proyecto? *(2,5 p)*

    Respuesta:

13. ¿Qué comando se usó en el producto 3 para desempatar dos DNS con la misma velocidad y en qué se basaba? *(2,5 p)*

    Respuesta:

14. Reglas para que un XML esté bien formado (producto 4). *(2,5 p)*

    Respuesta:

---

# PARTE 2 — CÓDIGO: TRAZAS (¿qué imprime y por qué?)

15. *(2,5 p)*
```c
char cadena[50] = "La cadena es mia\n";
cadena[strlen("La cadena")] = '\0';
printf("CADENA: %s \n", cadena);
```
Respuesta:

16. *(2,5 p)*
```c
char cadena[50] = "La cadena es mia\n";
cadena[strlen("es mia")] = 'E';
printf("CADENA: %s \n", cadena);
```
Respuesta:

17. *(2,5 p)*
```c
char cadena[50] = "La\ncadena\nes\nmia\n";
printf("CADENA: %s \n", cadena);
for (int i = 0; i < strlen(cadena); i++)
    if (cadena[i] == '\n') cadena[i] = ' ';
printf("CADENA: %s \n", cadena);
```
Respuesta:

18. ¿Qué hace este fragmento? *(2,5 p)*
```c
int longi = strlen(cad);
cad[longi-2] = '\0';
```
Respuesta:

19. ¿Qué cuenta la variable `i`? *(2,5 p)*
```c
FILE* fp = fopen("c:/a/ips.txt", "r");
int i = 0; char c;
if (fp != NULL)
    while (!feof(fp)) {
        c = fgetc(fp);
        if (c == '\n') i++;
    }
```
Respuesta:

---

# PARTE 3 — CÓDIGO: ESCRIBIR / COMPLETAR

20. Línea que lista `d:/archivos` y escribe el resultado en `c:/listado.txt` (función C + comando). *(2,5 p)*

    Respuesta:

21. Línea que lanza un ping y redirige la salida a `D:/redirección/comandoredirección.txt`. *(2,5 p)*

    Respuesta:

22. Línea que guarda en `c:/adaptadores.txt` la lista de nombres de adaptadores de red. *(2,5 p)*

    Respuesta:

23. Línea que reconfigura un adaptador de red (función C + comando). *(2,5 p)*

    Respuesta:

24. Código (≤5 líneas) que abre `D:/redirección/comandoredirección.txt` y analiza si el ping fue exitoso. *(2,5 p)*

    Respuesta:

25. Código (~8 líneas) que pide una IP, le hace ping y muestra "hay conectividad" / "no hay conectividad". *(2,5 p)*

    Respuesta:

26. Completa los huecos: *(2,5 p)*
```c
#include <stdio.h>
int main() {
    char directorio[20];
    char comando[30] = __________________;     // (1)
    printf("Introduce el directorio a listar.\n");
    scanf("%s", directorio);
    __________________________________         // (2) construir comando
    printf("%s", comando);
    __________________________________         // (3) lanzar comando
    return 0;
}
```
Respuesta:

---

# PARTE 4 — SIMULACROS CRONOMETRADOS (30 min · 4 preguntas · 10 puntos)

## SIMULACRO 1
1. ¿Qué herramienta de depuración de VS usarías para inspeccionar variables solo cuando `n>250` en un bucle de 1 a 300? *(2,5 p)*
2. Línea que reconfigura un adaptador de red (función C + comando). *(2,5 p)*
3. ¿En qué consiste la redirección de la salida estándar y dónde la has usado en el proyecto? *(2,5 p)*
4. Completa el código que lista por pantalla el directorio introducido por el usuario (huecos de la pregunta 26). *(2,5 p)*

Respuestas:


## SIMULACRO 2
1. ¿Qué imprime el código de la pregunta 16 (`cadena[strlen("es mia")] = 'E'`) y por qué? *(2,5 p)*
2. ¿Podemos usar el depurador para encontrar un error de falta de `;`? Justifica. *(2,5 p)*
3. Código que pide una IP y comprueba conectividad mostrando el mensaje correspondiente. *(2,5 p)*
4. Línea que lista `d:/archivos` en `c:/listado.txt` (función C + comando). *(2,5 p)*

Respuestas:


## SIMULACRO 3
1. ¿Qué se está contando con la variable `i` en el código de lectura de `ips.txt`? *(2,5 p)*
2. ¿Cómo se crea y enlaza una librería de funciones en C? Utilidad. *(2,5 p)*
3. Instrucciones para guardar fecha, hora y versión del SO en `actualidad.txt`. *(2,5 p)*
4. ¿Qué funciones de `string.h` has usado y con qué propósito? *(2,5 p)*

Respuestas:


---

# PARTE 5 — PREGUNTAS NUEVAS DE AMPLIACIÓN (Python + temas actuales)

27. Diferencia entre error de sintaxis, de ejecución y de lógica. ¿Cuáles detecta el depurador? *(2,5 p)*

    Respuesta:

28. Algoritmo del producto 3: cómo eliges el DNS más rápido y qué haces si el actual no lo es. *(2,5 p)*

    Respuesta:

29. Reglas de un XML bien formado + ejemplo mal formado corregido. *(2,5 p)*

    Respuesta:

30. ¿Qué es XSLT y en qué se diferencia de CSS al presentar un XML? *(2,5 p)*

    Respuesta:
