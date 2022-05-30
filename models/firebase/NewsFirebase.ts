export default interface NewsFirebase {
  titulo: String,
  texto: String,
  estado: String,
  capa: String,
  criadoEm: number,
  criadoPor: String,
  editadoEm?: number,
  editadoPor?: String,
  publicadoEm?: number,
}
