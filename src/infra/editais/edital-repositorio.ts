import firebase from 'firebase/compat/app'
import { NuxtFireInstance } from '@nuxtjs/firebase'
import Edital from '~/src/aplicacao/editais/entidade/edital'
import EditalRepositorioInterface from '~/src/aplicacao/editais/repositorio/edital-repositorio'
import { editalStore } from '~/store'

export default class EditalRepositorio implements EditalRepositorioInterface {
  constructor (private db: NuxtFireInstance) {}

  async criar (entidade: Edital): Promise<void> {
    const editaisRef = this.db.firestore.collection('editais').doc(entidade.getId())
    const contadoresRef = this.db.firestore.collection('contadores').doc('editais')
    const batch = this.db.firestore.batch()

    batch.set(editaisRef, {
      titulo: entidade.getTitulo(),
      documento: entidade.getDocumento(),
      criadoPor: entidade.getCriadoPor(),
      criadoEm: firebase.firestore.Timestamp.fromDate(entidade.getCriadoEm()),
      editadoPor: null,
      editadoEm: null
    })
    batch.update(contadoresRef, {
      total: firebase.firestore.FieldValue.increment(1)
    })

    await batch.commit()
  }

  async baixarDocumento (caminho: string): Promise<string> {
    return await this.db.storage.ref().child(caminho).getDownloadURL()
  }

  async adicionarDocumento (documento: File): Promise<void> {
    await this.db.storage.ref().child(`/editais/${documento.name}`)
      .put(documento)
  }

  async deletarDocumento (caminho: string): Promise<void> {
    await this.db.storage.ref().child(caminho).delete()
  }

  async criarEvento (entidade: Edital, documento: File): Promise<void> {
    await this.adicionarDocumento(documento)
    await this.criar(entidade)
  }

  async atualizar (entidade: Edital): Promise<void> {
    await this.db.firestore.collection('editais')
      .doc(entidade.getId())
      .update({
        titulo: entidade.getTitulo(),
        documento: entidade.getDocumento(),
        criadoPor: entidade.getCriadoPor(),
        criadoEm: firebase.firestore.Timestamp.fromDate(entidade.getCriadoEm()),
        editadoPor: entidade.getEditadoPor(),
        editadoEm: entidade.getEditadoEm()
          ? firebase.firestore.Timestamp.fromDate(entidade.getEditadoEm())
          : null
      })
  }

  async atualizarEvento (entidade: Edital, novoDocumento: File|null): Promise<void> {
    await this.atualizar(entidade)
    if (novoDocumento !== null) {
      await this.adicionarDocumento(novoDocumento)
    }
  }

  async get (id: string): Promise<Edital> {
    const docSnap = await this.db.firestore.collection('editais').doc(id).get()

    if (docSnap.exists) {
      return new Edital(
        docSnap.id,
        docSnap.data().titulo,
        docSnap.data().documento,
        docSnap.data().criadoPor,
        docSnap.data().criadoEm.toDate(),
        docSnap.data().editadoPor ?? null,
        docSnap.data().editadoEm?.toDate() ?? null
      )
    }
  }

  getTodos (): Promise<Edital[]> {
    throw new Error('Method not implemented.')
  }

  async getItensPaginados (
    paginaAtual: number, paginaAnterior: number,
    itensPorPagina: number, ultimoDocumento: firebase.firestore.QuerySnapshot
  ): Promise<Edital[]> {
    let querySnap
    if (paginaAtual === 1) {
      querySnap = await this.db.firestore.collection('editais')
        .orderBy('titulo').limit(itensPorPagina).get()
    }

    if (paginaAtual > 1 && paginaAtual > paginaAnterior) {
      querySnap = await this.db.firestore.collection('editais')
        .orderBy('titulo')
        .startAfter(ultimoDocumento)
        .limit(itensPorPagina).get()
    }

    if (paginaAtual > 1 && paginaAtual < paginaAnterior) {
      querySnap = await this.db.firestore.collection('editais')
        .orderBy('titulo')
        .endBefore(ultimoDocumento)
        .limit(itensPorPagina).get()
    }

    editalStore.context.commit('setUltimoDocumento', querySnap.docs[querySnap.size - 1])

    const editais = []
    for (const doc of querySnap.docs) {
      editais.push(
        new Edital(
          doc.id,
          doc.data().titulo,
          doc.data().documento,
          doc.data().criadoPor,
          doc.data().criadoEm.toDate(),
          doc.data().editadoPor ?? null,
          doc.data().editadoEm?.toDate() ?? null
        )
      )
    }

    return editais
  }

  async deletar (entidade: Edital): Promise<void> {
    const editaisRef = this.db.firestore.collection('editais').doc(entidade.getId())
    const contadoresRef = this.db.firestore.collection('contadores').doc('editais')

    const batch = this.db.firestore.batch()
    batch.delete(editaisRef)
    batch.update(contadoresRef, {
      total: firebase.firestore.FieldValue.increment(-1)
    })

    await batch.commit()

    await this.deletarDocumento(entidade.getDocumento())
  }
}
