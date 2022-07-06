import { NuxtFireInstance } from '@nuxtjs/firebase'
import Chat from '~/src/aplicacao/chat/entidade/chat'
import Membro, { MembroTipo } from '~/src/aplicacao/chat/objeto-valor/membro'
import ChatRepositorioInterface from '~/src/aplicacao/chat/repositorio/chat-repositorio'
import Mensagem from '~/src/aplicacao/chat/objeto-valor/mensagem'

export default class ChatRepositorio implements ChatRepositorioInterface {
  constructor (private db: NuxtFireInstance) {}

  async get (id: string): Promise<Chat> {
    const chatRef = this.db.database.ref(`chats/${id}`)

    let chat: Chat
    await chatRef.once('value', (snapshot) => {
      if (snapshot.exists()) {
        chat = new Chat(
          snapshot.key,
          snapshot.val().ultimaMensagem,
          new Date(snapshot.val().timestamp)
        )
      }
    })

    return chat
  }

  async getMembros (): Promise<Membro[]> {
    let membros = []
    await this.db.database.ref('membros/').on('value', (snapshot) => {
      if (snapshot.exists()) {
        const mbs = []
        snapshot.forEach((snap) => {
          mbs.push(
            new Membro(
              snap.val().visitante.id,
              snap.val().visitante.nome,
              MembroTipo.VISITANTE,
              snap.key
            )
          )

          if (snapshot.val().atendente) {
            mbs.push(
              new Membro(
                snap.val().atendente.id,
                snap.val().atendente.nome,
                MembroTipo.ATENDENTE,
                snap.key
              )
            )
          }

          membros = mbs
        })
      }
    })

    // const auxiliar = membros

    return membros
  }

  async getMensagens (chatId: string): Promise<Mensagem[]> {
    const mensagens = []
    await this.db.database.ref(`mensagens/${chatId}`)
      .orderByChild('timestamp')
      .limitToLast(50)
      .on('child_added', (snapshot) => {
        if (snapshot.exists()) {
          mensagens.push(
            new Mensagem(
              snapshot.key,
              snapshot.val().membro,
              snapshot.val().mensagem,
              new Date(snapshot.val().timestamp),
              snapshot.key
            )
          )
        }
      })
    return mensagens
  }

  async enviarMensagem (mensagem: Mensagem): Promise<void> {
    const mensagemRef = this.db.database.ref(`mensagens/${mensagem.getChatId()}`)
    await mensagemRef.push({
      mensagem: mensagem.getTexto(),
      membro: mensagem.getMembro(),
      timestamp: mensagem.getData().getTime()
    })

    const chatRef = this.db.database.ref(`chats/${mensagem.getChatId()}`)
    await chatRef.update({
      ultimaMensagem: mensagem.getTexto(),
      timestamp: mensagem.getData().getTime()
    })
  }

  async encerrarChat (id: string): Promise<void> {
    await this.db.database.ref(`chats/${id}`).remove()
    await this.db.database.ref(`membros/${id}`).remove()
    await this.db.database.ref(`mensagens/${id}`).remove()
  }

  async entrarNoAtendimento (membro: Membro): Promise<void> {
    const membroRef = this.db.database.ref(`membros/${membro.getChatId()}/atendente`)
    await membroRef.set({
      id: membro.getId(),
      nome: membro.getNome()
    })
  }
}
