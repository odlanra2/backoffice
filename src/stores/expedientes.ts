import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getExpedientes, getExpedienteById, updateExpediente } from '../mosk/api'
import type {
  Expediente,
  GetExpedientesParams,
} from '../types/expediente'


export const useExpedientesStore = defineStore('expedientes', () => {
  // ---------- Listado ----------
  const items = ref<Expediente[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const scrollGuardado = ref(0)

  const totalPaginas = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
  
  const filtrosGuardados = ref<GetExpedientesParams | null>(null)
  const loadingListado = ref(false)
  const errorListado = ref<string | null>(null)
  /** Simula GET /expedientes con los filtros + paginación actuales. */
  async function fetchListado(filtros: GetExpedientesParams = {}): Promise<void> 
  {

    loadingListado.value = true
    errorListado.value = null  
    
    try{
        const response = await getExpedientes({
            ...filtros,
            page: page.value,
            pageSize: pageSize.value,
          })

          items.value = response.items
          total.value = response.total
          filtrosGuardados.value = filtros
       }catch(err){
            errorListado.value = err instanceof Error ? err.message : 'Error al cargar el listado.'
       } finally {
             loadingListado.value = false
       }

  }

  /** Cambia de página y vuelve a pedir el listado con esa página. */
  function irAPagina(nuevaPagina: number, filtrosActuales: GetExpedientesParams = {}): void {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas.value) return
    page.value = nuevaPagina
    void fetchListado(filtrosActuales)
  }


   return {
    items,
    total,
    page,
    pageSize,
    filtrosGuardados,
    scrollGuardado,
    totalPaginas,
    fetchListado,
    irAPagina,

   
  }

})