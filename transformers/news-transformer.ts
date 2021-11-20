import News from '@/models/domain/News'
import NewsFirebase from '@/models/firebase/NewsFirebase'
import { userStore } from '@/store'

export default class NewsTransformer {
  static async transformInfraToModel (news: NewsFirebase, newsUid: String): Promise<News> {
    const user = await userStore.getUserByUid(news.userUid)
    return {
      uid: newsUid,
      title: news.title,
      newsText: news.newsText,
      state: news.state,
      lastModified: news.lastModified,
      user,
      coverPath: news.coverPath
    }
  }

  static transformModelToInfra (news: News): NewsFirebase {
    return {
      title: news.title!,
      newsText: news.newsText!,
      state: news.state!,
      lastModified: news.lastModified!,
      userUid: news.user!.uid!,
      coverPath: news.coverPath!
    }
  }
}
