export enum MembroTipo {
  ATENDENTE = 'A',
  VISITANTE = 'V'
}

export default class Membro {
  constructor (private id: string, private nome: string, private tipo: MembroTipo, private chatId: string) {
    this.validar()
  }

  getId (): string {
    return this.id
  }

  getTipo (): MembroTipo {
    return this.tipo
  }

  getNome (): string {
    return this.nome
  }

  getChatId (): string {
    return this.chatId
  }

  validar (): void {
    if (this.id.length === 0) {
      throw new Error('O id é obrigatório')
    }

    if (this.nome.length === 0) {
      throw new Error('O nome do usuário é obrigatório')
    }

    if (this.tipo.length === 0) {
      throw new Error('O tipo do usuário é obrigatório')
    }

    if (Object.values(MembroTipo).every(v => v !== this.tipo)) {
      throw new Error('O tipo do usuário é inválido')
    }
  }
}
