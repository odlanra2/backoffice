import { expedientesMock } from './Expedientes'
import type {
  Expediente,
} from '../types/expediente'

//Funciones mock requeridas
const DELAY_MIN_MS = 600
const DELAY_MAX_MS = 1000
//Funcion dalay que devuelve una promesa vacia
//Retardo artificial de entre 600 y 1000ms para que los comportamientos de carga, cancelación y error sean observables
const delay = (): Promise<void> => {
    const ms = Math.floor(Math.random() * (DELAY_MAX_MS - DELAY_MIN_MS + 1)) + DELAY_MIN_MS
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Simula GET /expedientes — filtra y pagina los datos locales
 * Retorna: { items: Expediente[], total: number }
*/
export async function getExpedientes(
  params: any = {},
): Promise<any> {
  //Retardo artificial de entre 600 y 1000ms
  await delay()
  
  let resultado = expedientesMock

  return resultado;



}

/**
 * Simula GET /expedientes/:id.
 * Para al menos un ID debe lanzar un Error() para poder evaluar manejo de errores
 * Devueleve una promesa tipo expediente
 * El mock debe incluir al menos un caso donde getExpedienteById lance un error, para que el manejo de errores del
   store pueda evaluarse durante la revision.
 */
export async function getExpedienteById(id: number): Promise<Expediente> {
    //Retardo artificial de entre 600 y 1000ms
    await delay()

    //Si es este id lanzamos el error 
    if (id === 13) {
      throw new Error(
      `No fue posible cargar el expediente ${id}: datos inconsistentes en el origen.`,
     )
    }
    const encontrado = expedientesMock.find((exp) => exp.id === id)
    //Si es este id lanzamos el error ya que encontrado debe ser undefined lo que devuelve esta funcion

    if (!encontrado) {
        throw new Error(`El expediente con id ${id} no existe.`)
    }
    //Devolvemos una promesa tipo expediente
    return encontrado;

}

/**
 * Simula PUT /expedientes/:id 
 * retorna el expediente actualizado
 */
export async function updateExpediente(
  id: number,
  data: Expediente,
): Promise<Expediente> {
  await delay()

  const index = expedientesMock.findIndex((exp) => exp.id === id)
  //Si no encuentra nada findIndex devuelve un -1, entonces lanzamos el error throw
  if (index === -1) {
    throw new Error(`No se puede actualizar: el expediente con id ${id} no existe.`)
  }
  //Se usa .map() para transformar el array y actualizar si no encuentra el id devuelve el mismo
  const actualizado: any= expedientesMock.map((exp) => {
    if (exp.id === id) {
       //Creamos el nuevo objeto fusionando el original con los nuevos datos
       return { ...exp, ...data }
    }
      //Si no es el ID que buscamos, devolvemos el expediente sin cambios
      return exp
   })

  return actualizado
}