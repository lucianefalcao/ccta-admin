export default class Evento {
  constructor (
    private id: string,
    private titulo: string,
    private descricao: string,
    private criadoPor: string,
    private data: Date,
    private criadoEm?: Date,
    private editadoPor?: string,
    private editadoEm?: Date
  ) {
    this.criadoEm = criadoEm ?? new Date()
    this.validar()
  }

  getId (): string {
    return this.id
  }

  getTitulo (): string {
    return this.titulo
  }

  getDescricao (): string {
    return this.descricao
  }

  getCriadoPor (): string {
    return this.criadoPor
  }

  getCriadoEm (): Date {
    return this.criadoEm
  }

  getData (): Date|null {
    return this.data
  }

  getEditadoPor (): string|null {
    return this.editadoPor
  }

  getEditadoEm (): Date|null {
    return this.editadoEm
  }

  validar (): void {
    if (this.id.length === 0) {
      throw new Error('O id é obrigatório')
    }

    if (this.titulo.length === 0) {
      throw new Error('O título é obrigatório')
    }

    if (this.descricao.length === 0) {
      throw new Error('A descrição é obrigatória')
    }

    if (this.criadoPor.length === 0) {
      throw new Error('O usuário é obrigatório')
    }

    if (!this.data) {
      throw new Error('A data é obrigatória')
    }
  }

  modificarTitulo (titulo: string, editadoPor: string): void {
    this.titulo = titulo
    this.editadoPor = editadoPor
    this.editadoEm = new Date()
    this.validar()
  }

  modificarDescricao (descricao: string, editadoPor: string): void {
    this.descricao = descricao
    this.editadoPor = editadoPor
    this.editadoEm = new Date()
    this.validar()
  }

  modificarData (data: Date, editadoPor: string): void {
    this.data = data
    this.editadoPor = editadoPor
    this.editadoEm = new Date()
    this.validar()
  }
}
