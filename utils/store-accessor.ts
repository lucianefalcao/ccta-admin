import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import user from '@/store/users'
import newsModule from '@/store/news'

let userStore: user
let newsStore: newsModule

function initialiseStores (store: Store<any>): void {
  userStore = getModule(user, store)
  newsStore = getModule(newsModule, store)
}

export { initialiseStores, userStore, newsStore }
