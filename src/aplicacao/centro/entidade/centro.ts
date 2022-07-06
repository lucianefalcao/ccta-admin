export default class Centro {
  constructor (
    private id: string,
    private descricao: string,
    private usuario: string,
    private ultimaModificacao?: Date
  ) {
    this.ultimaModificacao = new Date()
    this.validar()
  }

  getId (): string {
    return this.id
  }

  getDescricao (): string {
    return this.descricao
  }

  getUsuario (): string {
    return this.usuario
  }

  getUltimaModificacao (): Date {
    return this.ultimaModificacao
  }

  validar (): void {
    if (this.id.length === 0) {
      throw new Error('O id é obrigatório')
    }

    if (this.descricao.length === 0) {
      throw new Error('A descrição do centro é obrigatória')
    }

    if (this.usuario.length === 0) {
      throw new Error('O usuário é obrigatório')
    }
  }

  modificarDescricao (descricao: string, usuario: string): void {
    this.descricao = descricao
    this.ultimaModificacao = new Date()
    this.usuario = usuario
    this.validar()
  }
}
