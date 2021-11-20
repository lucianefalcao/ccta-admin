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

  @Action({ rawError: true })
  async getAllNews (): Promise<News[]> {
    const news = await this.store.$fire.firestore.collection('news').get()
    const newsPosts: News[] = []
    news.forEach((doc: any) => {
      newsPosts.push({
        uid: doc.id,
        title: doc.data().title,
        state: doc.data().state,
        newsText: doc.data().newsText,
        user: doc.data().user,
        dateCreated: doc.data().dateCreated,
        datePublished: doc.data().datePublished
      })
    })
    return newsPosts
  }
}
