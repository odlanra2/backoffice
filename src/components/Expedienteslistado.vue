<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount,nextTick } from 'vue'
import { useExpedientesStore } from '../stores/expedientes'
import { useExpedientesFiltros } from '../composables/useexpedientesFiltros'
import type { EstadoExpediente } from '../types/expediente'

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


const hayPaginaAnterior = computed(() => store.page > 1)
const hayPaginaSiguiente = computed(() => store.page < store.totalPaginas)

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

