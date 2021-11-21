import { Action, Module, VuexModule } from 'vuex-module-decorators'
import { userStore } from '@/store'
import Edital from '@/models/domain/Edital'
import EditalTransformer from '@/transformers/edital-transformer'

@Module({ name: 'editais', stateFactory: true, namespaced: true })
export default class EditaisModule extends VuexModule {
  @Action({ rawError: true })
  async save (edital: Edital): Promise<Edital> {
    const editalFirebase = EditalTransformer.transformModelToInfra(edital)
    const editalRef = await this.store.$fire.firestore.collection('editais').doc()
    await editalRef.set(editalFirebase)
    edital.uid = editalRef.id
    return edital
  }

  @Action({ rawError: true })
  async getAll (): Promise<Edital[]> {
    const editais = await this.store.$fire.firestore.collection('editais').get()
    const editaisPosts: Edital[] = []
    for (const editalData of editais.docs) {
      const news = await EditalTransformer.transformInfraToModel(editalData.data(), editalData.id)
      editaisPosts.push(news)
    }

    return editaisPosts
  }

  @Action({ rawError: true })
  async getEditalByUid (uid: String): Promise<Edital> {
    const edital = await this.store.$fire.firestore.collection('editais').doc(uid).get()
    const user = await userStore.getUserByUid(edital.data().userUid)
    return {
      uid: edital.id,
      title: edital.data().title,
      lastModified: edital.data().lastModified,
      user,
      documentPath: edital.data().documentPath
    }
  }

  @Action({ rawError: true })
  async update (edital: Edital): Promise<Edital> {
    const editalFirebase = EditalTransformer.transformModelToInfra(edital)
    const editalRef = await this.store.$fire.firestore.collection('editais').doc(edital.uid)
    await editalRef.update(editalFirebase)

    return edital
  }

  @Action({ rawError: true })
  async addDocument (document: File): Promise<String> {
    const storageRef = this.store.$fire.storage.ref().child(`/editais/${document.name}`)
    await storageRef.put(document)

    return await storageRef.getDownloadURL()
  }

  @Action({ rawError: true })
  async getDocument (documentPath: String): Promise<String> {
    const storageRef = this.store.$fire.storage.ref().child(documentPath)
    return await storageRef.getDownloadURL()
  }

  @Action({ rawError: true })
  async delete (edital: Edital): Promise<Edital[]> {
    const editalFirebase = EditalTransformer.transformModelToInfra(edital)
    const editalRef = await this.store.$fire.firestore.collection('editais').doc(edital.uid)
    await editalRef.delete(editalFirebase)
    return await this.getAll()
  }
}
