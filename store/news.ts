import { Action, Module, VuexModule } from 'vuex-module-decorators'

@Module({ name: 'news', stateFactory: true, namespaced: true })
export default class NewsModule extends VuexModule {
  @Action({ rawError: true })
  async save (news: {title: String, newsText: String, state: String, dateCreated: Number, datePublished: Number, user: String}): Promise<void> {
    const newsRef = await this.store.$fire.firestore.collection('news').doc()
    await newsRef.set(news)
  }
}
