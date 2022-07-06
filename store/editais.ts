import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import firebase from 'firebase/compat'
import Edital from '~/src/aplicacao/editais/entidade/edital'
import EditalRepositorio from '~/src/infra/editais/edital-repositorio'

@Module({ name: 'editais', stateFactory: true, namespaced: true })
export default class EditaisModule extends VuexModule {
  ultimoDocumento: firebase.firestore.QuerySnapshot
  editalSelecionado: Edital

  @Mutation
  setUltimoDocumento (documento: firebase.firestore.QuerySnapshot): void {
    this.ultimoDocumento = documento
  }

  @Mutation
  setEditalSelecionado (edital: Edital): void {
    this.editalSelecionado = edital
  }

  @Action({ rawError: true })
  async criar ({ edital, documento }: {edital: Edital, documento: File}): Promise<void> {
    const repositorio = new EditalRepositorio(this.store.$fire)
    await repositorio.criarEvento(edital, documento)
  }

  @Action({ rawError: true })
  async getEditalPorId (id: string): Promise<Edital> {
    const repositorio = new EditalRepositorio(this.store.$fire)
    return await repositorio.get(id)
  }

  @Action({ rawError: true })
  async getItens ({ paginaAtual, paginaAnterior, itensPorPagina }: { paginaAtual: number, paginaAnterior: number, itensPorPagina: number }): Promise<Edital[]> {
    const repositorio = new EditalRepositorio(this.store.$fire)
    return await repositorio.getItensPaginados(
      paginaAtual,
      paginaAnterior,
      itensPorPagina,
      this.context.rootState.editais.ultimoDocumento
    )
  }

  @Action({ rawError: true })
  async atualizar ({ edital, novoDocumento }: {edital: Edital, novoDocumento: File|null}): Promise<void> {
    const repositorio = new EditalRepositorio(this.store.$fire)
    await repositorio.atualizarEvento(edital, novoDocumento)
  }

  @Action({ rawError: true })
  async deletar (edital: Edital): Promise<void> {
    const repositorio = new EditalRepositorio(this.store.$fire)
    await repositorio.deletar(edital)
  }

  @Action({ rawError: true })
  async getDocumentoLink (documento: string): Promise<string> {
    const repositorio = new EditalRepositorio(this.store.$fire)
    return await repositorio.baixarDocumento(documento)
  }

  @Action({ rawError: true })
  async deletarDocumento (documento: string): Promise<void> {
    const repositorio = new EditalRepositorio(this.store.$fire)
    await repositorio.deletarDocumento(documento)
  }
}
