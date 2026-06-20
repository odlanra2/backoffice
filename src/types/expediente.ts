
export type EstadoExpediente = 'pendiente' | 'revision' | 'aprobado' | 'cerrado'

/** Entidad principal del módulo. */
export interface Expediente {
  id: number
  numero: string
  titulo: string
  estado: EstadoExpediente
  responsableId: number
  responsableNombre: string
  fechaCreacion: string
  fechaGestion: string
}

/**
 * Parámetros que acepta GET /expedientes (simulado).
 * Todos los filtros son opcionales: su ausencia equivale a "sin filtrar por este campo".
 */
export interface GetExpedientesParams {
  texto?: string
  estado?: EstadoExpediente | null
  responsableId?: number | null
  fechaDesde?: string | null
  fechaHasta?: string | null
  page?: number
  pageSize?: number
}

export interface GetExpedientesResponse {
  items: Expediente[]
  total: number
}

export interface Responsable {
  id: number
  nombre: string
}

export type UpdateExpedientePayload = Partial<
  Pick<Expediente, 'estado' | 'titulo' | 'responsableId' | 'responsableNombre' | 'fechaGestion'>
>




