
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




