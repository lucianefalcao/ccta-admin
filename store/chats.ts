import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { requestAndShowPermission } from '@/utils/notification'
import { userStore } from '@/store'

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
        const chats: any = Object.keys(snapshot.val()).map((s) => {
          const chat: any = snapshot.val()[s]
          chat.id = s
          return chat
        })

        const changes = chats.filter((data: any) => {
          if (data.atendente && (data.atendente.uid === userStore.authUser.uid)) {
            return !this.chats.includes(data)
          }

          return null
        })

        this.context.commit('setChats', chats)

        if ((window.location.pathname !== '/chats' || document.visibilityState !== 'visible') && changes.length > 0) {
          requestAndShowPermission()
        }
      } else {
        this.context.commit('setChats', [])
      }
    })
  }
}
