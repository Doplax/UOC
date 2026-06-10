# FP.055 — Introducción a las bases de datos
## Preguntas NUEVAS de práctica (basadas en los enunciados de las AA1–AA5)

> Preguntas inéditas con el mismo formato del examen real, cubriendo las 5 actividades: AA1 (conceptos BBDD), AA2 (E-R), AA3 (modelo relacional/DDL), AA4 (DQL/DML), AA5 (DCL/TCL).
> Rellena y pásame el documento para corregir.

---

## BLOQUE 1 — Diseño E-R y tablas (3 p)

**N1.** Una **clínica veterinaria** registra: DUEÑO(DNI, nombre, teléfono), MASCOTA(chip, nombre, especie, raza) y VISITA(fecha, motivo, importe). Un dueño puede tener varias mascotas; cada visita corresponde a una mascota. Dibuja el diagrama y pasa a tablas indicando PK y FK.

Respuesta:


**N2.** Una **biblioteca**: SOCIO(id, nombre, email), LIBRO(ISBN, título, autor) y PRÉSTAMO(fecha_inicio, fecha_devolución). Un socio toma muchos libros y un libro puede prestarse muchas veces. Modela la relación N:M, indica PK y FK y el atributo propio de la relación.

Respuesta:


**N3.** Identifica la cardinalidad (1:1, 1:N, N:M) de cada caso y justifícalo: (a) persona–DNI, (b) cliente–pedidos, (c) estudiantes–asignaturas. *(2 p)*

Respuesta:


---

## BLOQUE 2 — Conceptos (AA1) (2 p)

**N4.** ¿Qué es un SGBD? Cita dos ejemplos y dos ventajas frente a almacenar la información en ficheros sueltos. *(2 p)*

Respuesta:


**N5.** Define: **clave primaria**, **clave foránea** y **clave candidata**. ¿Puede una clave primaria ser compuesta? Pon un ejemplo. *(2 p)*

Respuesta:


**N6.** Diferencia entre **DDL, DML, DQL, DCL y TCL**. Pon un comando de ejemplo de cada uno. *(2,5 p)*

Respuesta:


---

## BLOQUE 3 — Modelo relacional y DDL (AA3) (2,5 p)

**N7.** Escribe la sentencia `CREATE TABLE` para una tabla `PRODUCTO(Codigo PK, nomProd, precio, stock)` y otra `COMPRA` con clave foránea hacia `PRODUCTO` y hacia `CLIENTE`. Define tipos y restricciones. *(2,5 p)*

Respuesta:


**N8.** ¿Qué hace `ALTER TABLE clientes ADD COLUMN email VARCHAR(100);`? ¿Y `DROP TABLE`? Diferencia entre `DROP`, `DELETE` y `TRUNCATE`. *(2,5 p)*

Respuesta:


---

## BLOQUE 4 — Consultas DQL/DML (AA4) (2,5 p)

**N9.** Escribe la consulta: *"Nombre y total gastado por cada cliente que haya gastado más de 1000€, ordenado de mayor a menor."* (usa `JOIN`, `SUM`, `GROUP BY`, `HAVING`, `ORDER BY`).

Respuesta:


**N10.** ¿Qué devuelve esta consulta? Explica el papel de `LEFT JOIN`. *(2 p)*
```sql
SELECT c.nombre, COUNT(p.id) AS num_pedidos
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.cliente_id
GROUP BY c.nombre;
```
Respuesta:


**N11.** Escribe sentencias DML para: (a) insertar un cliente, (b) subir un 10% el precio de los productos de tipo 'bebida', (c) borrar los pedidos anteriores a 2020. *(2,5 p)*

Respuesta:


**N12.** Diferencia entre `INNER JOIN`, `LEFT JOIN` y `RIGHT JOIN` con un ejemplo breve de cada uno. *(2 p)*

Respuesta:


---

## BLOQUE 5 — Seguridad y transacciones DCL/TCL (AA5) (2,5 p)

**N13.** Crea un usuario `lectura@localhost`, dale solo permiso de `SELECT` sobre la base `Tienda` y luego retíraselo. Escribe las tres sentencias. *(2,5 p)*

Respuesta:


**N14.** Explica para qué sirven `COMMIT`, `ROLLBACK` y `SAVEPOINT`. Pon un ejemplo de transacción donde uses `ROLLBACK`. *(2,5 p)*

Respuesta:


**N15.** ¿Qué diferencia hay entre `GRANT ... WITH GRANT OPTION` y un `GRANT` normal? *(2 p)*

Respuesta:


---

## BLOQUE 6 — Normalización (2 p)

**N16.** Dada la tabla no normalizada `PEDIDO(id, cliente, telefono_cliente, producto1, producto2, producto3)`, explica qué problemas tiene y normalízala hasta 3FN. *(2,5 p)*

Respuesta:


**N17.** Define con tus palabras 1FN, 2FN y 3FN. *(2 p)*

Respuesta:
