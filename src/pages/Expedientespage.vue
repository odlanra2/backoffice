<script setup lang="ts">
import { ref } from 'vue'
import Expedienteslistado from '../components/Expedienteslistado.vue'
import Expedientedetallepanel from '../components/Expedientedetallepanel.vue'
interface ListadoExpuesto {
  reset: () => void
}
const listadoRef = ref<ListadoExpuesto | null>(null)

function manejarLogout(): void {
  listadoRef.value?.reset()
}
</script>
<template>
  <div class="pagina">
    <header class="pagina__header">
      <h1>Seguimiento de expedientes</h1>
      <button type="button" class="pagina__logout" @click="manejarLogout">
        Cerrar sesión
      </button>
    </header>
     <div class="pagina__cuerpo">
      <Expedienteslistado ref="listadoRef" class="pagina__listado" />
      <Expedientedetallepanel />
    
    </div>
  </div>
</template>
<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  font-family: system-ui, sans-serif;
}

.pagina__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pagina__header h1 {
  font-size: 1.25rem;
  margin: 0;
  color: #1f2937;
}

.pagina__logout {
  padding: 0.5rem 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

.pagina__cuerpo {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.pagina__listado {
  flex: 1;
  min-width: 0;
}
</style>