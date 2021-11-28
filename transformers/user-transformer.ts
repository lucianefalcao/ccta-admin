import User from '@/models/domain/User'
import UserFirebase from '@/models/firebase/UserFirebase'
import { permissionStore } from '@/store'

export default class UserTransformer {
  static async transformInfraToModel (user: UserFirebase, userUid: String): Promise<User> {
    const userPermissions = await permissionStore.getPermissionsByUserUid(userUid)
    return {
      uid: userUid,
      email: user.email,
      name: user.name,
      permissions: userPermissions
    }
  }

  static transformModelToInfra (user: User): UserFirebase {
    return {
      email: user.email!,
      name: user.name!
    }
  }
}
