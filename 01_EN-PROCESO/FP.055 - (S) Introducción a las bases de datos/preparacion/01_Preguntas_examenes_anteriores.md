# FP.055 — Introducción a las bases de datos
## Banco de preguntas de exámenes de años anteriores

> Recopilación de TODAS las preguntas de las pruebas de validación / síntesis de semestres anteriores (2020–2023).
> Rellena cada **Respuesta:** y pásame el documento para corregirlo.
>
> **Estructura típica del examen** (4 preguntas, 30 min, mínimo 5/10, sin material):
> - **P1 (3 p):** Diseñar diagrama E-R / tablas del modelo relacional a partir de un enunciado → identificar PK y FK.
> - **P2 (2,5 p):** Escribir una consulta SQL (`SELECT` con `JOIN`, `WHERE`, agregados).
> - **P3 (2 p):** Interpretar qué devuelve una instrucción SQL dada.
> - **P4 (2,5 p):** Explicar el significado de un `GRANT`/`REVOKE` y qué otros privilegios existen.
> - Temas transversales que también caen: **normalización (1FN/2FN/3FN), herencia entre entidades, atributos de relación**.

---

## BLOQUE 1 — Diseño E-R y paso a tablas (3 p)

**1.1** Realiza un diagrama con las tablas resultantes. Empresa de venta de **productos químicos**: CLIENTES(NIF, nombre, apellidos, teléfonos), PRODUCTO(Código, nomProd); registrar fecha_compra y cantidad. Identifica PK y FK.

Respuesta:


**1.2** Tienda de **productos para mascotas**: CLIENTES(NIF, nombre, apellidos, teléfono), PRODUCTO(Código, nomProd, tipo_producto); registrar fecha_compra y cantidad. PK y FK.

Respuesta:


**1.3** **Universidad**: PROFESORES(NIF, nombre, apellidos, teléfono), DEPARTAMENTO(Código, nomDep, Num_despacho). Un profesor puede pertenecer a varios departamentos; registrar fecha_ingreso. PK y FK.

Respuesta:


**1.4** Agencia de **alquiler de localizaciones para rodajes**: CLIENTE(NIF, nombre, apellidos, teléfonos), ESPACIO(Codigo, nombre, ciudad, dirección, descripción, precio_dia); registrar fecha_alquiler y numero_dias. PK y FK.

Respuesta:


**1.5** Tienda de **material de oficina**: CLIENTES(NIF, nombre, apellidos, teléfono), PRODUCTO(Código, nomProd, tipo_producto, stock); registrar fecha_compra y cantidad. PK y FK.

Respuesta:


**1.6** Tienda de **ropa al por mayor**: CLIENTES(NIF, nombre, apellidos, teléfono), PRODUCTO(Código, nomProd, tipo_producto, stock); registrar fecha_compra y cantidad. PK y FK.

Respuesta:


**1.7** *(Modelo B — E-R)* Gimnasio fase 3: SOCIOS(idSocio, nombre, apellidos, dni, teléfonos, email), ACTIVIDAD(Codigo, nombre, duración, nombre_monitor); registrar hora y fecha de la reserva. Diagrama E-R + paso a tablas con PK/FK.

Respuesta:


**1.8** *(Modelo B)* Agencia de **alquiler de espacios para eventos**: CLIENTES(NIF, nombre, apellidos, teléfonos), ESPACIOS(Id_espacio, ciudad, dirección, código postal, descripción, precio_hora); registrar fecha_alquiler y numero_horas. Diagrama E-R + tablas.

Respuesta:


**1.9** *(Modelo B)* **Puerto deportivo**: SOCIOS(DNI, nombre, ciudad, apellidos, teléfonos), EMBARCACIONES(matricula, eslora, nombre). Un socio puede tener varios barcos, cada barco pertenece a un único socio. Cada embarcación tiene un AMARRE(Número, embarcación, lectura luz, lectura agua). Diagrama E-R + tablas.

Respuesta:


---

## BLOQUE 2 — Escribir consultas SQL (2,5 p)

**2.1** A partir de las tablas del enunciado químico: *Clientes que han comprado más de 300 unidades de nitrato potásico.*

Respuesta:


**2.2** Mascotas: *Clientes que han comprado más de 20 unidades del tipo de producto Comida_perros.*

Respuesta:


**2.3** Universidad: *Profesores que pertenecen al departamento de Matemáticas y de Física.*

Respuesta:


**2.4** Tablas Facturas / Productos / DetallesFactura: *Compras en DetallesFactura cuyo importe (precio×cantidad) supera 3000€. Se pide ProductoID y FacturaID.*

Respuesta:


**2.5** Mismas tablas: *Productos vendidos más de 300 veces en los detalles de factura. Se pide nombre del producto y su ID.*

Respuesta:


**2.6** Mismas tablas: *Productos vendidos más de 150 veces en los detalles de factura. Se pide nombre del producto y su ID.*

Respuesta:


---

## BLOQUE 3 — Interpretar consultas SQL (2 p): ¿qué devuelve?

**3.1** *(2 p)*
```sql
SELECT p.nomProd AS producto, COUNT(m.codMarca) AS num_marcas
FROM producto p INNER JOIN Marca m ON p.codProducto = m.codProducto
GROUP BY m
ORDER BY p.nomProd;
```
> Pista: fíjate si el `GROUP BY m` es correcto. ¿Qué pasa al agrupar por una tabla en vez de por una columna?

Respuesta:


**3.2** *(2 p)*
```sql
SELECT p.nombre AS Nombre, p.apellido1 AS Apellido, COUNT(d.departamento) AS departamentos
FROM profesor p INNER JOIN departamento d ON p.id_departamento = d.id
GROUP BY d
ORDER BY p.nombre;
```
Respuesta:


**3.3** *(2 p)*
```sql
SELECT e.first_name, e.last_name, SUM(e.salary) AS sueldo
FROM employees e INNER JOIN salaries s ON e.emp_no = s.emp_no
GROUP BY s
ORDER BY e.last_name;
```
Respuesta:


**3.4** *(2 p)*
```sql
SELECT c.NIF, c.nombre, c.apellidos
FROM CLIENTE c
INNER JOIN ALQUILER a ON c.NIF = a.NIF_cliente
INNER JOIN ESPACIO e ON a.Codigo_espacio = e.Codigo
WHERE e.ciudad = 'Madrid' AND a.numero_dias > 3 AND (a.numero_dias * e.precio_dia) > 500;
```
Respuesta:


**3.5** *(2 p)*
```sql
SELECT c.Nombre, SUM(co.Cantidad_compra) AS Total_compras,
       p.Tipo_producto, SUM(co.Cantidad_compra * p.Precio) AS Ingresos
FROM Clientes c
INNER JOIN Compras co ON c.NIF = co.NIF_cliente
INNER JOIN Productos p ON co.Codigo_producto = p.Codigo
GROUP BY c.Nombre, p.Tipo_producto
ORDER BY c.Nombre;
```
Respuesta:


**3.6** *(2 p)*
```sql
SELECT PLAN, COUNT(SOCIO.ID_PLAN) AS 'NUMERO DE SOCIOS',
       FORMAT(CUOTA_MENSUAL,2) AS 'CUOTA MENSUAL',
       FORMAT(COUNT(SOCIO.ID_PLAN)*CUOTA_MENSUAL,2) AS 'TOTAL'
FROM (plan INNER JOIN SOCIO ON plan.ID_PLAN = SOCIO.ID_PLAN)
GROUP BY PLAN.PLAN
HAVING COUNT(SOCIO.ID_PLAN) > 1;
```
Respuesta:


---

## BLOQUE 4 — Privilegios DCL (GRANT / REVOKE) (2,5 p)

**4.1** ¿Qué significa y qué otros privilegios existen?
```sql
GRANT SELECT, DELETE ON BdQuimica.clientes TO 'auditoria'@'localhost';
```
Respuesta:


**4.2**
```sql
REVOKE DELETE ON BdMascota.clientes TO 'owner'@'localhost';
```
Respuesta:


**4.3**
```sql
REVOKE DELETE ON BdUniversidad.profesor TO 'owner'@'localhost';
```
Respuesta:


**4.4**
```sql
GRANT SELECT, INSERT ON BdQuimica.clientes TO 'auditoria'@'localhost';
```
Respuesta:


**4.5**
```sql
REVOKE DELETE ON BdOfice.clientes TO 'owner'@'localhost';
```
Respuesta:


**4.6**
```sql
REVOKE DELETE ON BdGym.abonados TO 'owner'@'localhost';
```
Respuesta:


---

## BLOQUE 5 — Temas transversales (normalización, herencia, atributos de relación)

**5.1** ¿Podría normalizarse el modelo? ¿Qué forma normal le aplicarías y cómo quedarían las tablas? *(2 p)*

Respuesta:


**5.2** Explica brevemente qué es la **herencia entre entidades** y pon un ejemplo. *(2 p)*

Respuesta:


**5.3** Pon un ejemplo de **atributo de relación** (que pertenece a la relación entre dos entidades) y explica por qué pertenece a la relación. *(2 p)*

Respuesta:
