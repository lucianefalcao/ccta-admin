import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import UsuariosModule from '~/store/usuarios'
import MenuModule from '~/store/menu'
import EventosModule from '~/store/eventos'
import EditaisModule from '~/store/editais'
import CentroModule from '~/store/centro'
import CursosModule from '~/store/cursos'
import MoticiasModule from '~/store/noticias'
import ChatsModule from '~/store/chats'

let usuarioStore: UsuariosModule
let menuStore: MenuModule
let eventoStore: EventosModule
let editalStore: EditaisModule
let centroStore: CentroModule
let cursoStore: CursosModule
let noticiaStore: MoticiasModule
let chatStore: ChatsModule

function initialiseStores (store: Store<any>): void {
  usuarioStore = getModule(UsuariosModule, store)
  menuStore = getModule(MenuModule, store)
  eventoStore = getModule(EventosModule, store)
  editalStore = getModule(EditaisModule, store)
  centroStore = getModule(CentroModule, store)
  cursoStore = getModule(CursosModule, store)
  noticiaStore = getModule(MoticiasModule, store)
  chatStore = getModule(ChatsModule, store)
}

export { initialiseStores, usuarioStore, menuStore, eventoStore, editalStore, centroStore, cursoStore, noticiaStore, chatStore }
