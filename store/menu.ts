import { Action, Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { userStore } from '@/store'
import { Menu, menuPermissionMap } from '@/models/helpers/PermissionMenuMap'
import Permission from '~/models/domain/Permission'

@Module({ name: 'menu', stateFactory: true, namespaced: true })
export default class MenuModule extends VuexModule {
  primary: Menu[] = []
  secondary: Menu[] = []

  @Mutation
  addItemToPrimaryMenu (item: Menu) {
    this.primary.push(item)
  }

  @Mutation
  addItemToSecondaryMenu (item: Menu) {
    this.secondary.push(item)
  }

  @Mutation
  emptyMenus () {
    this.primary = []
    this.secondary = []
  }

  @Action({ rawError: true })
  defineMenus () {
    this.context.commit('emptyMenus')
    const permissions = userStore.userPermissions.map(item => item.code)

    for (const menu of menuPermissionMap) {
      if (menu.permission.length === 0) {
        this.context.commit('addItemToSecondaryMenu', menu)
      }

      if (menu.type === 'primary' && permissions.includes(menu.permission)) {
        this.context.commit('addItemToPrimaryMenu', menu)
      }

      if (menu.type === 'secondary' && permissions.includes(menu.permission)) {
        this.context.commit('addItemToSecondaryMenu', menu)
      }
    }
  }
}
