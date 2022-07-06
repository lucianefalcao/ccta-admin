export default class UsuarioNaoExisteErro extends Error {
  constructor () {
    super('Não foi encontrado nenhum usuário com os dados informados.')
    this.name = 'UsuarioNaoExisteErro'
  }
}
