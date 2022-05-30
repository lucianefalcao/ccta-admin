import Permission from '@/models/domain/Permission'
import PermissionFirebase from '@/models/firebase/PermissionFirebase'
import { userStore } from '@/store'

export default class PermissionTransformer {
  static async transformInfraToModel (permission: PermissionFirebase, userUid: String): Promise<Permission> {
    const user = await userStore.getUserByUid(permission.usuario!)
    return {
      uid: userUid,
      code: permission.codigo,
      user
    }
  }

  static transformModelToInfra (permission: Permission): PermissionFirebase {
    return {
      codigo: permission.code!,
      usuario: permission.user!.uid!
    }
  }
}
