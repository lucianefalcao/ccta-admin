import User from '@/models/domain/User'
import UserFirebase from '@/models/firebase/UserFirebase'
import { permissionStore } from '@/store'
import Permission from '~/models/domain/Permission'

export default class UserTransformer {
  static async transformInfraToModel (user: UserFirebase, userUid: String): Promise<User> {
    const userPermissions = await permissionStore.getPermissionsByUserUid(userUid)
    const permissions = userPermissions.map((item: Permission) => item.code) as String[]
    return {
      uid: userUid,
      email: user.email,
      name: user.name,
      permissions
    }
  }

  static transformModelToInfra (user: User): UserFirebase {
    return {
      email: user.email!,
      name: user.name!
    }
  }
}
