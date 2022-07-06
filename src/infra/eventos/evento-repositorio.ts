import { NuxtFireInstance } from '@nuxtjs/firebase'
import firebase from 'firebase/compat/app'
import Evento from '~/src/aplicacao/eventos/entidade/evento'
import EventoRepostiorioInterface from '~/src/aplicacao/eventos/repositorio/evento-repositorio'
import { eventoStore } from '~/store'

export default class EventoRepositorio implements EventoRepostiorioInterface {
  constructor (private db: NuxtFireInstance) {}

  async criar (entidade: Evento): Promise<void> {
    const eventosRef = this.db.firestore.collection('eventos').doc(entidade.getId())
    const contadoresRef = this.db.firestore.collection('contadores').doc('eventos')
    const batch = this.db.firestore.batch()

    batch.set(eventosRef, {
      titulo: entidade.getTitulo(),
      descricao: entidade.getDescricao(),
      data: firebase.firestore.Timestamp.fromDate(entidade.getData()),
      criadoPor: entidade.getCriadoPor(),
      criadoEm: firebase.firestore.Timestamp.fromDate(entidade.getCriadoEm()),
      editadoPor: entidade.getEditadoPor() ?? null,
      editadoEm: entidade.getEditadoEm()
        ? firebase.firestore.Timestamp.fromDate(entidade.getEditadoEm())
        : null
    })
    batch.update(contadoresRef, {
      total: firebase.firestore.FieldValue.increment(1)
    })

    await batch.commit()
  }

  async atualizar (entidade: Evento): Promise<void> {
    await this.db.firestore.collection('eventos')
      .doc(entidade.getId())
      .update({
        titulo: entidade.getTitulo(),
        descricao: entidade.getDescricao(),
        data: firebase.firestore.Timestamp.fromDate(entidade.getData()),
        editadoPor: entidade.getEditadoPor() ?? null,
        editadoEm: entidade.getEditadoEm()
          ? firebase.firestore.Timestamp.fromDate(entidade.getEditadoEm())
          : null
      })
  }

  async get (id: string): Promise<Evento> {
    const docSnap = await this.db.firestore.collection('eventos').doc(id).get()

    if (docSnap.exists) {
      return new Evento(
        docSnap.id,
        docSnap.data().titulo,
        docSnap.data().descricao,
        docSnap.data().criadoPor,
        docSnap.data().data.toDate(),
        docSnap.data().criadoEm.toDate(),
        docSnap.data().editadoPor ?? null,
        docSnap.data().editadoEm?.toDate() ?? null
      )
    }
  }

  async getTodos (): Promise<Evento[]> {
    const querySnap = await this.db.firestore.collection('eventos')
      .orderBy('titulo').limit(1).get()

    const eventos = []
    for (const doc of querySnap.docs) {
      eventos.push(
        new Evento(
          doc.id,
          doc.data().titulo,
          doc.data().descricao,
          doc.data().criadoPor,
          doc.data().data.toDate(),
          doc.data().criadoEm.toDate(),
          doc.data().editadoPor ?? null,
          doc.data().editadoEm?.toDate() ?? null
        )
      )
    }

    return eventos
  }

  async getItensPaginados (
    paginaAtual: number, paginaAnterior: number,
    itensPorPagina: number, ultimoDocumento: firebase.firestore.QuerySnapshot
  ): Promise<Evento[]> {
    let querySnap
    if (paginaAtual === 1) {
      querySnap = await this.db.firestore.collection('eventos')
        .orderBy('titulo').limit(itensPorPagina).get()
    }

    if (paginaAtual > 1 && paginaAtual > paginaAnterior) {
      querySnap = await this.db.firestore.collection('eventos')
        .orderBy('titulo')
        .startAfter(ultimoDocumento)
        .limit(itensPorPagina).get()
    }

    if (paginaAtual > 1 && paginaAtual < paginaAnterior) {
      querySnap = await this.db.firestore.collection('eventos')
        .orderBy('titulo')
        .endBefore(ultimoDocumento)
        .limit(itensPorPagina).get()
    }

    eventoStore.context.commit('setUltimoDocumento', querySnap.docs[querySnap.size - 1])

    const eventos = []
    for (const doc of querySnap.docs) {
      eventos.push(
        new Evento(
          doc.id,
          doc.data().titulo,
          doc.data().descricao,
          doc.data().criadoPor,
          doc.data().data.toDate(),
          doc.data().criadoEm.toDate(),
          doc.data().editadoPor ?? null,
          doc.data().editadoEm?.toDate() ?? null
        )
      )
    }

    return eventos
  }

  async deletar (id: string): Promise<void> {
    const eventosRef = this.db.firestore.collection('eventos').doc(id)
    const contadoresRef = this.db.firestore.collection('contadores').doc('eventos')

    const batch = this.db.firestore.batch()
    batch.delete(eventosRef)
    batch.update(contadoresRef, {
      total: firebase.firestore.FieldValue.increment(-1)
    })

    await batch.commit()
  }
}
