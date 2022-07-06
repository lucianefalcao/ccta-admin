import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import firebase from 'firebase/compat'
import CursoRepositorio from '~/src/infra/cursos/curso-repositorio'
import Curso from '~/src/aplicacao/cursos/entidade/curso'

@Module({ name: 'cursos', stateFactory: true, namespaced: true })
export default class CursosModule extends VuexModule {
  ultimoDocumento: firebase.firestore.QuerySnapshot
  cursoSelecionado: Curso

  @Mutation
  setUltimoDocumento (documento: firebase.firestore.QuerySnapshot): void {
    this.ultimoDocumento = documento
  }

  @Mutation
  setCursoSelecionado (curso: Curso): void {
    this.cursoSelecionado = curso
  }

  @Action({ rawError: true })
  async criar (curso: Curso): Promise<void> {
    const repositorio = new CursoRepositorio(this.store.$fire)
    return await repositorio.criar(curso)
  }

  @Action({ rawError: true })
  async atualizar (curso: Curso): Promise<void> {
    const repositorio = new CursoRepositorio(this.store.$fire)
    return await repositorio.atualizar(curso)
  }

  @Action({ rawError: true })
  async getCursoPorId (id: string): Promise<Curso> {
    const repositorio = new CursoRepositorio(this.store.$fire)
    return await repositorio.get(id)
  }

  @Action({ rawError: true })
  async getItens ({ paginaAtual, paginaAnterior, itensPorPagina }: { paginaAtual: number, paginaAnterior: number, itensPorPagina: number }): Promise<Curso[]> {
    const repositorio = new CursoRepositorio(this.store.$fire)
    return await repositorio.getItensPaginados(
      paginaAtual,
      paginaAnterior,
      itensPorPagina,
      this.context.rootState.editais.ultimoDocumento
    )
  }

  @Action({ rawError: true })
  async deletar (id: string): Promise<void> {
    const repositorio = new CursoRepositorio(this.store.$fire)
    await repositorio.deletar(id)
  }
}
