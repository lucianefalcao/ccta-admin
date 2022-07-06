import validator from 'validator'

export enum UsuarioEstado {
  ATIVO = 'A',
  INATIVO = 'I'
}

export enum Permissao {
  GERENCIAR_NOTICIAS = 'gerenciar-noticias',
  GERENCIAR_EVENTOS = 'gerenciar-eventos',
  GERENCIAR_EDITAIS = 'gerenciar-editais',
  GERENCIAR_USUARIOS = 'gerenciar-usuarios',
  GERENCIAR_CHAT = 'gerenciar-chat',
  GERENCIAR_CENTRO = 'gerenciar-info-centro',
  GERENCIAR_CURSOS = 'gerenciar-cursos',
}

export default class Usuario {
  constructor (
    private id: string,
    private nome: string,
    private email: string,
    private permissoes: Permissao[] = [],
    private estado: UsuarioEstado = UsuarioEstado.ATIVO
  ) {
    this.validar()
  }

  getId (): string {
    return this.id
  }

  getNome (): string {
    return this.nome
  }

  getEmail (): string {
    return this.email
  }

  getPermissoes (): Permissao[] {
    return this.permissoes
  }

  estaAtivo (): boolean {
    return this.estado === UsuarioEstado.ATIVO
  }

  validar (): void {
    if (this.id.length === 0) {
      throw new Error('O id é obrigatório')
    }

    if (this.nome.length === 0) {
      throw new Error('O nome é obrigatório')
    }

    if (this.email.length === 0) {
      throw new Error('O email é obrigatório')
    }

    if (!validator.isEmail(this.email)) {
      throw new Error('O email é inválido')
    }
  }

  mudarNome (nome: string): void {
    this.nome = nome
    this.validar()
  }

  mudarEmail (email: string): void {
    this.email = email
    this.validar()
  }

  modificarPermissoes (permissoes: Permissao[]): void {
    this.permissoes = permissoes
    this.validar()
  }

  adicionarPermissao (codigo: Permissao): void {
    if (!this.permissoes.includes(codigo)) {
      this.permissoes.push(codigo)
    }
  }

  removerPermissao (codigo: Permissao): void {
    if (this.permissoes.includes(codigo)) {
      this.permissoes = this.permissoes.filter((permissao: Permissao) =>
        permissao !== codigo
      )
    }
  }

  ativar (): void {
    this.estado = UsuarioEstado.ATIVO
  }

  inativar (): void {
    this.estado = UsuarioEstado.INATIVO
  }
}
