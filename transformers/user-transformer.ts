import User from '@/models/domain/User'
import UserFirebase from '@/models/firebase/UserFirebase'

export default class UserTransformer {
  static transformInfraToModel (user: UserFirebase, userUid: String): User {
    return {
      uid: userUid,
      email: user.email,
      name: user.nome,
      state: user.estado
    }
  }

  static transformModelToInfra (user: User): UserFirebase {
    return {
      email: user.email!,
      nome: user.name!,
      estado: user.state
    }
  }
}
