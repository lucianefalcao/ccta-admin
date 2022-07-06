export default class Chat {
  constructor (
      private id: string,
      private ultimaMensagem: string,
      private data: Date
  ) {
    this.validar()
  }

  getId (): string {
    return this.id
  }

  getUltimaMensagem (): string {
    return this.ultimaMensagem
  }

  getData (): Date {
    return this.data
  }

  validar (): void {
    if (this.id.length === 0) {
      throw new Error('O id é obrigatório')
    }

    if (this.ultimaMensagem.length === 0) {
      throw new Error('A última mensagem é obrigatória')
    }

    if (!this.data) {
      throw new Error('O data é inválida')
    }
  }

  modificarUltimaMensagem (mensagem: string, data: Date): void {
    this.ultimaMensagem = mensagem
    this.data = data
    this.validar()
  }
}
