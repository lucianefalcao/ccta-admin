import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import firebase from 'firebase/compat'
import Noticia from '~/src/aplicacao/noticias/entidade/noticia'
import NoticiaRepositorio from '~/src/infra/noticias/noticia-repositorio'

@Module({ name: 'noticias', stateFactory: true, namespaced: true })
export default class NoticiasModule extends VuexModule {
  ultimoDocumento: firebase.firestore.QuerySnapshot
  noticiaSelecionada: Noticia

  @Mutation
  setUltimoDocumento (documento: firebase.firestore.QuerySnapshot): void {
    this.ultimoDocumento = documento
  }

  @Mutation
  setNoticiaSelecionada (noticia: Noticia): void {
    this.noticiaSelecionada = noticia
  }

  @Action({ rawError: true })
  async getNoticiaPorId (id: string): Promise<Noticia> {
    const repositorio = new NoticiaRepositorio(this.store.$fire)
    return await repositorio.get(id)
  }

  @Action({ rawError: true })
  async criar ({ noticia, capa }: {noticia: Noticia, capa: File|null}): Promise<void> {
    const repositorio = new NoticiaRepositorio(this.store.$fire)
    await repositorio.criarNoticia(noticia, capa)
  }

  @Action({ rawError: true })
  async atualizar ({ noticia, capa }: {noticia: Noticia, capa: File|null}): Promise<void> {
    const repositorio = new NoticiaRepositorio(this.store.$fire)
    await repositorio.atualizarNoticia(noticia, capa)
  }

  @Action({ rawError: true })
  async getItens ({ paginaAtual, paginaAnterior, itensPorPagina }: { paginaAtual: number, paginaAnterior: number, itensPorPagina: number }): Promise<Noticia[]> {
    const repositorio = new NoticiaRepositorio(this.store.$fire)
    return await repositorio.getItensPaginados(
      paginaAtual,
      paginaAnterior,
      itensPorPagina,
      this.context.rootState.editais.ultimoDocumento
    )
  }

  @Action({ rawError: true })
  async deletar (noticia: Noticia): Promise<void> {
    const repositorio = new NoticiaRepositorio(this.store.$fire)
    await repositorio.deletar(noticia)
  }

  @Action({ rawError: true })
  async deletarCapa (capa: string): Promise<void> {
    const repositorio = new NoticiaRepositorio(this.store.$fire)
    await repositorio.deletarCapa(capa)
  }

  @Action({ rawError: true })
  async getCapaLink (capa: string): Promise<string> {
    const repositorio = new NoticiaRepositorio(this.store.$fire)
    return await repositorio.getCapa(capa)
  }
}
