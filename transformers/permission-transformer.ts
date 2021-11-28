import Permission from '@/models/domain/Permission'
import PermissionFirebase from '@/models/firebase/PermissionFirebase'
import { userStore } from '@/store'

export default class PermissionTransformer {
  static async transformInfraToModel (permission: PermissionFirebase, userUid: String): Promise<Permission> {
    const user = await userStore.getUserByUid(permission.userUid!)
    return {
      uid: userUid,
      code: permission.code,
      user
    }
  }

  static transformModelToInfra (permission: Permission): PermissionFirebase {
    return {
      code: permission.code!,
      userUid: permission.user!.uid!
    }
  }
}
