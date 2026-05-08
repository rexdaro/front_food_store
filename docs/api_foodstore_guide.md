# Guía de la API FoodStore — Para el equipo Frontend

## Contexto general

Esta es una API REST construida con **FastAPI** y **PostgreSQL**. Expone tres recursos principales: `productos`, `categorias` e `ingredientes`. La base del negocio es el **producto**, que puede pertenecer a múltiples categorías y contener múltiples ingredientes (relaciones muchos a muchos).

---

## Base URL

```
http://127.0.0.1:8000/api/v1
```

Health check (sin prefijo):
```
GET http://127.0.0.1:8000/
→ { "status": "online", "message": "...", "version": "1.0.0" }
```

Documentación interactiva (Swagger):
```
http://127.0.0.1:8000/docs
```

---

## Convenciones generales

| Convención | Detalle |
|---|---|
| Formato | JSON en request y response |
| Paginación | `offset` + `limit` (solo en productos) |
| Borrado | **Lógico** en productos y categorías (campo `disponible: false`). **Físico** en ingredientes |
| IDs | Enteros (`BigInteger` en DB) |
| Precios | `Decimal` con 2 decimales — mandar como número, ej: `12.50` |
| Imágenes | Array de strings (URLs), puede ser `null` |

---

## Módulo: Productos

### Modelo de respuesta (`ProductoRead`)

```json
{
  "id": 1,
  "nombre": "Hamburguesa Clásica",
  "descripcion": "Carne 200g, queso, lechuga, tomate",
  "precio_base": "12.50",
  "stock_cantidad": 50,
  "imagenes_url": ["https://cdn.example.com/burger.jpg"],
  "disponible": true
}
```

### `GET /productos/` — Listar con paginación y filtros

```
GET /api/v1/productos/?offset=0&limit=10&search=burger&categoria_id=2
```

**Query params:**
| Param | Tipo | Requerido | Descripción |
|---|---|---|---|
| `offset` | int ≥ 0 | No (default: 0) | Registros a saltar |
| `limit` | int 1-100 | No (default: 100) | Máximo de resultados |
| `search` | string | No | Busca en `nombre` y `descripcion` (case-insensitive) |
| `categoria_id` | int | No | Filtra productos de esa categoría |

**Response:**
```json
{
  "items": [ /* array de ProductoRead */ ],
  "total": 42
}
```

> El campo `total` es el conteo TOTAL que matchea los filtros (sin el limit), para que puedas calcular las páginas en el frontend.

### `GET /productos/{id}` — Detalle de un producto

```
GET /api/v1/productos/1
→ ProductoRead | 404
```

### `GET /productos/inactivos` — Productos con borrado lógico

```
GET /api/v1/productos/inactivos
→ Array de ProductoRead (solo los que tienen disponible: false)
```

### `POST /productos/` — Crear producto

```json
POST /api/v1/productos/
Content-Type: application/json

{
  "nombre": "Hamburguesa Clásica",
  "descripcion": "Descripción opcional",
  "precio_base": 12.50,
  "stock_cantidad": 50,
  "imagenes_url": ["https://cdn.example.com/burger.jpg"]
}
```

- `descripcion` → opcional, puede omitirse
- `imagenes_url` → opcional, puede omitirse o ser `null`
- `stock_cantidad` → opcional, default `0`

**Response: `201 Created` + `ProductoRead`**

### `PATCH /productos/{id}` — Actualizar parcialmente

```json
PATCH /api/v1/productos/1
Content-Type: application/json

{
  "precio_base": 15.00,
  "stock_cantidad": 30
}
```

Solo mandás los campos que querés cambiar. Todos son opcionales.

**Response: `200` + `ProductoRead`**

### `DELETE /productos/{id}` — Borrado lógico

```
DELETE /api/v1/productos/1
→ 200 + ProductoRead (con disponible: false)
→ 400 si ya estaba desactivado
→ 404 si no existe
```

El producto NO se borra de la DB. Solo se cambia `disponible = false`.

---

## Módulo: Categorías

Las categorías soportan **jerarquía**: una categoría puede tener un `parent_id` que apunta a otra categoría padre (ej: "Bebidas" → "Bebidas Calientes").

### Modelo de respuesta (`CategoriaRead`)

```json
{
  "id": 1,
  "nombre": "Hamburguesas",
  "descripcion": "Todas nuestras hamburguesas",
  "imagen_url": "https://cdn.example.com/cat.jpg",
  "parent_id": null,
  "disponible": true
}
```

### `GET /categorias/` — Listar

```
GET /api/v1/categorias/
GET /api/v1/categorias/?producto_id=3   ← solo las categorías de ese producto
→ Array de CategoriaRead (solo disponibles)
```

### `GET /categorias/{id}` — Detalle

```
GET /api/v1/categorias/1
→ CategoriaRead | 404
```

### `GET /categorias/inactivos` — Borradas lógicamente

```
GET /api/v1/categorias/inactivos
→ Array de CategoriaRead
```

### `POST /categorias/` — Crear

```json
POST /api/v1/categorias/
{
  "nombre": "Bebidas Calientes",
  "descripcion": "Opcional",
  "imagen_url": "https://...",   
  "parent_id": 5
}
```

- `descripcion`, `imagen_url`, `parent_id` → opcionales
- Si mandás `parent_id`, el servidor valida que ese ID exista → `400` si no existe

**Response: `201 Created` + `CategoriaRead`**

### `PATCH /categorias/{id}` — Actualizar parcialmente

```json
PATCH /api/v1/categorias/1
{
  "nombre": "Nuevo nombre",
  "parent_id": null
}
```

> ⚠️ Mandar `parent_id: null` saca la categoría de su padre (pasa a ser raíz).
> ⚠️ No se puede asignar una categoría como su propio padre → `400`.

### `DELETE /categorias/{id}` — Borrado lógico

```
DELETE /api/v1/categorias/1
→ 200 + CategoriaRead | 400 si ya inactiva | 404 si no existe
```

---

## Módulo: Ingredientes

Los ingredientes no tienen borrado lógico: el DELETE los elimina físicamente de la DB.

### Modelo de respuesta (`IngredienteRead`)

```json
{
  "id": 1,
  "nombre": "Queso Cheddar",
  "descripcion": "Queso amarillo fundible",
  "es_alergeno": false,
  "created_at": "2025-01-15T10:30:00Z"
}
```

### `GET /ingredientes/` — Listar

```
GET /api/v1/ingredientes/
GET /api/v1/ingredientes/?producto_id=3   ← solo los ingredientes de ese producto
→ Array de IngredienteRead
```

### `GET /ingredientes/{id}` — Detalle

```
GET /api/v1/ingredientes/1
→ IngredienteRead | 404
```

### `POST /ingredientes/` — Crear

```json
POST /api/v1/ingredientes/
{
  "nombre": "Cebolla Caramelizada",
  "descripcion": "Opcional",
  "es_alergeno": false
}
```

- `descripcion` → opcional
- `es_alergeno` → opcional, default `false`

**Response: `201 Created` + `IngredienteRead`**

### `PATCH /ingredientes/{id}` — Actualizar parcialmente

```json
PATCH /api/v1/ingredientes/1
{
  "es_alergeno": true
}
```

### `DELETE /ingredientes/{id}` — Eliminación FÍSICA

```
DELETE /api/v1/ingredientes/1
→ 200 { "message": "Ingrediente eliminado correctamente" } | 404
```

> ⚠️ A diferencia de productos y categorías, este DELETE es PERMANENTE.

---

## Relaciones M:N — Lo más importante

> **Decisión arquitectural del backend:** Las dos tablas intermedias (`producto_categoria` y `producto_ingrediente`) fueron consolidadas dentro del módulo `productos`. Esto significa que todos los endpoints para vincular y desvincular relaciones viven **bajo el prefijo `/api/v1/productos/`**, no bajo categorías ni ingredientes.

### Cómo funciona la vinculación

Un producto se relaciona con categorías e ingredientes mediante **tablas de unión** que tienen campos extra (no es una relación simple). El flujo siempre es:

1. Crear el producto → `POST /productos/`
2. Crear la categoría o ingrediente si no existe
3. Vincular → `POST /productos/vincular-categoria` o `POST /productos/vincular-ingrediente`

### Vincular Producto ↔ Categoría

```json
POST /api/v1/productos/vincular-categoria
Content-Type: application/json

{
  "producto_id": 1,
  "categoria_id": 3,
  "es_principal": true
}
```

**Campos:**
| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `producto_id` | int | ✅ | ID del producto |
| `categoria_id` | int | ✅ | ID de la categoría |
| `es_principal` | bool | No (default: false) | Si es la categoría principal del producto |

**Response: `200`**
```json
{
  "producto_id": 1,
  "categoria_id": 3,
  "es_principal": true,
  "created_at": "2025-01-15T10:30:00Z"
}
```

> Si la relación ya existe, devuelve la existente sin duplicar (idempotente).

**Errores:**
- `400` → el producto o la categoría no existen

### Desvincular Producto ↔ Categoría

```
DELETE /api/v1/productos/desvincular-categoria/{producto_id}/{categoria_id}

DELETE /api/v1/productos/desvincular-categoria/1/3
→ 200 { "message": "Desvinculación exitosa" }
→ 404 si la relación no existía
```

### Vincular Producto ↔ Ingrediente

```json
POST /api/v1/productos/vincular-ingrediente
Content-Type: application/json

{
  "producto_id": 1,
  "ingrediente_id": 5,
  "es_removible": true
}
```

**Campos:**
| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `producto_id` | int | ✅ | ID del producto |
| `ingrediente_id` | int | ✅ | ID del ingrediente |
| `es_removible` | bool | No (default: false) | Si el cliente puede pedir que se lo saquen |

**Response: `200`**
```json
{
  "producto_id": 1,
  "ingrediente_id": 5,
  "es_removible": true
}
```

> Si la relación ya existe, devuelve la existente sin duplicar (idempotente).

### Desvincular Producto ↔ Ingrediente

```
DELETE /api/v1/productos/desvincular-ingrediente/{producto_id}/{ingrediente_id}

DELETE /api/v1/productos/desvincular-ingrediente/1/5
→ 200 { "message": "Desvinculación exitosa" }
→ 404 si la relación no existía
```

---

## Flujo completo de ejemplo

### Crear un producto con categoría e ingredientes

```javascript
// 1. Crear el producto
const producto = await fetch('/api/v1/productos/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: 'Hamburguesa Doble',
    precio_base: 18.50,
    stock_cantidad: 20
  })
}).then(r => r.json());
// → { id: 7, nombre: 'Hamburguesa Doble', ... }

// 2. Asignarle una categoría como principal
await fetch('/api/v1/productos/vincular-categoria', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    producto_id: producto.id,
    categoria_id: 1,
    es_principal: true
  })
});

// 3. Asignarle ingredientes
await fetch('/api/v1/productos/vincular-ingrediente', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    producto_id: producto.id,
    ingrediente_id: 2,
    es_removible: true   // el cliente puede pedirlo sin este
  })
});
```

### Obtener ingredientes de un producto específico

```javascript
const ingredientes = await fetch('/api/v1/ingredientes/?producto_id=7').then(r => r.json());
```

### Obtener categorías de un producto específico

```javascript
const categorias = await fetch('/api/v1/categorias/?producto_id=7').then(r => r.json());
```

### Paginar productos con búsqueda

```javascript
const pagina = await fetch('/api/v1/productos/?search=burger&offset=0&limit=10').then(r => r.json());
// pagina.items → array de productos
// pagina.total → total de resultados para calcular páginas
const totalPaginas = Math.ceil(pagina.total / 10);
```

---

## Tabla de errores comunes

| HTTP | Cuándo ocurre |
|---|---|
| `400` | Datos inválidos (parent que no existe, producto ya desactivado, categoría siendo su propio padre) |
| `404` | El recurso no existe |
| `422` | Error de validación del body (campo requerido faltante, tipo incorrecto) |
| `500` | Error interno del servidor |

---

## Resumen de todos los endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/productos/` | Listar con paginación y filtros |
| GET | `/productos/inactivos` | Productos desactivados |
| GET | `/productos/{id}` | Detalle |
| POST | `/productos/` | Crear |
| PATCH | `/productos/{id}` | Actualizar parcialmente |
| DELETE | `/productos/{id}` | Borrado lógico |
| POST | `/productos/vincular-categoria` | Vincular producto ↔ categoría |
| DELETE | `/productos/desvincular-categoria/{p_id}/{c_id}` | Desvincular |
| POST | `/productos/vincular-ingrediente` | Vincular producto ↔ ingrediente |
| DELETE | `/productos/desvincular-ingrediente/{p_id}/{i_id}` | Desvincular |
| GET | `/categorias/` | Listar (filtra por `?producto_id=`) |
| GET | `/categorias/inactivos` | Categorías desactivadas |
| GET | `/categorias/{id}` | Detalle |
| POST | `/categorias/` | Crear |
| PATCH | `/categorias/{id}` | Actualizar parcialmente |
| DELETE | `/categorias/{id}` | Borrado lógico |
| GET | `/ingredientes/` | Listar (filtra por `?producto_id=`) |
| GET | `/ingredientes/{id}` | Detalle |
| POST | `/ingredientes/` | Crear |
| PATCH | `/ingredientes/{id}` | Actualizar parcialmente |
| DELETE | `/ingredientes/{id}` | Eliminación física permanente |
