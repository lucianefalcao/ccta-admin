export default class Edital {
  constructor (
    private id: string,
    private titulo: string,
    private documento: string,
    private criadoPor: string,
    private criadoEm?: Date,
    private editadoPor?: string,
    private editadoEm?: Date
  ) {
    this.criadoEm = new Date()
    this.validar()
  }

  getId (): string {
    return this.id
  }

  getTitulo (): string {
    return this.titulo
  }

  getCriadoPor (): string {
    return this.criadoPor
  }

  getDocumento (): string|null {
    return this.documento
  }

  getEditadoPor (): string|null {
    return this.editadoPor
  }

  getEditadoEm (): Date|null {
    return this.editadoEm
  }

  getCriadoEm (): Date {
    return this.criadoEm
  }

  validar (): void {
    if (this.id.length === 0) {
      throw new Error('O id é obrigatório')
    }

    if (this.titulo.length === 0) {
      throw new Error('O título é obrigatório')
    }

    if (this.documento.length === 0) {
      throw new Error('O documento é obrigatório')
    }

    if (this.criadoPor.length === 0) {
      throw new Error('O usuário é obrigatório')
    }
  }

  modificarTitulo (titulo: string, editadoPor: string): void {
    this.titulo = titulo
    this.editadoPor = editadoPor
    this.editadoEm = new Date()
    this.validar()
  }

  modificarDocumento (documento: string, editadoPor: string): void {
    this.documento = documento
    this.editadoPor = editadoPor
    this.editadoEm = new Date()
    this.validar()
  }
}
