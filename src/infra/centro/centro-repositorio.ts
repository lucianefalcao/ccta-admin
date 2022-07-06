import { NuxtFireInstance } from '@nuxtjs/firebase'
import firebase from 'firebase/compat/app'
import Centro from '~/src/aplicacao/centro/entidade/centro'
import CentroRepositorioInterface from '~/src/aplicacao/centro/repositorio/centro-repositorio'

export default class CentroRepositorio implements CentroRepositorioInterface {
  constructor (private db: NuxtFireInstance) {}
  async criar (entidade: Centro): Promise<void> {
    await this.db.firestore.collection('centro')
      .doc(entidade.getId())
      .set({
        sobre: entidade.getDescricao(),
        usuario: entidade.getUsuario(),
        ultimaModificacao: firebase.firestore.Timestamp.fromDate(entidade.getUltimaModificacao())
      })
  }

  async atualizar (entidade: Centro): Promise<void> {
    await this.db.firestore.collection('centro')
      .doc(entidade.getId())
      .update({
        sobre: entidade.getDescricao(),
        usuario: entidade.getUsuario(),
        ultimaModificacao: firebase.firestore.Timestamp.fromDate(entidade.getUltimaModificacao())
      })
  }

  async get (): Promise<Centro> {
    const docSnap = await this.db.firestore.collection('centro').get()

    if (!docSnap.empty) {
      const doc = docSnap.docs[0]
      return new Centro(
        doc.id,
        doc.data().sobre,
        doc.data().usuario,
        doc.data().ultimaModificacao.toDate()
      )
    }
  }
}
