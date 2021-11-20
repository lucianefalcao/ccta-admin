import { Action, Module, VuexModule } from 'vuex-module-decorators'

interface News {
  uid?: String,
  title: String,
  newsText: String,
  state: String,
  dateCreated: Number,
  datePublished: Number,
  user: String
}

@Module({ name: 'news', stateFactory: true, namespaced: true })
export default class NewsModule extends VuexModule {
  @Action({ rawError: true })
  async save (news: News): Promise<News> {
    const newsRef = await this.store.$fire.firestore.collection('news').doc()
    await newsRef.set(news)
    news.uid = newsRef.id
    return news
  }
}
