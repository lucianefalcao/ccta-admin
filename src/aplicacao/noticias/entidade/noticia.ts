export enum NoticiaEstado {
  RASCUNHO = 'rascunho',
  PUBLICADO = 'publicado'
}

export default class Noticia {
  constructor (
    private id: string,
    private titulo: string,
    private texto: string,
    private estado: NoticiaEstado = NoticiaEstado.RASCUNHO,
    private criadoPor: string,
    private criadoEm?: Date,
    private publicadoEm?: Date,
    private publicadoPor?: string,
    private capa?: string,
    private editadoPor?: string,
    private editadoEm?: Date
  ) {
    this.criadoEm = this.criadoEm ?? new Date()
    this.validar()
  }

  getId (): string {
    return this.id
  }

  getTitulo (): string {
    return this.titulo
  }

  getTexto (): string {
    return this.texto
  }

  getCriadoPor (): string {
    return this.criadoPor
  }

  getCriadoEm (): Date {
    return this.criadoEm
  }

  getEstado (): NoticiaEstado {
    return this.estado
  }

  getPublicadoEm (): Date|null {
    return this.publicadoEm
  }

  getPublicadoPor (): string|null {
    return this.publicadoPor
  }

  getEditadoPor (): string|null {
    return this.editadoPor
  }

  getEditadoEm (): Date|null {
    return this.editadoEm
  }

  getCapa (): string|null {
    return this.capa
  }

  validar (): void {
    if (this.id.length === 0) {
      throw new Error('O id é obrigatório')
    }

    if (this.titulo.length === 0) {
      throw new Error('O título é obrigatório')
    }

    if (this.texto.length === 0) {
      throw new Error('O texto é obrigatório')
    }

    if (this.criadoPor.length === 0) {
      throw new Error('O usuário é obrigatório')
    }
  }

  publicar (publicadoPor: string): void {
    this.estado = NoticiaEstado.PUBLICADO
    this.publicadoEm = new Date()
    this.publicadoPor = publicadoPor
    this.validar()
  }

  modificarTitulo (titulo: string, editadoPor: string): void {
    this.titulo = titulo
    this.editadoPor = editadoPor
    this.editadoEm = new Date()
    this.validar()
  }

  modificarTexto (texto: string, editadoPor: string): void {
    this.texto = texto
    this.editadoPor = editadoPor
    this.editadoEm = new Date()
    this.validar()
  }

  modificarCapa (caminho: string|null, editadoPor: string): void {
    this.capa = caminho
    this.editadoPor = editadoPor
    this.editadoEm = new Date()
    this.validar()
  }
}
