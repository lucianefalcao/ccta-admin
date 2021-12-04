import { Module, VuexModule } from 'vuex-module-decorators'

@Module({ name: 'chats', stateFactory: true, namespaced: true })
export default class ChatsModule extends VuexModule {

}
