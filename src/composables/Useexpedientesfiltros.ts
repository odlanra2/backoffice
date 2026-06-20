import { reactive, ref, computed, watch,  type ComputedRef} from 'vue'
import type { EstadoExpediente, GetExpedientesParams } from '../types/expediente'


export interface FiltrosExpedientes {
  texto: string
  estado: EstadoExpediente | null
  responsableId: number | null
  fechaDesde: string | null
  fechaHasta: string | null
}

const FILTROS_INICIALES: FiltrosExpedientes = {
  texto: '',
  estado: null,
  responsableId: null,
  fechaDesde: null,
  fechaHasta: null,
}
const DEBOUNCE_TEXTO_MS = 400

export interface UseExpedientesFiltrosReturn {
  /** Enlazar directamente al <input> con v-model: se actualiza en cada tecla, sin demora. */
  textoInput: ReturnType<typeof ref<string>>
  /** Filtros "efectivos": estado + texto YA debounced. Es la fuente de verdad para construir los params de la API. */
  filtros: FiltrosExpedientes
  /** Cuántos filtros están activos en este momento (cuenta sobre el valor instantáneo, no espera el debounce). */
  filtrosActivos: ComputedRef<number>
  /** Atajo booleano sobre filtrosActivos. */
  hayFiltrosActivos: ComputedRef<boolean>
  /** True si el estado actual (incluyendo lo que el usuario está tecleando ahora) difiere del estado inicial. */
  esDiferenteDelInicial: ComputedRef<boolean>
  /** Objeto listo para enviar a getExpedientes(), derivado automáticamente de `filtros`. */
  params: ComputedRef<GetExpedientesParams>
  /** Resetea todo (incluyendo el input de texto) al estado inicial. */
  limpiarFiltros: () => void
}

export function useExpedientesFiltros(
  valoresIniciales?: Partial<FiltrosExpedientes>,
): UseExpedientesFiltrosReturn {
    
    const estadoInicial: FiltrosExpedientes = { ...FILTROS_INICIALES, ...valoresIniciales }

    const textoInput = ref(estadoInicial.texto)

    const filtros = reactive<FiltrosExpedientes>({ ...estadoInicial })

    let debounceTimer: ReturnType<typeof setTimeout> | undefined

    watch(textoInput, (nuevoValor) => {
    
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      filtros.texto = nuevoValor.trim()
    }, DEBOUNCE_TEXTO_MS)
    })

    const filtrosActivos = computed<number>(() => {
    let count = 0
    if (textoInput.value.trim() !== '') count++
    if (filtros.estado !== null) count++
    if (filtros.responsableId !== null) count++
    if (filtros.fechaDesde !== null) count++
    if (filtros.fechaHasta !== null) count++
    return count
   })

   const hayFiltrosActivos = computed<boolean>(() => filtrosActivos.value > 0)

    const esDiferenteDelInicial = computed<boolean>(() => {
    return (
      textoInput.value.trim() !== FILTROS_INICIALES.texto ||
      filtros.estado !== FILTROS_INICIALES.estado ||
      filtros.responsableId !== FILTROS_INICIALES.responsableId ||
      filtros.fechaDesde !== FILTROS_INICIALES.fechaDesde ||
      filtros.fechaHasta !== FILTROS_INICIALES.fechaHasta
    )
   })

   const params = computed<GetExpedientesParams>(() => ({
    texto: filtros.texto !== '' ? filtros.texto : undefined,
    estado: filtros.estado,
    responsableId: filtros.responsableId,
    fechaDesde: filtros.fechaDesde,
    fechaHasta: filtros.fechaHasta,
  }))

   function limpiarFiltros(): void {
    if (debounceTimer) clearTimeout(debounceTimer)
    textoInput.value = FILTROS_INICIALES.texto
    filtros.texto = FILTROS_INICIALES.texto
    filtros.estado = FILTROS_INICIALES.estado
    filtros.responsableId = FILTROS_INICIALES.responsableId
    filtros.fechaDesde = FILTROS_INICIALES.fechaDesde
    filtros.fechaHasta = FILTROS_INICIALES.fechaHasta
  }

   return {
    textoInput,
    filtros,
    filtrosActivos,
    hayFiltrosActivos,
    esDiferenteDelInicial,
    params,
    limpiarFiltros,
  }

}