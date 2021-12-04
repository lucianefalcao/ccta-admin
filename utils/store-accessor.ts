import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import userModule from '@/store/users'
import newsModule from '@/store/news'
import editaisModule from '@/store/editais'
import eventsModule from '@/store/events'
import centerModule from '@/store/center'
import courseModule from '@/store/course'
import permissionModule from '@/store/permission'
import menuModule from '@/store/menu'
import chatModule from '@/store/chats'

let userStore: userModule
let newsStore: newsModule
let editaisStore: editaisModule
let eventsStore: eventsModule
let centerStore: centerModule
let courseStore: courseModule
let permissionStore: permissionModule
let menuStore: menuModule
let chatStore: chatModule

function initialiseStores (store: Store<any>): void {
  userStore = getModule(userModule, store)
  newsStore = getModule(newsModule, store)
  editaisStore = getModule(editaisModule, store)
  eventsStore = getModule(eventsModule, store)
  centerStore = getModule(centerModule, store)
  courseStore = getModule(courseModule, store)
  permissionStore = getModule(permissionModule, store)
  menuStore = getModule(menuModule, store)
  chatStore = getModule(chatModule, store)
}

export { initialiseStores, userStore, newsStore, editaisStore, eventsStore, centerStore, courseStore, permissionStore, menuStore, chatStore }
