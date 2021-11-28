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
  async remove (permission: Permission): Promise<void> {
    const permissionFirebase = PermissionTransformer.transformModelToInfra(permission)
    const permissionRef = await this.store.$fire.firestore.collection('permissions').doc(permission.uid)
    await permissionRef.delete(permissionFirebase)
  }

  @Action({ rawError: true })
  async setPermission (permission: Permission): Promise<Permission> {
    const permissionFirebase = PermissionTransformer.transformModelToInfra(permission)
    const permissionRef = await this.store.$fire.firestore.collection('permissions').doc()
    await permissionRef.set(permissionFirebase)
    permission.uid = permissionRef.id
    return permission
  }
}
