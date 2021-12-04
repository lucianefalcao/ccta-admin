import Center from '@/models/domain/Center'
import CenterFirebase from '@/models/firebase/CenterFirebase'
import { userStore } from '@/store'

export default class CenterTransformer {
  static async transformInfraToModel (center: CenterFirebase, centerUid: String): Promise<Center> {
    const user = await userStore.getUserByUid(center.userUid)
    return {
      uid: centerUid,
      about: center.about,
      lastModified: center.lastModified,
      user
    }
  }

  static transformModelToInfra (center: Center): CenterFirebase {
    return {
      about: center.about!,
      lastModified: center.lastModified!,
      userUid: center.user!.uid!
    }
  }
}
