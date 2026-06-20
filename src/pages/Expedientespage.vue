<script setup lang="ts">
import Expedienteslistado from '../components/Expedienteslistado.vue'

</script>
<template>
  <div class="pagina">
    <header class="pagina__header">
      <h1>Seguimiento de expedientes</h1>
     
    </header>
     <div class="pagina__cuerpo">
      <Expedienteslistado ref="listadoRef" class="pagina__listado" />
    
    </div>
  </div>
</template>

