import Chat from '../entidade/chat'
import Membro from '../objeto-valor/membro'
import Mensagem from '../objeto-valor/mensagem'

export default interface ChatRepositorioInterface {
  get (id: string): Promise<Chat>
  getMembros (): Promise<Membro[]>
  getMensagens (chatId: string): Promise<Mensagem[]>
  enviarMensagem (mensagem: Mensagem): Promise<void>
  encerrarChat (id: string): Promise<void>
  entrarNoAtendimento (membro: Membro): Promise<void>
}
