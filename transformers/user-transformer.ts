import User from '@/models/domain/User'
import UserFirebase from '@/models/firebase/UserFirebase'

export default class UserTransformer {
  static transformInfraToModel (user: UserFirebase, userUid: String): User {
    return {
      uid: userUid,
      email: user.email,
      name: user.name,
      state: user.state
    }
  }

  static transformModelToInfra (user: User): UserFirebase {
    return {
      email: user.email!,
      name: user.name!,
      state: user.state
    }
  }
}
