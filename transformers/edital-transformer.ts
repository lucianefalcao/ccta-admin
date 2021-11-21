import Edital from '@/models/domain/Edital'
import EditalFirebase from '@/models/firebase/EditalFirebase'
import { userStore } from '@/store'

export default class NewsTransformer {
  static async transformInfraToModel (edital: EditalFirebase, editalUid: String): Promise<Edital> {
    const user = await userStore.getUserByUid(edital.userUid)
    return {
      uid: editalUid,
      title: edital.title,
      lastModified: edital.lastModified,
      user,
      documentPath: edital.documentPath
    }
  }

  static transformModelToInfra (edital: Edital): EditalFirebase {
    return {
      title: edital.title!,
      lastModified: edital.lastModified!,
      userUid: edital.user!.uid!,
      documentPath: edital.documentPath!
    }
  }
}
