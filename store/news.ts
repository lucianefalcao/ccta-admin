import { Action, Module, VuexModule } from 'vuex-module-decorators'
import { userStore } from '@/store'
import News from '@/models/domain/News'
import NewsTransformer from '@/transformers/news-transformer'

@Module({ name: 'news', stateFactory: true, namespaced: true })
export default class NewsModule extends VuexModule {
  @Action({ rawError: true })
  async save (news: News): Promise<News> {
    const newsFirebase = NewsTransformer.transformModelToInfra(news)
    const newsRef = await this.store.$fire.firestore.collection('news').doc()
    await newsRef.set(newsFirebase)
    news.uid = newsRef.id
    return news
  }

  @Action({ rawError: true })
  async getAllNews (): Promise<News[]> {
    const news = await this.store.$fire.firestore.collection('news').get()
    const newsPosts: News[] = []
    for (const newsData of news.docs) {
      const news = await NewsTransformer.transformInfraToModel(newsData.data(), newsData.id)
      newsPosts.push(news)
    }

    return newsPosts
  }

  @Action({ rawError: true })
  async getNewsByUid (uid: String): Promise<News> {
    const news = await this.store.$fire.firestore.collection('news').doc(uid).get()
    const user = await userStore.getUserByUid(news.data().userUid)
    return {
      uid: news.id,
      title: news.data().title,
      newsText: news.data().newsText,
      state: news.data().state,
      dateCreated: news.data().dateCreated,
      datePublished: news.data().datePublished,
      user
    }
  }

  @Action({ rawError: true })
  async updateNews (news: News): Promise<News> {
    const newsFirebase = NewsTransformer.transformModelToInfra(news)
    const newsRef = await this.store.$fire.firestore.collection('news').doc(news.uid)
    await newsRef.update(newsFirebase)

    return news
  }
}
