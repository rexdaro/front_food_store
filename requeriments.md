Actúa como un Senior Frontend Architect (Staff Engineer) con más de 15 años de experience. Tu tarea es diseñar y estructurar el boilerplate y la arquitectura de un proyecto Frontend para una tienda de alimentos basada en una API de FastAPI ya existente.

### Contexto del Proyecto
El backend está construido con FastAPI y SQLModel. Es una tienda que gestiona Productos, Categorías e Ingredientes.
La arquitectura del backend es modular y utiliza borrado lógico (`disponible: bool`).

### Stack Tecnológico Requerido
- **Framework**: React 18+ con Vite.
- **Lenguaje**: TypeScript (Strict Mode).
- **Gestión de Estado**: 
    - TanStack Query
    - Zustand o Signals para Local State (UI state).
- **Estilos**: Tailwind CSS + shadcn/ui (para componentes premium).
- **Formularios**: React Hook Form + Zod para validaciones.
- **Routing**: TanStack Router

### Requisitos de Arquitectura (Clean Architecture Lite)
Quiero una estructura de carpetas organizada por "features" (dominio):
- `src/core`: Configuración global, interceptores de axios/fetch, tipos base, constantes.
- `src/shared`: Componentes UI reutilizables (botones, inputs, tablas), hooks genéricos, utilidades.
- `src/features`: Un directorio por módulo funcional:
    - `features/products`: Components, hooks, services y types específicos de productos.
    - `features/categories`: Gestión de categorías (debe soportar vista de árbol por jerarquía).
    - `features/ingredients`: Listado y CRUD de ingredientes (con énfasis en alérgenos).
- `src/api`: Definición de la instancia de cliente API y endpoints (usando Axios o Fetch).

### Entidades y Endpoints Detectados
1. **Productos** (`/api/v1/productos`):
    - `GET /`: Listar disponibles (soporta query param `categoria_id`).
    - `POST /`: Crear producto.
    - `PATCH /{id}`: Actualización parcial.
    - `DELETE /{id}`: Borrado lógico.
2. **Categorías** (`/api/v1/categorias`):
    - Soporta jerarquías via `parent_id`.
3. **Ingredientes** (`/api/v1/ingredientes`).
4. **Relaciones (Muchos a Muchos)**:
    - `/api/v1/vinculos-categorias/`: POST para vincular, DELETE para desvincular.
    - `/api/v1/vinculos-ingredientes/`: POST para vincular, DELETE para desvincular.

### Tareas del Prompt
1. Proponé la estructura de archivos detallada basada en el stack y arquitectura mencionados.
2. Creá los tipos de TypeScript (interfaces) basados en las entidades descritas (Producto, Categoria, Ingrediente, etc.).
3. Implementá un hook de TanStack Query (`useCreateProduct`) que no solo cree el producto, sino que maneje la orquestación de las vinculaciones de categorías e ingredientes si se le pasan en el payload.
4. Diseñá un componente de formulario premium para la creación de un Producto que incluya multi-select para categorías e ingredientes.
5. Asegurate de incluir SEO básico y una estética visual "Premium" (Dark mode support, micro-interacciones).

¡Empezá estructurando el proyecto y definiendo los tipos base!
