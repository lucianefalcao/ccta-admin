import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import Centro from '~/src/aplicacao/centro/entidade/centro'
import CentroRepositorio from '~/src/infra/centro/centro-repositorio'

@Module({ name: 'centro', stateFactory: true, namespaced: true })
export default class CentroModule extends VuexModule {
  centro: Centro

  @Mutation
  setCentro (centro: Centro): void {
    this.centro = centro
  }

  @Action({ rawError: true })
  async getCentro (): Promise<Centro> {
    const repositorio = new CentroRepositorio(this.store.$fire)
    return await repositorio.get()
  }

  @Action({ rawError: true })
  async criar (centro: Centro): Promise<void> {
    const repositorio = new CentroRepositorio(this.store.$fire)
    return await repositorio.criar(centro)
  }

  @Action({ rawError: true })
  async atualizar (centro: Centro): Promise<void> {
    const repositorio = new CentroRepositorio(this.store.$fire)
    return await repositorio.atualizar(centro)
  }
}
