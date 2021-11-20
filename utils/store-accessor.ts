import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import userModule from '@/store/users'
import newsModule from '@/store/news'

let userStore: userModule
let newsStore: newsModule

function initialiseStores (store: Store<any>): void {
  userStore = getModule(userModule, store)
  newsStore = getModule(newsModule, store)
}

export { initialiseStores, userStore, newsStore }
