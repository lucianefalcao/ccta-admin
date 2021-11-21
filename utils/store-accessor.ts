import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import userModule from '@/store/users'
import newsModule from '@/store/news'
import editaisModule from '@/store/editais'

let userStore: userModule
let newsStore: newsModule
let editaisStore: editaisModule

function initialiseStores (store: Store<any>): void {
  userStore = getModule(userModule, store)
  newsStore = getModule(newsModule, store)
  editaisStore = getModule(editaisModule, store)
}

export { initialiseStores, userStore, newsStore, editaisStore }
