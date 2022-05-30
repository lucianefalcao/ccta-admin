import Center from '@/models/domain/Center'
import CenterFirebase from '@/models/firebase/CenterFirebase'
import { userStore } from '@/store'

export default class CenterTransformer {
  static async transformInfraToModel (center: CenterFirebase, centerUid: String): Promise<Center> {
    const user = await userStore.getUserByUid(center.usuario)
    return {
      uid: centerUid,
      about: center.sobre,
      lastModified: center.ultimaModificacao,
      user
    }
  }

  static transformModelToInfra (center: Center): CenterFirebase {
    return {
      sobre: center.about!,
      ultimaModificacao: center.lastModified!,
      usuario: center.user!.uid!
    }
  }
}
