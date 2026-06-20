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


   return {
    items,
    total,
    page,
    pageSize,
    filtrosGuardados,
    scrollGuardado,
    fetchListado,
   
  }

})