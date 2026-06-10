# FP.056 — Programación orientada a objetos
## SÚPER DOCUMENTO DE PRÁCTICA (años anteriores + nuevas)

> Documento único para entrenar a fondo. Recorre las preguntas **en orden**, rellena cada **Respuesta:** y devuélveme el documento: te corregiré, puntuaré y te daré la respuesta modelo de lo que falles.
>
> **Cómo usarlo:** TEORÍA (clases y casos de uso) → CÓDIGO JAVA → DISEÑO/INTERPRETACIÓN → 3 SIMULACROS cronometrados (30 min, 4 preguntas).
>
> **Examen real:** 4 preguntas mezclando diagrama de clases, casos de uso y código Java.

---

# PARTE 1 — TEORÍA: DIAGRAMAS DE CLASES

1. Los cuatro pilares de la POO con un ejemplo de cada uno. *(2,5 p)*

   Respuesta:

2. ¿Qué es la asociación y cómo se aplica en Java? *(2 p)*

   Respuesta:

3. Diferencia entre agregación y composición (con ejemplos). *(2 p)*

   Respuesta:

4. ¿En qué casos se implementa una herencia? Relación con el polimorfismo. *(2,5 p)*

   Respuesta:

5. ¿Qué es la cardinalidad? Tipos con ejemplos. *(2 p)*

   Respuesta:

6. ¿Qué es una clase asociativa? *(2 p)*

   Respuesta:

7. ¿Cuándo declararías una clase abstracta y qué consecuencias tiene? *(2 p)*

   Respuesta:

8. Diferencia entre sobrecarga (overloading) y sobrescritura (overriding). *(2 p)*

   Respuesta:

---

# PARTE 2 — TEORÍA: CASOS DE USO

9. ¿Qué funcionalidad tiene un diagrama de casos de uso? Ejemplo. *(4 p)*

   Respuesta:

10. ¿Qué es un Actor? Ejemplo. *(2,5 p)*

    Respuesta:

11. ¿Cuándo se usa *extend* y cuándo *include*? *(3 p)*

    Respuesta:

12. ¿Qué es la herencia de un actor? Ejemplo. *(3 p)*

    Respuesta:

---

# PARTE 3 — CÓDIGO JAVA (escribir)

13. Clase con atributos que hereda de otra clase (ejemplo completo). *(2,5 p)*

    Respuesta:

14. Implementación de una relación de agregación. *(2 p)*

    Respuesta:

15. Implementación de una relación de composición (`Coche` crea `Motor`/`Rueda[]`). *(2,5 p)*

    Respuesta:

16. ¿Cómo se añade un objeto a un ArrayList? Escribe `Equipo` con add/remove/recorrer. *(2,5 p)*

    Respuesta:

17. ¿Qué es el constructor y cómo se codifica? Pon un ejemplo. *(2,5 p)*

    Respuesta:

18. Clase abstracta `Animal` con `hacerSonido()` y subclases `Perro`/`Gato` (polimorfismo). *(2,5 p)*

    Respuesta:

19. Interfaz `Pagable` implementada en `Empleado`. Diferencia interfaz vs clase abstracta. *(2,5 p)*

    Respuesta:

---

# PARTE 4 — CÓDIGO JAVA (leer / corregir)

20. ¿Qué imprime y por qué? *(2,5 p)*
```java
class A { void saludar() { System.out.println("Soy A"); } }
class B extends A { void saludar() { System.out.println("Soy B"); } }
A obj = new B();
obj.saludar();
```
Respuesta:

21. ¿Qué problema tiene y cómo se corrige? *(2 p)*
```java
public class Cuenta {
    private double saldo;
    public Cuenta(double saldo) { saldo = saldo; }
    public double getSaldo() { return saldo; }
}
```
Respuesta:

---

# PARTE 5 — DISEÑO

22. Diseña el diagrama de clases de una **biblioteca** (`Libro`, `Socio`, `Prestamo`) con atributos, relaciones y cardinalidades. *(3 p)*

    Respuesta:

23. Diagrama de casos de uso de un **cajero automático** (actores, casos de uso, *include*/*extend*). *(3 p)*

    Respuesta:

24. Pasos para implementar en Java un diagrama de clases dado (qué componentes contiene y cómo traducirlos). *(3 p)*

    Respuesta:

---

# PARTE 6 — SIMULACROS CRONOMETRADOS (30 min · 4 preguntas · 10 p)

## SIMULACRO 1
1. (2 p) ¿Cómo aplicarías una asociación en Java?
2. (4 p) ¿Qué funcionalidad tiene el diagrama de casos de uso? Ejemplo.
3. (2 p) Código Java: clase con atributos que hereda de otra.
4. (2 p) Código Java: implementación de una agregación.

Respuestas:


## SIMULACRO 2
1. (2,5 p) ¿En qué casos se implementa una herencia?
2. (2,5 p) Describe un ejemplo de diagrama de casos de uso.
3. (2,5 p) Código Java: clase con atributos que hereda de otra.
4. (2,5 p) ¿Cómo se añade un objeto a un ArrayList?

Respuestas:


## SIMULACRO 3
1. (2 p) Explica composición vs agregación.
2. (3 p) ¿Qué es la herencia de un actor? Ejemplo.
3. (3 p) Pasos para traducir un diagrama de clases a Java.
4. (2 p) ¿Cuándo declararías una clase abstracta y qué consecuencias tiene?

Respuestas:
