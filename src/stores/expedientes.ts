import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getExpedientes, getExpedienteById, updateExpediente } from '../mosk/api'
import type {
  Expediente,
  GetExpedientesParams,
  UpdateExpedientePayload
} from '../types/expediente'

const PAGE_SIZE_DEFAULT = 10
export const useExpedientesStore = defineStore('expedientes', () => {
  // ---------- Listado ----------
  const items = ref<Expediente[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const scrollGuardado = ref(0)

  // ---------- Detalle (panel lateral) ----------
  const detalle = ref<Expediente | null>(null)
  const selectedId = ref<number | null>(null)
  const loadingDetalle = ref(false)
  const errorDetalle = ref<string | null>(null)
  const guardandoDetalle = ref(false)
  const errorGuardado = ref<string | null>(null)

  const totalPaginas = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
  
  const filtrosGuardados = ref<GetExpedientesParams | null>(null)
  const loadingListado = ref(false)
  const errorListado = ref<string | null>(null)
  
  let tokenListado = 0
  let tokenDetalle = 0
  
  
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

    async function guardarDetalle(
    id: number,
    payload: UpdateExpedientePayload,
  ): Promise<Expediente | null> {
    guardandoDetalle.value = true
    errorGuardado.value = null

    try {
      const actualizado = await updateExpediente(id, payload)

      if (selectedId.value === id) {
        detalle.value = actualizado
      }

      const index = items.value.findIndex((exp) => exp.id === id)
      if (index !== -1) {
        items.value[index] = actualizado
      }

      return actualizado
    } catch (err) {
      errorGuardado.value = err instanceof Error ? err.message : 'Error al guardar los cambios.'
      return null
    } finally {
      guardandoDetalle.value = false
    }
  }

   function cerrarDetalle(): void {
    tokenDetalle++
    selectedId.value = null
    detalle.value = null
    errorDetalle.value = null
    loadingDetalle.value = false
  }

   async function fetchDetalle(id: number): Promise<void> {
    const miToken = ++tokenDetalle
    selectedId.value = id
    loadingDetalle.value = true
    errorDetalle.value = null
    detalle.value = null

    try {
      const data = await getExpedienteById(id)
      if (miToken !== tokenDetalle) return
      detalle.value = data
    } catch (err) {
      if (miToken !== tokenDetalle) return
      errorDetalle.value = err instanceof Error ? err.message : 'Error al cargar el detalle.'
    } finally {
      if (miToken === tokenDetalle) {
        loadingDetalle.value = false
      }
    }
  }

  
  function reset(): void {
    items.value = []
    total.value = 0
    page.value = 1
    pageSize.value = PAGE_SIZE_DEFAULT
    loadingListado.value = false
    errorListado.value = null

    detalle.value = null
    selectedId.value = null
    loadingDetalle.value = false
    errorDetalle.value = null
    guardandoDetalle.value = false
    errorGuardado.value = null
   
    filtrosGuardados.value = null
    scrollGuardado.value = 0

    // Invalida cualquier petición en vuelo para que, si llega tarde,
    // no repueble un store que el usuario ya pidió vaciar.
    tokenListado++
    tokenDetalle++
  }



   return {
    items,
    total,
    page,
    pageSize,
    filtrosGuardados,
    scrollGuardado,
    totalPaginas,
    detalle,
    selectedId,
    loadingDetalle,
    errorDetalle,
    guardandoDetalle,
    errorGuardado,
    fetchListado,
    fetchDetalle,
    irAPagina,
    guardarDetalle,
    reset,
    cerrarDetalle

   
  }

})