import { Action, Module, VuexModule } from 'vuex-module-decorators'
import PermissionTransformer from '@/transformers/permission-transformer'
import Permission from '@/models/domain/Permission'

@Module({ name: 'permission', stateFactory: true, namespaced: true })
export default class PermissionsModule extends VuexModule {
  @Action({ rawError: true })
  async getPermissionsByUserUid (userUid: String): Promise<Permission[]> {
    const permissionRef = await this.store.$fire.firestore.collection('permissions').get()
    const permissions: Permission[] = []
    for (const permissionData of permissionRef.docs) {
      if (permissionData.data().userUid === userUid) {
        const permission = await PermissionTransformer.transformInfraToModel(permissionData.data(), permissionData.id)
        permissions.push(permission)
      }
    }
    return permissions
  }

  @Action({ rawError: true })
  async update ({ name, email, password }: {name: String, email: String, password: String}): Promise<void> {
    const user = this.store.$fire.auth.currentUser

    await user.updateEmail(email)
    await user.updatePassword(password)

    const userRef = await this.store.$fire.firestore.collection('users').doc(user.uid)
    await userRef.update({ name, email })
  }

  @Action({ rawError: true })
  async setPermission ({ name, email }: {name: String, email: String}): Promise<Permission> {
    const createUser = this.store.$fire.functions.httpsCallable('createUser')
    const response = await createUser({ name, email })
    const user = await this.store.$fire.firestore.collection('users').doc(response.uid)
    return PermissionTransformer.transformInfraToModel(user, response.uid)
  }
}
