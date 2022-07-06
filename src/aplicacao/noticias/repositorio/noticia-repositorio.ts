import RepositorioInterface from '../../@shared/repositorio-interface'
import Noticia from '../entidade/noticia'

export default interface NoticiaRepositorioInterface extends RepositorioInterface<Noticia> {
  getCapa(caminho: string): Promise<string>
  adicionarCapa(capa: File): Promise<void>
  deletarCapa (caminho: string): Promise<void>
  criarNoticia(noticia: Noticia, capa: File): Promise<void>
}
