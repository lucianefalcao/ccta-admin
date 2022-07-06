export enum CursoTipo {
  GRADUACAO = 'graduacao',
  POS_GRADUACAO = 'pos-graduacao'
}

export enum CursoSubTipoPosGraduacao {
  MBA = 'mba',
  ESPECIALIZACAO = 'especializacao',
  MESTRADO = 'mestrado',
  DOUTURADO = 'Doutorado',
  POS_DOUTORADO = 'pos-doutorado'
}

export enum CursoSubTipoGraduacao {
  BACHARELADO = 'bacharelado',
  LICENCIATURA = 'licenciatura',
  TECNOLOGO = 'tecnologo',
}

export enum CursoTurno {
  MANHA = 'M',
  TARDE = 'T',
  INTEGRAL = 'I',
  NOITE = 'N'
}

export default class Curso {
  constructor (
    private id: string,
    private nome: string,
    private descricao: string,
    private tipo: CursoTipo,
    private subtipo: CursoSubTipoGraduacao|CursoSubTipoPosGraduacao,
    private nrPeriodos: number,
    private usuario: string,
    private turno?: CursoTurno,
    private ultimaModificacao?: Date
  ) {
    this.ultimaModificacao = new Date()
    this.validar()
  }

  getId (): string {
    return this.id
  }

  getNome (): string {
    return this.nome
  }

  getUsuario (): string {
    return this.usuario
  }

  getDescricao (): string|null {
    return this.descricao
  }

  getTipo (): CursoTipo|null {
    return this.tipo
  }

  getSubtipo (): CursoSubTipoGraduacao|CursoSubTipoPosGraduacao {
    return this.subtipo
  }

  getTurno (): CursoTurno|null {
    return this.turno
  }

  getPeriodos (): number {
    return this.nrPeriodos
  }

  getUltimaModificacao (): Date {
    return this.ultimaModificacao
  }

  validar (): void {
    if (this.id.length === 0) {
      throw new Error('O id é obrigatório')
    }

    if (this.nome.length === 0) {
      throw new Error('O nome é obrigatório')
    }

    if (this.descricao.length === 0) {
      throw new Error('A descrição é obrigatória')
    }

    if (this.usuario.length === 0) {
      throw new Error('O usuário é obrigatório')
    }

    if (!this.tipo) {
      throw new Error('O tipo é obrigatório')
    }

    if (!this.subtipo) {
      throw new Error('O subtipo é obrigatório')
    }

    if (this.tipo === CursoTipo.GRADUACAO && Object.values(CursoSubTipoGraduacao).every(v => v !== this.subtipo)) {
      throw new Error('O subtipo deve ser do tipo "Graduação"')
    }

    if (this.tipo === CursoTipo.POS_GRADUACAO && Object.values(CursoSubTipoPosGraduacao).every(v => v !== this.subtipo)) {
      throw new Error('O subtipo deve ser do tipo "Pós-Graduação"')
    }

    if (this.nrPeriodos === 0) {
      throw new Error('O número de períodos é obrigatório')
    }
  }

  modificarNome (nome: string, usuario: string): void {
    this.nome = nome
    this.ultimaModificacao = new Date()
    this.usuario = usuario
    this.validar()
  }

  modificarDescricao (descricao: string, usuario: string): void {
    this.descricao = descricao
    this.ultimaModificacao = new Date()
    this.usuario = usuario
    this.validar()
  }

  modificarTipo (tipo: CursoTipo, usuario: string): void {
    this.tipo = tipo
    this.ultimaModificacao = new Date()
    this.usuario = usuario
    this.validar()
  }

  modificarSubtipo (subtipo: CursoSubTipoGraduacao|CursoSubTipoPosGraduacao, usuario: string): void {
    this.subtipo = subtipo
    this.ultimaModificacao = new Date()
    this.usuario = usuario
    this.validar()
  }

  modificarTurno (turno: CursoTurno, usuario: string): void {
    this.turno = turno
    this.ultimaModificacao = new Date()
    this.usuario = usuario
    this.validar()
  }

  modificarPeriodos (periodos: number, usuario: string): void {
    this.nrPeriodos = periodos
    this.ultimaModificacao = new Date()
    this.usuario = usuario
    this.validar()
  }
}
