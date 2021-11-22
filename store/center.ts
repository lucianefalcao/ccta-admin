import { Action, Module, VuexModule } from 'vuex-module-decorators'
import Center from '@/models/domain/Center'
import CenterTransformer from '@/transformers/center-transformer'

@Module({ name: 'center', stateFactory: true, namespaced: true })
export default class CenterModule extends VuexModule {
  @Action({ rawError: true })
  async save (center: Center): Promise<Center> {
    const centerFirebase = CenterTransformer.transformModelToInfra(center)
    const centerRef = await this.store.$fire.firestore.collection('center').doc()
    await centerRef.set(centerFirebase)
    center.uid = centerRef.id
    return center
  }

  @Action({ rawError: true })
  async getCenterInfo (): Promise<Center> {
    const centerFirestore = await this.store.$fire.firestore.collection('center').get()
    const centerData: any = centerFirestore.docs[0]

    return centerData ? await CenterTransformer.transformInfraToModel(centerData.data(), centerData.id) : { about: '', location: '' }
  }

  @Action({ rawError: true })
  async update (center: Center): Promise<Center> {
    const centerFirebase = CenterTransformer.transformModelToInfra(center)
    const centerRef = await this.store.$fire.firestore.collection('center').doc(center.uid)
    await centerRef.update(centerFirebase)

    return center
  }
}
