// src/helpers/dateFormatter.ts

/**
 * Helper puro en TypeScript para dar formato a las fechas.
 * Al ser un helper, no depende de Vue ni tiene reactividad interna.
 */
export const formatearFecha = (fechaString: string): string => {
  const fecha = new Date(fechaString)
  
  // Si la fecha no es válida, devolvemos el string original
  if (isNaN(fecha.getTime())) return fechaString

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(fecha)
}
