import type { Expediente } from '../types/expediente'
8
export const expedientesMock: Expediente[] = [
  { id: 1, numero: 'EXP-2024-001', titulo: 'Revision contrato fiduciario Bogota', estado: 'pendiente', responsableId: 12, responsableNombre: 'Laura Gomez', fechaCreacion: '2024-01-15', fechaGestion: '2024-02-01' },
  { id: 2, numero: 'EXP-2024-002', titulo: 'Liquidacion fideicomiso inmobiliario Medellin', estado: 'revision', responsableId: 15, responsableNombre: 'Carlos Ramirez', fechaCreacion: '2024-01-18', fechaGestion: '2024-02-03' },
  { id: 3, numero: 'EXP-2024-003', titulo: 'Constitucion fiducia de garantia Cali', estado: 'aprobado', responsableId: 18, responsableNombre: 'Maria Fernanda Lopez', fechaCreacion: '2024-01-20', fechaGestion: '2024-02-05' },
  { id: 4, numero: 'EXP-2024-004', titulo: 'Cesion de derechos fiduciarios Barranquilla', estado: 'cerrado', responsableId: 21, responsableNombre: 'Andres Torres', fechaCreacion: '2024-01-22', fechaGestion: '2024-02-10' },
  { id: 5, numero: 'EXP-2024-005', titulo: 'Revision poliza colateral Bucaramanga', estado: 'pendiente', responsableId: 24, responsableNombre: 'Diana Castro', fechaCreacion: '2024-01-25', fechaGestion: '2024-02-12' },
  { id: 6, numero: 'EXP-2024-006', titulo: 'Auditoria fideicomiso de administracion Cartagena', estado: 'revision', responsableId: 12, responsableNombre: 'Laura Gomez', fechaCreacion: '2024-01-28', fechaGestion: '2024-02-14' },
  { id: 7, numero: 'EXP-2024-007', titulo: 'Aprobacion desembolso fiducia inmobiliaria Pereira', estado: 'aprobado', responsableId: 15, responsableNombre: 'Carlos Ramirez', fechaCreacion: '2024-02-01', fechaGestion: '2024-02-18' },
  { id: 8, numero: 'EXP-2024-008', titulo: 'Cierre fiducia mercantil Manizales', estado: 'cerrado', responsableId: 18, responsableNombre: 'Maria Fernanda Lopez', fechaCreacion: '2024-02-03', fechaGestion: '2024-02-20' },
  { id: 9, numero: 'EXP-2024-009', titulo: 'Revision contrato de encargo fiduciario Ibague', estado: 'pendiente', responsableId: 21, responsableNombre: 'Andres Torres', fechaCreacion: '2024-02-05', fechaGestion: '2024-02-22' },
  { id: 10, numero: 'EXP-2024-010', titulo: 'Validacion garantias fiducia de inversion Pasto', estado: 'revision', responsableId: 24, responsableNombre: 'Diana Castro', fechaCreacion: '2024-02-08', fechaGestion: '2024-02-25' },
  { id: 11, numero: 'EXP-2024-011', titulo: 'Aprobacion modificacion contractual Neiva', estado: 'aprobado', responsableId: 12, responsableNombre: 'Laura Gomez', fechaCreacion: '2024-02-10', fechaGestion: '2024-02-27' },
  { id: 12, numero: 'EXP-2024-012', titulo: 'Cierre anticipado fiducia de garantia Armenia', estado: 'cerrado', responsableId: 15, responsableNombre: 'Carlos Ramirez', fechaCreacion: '2024-02-12', fechaGestion: '2024-03-01' },
  { id: 13, numero: 'EXP-2024-013', titulo: 'Revision expediente migrado sistema legado Tunja', estado: 'pendiente', responsableId: 18, responsableNombre: 'Maria Fernanda Lopez', fechaCreacion: '2024-02-14', fechaGestion: '2024-03-03' },
  { id: 14, numero: 'EXP-2024-014', titulo: 'Auditoria fiducia inmobiliaria Villavicencio', estado: 'revision', responsableId: 21, responsableNombre: 'Andres Torres', fechaCreacion: '2024-02-16', fechaGestion: '2024-03-05' },
  { id: 15, numero: 'EXP-2024-015', titulo: 'Aprobacion desembolso fideicomiso Popayan', estado: 'aprobado', responsableId: 24, responsableNombre: 'Diana Castro', fechaCreacion: '2024-02-18', fechaGestion: '2024-03-07' },
  { id: 16, numero: 'EXP-2024-016', titulo: 'Cierre fiducia de administracion Monteria', estado: 'cerrado', responsableId: 12, responsableNombre: 'Laura Gomez', fechaCreacion: '2024-02-20', fechaGestion: '2024-03-09' },
  { id: 17, numero: 'EXP-2024-017', titulo: 'Revision contrato fiduciario Santa Marta', estado: 'pendiente', responsableId: 15, responsableNombre: 'Carlos Ramirez', fechaCreacion: '2024-02-22', fechaGestion: '2024-03-11' },
  { id: 18, numero: 'EXP-2024-018', titulo: 'Validacion garantias fiducia mercantil Sincelejo', estado: 'revision', responsableId: 18, responsableNombre: 'Maria Fernanda Lopez', fechaCreacion: '2024-02-24', fechaGestion: '2024-03-13' },
  { id: 19, numero: 'EXP-2024-019', titulo: 'Aprobacion cesion de derechos Riohacha', estado: 'aprobado', responsableId: 21, responsableNombre: 'Andres Torres', fechaCreacion: '2024-02-26', fechaGestion: '2024-03-15' },
  { id: 20, numero: 'EXP-2024-020', titulo: 'Cierre fideicomiso de inversion Yopal', estado: 'cerrado', responsableId: 24, responsableNombre: 'Diana Castro', fechaCreacion: '2024-02-28', fechaGestion: '2024-03-17' },
 
]