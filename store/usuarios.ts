import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import firebase from 'firebase/compat'
import Usuario from '~/src/aplicacao/usuarios/entidade/usuario'
import UsuarioRepositorio from '~/src/infra/usuarios/usuario-repositorio'
import { menuStore } from '~/store'

@Module({ name: 'usuarios', stateFactory: true, namespaced: true })
export default class UsuariosModule extends VuexModule {
  ultimoDocumento: firebase.firestore.QuerySnapshot
  usuario: Usuario = null

  @Mutation
  setUsuario (usuario: Usuario): void {
    this.usuario = usuario
  }

  @Mutation
  setUltimoDocumento (documento: firebase.firestore.QuerySnapshot): void {
    this.ultimoDocumento = documento
  }

  @Action({ rawError: true })
  async login ({ email, senha }:{email: string, senha: string}): Promise<void> {
    const credencial = await this.store.$fire.auth.signInWithEmailAndPassword(email, senha)
    const usuarioRepositorio = new UsuarioRepositorio(this.store.$fire)
    const usuario = await usuarioRepositorio.get(credencial.user.uid)
    this.context.commit('setUsuario', usuario)
  }

  @Action({ rawError: true })
  async verificarEmail (email: string): Promise<Usuario> {
    const usuarioRepositorio = new UsuarioRepositorio(this.store.$fire)
    return await usuarioRepositorio.getUsuarioPorEmail(email)
  }

  @Action({ rawError: true })
  async criarSenha ({ senha, uid }: {senha: string, uid: string}): Promise<void> {
    const usuarioRepositorio = new UsuarioRepositorio(this.store.$fire)
    await usuarioRepositorio.criarSenha(senha, uid)
  }

  @Action({ rawError: true })
  async getUsuarioPorId (id: string): Promise<Usuario> {
    const repositorio = new UsuarioRepositorio(this.store.$fire)
    return await repositorio.get(id)
  }

  @Action({ rawError: true })
  async atualizar ({ usuario, senha }: {usuario: Usuario, senha: string}): Promise<void> {
    const repositorio = new UsuarioRepositorio(this.store.$fire)
    await repositorio.atualizarUsuario(usuario, senha)
  }

  @Action({ rawError: true })
  async getItens ({ paginaAtual, paginaAnterior, itensPorPagina }: { paginaAtual: number, paginaAnterior: number, itensPorPagina: number }): Promise<Usuario[]> {
    const repositorio = new UsuarioRepositorio(this.store.$fire)
    return await repositorio.getItensPaginados(
      paginaAtual,
      paginaAnterior,
      itensPorPagina,
      this.context.rootState.eventos.ultimoDocumento
    )
  }

  @Action({ rawError: true })
  async criarUsuario (usuario: Usuario): Promise<void> {
    const repositorio = new UsuarioRepositorio(this.store.$fire)
    await repositorio.criar(usuario)
  }

  @Action({ rawError: true })
  async deletar (usuario: Usuario): Promise<void> {
    const repositorio = new UsuarioRepositorio(this.store.$fire)
    await repositorio.deletar(usuario)
  }

  @Action({ rawError: true })
  async atualizarPermissoes (usuario: Usuario): Promise<void> {
    const repositorio = new UsuarioRepositorio(this.store.$fire)
    await repositorio.atualizarPermissoes(usuario)
  }

  @Action({ rawError: true })
  async onAuthStateChanged ({ authUser }: { authUser: any }): Promise<void> {
    if (authUser) {
      const usuarioRepositorio = new UsuarioRepositorio(this.store.$fire)
      const usuario = await usuarioRepositorio.get(authUser.uid)
      this.context.commit('setUsuario', usuario)

      await menuStore.definirItensMenu(usuario)

      const userStatusDatabaseRef = this.store.$fire.database.ref('/status/' + authUser.uid)

      this.store.$fire.database.ref('.info/connected').on('value', async (snapshot: any) => {
        if (snapshot.val() !== false) {
          await userStatusDatabaseRef.onDisconnect().set({
            isOnline: false,
            last_changed: this.store.$fireModule.database.ServerValue.TIMESTAMP
          })

          userStatusDatabaseRef.set({
            isOnline: true,
            last_changed: this.store.$fireModule.database.ServerValue.TIMESTAMP
          })
        }
      })
    } else {
      this.context.commit('setUsuario', null)
    }
  }
}
