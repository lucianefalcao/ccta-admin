import { Action, Module, VuexModule, Mutation } from 'vuex-module-decorators'
import firebase from 'firebase/compat'
import Evento from '~/src/aplicacao/eventos/entidade/evento'
import EventoRepositorio from '~/src/infra/eventos/evento-repositorio'

@Module({ name: 'eventos', stateFactory: true, namespaced: true })
export default class EventosModule extends VuexModule {
  ultimoDocumento: firebase.firestore.QuerySnapshot
  eventoSelecionado: Evento

  @Mutation
  setUltimoDocumento (documento: firebase.firestore.QuerySnapshot): void {
    this.ultimoDocumento = documento
  }

  @Mutation
  setEventoSelecionado (evento: Evento): void {
    this.eventoSelecionado = evento
  }

  @Action({ rawError: true })
  async deletar (id: string): Promise<void> {
    const repositorio = new EventoRepositorio(this.store.$fire)
    await repositorio.deletar(id)
  }

  @Action({ rawError: true })
  async getItens ({ paginaAtual, paginaAnterior, itensPorPagina }: { paginaAtual: number, paginaAnterior: number, itensPorPagina: number }): Promise<Evento[]> {
    const repositorio = new EventoRepositorio(this.store.$fire)
    return await repositorio.getItensPaginados(
      paginaAtual,
      paginaAnterior,
      itensPorPagina,
      this.context.rootState.eventos.ultimoDocumento
    )
  }

  @Action({ rawError: true })
  async getEventoPorId (id: string): Promise<Evento> {
    const repositorio = new EventoRepositorio(this.store.$fire)
    return await repositorio.get(id)
  }

  @Action({ rawError: true })
  async criar (evento: Evento): Promise<void> {
    const repositorio = new EventoRepositorio(this.store.$fire)
    await repositorio.criar(evento)
  }

  @Action({ rawError: true })
  async atualizar (evento: Evento): Promise<void> {
    const repositorio = new EventoRepositorio(this.store.$fire)
    await repositorio.atualizar(evento)
  }
}
