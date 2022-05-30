import News from '@/models/domain/News'
import NewsFirebase from '@/models/firebase/NewsFirebase'
import { userStore } from '@/store'

export default class NewsTransformer {
  static async transformInfraToModel (news: NewsFirebase, newsUid: String): Promise<News> {
    const user = await userStore.getUserByUid(news.criadoPor)
    return {
      uid: newsUid,
      title: news.titulo,
      newsText: news.texto,
      state: news.estado,
      lastModified: news.publicadoEm,
      user,
      coverPath: news.capa
    }
  }

  static transformModelToInfra (news: News): NewsFirebase {
    return {
      titulo: news.title!,
      texto: news.newsText!,
      estado: news.state!,
      publicadoEm: news.lastModified!,
      criadoPor: news.user!.uid!,
      criadoEm: news.lastModified!,
      editadoPor: undefined,
      editadoEm: undefined,
      capa: news.coverPath!
    }
  }
}
