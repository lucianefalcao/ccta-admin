import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import Membro from '~/src/aplicacao/chat/objeto-valor/membro'
import ChatRepositorio from '~/src/infra/chats/chat-repositorio'
import Chat from '~/src/aplicacao/chat/entidade/chat'
import Mensagem from '~/src/aplicacao/chat/objeto-valor/mensagem'

@Module({ name: 'chats', stateFactory: true, namespaced: true })
export default class ChatsModule extends VuexModule {
  mensagens: Mensagem[]
  membros: Membro[]

  @Mutation
  setMensagens (mensagens: Mensagem[]): void {
    this.mensagens = mensagens
  }

  @Mutation
  setMembros (membros: Membro[]): void {
    this.membros = membros
  }

  @Action({ rawError: true })
  async getMembros (): Promise<Membro[]> {
    const repositorio = new ChatRepositorio(this.store.$fire)
    return await repositorio.getMembros()
  }

  @Action({ rawError: true })
  async getChat (id: string): Promise<Chat> {
    const repositorio = new ChatRepositorio(this.store.$fire)
    return await repositorio.get(id)
  }

  @Action({ rawError: true })
  async getMensagens (id: string): Promise<Mensagem[]> {
    const repositorio = new ChatRepositorio(this.store.$fire)
    return await repositorio.getMensagens(id)
  }

  @Action({ rawError: true })
  async enviarMensagem (mensagem: Mensagem): Promise<void> {
    const repositorio = new ChatRepositorio(this.store.$fire)
    await repositorio.enviarMensagem(mensagem)
  }

  @Action({ rawError: true })
  async encerrarChat (id: string): Promise<void> {
    const repositorio = new ChatRepositorio(this.store.$fire)
    await repositorio.encerrarChat(id)
    this.context.commit('setMensagens', [])
  }

  @Action({ rawError: true })
  async entrarNoAtendimento (membro: Membro): Promise<void> {
    const repositorio = new ChatRepositorio(this.store.$fire)
    await repositorio.entrarNoAtendimento(membro)
  }
}
