# FP.056 — Programación orientada a objetos
## Preguntas NUEVAS de práctica (basadas en las actividades AA1–AA5)

> Preguntas inéditas con el formato del examen real, cubriendo: AA1 (diagrama de clases, herencia, Java), AA2 (agregación y composición), AA3/AA4 (diseño de diagramas de clases), AA5 (casos de uso).
> Rellena y pásame el documento para corregir.

---

## BLOQUE 1 — Pilares de la POO

**N1.** Explica los **cuatro pilares** de la POO (abstracción, encapsulación, herencia, polimorfismo) con un ejemplo breve de cada uno. *(2,5 p)*

Respuesta:


**N2.** ¿Qué es la **encapsulación**? ¿Para qué sirven los modificadores `private`, `protected` y `public` y los métodos *getter/setter*? *(2 p)*

Respuesta:


**N3.** Diferencia entre **sobrecarga** (overloading) y **sobrescritura** (overriding) de métodos. Pon un ejemplo en Java. *(2,5 p)*

Respuesta:


---

## BLOQUE 2 — Diagramas de clases (interpretar / diseñar)

**N4.** Diseña un diagrama de clases para un sistema de **biblioteca** con clases `Libro`, `Socio` y `Prestamo`. Indica atributos, relaciones y cardinalidades. *(3 p)*

Respuesta:


**N5.** Dado el enunciado: *"Un Pedido contiene varias Líneas de pedido; si se elimina el Pedido, sus líneas dejan de existir"*, ¿qué tipo de relación es (asociación, agregación o composición) y por qué? *(2 p)*

Respuesta:


**N6.** Distingue cuándo usar **agregación** y cuándo **composición** con un ejemplo de la vida real de cada una. *(2 p)*

Respuesta:


---

## BLOQUE 3 — Código Java a partir de diagrama

**N7.** Escribe en Java una clase abstracta `Animal` con un método abstracto `hacerSonido()` y dos subclases `Perro` y `Gato` que lo implementen (demuestra polimorfismo). *(2,5 p)*

Respuesta:


**N8.** Implementa en Java una relación de **composición**: una clase `Coche` que crea sus propios objetos `Motor` y `Rueda[]` en su constructor. *(2,5 p)*

Respuesta:


**N9.** Escribe una clase `Equipo` que contenga un `ArrayList<Jugador>` con métodos para **añadir**, **eliminar** y **recorrer** los jugadores. *(2,5 p)*

Respuesta:


**N10.** Escribe en Java una interfaz `Pagable` con el método `calcularPago()` e impleméntala en una clase `Empleado`. ¿En qué se diferencia una interfaz de una clase abstracta? *(2,5 p)*

Respuesta:


---

## BLOQUE 4 — Casos de uso

**N11.** Dibuja (en texto) un diagrama de casos de uso para un **cajero automático**: identifica actores, casos de uso y al menos una relación *include* y una *extend*. *(3 p)*

Respuesta:


**N12.** En un sistema de venta online hay un actor `Cliente` y un actor `Cliente VIP`. Explica cómo modelarías la **herencia de actor** y qué aporta. *(2,5 p)*

Respuesta:


---

## BLOQUE 5 — Traza / lectura de código

**N13.** ¿Qué imprime este código y por qué? *(2,5 p)*
```java
class A { void saludar() { System.out.println("Soy A"); } }
class B extends A { void saludar() { System.out.println("Soy B"); } }
public class Main {
    public static void main(String[] args) {
        A obj = new B();
        obj.saludar();
    }
}
```
Respuesta:


**N14.** ¿Qué problema tiene este código y cómo lo corregirías? *(2 p)*
```java
public class Cuenta {
    private double saldo;
    public Cuenta(double saldo) { saldo = saldo; }
    public double getSaldo() { return saldo; }
}
```
Respuesta:
