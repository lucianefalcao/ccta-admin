export default class Mensagem {
  constructor (
      private id: string,
      private membro: string,
      private texto: string,
      private data: Date,
      private chatId: string
  ) {
    this.validar()
  }

  getId (): string {
    return this.id
  }

  getTexto (): string {
    return this.texto
  }

  getData (): Date {
    return this.data
  }

  getMembro (): string {
    return this.membro
  }

  getChatId (): string {
    return this.chatId
  }

  validar (): void {
    if (this.id.length === 0) {
      throw new Error('O id é obrigatório')
    }

    if (this.texto.length === 0) {
      throw new Error('O texto da mensagem é obrigatório')
    }

    if (!this.data) {
      throw new Error('O data é inválida')
    }

    if (!this.membro) {
      throw new Error('O membro é obrigatório')
    }
  }
}
