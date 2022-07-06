import { Action, Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { Menu, menuPermissionMap } from '~/models/helpers/PermissionMenuMap'
import Usuario from '~/src/aplicacao/usuarios/entidade/usuario'

@Module({ name: 'menu', stateFactory: true, namespaced: true })
export default class MenuModule extends VuexModule {
  menuPrimario: Menu[] = []
  menuSecundario: Menu[] = []

  @Mutation
  atualiarMenuSecundario (itens: Menu[]): void {
    this.menuSecundario = itens
  }

  @Mutation
  atualizarMenuPrimario (itens: Menu[]): void {
    this.menuPrimario = itens
  }

  @Action({ rawError: true })
  definirItensMenu (usuario: Usuario): void {
    const permissoes = usuario.getPermissoes()

    const menuPrimario = []
    const menuSecundario = []

    for (const menu of menuPermissionMap) {
      if ((!menu.permissao) || (menu.tipo === 'secundario' && permissoes.includes(menu.permissao))) {
        menuSecundario.push(menu)
      }

      if (menu.tipo === 'primario' && permissoes.includes(menu.permissao)) {
        menuPrimario.push(menu)
      }
    }

    this.context.commit('atualizarMenuPrimario', menuPrimario)
    this.context.commit('atualiarMenuSecundario', menuSecundario)
  }
}
