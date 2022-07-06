export default class MultiplosUsuariosErro extends Error {
  constructor () {
    super('Existem múltiplos usuários com o mesmo email')
    this.name = 'MultiplosUsuariosError'
  }
}
