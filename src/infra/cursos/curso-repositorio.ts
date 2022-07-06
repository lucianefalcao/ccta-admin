import firebase from 'firebase/compat/app'
import { NuxtFireInstance } from '@nuxtjs/firebase'
import Curso, { CursoSubTipoGraduacao, CursoSubTipoPosGraduacao, CursoTipo } from '~/src/aplicacao/cursos/entidade/curso'
import { cursoStore } from '~/store'
import CursoRepositorioInterface from '~/src/aplicacao/cursos/repositorio/curso-repositorio'
import { getEnumChavePorValor } from '~/utils/enumHelper'

export default class CursoRepositorio implements CursoRepositorioInterface {
  constructor (private db: NuxtFireInstance) {}
  async criar (entidade: Curso): Promise<void> {
    const cursosRef = this.db.firestore.collection('cursos').doc(entidade.getId())
    const contadoresRef = this.db.firestore.collection('contadores').doc('cursos')
    const batch = this.db.firestore.batch()

    batch.set(cursosRef, {
      nome: entidade.getNome(),
      descricao: entidade.getDescricao(),
      turno: entidade.getTurno() ?? null,
      tipo: entidade.getTipo(),
      subtipo: entidade.getSubtipo(),
      nrPeriodos: entidade.getPeriodos(),
      usuario: entidade.getUsuario(),
      ultimaModificacao: firebase.firestore.Timestamp.fromDate(entidade.getUltimaModificacao())
    })

    batch.update(contadoresRef, {
      total: firebase.firestore.FieldValue.increment(1)
    })

    await batch.commit()
  }

  async atualizar (entidade: Curso): Promise<void> {
    await this.db.firestore.collection('cursos').doc(entidade.getId())
      .update({
        nome: entidade.getNome(),
        descricao: entidade.getDescricao(),
        turno: entidade.getTurno() ?? null,
        tipo: entidade.getTipo(),
        subtipo: entidade.getSubtipo(),
        nrPeriodos: entidade.getPeriodos(),
        usuario: entidade.getUsuario(),
        ultimaModificacao: firebase.firestore.Timestamp.fromDate(entidade.getUltimaModificacao())
      })
  }

  async get (id: string): Promise<Curso> {
    const docSnap = await this.db.firestore.collection('cursos').doc(id).get()

    if (docSnap.exists) {
      const tipo = this.getTipo(docSnap.data().tipo)
      const subtipo = this.getSubtipo(docSnap.data().subtipo, tipo)

      return new Curso(
        docSnap.id,
        docSnap.data().nome,
        docSnap.data().descricao,
        tipo,
        subtipo,
        docSnap.data().nrPeriodos,
        docSnap.data().usuario,
        docSnap.data().turno ?? null
      )
    }
  }

  getTodos (): Promise<Curso[]> {
    throw new Error('Method not implemented.')
  }

  async deletar (id: string): Promise<void> {
    const cursosRef = this.db.firestore.collection('cursos').doc(id)
    const contadoresRef = this.db.firestore.collection('contadores').doc('cursos')

    const batch = this.db.firestore.batch()
    batch.delete(cursosRef)
    batch.update(contadoresRef, {
      total: firebase.firestore.FieldValue.increment(-1)
    })

    await batch.commit()
  }

  async getItensPaginados (
    paginaAtual: number, paginaAnterior: number,
    itensPorPagina: number, ultimoDocumento: firebase.firestore.QuerySnapshot
  ): Promise<Curso[]> {
    let querySnap
    if (paginaAtual === 1) {
      querySnap = await this.db.firestore.collection('cursos')
        .orderBy('nome').limit(itensPorPagina).get()
    }

    if (paginaAtual > 1 && paginaAtual > paginaAnterior) {
      querySnap = await this.db.firestore.collection('cursos')
        .orderBy('nome')
        .startAfter(ultimoDocumento)
        .limit(itensPorPagina).get()
    }

    if (paginaAtual > 1 && paginaAtual < paginaAnterior) {
      querySnap = await this.db.firestore.collection('cursos')
        .orderBy('nome')
        .endBefore(ultimoDocumento)
        .limit(itensPorPagina).get()
    }

    cursoStore.context.commit('setUltimoDocumento', querySnap.docs[querySnap.size - 1])

    const cursos = []
    for (const doc of querySnap.docs) {
      const tipo = this.getTipo(doc.data().tipo)
      const subtipo = this.getSubtipo(doc.data().subtipo, tipo)

      cursos.push(
        new Curso(
          doc.id,
          doc.data().nome,
          doc.data().descricao,
          tipo,
          subtipo,
          doc.data().nrPeriodos,
          doc.data().usuario,
          doc.data().turno ?? null,
          doc.data().ultimaModificacao.toDate()
        )
      )
    }

    return cursos
  }

  getTipo (tipo: string): CursoTipo {
    const chaveTipo = getEnumChavePorValor(CursoTipo, tipo)
    return CursoTipo[chaveTipo]
  }

  getSubtipo (subtipo: string, tipo: CursoTipo): CursoSubTipoGraduacao|CursoSubTipoPosGraduacao {
    if (tipo === CursoTipo.GRADUACAO) {
      const chaveSubtipo = getEnumChavePorValor(CursoSubTipoGraduacao, subtipo)
      return CursoSubTipoGraduacao[chaveSubtipo]
    } else {
      const chaveSubtipo = getEnumChavePorValor(CursoSubTipoPosGraduacao, subtipo)
      return CursoSubTipoPosGraduacao[chaveSubtipo]
    }
  }
}
