<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useExpedientesStore } from '../stores/expedientes'
import { responsablesMock } from '../mosk/Expedientes'
import type { EstadoExpediente, UpdateExpedientePayload } from '../types/expediente'

const store = useExpedientesStore()

const ESTADOS: EstadoExpediente[] = ['pendiente', 'revision', 'aprobado', 'cerrado']

interface FormularioDetalle {
  estado: EstadoExpediente | ''
  responsableId: number | null
  fechaGestion: string
}
const form = reactive<FormularioDetalle>({
  estado: '',
  responsableId: null,
  fechaGestion: '',
})

watch(
  () => store.detalle,
  (nuevoDetalle) => {
    if (!nuevoDetalle) return
    form.estado = nuevoDetalle.estado
    form.responsableId = nuevoDetalle.responsableId
    form.fechaGestion = nuevoDetalle.fechaGestion
  },
  { immediate: true },
)

async function guardar(): Promise<void> {
  if (store.selectedId === null || form.estado === '') return

  const responsableSeleccionado = responsablesMock.find((r) => r.id === form.responsableId)

  const payload: UpdateExpedientePayload = {
    estado: form.estado,
    responsableId: form.responsableId ?? undefined,
    responsableNombre: responsableSeleccionado?.nombre,
    fechaGestion: form.fechaGestion,
  }

  await store.guardarDetalle(store.selectedId, payload)
 
}

function cerrar(): void {
  store.cerrarDetalle()
}

</script>
<template>
  <aside v-if="store.selectedId !== null" class="panel" aria-label="Detalle del expediente">
    <header class="panel__header">
      <h2>Detalle del expediente</h2>
      <button type="button" class="panel__cerrar" aria-label="Cerrar panel" @click="cerrar">
        ✕
      </button>
    </header>
    <p v-if="store.loadingDetalle" class="estado-mensaje">Cargando expediente…</p>
     <p v-else-if="store.errorDetalle" class="estado-mensaje estado-mensaje--error" role="alert">
      {{ store.errorDetalle }}
    </p>
    
    <form v-else-if="store.detalle" class="panel__form" @submit.prevent="guardar">
      <div class="campo">
        <span class="campo__label">Número</span>
        <span class="campo__valor">{{ store.detalle.numero }}</span>
      </div>

      <div class="campo">
        <span class="campo__label">Título</span>
        <span class="campo__valor">{{ store.detalle.titulo }}</span>
      </div>

      <div class="campo">
        <span class="campo__label">Fecha de creación</span>
        <span class="campo__valor">{{ store.detalle.fechaCreacion }}</span>
      </div>

      <label class="campo">
        <span class="campo__label">Estado</span>
        <select v-model="form.estado" required>
          <option v-for="estado in ESTADOS" :key="estado" :value="estado">{{ estado }}</option>
        </select>
      </label>

      <label class="campo">
        <span class="campo__label">Responsable</span>
        <select v-model.number="form.responsableId" required>
          <option v-for="resp in responsablesMock" :key="resp.id" :value="resp.id">
            {{ resp.nombre }}
          </option>
        </select>
      </label>

      <label class="campo">
        <span class="campo__label">Fecha de gestión</span>
        <input v-model="form.fechaGestion" type="date" required />
      </label>

      <p v-if="store.errorGuardado" class="estado-mensaje estado-mensaje--error" role="alert">
        {{ store.errorGuardado }}
      </p>

      <button type="submit" class="panel__guardar" :disabled="store.guardandoDetalle">
        {{ store.guardandoDetalle ? 'Guardando…' : 'Guardar cambios' }}
      </button>
    </form>
  
  </aside>  
</template> 
<style scoped>
.panel {
  width: 320px;
  flex-shrink: 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  font-family: system-ui, sans-serif;
  color: #1f2937;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel__header h2 {
  font-size: 1rem;
  margin: 0;
}

.panel__cerrar {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  color: #6b7280;
}

.panel__form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.campo__label {
  font-size: 0.75rem;
  color: #6b7280;
}

.campo select,
.campo input {
  padding: 0.45rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.panel__guardar {
  margin-top: 0.5rem;
  padding: 0.55rem;
  border: none;
  border-radius: 6px;
  background: #4f46e5;
  color: white;
  cursor: pointer;
}

.panel__guardar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.estado-mensaje {
  font-size: 0.875rem;
  color: #6b7280;
}

.estado-mensaje--error {
  color: #b91c1c;
  background: #fef2f2;
  padding: 0.5rem;
  border-radius: 6px;
}
</style>   
