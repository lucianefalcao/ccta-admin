import RepositorioInterface from '../../@shared/repositorio-interface'
import Edital from '../entidade/edital'

export default interface EditalRepositorioInterface extends RepositorioInterface<Edital> {
  baixarDocumento(caminho: string): Promise<string>
  adicionarDocumento(documento: File): Promise<void>
  deletarDocumento (caminho: string): Promise<void>
  criarEvento(edital: Edital, documento: File): Promise<void>
}
