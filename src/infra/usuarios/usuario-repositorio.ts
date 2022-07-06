import { NuxtFireInstance } from '@nuxtjs/firebase'
import firebase from 'firebase/compat/app'
import MultiplosUsuariosErro from './erros/multiplios-usuarios-erro'
import UsuarioNaoExisteErro from './erros/usuario-nao-existe-erro'
import Usuario, { Permissao, UsuarioEstado } from '~/src/aplicacao/usuarios/entidade/usuario'
import UsuarioRepositorioInterface from '~/src/aplicacao/usuarios/repositorio/usuario-repositorio'
import { usuarioStore } from '~/store'

export default class UsuarioRepositorio implements UsuarioRepositorioInterface {
  constructor (private db: NuxtFireInstance) {}

  atualizar (entidade: Usuario): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async criar (entidade: Usuario): Promise<void> {
    const criarUsuario = this.db.functions.httpsCallable('createUser')
    await criarUsuario({ name: entidade.getNome(), email: entidade.getEmail(), id: entidade.getId() })
  }

  async deletar (entidade: Usuario): Promise<void> {
    const inativarUsuario = this.db.functions.httpsCallable('inactivateUser')
    await inativarUsuario({ id: entidade.getId() })
  }

  async atualizarUsuario (entidade: Usuario, senha: string): Promise<void> {
    const usuarioAtual = this.db.auth.currentUser

    await usuarioAtual.updatePassword(senha)

    if (entidade.getEmail() !== usuarioAtual.email) {
      await usuarioAtual.updateEmail(entidade.getEmail())
    }

    if (entidade.getNome() !== usuarioAtual.displayName) {
      await usuarioAtual.updateProfile({ displayName: entidade.getNome() })
    }

    await this.db.firestore.collection('usuarios').doc(entidade.getId()).update({
      nome: entidade.getNome(),
      email: entidade.getEmail(),
      estado: entidade.estaAtivo() ? UsuarioEstado.ATIVO : UsuarioEstado.INATIVO
    })
  }

  async get (id: string): Promise<Usuario> {
    const docSnap = await this.db.firestore.collection('usuarios').doc(id).get()

    if (docSnap.exists) {
      const permissoes = await this.getPermissoes(id)
      return new Usuario(
        docSnap.id,
        docSnap.data().nome,
        docSnap.data().email,
        permissoes as Permissao[],
        docSnap.data().estado
      )
    }

    throw new UsuarioNaoExisteErro()
  }

  getTodos (): Promise<Usuario[]> {
    throw new Error('Method not implemented.')
  }

  async getUsuarioPorEmail (email: string): Promise<Usuario> {
    const querySnap = await this.db.firestore.collection('usuarios')
      .where('email', '==', email).get()

    if (querySnap.empty) {
      return null
    }

    if (querySnap.docs.length > 1) {
      throw new MultiplosUsuariosErro()
    }

    const doc = querySnap.docs[0]
    return new Usuario(
      doc.id,
      doc.data().nome,
      doc.data().email,
      [],
      doc.data().estado
    )
  }

  async criarSenha (senha: string, id: string): Promise<void> {
    const criarSenha = this.db.functions.httpsCallable('updateUser')
    await criarSenha({ id, password: senha })
  }

  async getPermissoes (usuarioId: string): Promise<string[]> {
    const docSnap = await this.db.firestore.collection('permissoes')
      .doc(usuarioId).get()

    if (docSnap.exists) {
      return docSnap.data().permissoes
    }
  }

  async atualizarPermissoes (entidade: Usuario): Promise<void> {
    await this.db.firestore.collection('permissoes')
      .doc(entidade.getId())
      .set({
        permissoes: entidade.getPermissoes()
      })
  }

  async getItensPaginados (
    paginaAtual: number, paginaAnterior: number,
    itensPorPagina: number, ultimoDocumento: firebase.firestore.QuerySnapshot
  ): Promise<Usuario[]> {
    let querySnap
    if (paginaAtual === 1) {
      querySnap = await this.db.firestore.collection('usuarios')
        .orderBy('nome')
        .where('estado', '==', UsuarioEstado.ATIVO)
        .limit(itensPorPagina).get()
    }

    if (paginaAtual > 1 && paginaAtual > paginaAnterior) {
      querySnap = await this.db.firestore.collection('usuarios')
        .orderBy('nome')
        .where('estado', '==', UsuarioEstado.ATIVO)
        .startAfter(ultimoDocumento)
        .limit(itensPorPagina).get()
    }

    if (paginaAtual > 1 && paginaAtual < paginaAnterior) {
      querySnap = await this.db.firestore.collection('usuarios')
        .orderBy('nome')
        .where('estado', '==', UsuarioEstado.ATIVO)
        .endBefore(ultimoDocumento)
        .limit(itensPorPagina).get()
    }

    usuarioStore.context.commit('setUltimoDocumento', querySnap.docs[querySnap.size - 1])

    const usuarios = []
    for (const doc of querySnap.docs) {
      const permissoes = await this.getPermissoes(doc.id)
      usuarios.push(
        new Usuario(
          doc.id,
          doc.data().nome,
          doc.data().email,
          permissoes as Permissao[],
          doc.data().estado
        )
      )
    }

    return usuarios
  }
}
