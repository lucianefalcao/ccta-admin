import Edital from '@/models/domain/Edital'
import EditalFirebase from '@/models/firebase/EditalFirebase'
import { userStore } from '@/store'

export default class EditalTransformer {
  static async transformInfraToModel (edital: EditalFirebase, editalUid: String): Promise<Edital> {
    const user = await userStore.getUserByUid(edital.criadoPor)
    return {
      uid: editalUid,
      title: edital.titulo,
      lastModified: edital.criadoEm,
      user,
      documentPath: edital.documento
    }
  }

  static transformModelToInfra (edital: Edital): EditalFirebase {
    return {
      titulo: edital.title!,
      criadoEm: edital.lastModified!,
      criadoPor: edital.user!.uid!,
      documento: edital.documentPath!
    }
  }
}
