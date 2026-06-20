Seguimiento de Expedientes — Vue 3 + TypeScript + Pinia

Módulo de backoffice para que los gestores de una entidad fiduciaria consulten, filtren y gestionen expedientes, con un listado paginado y un panel lateral de detalle que se actualiza sin recargar la página.

Cómo clonar y ejecutar el proyecto

git clone https://github.com/odlanra2/backoffice.git
cd backoffice
npm install
npm run dev

El proyecto corre completamente en el navegador: no requiere backend ni base de datos. Todos los datos viven en memoria, simulados en src/mosk/.

Requisitos


Node.js 18 o superior
npm 9 o superior

Qué se construyó (orden de trabajo)

El proyecto se armó de abajo hacia arriba: primero la base de datos falsa, luego la lógica desacoplada, y al final los componentes visuales que la consumen.

1. Mocks — la "base de datos" falsa (src/mosk/)


Expedientes.ts: dataset de 20 expedientes (numero, titulo, estado, responsableId, responsableNombre, fechaCreacion, fechaGestion) y un catálogo de 5 responsables.

api.ts: tres funciones que simulan los endpoints del backend, cada una con una latencia artificial de 600–1000ms para que los estados de carga sean observables:
getExpedientes(params) — simula GET /expedientes, filtra y pagina el dataset, retorna { items, total }.

getExpedienteById(id) — simula GET /expedientes/:id; un id reservado lanza un Error() real para poder probar el manejo de errores.

updateExpediente(id, data) — simula PUT /expedientes/:id y retorna el expediente actualizado.

2. Tipos compartidos (src/types/expediente.ts)

Las interfaces (Expediente, GetExpedientesParams, UpdateExpedientePayload, etc.) se centralizaron en un solo archivo, consumido tanto por el mock como por el store, el composable y los componentes.

3. Composable de filtros (src/composables/useexpedientesfiltros.ts)

Lógica de filtros (texto libre, estado, responsable, rango de fechas) aislada de cualquier componente, con debounce en el texto libre.

4. Store de Pinia (src/stores/expedientes.store.ts)

Estado global del módulo: listado, detalle del panel lateral, loading/error independientes para cada uno.

5. Componentes de UI (src/components/ y src/pages/)


Expedienteslistado.vue — filtros, tabla, paginación.
Expedientedetallepanel.vue — panel lateral que muestra y edita el expediente seleccionado.
Expedientespage.vue — layout que une ambos y demuestra el mecanismo de reset externo (por ejemplo, en logout).

Filtros disponibles

CampoTipoValores posiblestextostringCualquier texto libreestadostring | null"pendiente" | "revision" | "aprobado" | "cerrado"responsableIdnumber | nullID del usuario responsablefechaDesdestring | nullFecha ISO 8601fechaHastastring | nullFecha ISO 8601


Decisiones de arquitectura

1. TypeScript estricto en todo el proyecto, con tipos centralizados

Se definieron las interfaces del dominio (Expediente, EstadoExpediente, GetExpedientesParams, UpdateExpedientePayload) en un único archivo (src/types/expediente.ts) en vez de declararlas dentro de cada archivo que las usa.

Por qué: en un módulo donde el mismo objeto Expediente viaja por cuatro capas distintas (mock → store → composable → componente), el tipado evita errores que en JavaScript plano solo aparecerían en tiempo de ejecución — por ejemplo, enviar un estado con un valor que no es uno de los cuatro permitidos, o llamar updateExpediente con un campo que no existe en el contrato. El autocompletado del editor además hace evidente, sin necesidad de documentación externa, qué forma tiene cada respuesta del "API".


2. Funciones mock en lugar de fetch/axios contra una URL simulada

src/mosk/api.ts exporta funciones async normales (getExpedientes, getExpedienteById, updateExpediente) que operan directamente sobre el array en memoria de Expedientes.ts, en vez de usar fetch/axios apuntando a alguna URL falsa.

3. Un único store de Pinia para listado, detalle y memoria de navegación

Se evaluó dividir el estado en varios stores (uno para el listado, otro para el detalle, otro para la persistencia de navegación de la Tarea 3), pero se optó por un único store (expedientes.ts).

Por qué: estas tres responsabilidades están fuertemente acopladas entre sí. Guardar un cambio desde el panel lateral (guardarDetalle) necesita tocar el listado en el mismo instante para reflejar el cambio sin recargar; tenerlos en stores separados habría obligado a los componentes a coordinar dos o tres stores para completar una sola acción de usuario, además de complicar el manejo de las condiciones de carrera (que necesitan un único punto de verdad por tipo de petición).

Por qué Pinia y no estado local en cada componente: el listado y el panel lateral son componentes independientes que deben ver los mismos datos sincronizados. Un ref local en cada componente no se sincroniza automáticamente con el de otro componente; Pinia crea una única instancia reactiva compartida , así que cuando el store reemplaza un item en items, todos los componentes que lo usan se actualizan al instante, sin emitir eventos ni props manualmente.

Estructura de carpetas relevante

src/
├── types/
│   └── expediente.ts        # Contratos compartidos
├── mosk/
│   ├── Expedientes.ts             # Dataset + responsables
│   └── api.ts                     # GET/PUT simulados
├── composables/
│   └── useExpedientesFiltros.ts   # Lógica de filtros, aislada de la UI
├── stores/
│   └── expedientes.ts       # Estado global: listado, detalle, navegación
├── components/
│   ├── Expedienteslistado.vue
│   └── ExpedientedetallePanel.vue
└── pages/
    └── Expedientespage.vue        # Layout que une listado + panel