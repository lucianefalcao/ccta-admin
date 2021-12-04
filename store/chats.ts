import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { requestAndShowPermission } from '@/utils/notification'

@Module({ name: 'chats', stateFactory: true, namespaced: true })
export default class ChatsModule extends VuexModule {
  chats: any = []

  @Mutation
  setChats (chats: any) {
    this.chats = chats
  }

  @Action({ rawError: true })
  async fetchChats () {
    const chatsRef = this.store.$fire.database.ref('chats')

    await chatsRef.on('value', (snapshot: any) => {
      if (snapshot.val()) {
        const chats = Object.keys(snapshot.val()).map((s) => {
          const chats = snapshot.val()[s]
          chats.id = s
          return chats
        })

        this.context.commit('setChats', chats)

        if (window.location.pathname !== '/chats') {
          requestAndShowPermission()
        }
      }
    })
  }
}
