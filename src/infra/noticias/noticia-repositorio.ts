import firebase from 'firebase/compat/app'
import { NuxtFireInstance } from '@nuxtjs/firebase'
import { noticiaStore } from '~/store'
import { getEnumChavePorValor } from '~/utils/enumHelper'
import NoticiaRepositorioInterface from '~/src/aplicacao/noticias/repositorio/noticia-repositorio'
import Noticia, { NoticiaEstado } from '~/src/aplicacao/noticias/entidade/noticia'

export default class NoticiaRepositorio implements NoticiaRepositorioInterface {
  constructor (private db: NuxtFireInstance) {}

  async getCapa (caminho: string): Promise<string> {
    return await this.db.storage.ref().child(caminho).getDownloadURL()
  }

  async adicionarCapa (capa: File): Promise<void> {
    await this.db.storage.ref().child(`/noticiasCapa/${capa.name}`)
      .put(capa)
  }

  async deletarCapa (caminho: string): Promise<void> {
    await this.db.storage.ref().child(caminho).delete()
  }

  async criar (entidade: Noticia): Promise<void> {
    const noticiasRef = this.db.firestore.collection('noticias').doc(entidade.getId())
    const contadoresRef = this.db.firestore.collection('contadores').doc('noticias')
    const batch = this.db.firestore.batch()

    batch.set(noticiasRef, {
      titulo: entidade.getTitulo(),
      texto: entidade.getTexto(),
      estado: entidade.getEstado(),
      capa: entidade.getCapa() ?? null,
      criadoPor: entidade.getCriadoPor(),
      criadoEm: firebase.firestore.Timestamp.fromDate(entidade.getCriadoEm()),
      publicadoEm: entidade.getPublicadoEm()
        ? firebase.firestore.Timestamp.fromDate(entidade.getPublicadoEm())
        : null,
      publicadoPor: entidade.getPublicadoPor() ?? null,
      editadoPor: null,
      editadoEm: null
    })
    batch.update(contadoresRef, {
      total: firebase.firestore.FieldValue.increment(1)
    })

    await batch.commit()
  }

  async criarNoticia (noticia: Noticia, capa: File|null): Promise<void> {
    if (capa !== null) {
      await this.adicionarCapa(capa)
    }
    await this.criar(noticia)
  }

  async atualizar (entidade: Noticia): Promise<void> {
    await this.db.firestore.collection('noticias')
      .doc(entidade.getId())
      .update({
        titulo: entidade.getTitulo(),
        texto: entidade.getTexto(),
        estado: entidade.getEstado(),
        capa: entidade.getCapa() ?? null,
        criadoPor: entidade.getCriadoPor(),
        criadoEm: firebase.firestore.Timestamp.fromDate(entidade.getCriadoEm()),
        publicadoEm: entidade.getPublicadoEm()
          ? firebase.firestore.Timestamp.fromDate(entidade.getPublicadoEm())
          : null,
        publicadoPor: entidade.getPublicadoPor() ?? null,
        editadoPor: entidade.getEditadoPor() ?? null,
        editadoEm: entidade.getEditadoEm()
          ? firebase.firestore.Timestamp.fromDate(entidade.getEditadoEm())
          : null
      })
  }

  async atualizarNoticia (entidade: Noticia, capa: File|null): Promise<void> {
    await this.atualizar(entidade)
    if (capa !== null) {
      await this.adicionarCapa(capa)
    }
  }

  async get (id: string): Promise<Noticia> {
    const docSnap = await this.db.firestore.collection('noticias').doc(id).get()

    if (docSnap.exists) {
      const estado = this.getEstado(docSnap.data().estado)
      return new Noticia(
        docSnap.id,
        docSnap.data().titulo,
        docSnap.data().texto,
        estado,
        docSnap.data().criadoPor,
        docSnap.data().criadoEm.toDate(),
        docSnap.data().publicadoEm?.toDate() ?? null,
        docSnap.data().publicadoPor ?? null,
        docSnap.data().capa ?? null,
        docSnap.data().editadoPor ?? null,
        docSnap.data().editadoEm?.toDate() ?? null
      )
    }
  }

  getTodos (): Promise<Noticia[]> {
    throw new Error('Method not implemented.')
  }

  async deletar (entidade: Noticia): Promise<void> {
    const noticiasRef = this.db.firestore.collection('noticias').doc(entidade.getId())
    const contadoresRef = this.db.firestore.collection('contadores').doc('noticias')

    const batch = this.db.firestore.batch()
    batch.delete(noticiasRef)
    batch.update(contadoresRef, {
      total: firebase.firestore.FieldValue.increment(-1)
    })

    await batch.commit()

    if (entidade.getCapa()) {
      await this.deletarCapa(entidade.getCapa())
    }
  }

  async getItensPaginados (
    paginaAtual: number, paginaAnterior: number,
    itensPorPagina: number, ultimoDocumento: firebase.firestore.QuerySnapshot
  ): Promise<Noticia[]> {
    let querySnap
    if (paginaAtual === 1) {
      querySnap = await this.db.firestore.collection('noticias')
        .orderBy('criadoEm').limit(itensPorPagina).get()
    }

    if (paginaAtual > 1 && paginaAtual > paginaAnterior) {
      querySnap = await this.db.firestore.collection('noticias')
        .orderBy('criadoEm')
        .startAfter(ultimoDocumento)
        .limit(itensPorPagina).get()
    }

    if (paginaAtual > 1 && paginaAtual < paginaAnterior) {
      querySnap = await this.db.firestore.collection('noticias')
        .orderBy('criadoEm')
        .endBefore(ultimoDocumento)
        .limit(itensPorPagina).get()
    }

    noticiaStore.context.commit('setUltimoDocumento', querySnap.docs[querySnap.size - 1])

    const noticias = []
    for (const doc of querySnap.docs) {
      const estado = this.getEstado(doc.data().estado)

      noticias.push(
        new Noticia(
          doc.id,
          doc.data().titulo,
          doc.data().texto,
          estado,
          doc.data().criadoPor,
          doc.data().criadoEm.toDate(),
          doc.data().publicadoEm?.toDate() ?? null,
          doc.data().publicadoPor ?? null,
          doc.data().capa ?? null,
          doc.data().editadoPor ?? null,
          doc.data().editadoEm?.toDate() ?? null
        )
      )
    }

    return noticias
  }

  getEstado (estado: string): NoticiaEstado {
    const chaveEstado = getEnumChavePorValor(NoticiaEstado, estado)
    return NoticiaEstado[chaveEstado]
  }
}
