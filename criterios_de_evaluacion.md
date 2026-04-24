Frontend: Experiencia de Usuario y Estado

Módulos a realizar: Categorias, Ingredientes y productos, cada módulo debe
tener su respectiva página, con su tabla sus botones de acciones y su
respectivo modal con el formulario de alta y edición.
● Estructura y Tipado: Muestra un componente clave y su respectiva interfaz en
TypeScript para las Props.
● Server State (TanStack Query): Explica una implementación de useQuery
para el listado y una useMutation para el alta o edición. Muestra dónde haces
la invalidación de la caché (invalidateQueries).
● Navegación: Muestra la configuración de react-router-dom y cómo pasas
parámetros dinámicos a través de la URL (ej. el ID para ver el detalle).

Criterios de Evaluación
1. Claridad Técnica: Uso correcto de la terminología vista en clase.
2. Integración: El frontend debe consumir datos reales del backend (no mock
data).
3. Diseño: Aplicación coherente de Tailwind CSS para una interfaz limpia y
responsive.
4. Resolución de Problemas: Explicación de algún desafío técnico que
encontraron y cómo lo resolvieron.


Frontend (React + TypeScript + Tailwind)
● [ ] Setup: Proyecto creado con Vite + TS y estructura de carpetas limpia.
● [ ] Componentes: Uso de componentes funcionales y Props debidamente
tipadas con interfaces.
● [ ] Estilos: Interfaz construida íntegramente con clases de utilidad de Tailwind
CSS 4.
● [ ] Navegación: Configuración de react-router-dom con al menos una ruta
dinámica (ej. /detalle/:id).
● [ ] Estado Local: Uso de useState para el manejo de formularios o UI
interactiva.


Integración y Server State
● [ ] Lectura (useQuery): Listados y detalles consumiendo datos reales de la
API.
● [ ] Escritura (useMutation): Formularios que envían datos al backend con
éxito.
● [ ] Sincronización: Uso de invalidateQueries para refrescar la UI
automáticamente tras un cambio.
● [ ] Feedback: Gestión visual de estados de "Cargando..." y "Error" en las
peticiones.

Frontend y Estado
(React &
TanStack)
Implementa useQuery y
useMutation con
invalidación de caché.
Tipado de props y estados
con TypeScript sin errores.
