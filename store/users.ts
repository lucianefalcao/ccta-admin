import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import UserTransformer from '@/transformers/user-transformer'
import User from '@/models/domain/User'
import Permission from '~/models/domain/Permission'
import { permissionStore } from '~/utils/store-accessor'

@Module({ name: 'users', stateFactory: true, namespaced: true })
export default class UsersModule extends VuexModule {
  authUser: User = {
    uid: undefined,
    email: undefined,
    name: undefined,
    state: 'A'
  }

  userPermissions: Permission[] = []

  @Mutation
  setAuthUser (user: User): void {
    this.authUser = user
  }

  @Mutation
  setUserPermissions (userPermissions: Permission[]): void {
    this.userPermissions = userPermissions
  }

  @Action({ rawError: true })
  async signIn ({ email, password }: { email: String, password: String }): Promise<void> {
    await this.store.$fire.auth.signInWithEmailAndPassword(email, password)
    this.store.$router.push('/')
  }

  @Action({ rawError: true })
  async getUserByUid (uid: String): Promise<User> {
    const userInfra = await this.store.$fire.firestore.collection('users').doc(uid).get()
    return UserTransformer.transformInfraToModel(userInfra.data(), userInfra.id)
  }

  @Action({ rawError: true })
  async getAll (): Promise<User[]> {
    const usersRef = await this.store.$fire.firestore.collection('users').where('state', '==', 'A').get()
    const users: User[] = []
    for (const userData of usersRef.docs) {
      const user = UserTransformer.transformInfraToModel(userData.data(), userData.id)
      users.push(user)
    }

    return users
  }

  @Action({ rawError: true })
  async update ({ name, email, password }: {name: String, email: String, password: String }): Promise<void> {
    const user = this.store.$fire.auth.currentUser

    await user.updateEmail(email)
    const updateUser = this.store.$fire.functions.httpsCallable('updateUser')
    await updateUser({ uid: user.uid, password })

    const userRef = await this.store.$fire.firestore.collection('users').doc(user.uid)
    await userRef.update({ name, email })
  }

  @Action({ rawError: true })
  async createUser ({ name, email }: {name: String, email: String}): Promise<User> {
    const createUser = this.store.$fire.functions.httpsCallable('createUser')
    const response = await createUser({ name, email })
    const user = await this.store.$fire.firestore.collection('users').doc(response.data.uid)
    return UserTransformer.transformInfraToModel(user, response.data.uid)
  }

  @Action({ rawError: true })
  updateUserPermissions (permissions: Permission[]): void {
    const userPermissions = permissions
    this.context.commit('setUserPermissions', userPermissions)
  }

  @Action({ rawError: true })
  async deleteUser (user: User): Promise<void> {
    const removeUser = this.store.$fire.functions.httpsCallable('removeUser')
    await removeUser({ email: user.email })

    const userRef = await this.store.$fire.firestore.collection('users').doc(user.uid)
    await userRef.update({ state: 'X' })
    await permissionStore.deletePermissionsByUserUid(user.uid!)
  }

  @Action({ rawError: true })
  async verifyEmail (email: String): Promise<User[]> {
    const usersRef = await this.store.$fire.firestore.collection('users').where('email', '==', email).get()
    const users: User[] = []
    for (const userData of usersRef.docs) {
      const user = UserTransformer.transformInfraToModel(userData.data(), userData.id)
      users.push(user)
    }

    return users
  }

  @Action({ rawError: true })
  async createPassword ({ uid, password }: {uid: String, password: String }): Promise<void> {
    const updateUser = this.store.$fire.functions.httpsCallable('updateUser')
    await updateUser({ uid, password })
  }

  @Action({ rawError: true })
  async onAuthStateChanged ({ authUser }: { authUser: any }): Promise<void> {
    if (authUser) {
      const userInfra = await this.store.$fire.firestore.collection('users').doc(authUser.uid).get()
      const user = UserTransformer.transformInfraToModel(userInfra.data(), userInfra.id)
      this.context.commit('setAuthUser', user)

      const userPermissions = await permissionStore.getPermissionsByUserUid(user.uid!)
      this.context.commit('setUserPermissions', userPermissions)

      const userStatusDatabaseRef = this.store.$fire.database.ref('/status/' + authUser.uid)

      this.store.$fire.database.ref('.info/connected').on('value', async (snapshot: any) => {
        if (snapshot.val() !== false) {
          await userStatusDatabaseRef.onDisconnect().set({
            idOnline: false,
            last_changed: this.store.$fireModule.database.ServerValue.TIMESTAMP
          })
          userStatusDatabaseRef.set({
            isOnline: true,
            last_changed: this.store.$fireModule.database.ServerValue.TIMESTAMP
          })
        }
      })
    } else {
      this.context.commit('setAuthUser', null)
      this.context.commit('setUserPermissions', [])
    }
  }
}
