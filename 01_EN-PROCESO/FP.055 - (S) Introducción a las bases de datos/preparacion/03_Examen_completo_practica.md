# FP.055 — Introducción a las bases de datos
## SÚPER DOCUMENTO DE PRÁCTICA (años anteriores + nuevas)

> Documento único para entrenar a fondo. Recorre las preguntas **en orden**, rellena cada **Respuesta:** y devuélveme el documento: te corregiré, puntuaré (simulacros de 4 preguntas) y te daré la solución modelo de lo que falles.
>
> **Cómo usarlo:** primero TEORÍA, luego DISEÑO E-R, luego SQL (escribir e interpretar), luego DCL/normalización, y al final 3 SIMULACROS cronometrados (30 min).
>
> **Estructura del examen real:** P1 diseño E-R/tablas (3 p) · P2 escribir SQL (2,5 p) · P3 interpretar SQL (2 p) · P4 privilegios GRANT/REVOKE (2,5 p).

---

# PARTE 1 — TEORÍA RÁPIDA

1. ¿Qué es un SGBD? Dos ejemplos y dos ventajas frente a ficheros sueltos. *(2 p)*

   Respuesta:

2. Define clave primaria, foránea y candidata. ¿Puede la PK ser compuesta? Ejemplo. *(2 p)*

   Respuesta:

3. Diferencia entre DDL, DML, DQL, DCL y TCL con un comando de ejemplo de cada uno. *(2,5 p)*

   Respuesta:

4. ¿Qué es la herencia entre entidades? Ejemplo. *(2 p)*

   Respuesta:

5. ¿Qué es un atributo de relación? Ejemplo y por qué pertenece a la relación. *(2 p)*

   Respuesta:

6. Define 1FN, 2FN y 3FN con tus palabras. *(2 p)*

   Respuesta:

7. Diferencia entre INNER JOIN, LEFT JOIN y RIGHT JOIN. *(2 p)*

   Respuesta:

8. Diferencia entre DROP, DELETE y TRUNCATE. *(2 p)*

   Respuesta:

---

# PARTE 2 — DISEÑO E-R Y PASO A TABLAS (3 p cada uno)

9. Empresa de productos **químicos**: CLIENTES(NIF, nombre, apellidos, teléfonos), PRODUCTO(Código, nomProd); registrar fecha_compra y cantidad. Tablas + PK/FK.

   Respuesta:

10. **Universidad**: PROFESORES(NIF, nombre, apellidos, teléfono), DEPARTAMENTO(Código, nomDep, Num_despacho), un profesor en varios departamentos; fecha_ingreso. Tablas + PK/FK.

    Respuesta:

11. Agencia de **rodajes**: CLIENTE(NIF, nombre, apellidos, teléfonos), ESPACIO(Codigo, nombre, ciudad, dirección, descripción, precio_dia); fecha_alquiler, numero_dias. Tablas + PK/FK.

    Respuesta:

12. **Puerto deportivo** (E-R completo): SOCIOS, EMBARCACIONES (1:N), AMARRE con lecturas de luz/agua. Diagrama + tablas.

    Respuesta:

13. **Clínica veterinaria**: DUEÑO, MASCOTA (1:N), VISITA. Diagrama + tablas + PK/FK.

    Respuesta:

---

# PARTE 3 — ESCRIBIR CONSULTAS SQL (2,5 p cada una)

14. Clientes que han comprado más de 300 unidades de nitrato potásico.

    Respuesta:

15. Profesores que pertenecen al departamento de Matemáticas y de Física.

    Respuesta:

16. (Facturas/Productos/DetallesFactura) Compras con precio×cantidad > 3000€; pedir ProductoID y FacturaID.

    Respuesta:

17. Productos vendidos más de 150 veces en los detalles de factura; pedir nombre e ID.

    Respuesta:

18. Nombre y total gastado por cada cliente que haya gastado más de 1000€, de mayor a menor.

    Respuesta:

19. DML: (a) insertar un cliente, (b) subir 10% el precio de productos tipo 'bebida', (c) borrar pedidos anteriores a 2020.

    Respuesta:

---

# PARTE 4 — INTERPRETAR CONSULTAS SQL (2 p cada una)

20. ¿Qué devuelve? (¿es correcto el `GROUP BY m`?)
```sql
SELECT p.nomProd AS producto, COUNT(m.codMarca) AS num_marcas
FROM producto p INNER JOIN Marca m ON p.codProducto = m.codProducto
GROUP BY m ORDER BY p.nomProd;
```
Respuesta:

21. ¿Qué devuelve?
```sql
SELECT e.first_name, e.last_name, SUM(e.salary) AS sueldo
FROM employees e INNER JOIN salaries s ON e.emp_no = s.emp_no
GROUP BY s ORDER BY e.last_name;
```
Respuesta:

22. ¿Qué devuelve?
```sql
SELECT c.NIF, c.nombre, c.apellidos
FROM CLIENTE c
INNER JOIN ALQUILER a ON c.NIF = a.NIF_cliente
INNER JOIN ESPACIO e ON a.Codigo_espacio = e.Codigo
WHERE e.ciudad = 'Madrid' AND a.numero_dias > 3 AND (a.numero_dias * e.precio_dia) > 500;
```
Respuesta:

23. ¿Qué devuelve?
```sql
SELECT PLAN, COUNT(SOCIO.ID_PLAN) AS 'NUMERO DE SOCIOS',
       FORMAT(CUOTA_MENSUAL,2) AS 'CUOTA MENSUAL',
       FORMAT(COUNT(SOCIO.ID_PLAN)*CUOTA_MENSUAL,2) AS 'TOTAL'
FROM (plan INNER JOIN SOCIO ON plan.ID_PLAN = SOCIO.ID_PLAN)
GROUP BY PLAN.PLAN HAVING COUNT(SOCIO.ID_PLAN) > 1;
```
Respuesta:

---

# PARTE 5 — PRIVILEGIOS, TRANSACCIONES Y NORMALIZACIÓN

24. ¿Qué significa y qué otros privilegios existen? `GRANT SELECT, DELETE ON BdQuimica.clientes TO 'auditoria'@'localhost';` *(2,5 p)*

    Respuesta:

25. ¿Qué significa? `REVOKE DELETE ON BdGym.abonados TO 'owner'@'localhost';` *(2,5 p)*

    Respuesta:

26. Crea usuario `lectura@localhost`, dale solo `SELECT` sobre `Tienda` y luego retíraselo (3 sentencias). *(2,5 p)*

    Respuesta:

27. ¿Para qué sirven COMMIT, ROLLBACK y SAVEPOINT? Ejemplo con ROLLBACK. *(2,5 p)*

    Respuesta:

28. Normaliza hasta 3FN: `PEDIDO(id, cliente, telefono_cliente, producto1, producto2, producto3)`. *(2,5 p)*

    Respuesta:

---

# PARTE 6 — SIMULACROS CRONOMETRADOS (30 min · 4 preguntas · 10 p)

## SIMULACRO 1
1. (3 p) Diseña tablas para la tienda de **material de oficina** (CLIENTES, PRODUCTO con tipo_producto y stock, compra con fecha y cantidad). PK/FK.
2. (2,5 p) Consulta: clientes que han comprado más de 20 unidades del tipo 'Comida_perros'.
3. (2 p) Interpreta la consulta de la pregunta 22.
4. (2,5 p) `REVOKE DELETE ON BdOfice.clientes TO 'owner'@'localhost';` — significado y otros privilegios.

Respuestas:


## SIMULACRO 2
1. (3 p) Diagrama E-R del **gimnasio** (SOCIOS, ACTIVIDAD, reserva con fecha/hora) + paso a tablas.
2. (2,5 p) Productos vendidos más de 300 veces; pedir nombre e ID.
3. (2 p) Interpreta la consulta de la pregunta 23.
4. (2,5 p) `GRANT SELECT, INSERT ON BdQuimica.clientes TO 'auditoria'@'localhost';` — significado.

Respuestas:


## SIMULACRO 3
1. (3 p) Diseña tablas para la **clínica veterinaria** (pregunta 13).
2. (2,5 p) Nombre y total gastado por cliente que gastó más de 1000€, de mayor a menor.
3. (2 p) ¿Podría normalizarse el modelo anterior? ¿Qué forma normal aplicarías?
4. (2,5 p) Explica COMMIT/ROLLBACK/SAVEPOINT con un ejemplo.

Respuestas:
