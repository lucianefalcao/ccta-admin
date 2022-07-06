import RepositorioInterface from '../../@shared/repositorio-interface'
import Usuario from '../entidade/usuario'

export default interface UsuarioRepositorioInterface extends RepositorioInterface<Usuario> {
  getUsuarioPorEmail(email: string): Promise<Usuario>
  criarSenha (senha: string, uid: string): Promise<void>
  getPermissoes (usuarioId: string): Promise<string[]>
  atualizarUsuario (entidade: Usuario, senha: string)
}
