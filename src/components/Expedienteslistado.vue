<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount,nextTick } from 'vue'
import { useExpedientesStore } from '../stores/expedientes'
import { useExpedientesFiltros } from '../composables/useexpedientesFiltros'
import type { EstadoExpediente } from '../types/expediente'
import { responsablesMock } from '../mosk/Expedientes'

const store = useExpedientesStore()
//Desestructuración
const {
  textoInput,
  filtros,
  filtrosActivos,
  hayFiltrosActivos,
  params,
  limpiarFiltros,
} = useExpedientesFiltros({
  texto: store.filtrosGuardados?.texto ?? '',
  estado: store.filtrosGuardados?.estado ?? null,
  responsableId: store.filtrosGuardados?.responsableId ?? null,
  fechaDesde: store.filtrosGuardados?.fechaDesde ?? null,
  fechaHasta: store.filtrosGuardados?.fechaHasta ?? null,
})
let inicializando = true
const contenedorTablaRef = ref<HTMLDivElement | null>(null)
const ESTADOS: EstadoExpediente[] = ['pendiente', 'revision', 'aprobado', 'cerrado']
onMounted(async () => {
  await store.fetchListado(params.value)
  await nextTick()
  if (contenedorTablaRef.value) {
    contenedorTablaRef.value.scrollTop = store.scrollGuardado
  }
  inicializando = false
})

watch(params, (nuevosParams) => {
  if (inicializando) return
  store.page = 1
  
  void store.fetchListado(nuevosParams)
})

function cambiarPagina(nuevaPagina: number): void {
  store.irAPagina(nuevaPagina, params.value)
}

function seleccionarExpediente(id: number): void {
  void store.fetchDetalle(id)
}



const hayPaginaAnterior = computed(() => store.page > 1)
const hayPaginaSiguiente = computed(() => store.page < store.totalPaginas)

function reset(): void {
  limpiarFiltros()
  store.reset()
  inicializando = true
  void store.fetchListado({}).finally(() => {
    inicializando = false
  })
}

defineExpose({ reset })

</script>

<template>
  <section class="listado" aria-label="Listado de expedientes">
    <header class="filtros">
        <input
            v-model="textoInput"
            type="search"
            class="filtros__texto"
            placeholder="Buscar por número, título o responsable…"
            aria-label="Buscar expedientes"
            
        />
        <select v-model="filtros.estado" class="filtros__select" aria-label="Filtrar por estado">
        <option :value="null">Todos los estados</option>
        <option v-for="estado in ESTADOS" :key="estado" :value="estado">
          {{ estado }}
        </option>
      </select>

      <select
        v-model.number="filtros.responsableId"
        class="filtros__select"
        aria-label="Filtrar por responsable"
      >
        <option :value="null">Todos los responsables</option>
        <option v-for="resp in responsablesMock" :key="resp.id" :value="resp.id">
          {{ resp.nombre }}
        </option>
      </select>

      <label class="filtros__fecha">
        Desde
        <input v-model="filtros.fechaDesde" type="date" />
      </label>

      <label class="filtros__fecha">
        Hasta
        <input v-model="filtros.fechaHasta" type="date" />
      </label>
       <button
        type="button"
        class="filtros__limpiar"
        :disabled="!hayFiltrosActivos"
        @click="limpiarFiltros"
      >
        Limpiar filtros{{ hayFiltrosActivos ? ` (${filtrosActivos})` : '' }}
      </button>
    </header>
      <p v-if="store.errorListado" class="estado-mensaje estado-mensaje--error" role="alert">
      {{ store.errorListado }}
    </p>
     <div
      ref="contenedorTablaRef"
      class="tabla-scroll"
      @scroll="onScrollTabla"
     >
      <table class="tabla">
        <thead>
          <tr>
            <th>Número</th>
            <th>Título</th>
            <th>Estado</th>
            <th>Responsable</th>
            <th>Fecha gestión</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="exp in store.items"
            :key="exp.id"
            class="tabla__fila"
            :class="{ 'tabla__fila--activa': exp.id === store.selectedId }"
            tabindex="0"
            @click="seleccionarExpediente(exp.id)"
            @keydown.enter="seleccionarExpediente(exp.id)"
          >
            <td>{{ exp.numero }}</td>
            <td>{{ exp.titulo }}</td>
            <td><span class="badge" :class="`badge--${exp.estado}`">{{ exp.estado }}</span></td>
            <td>{{ exp.responsableNombre }}</td>
            <td>{{ exp.fechaGestion }}</td>
          </tr>
          <tr v-if="!store.loadingListado && store.items.length === 0">
            <td colspan="5" class="tabla__vacio">No hay expedientes que coincidan con los filtros.</td>
          </tr>
        </tbody>
      </table>

      <p v-if="store.loadingListado" class="estado-mensaje">Cargando expedientes…</p>

    </div>
      <footer class="paginacion">
      <button type="button" :disabled="!hayPaginaAnterior" @click="cambiarPagina(store.page - 1)">
        ← Anterior
      </button>
      <span>Página {{ store.page }} de {{ store.totalPaginas }} ({{ store.total }} expedientes)</span>
      <button type="button" :disabled="!hayPaginaSiguiente" @click="cambiarPagina(store.page + 1)">
        Siguiente →
      </button>
    </footer>

  </section>
</template>
<style scoped>
.listado {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-family: system-ui, sans-serif;
  color: #1f2937;
}

.filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: end;
}

.filtros__texto {
  flex: 1 1 220px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.filtros__select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.filtros__fecha {
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  color: #6b7280;
  gap: 0.25rem;
}

.filtros__fecha input {
  padding: 0.4rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.filtros__limpiar {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #f9fafb;
  cursor: pointer;
}

.filtros__limpiar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tabla-scroll {
  max-height: 420px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
}

.tabla thead {
  position: sticky;
  top: 0;
  background: #f9fafb;
  z-index: 1;
}

.tabla th,
.tabla td {
  text-align: left;
  padding: 0.6rem 0.8rem;
  border-bottom: 1px solid #f0f1f3;
  font-size: 0.875rem;
}

.tabla__fila {
  cursor: pointer;
}

.tabla__fila:hover {
  background: #f9fafb;
}

.tabla__fila--activa {
  background: #eef2ff;
}

.tabla__fila:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: -2px;
}

.tabla__vacio {
  text-align: center;
  color: #9ca3af;
  padding: 2rem;
}

.badge {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.badge--pendiente { background: #fef3c7; color: #92400e; }
.badge--revision { background: #dbeafe; color: #1e40af; }
.badge--aprobado { background: #d1fae5; color: #065f46; }
.badge--cerrado { background: #e5e7eb; color: #374151; }

.estado-mensaje {
  padding: 0.75rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.estado-mensaje--error {
  color: #b91c1c;
  background: #fef2f2;
  border-radius: 6px;
}

.paginacion {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 0.875rem;
}

.paginacion button {
  padding: 0.4rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

.paginacion button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>      

