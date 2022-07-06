import { v4 as uuid } from 'uuid'
import Usuario from '../../usuarios/entidade/usuario'
import Noticia, { NoticiaEstado } from './noticia'

interface SutTypes {
  sut: Noticia
  usuario: Usuario
}

const makeSut = (): SutTypes => {
  const usuario = new Usuario(uuid(), 'Nome', 'nome@mail.com')
  const sut = new Noticia(uuid(), 'Título', 'Texto', NoticiaEstado.RASCUNHO, usuario.getId())
  return {
    sut,
    usuario
  }
}

describe('Notícia', () => {
  test('Deve retornar erro se nenhum id for fornecido', () => {
    const { usuario } = makeSut()
    expect(() => {
      new Noticia('', 'Título', 'texto', NoticiaEstado.RASCUNHO, usuario.getId())
    }).toThrowError('O id é obrigatório')
  })

  test('Deve retornar erro se nenhum título for fornecido', () => {
    const { usuario } = makeSut()
    expect(() => {
      new Noticia(uuid(), '', 'texto', NoticiaEstado.RASCUNHO, usuario.getId())
    }).toThrowError('O título é obrigatório')
  })

  test('Deve retornar erro se nenhum texto for fornecido', () => {
    const { usuario } = makeSut()
    expect(() => {
      new Noticia(uuid(), 'Título', '', NoticiaEstado.RASCUNHO, usuario.getId())
    }).toThrowError('O texto é obrigatório')
  })

  test('Deve retornar erro se nenhum usuário for fornecido', () => {
    expect(() => {
      new Noticia(uuid(), 'Título', 'Texto', NoticiaEstado.RASCUNHO, '')
    }).toThrowError('O usuário é obrigatório')
  })

  test('Deve criar uma notícia se todos os dados estiverem corretos', () => {
    const { sut, usuario } = makeSut()
    expect(sut.getId()).toHaveLength(36)
    expect(sut.getTitulo()).toBe('Título')
    expect(sut.getTexto()).toBe('Texto')
    expect(sut.getCriadoPor()).toBe(usuario.getId())
  })

  test('Deve publicar uma notícia', () => {
    const { sut } = makeSut()
    sut.publicar('Luciane')

    expect(sut.getEstado()).toBe(NoticiaEstado.PUBLICADO)
    expect(sut.getPublicadoEm()).toBeDefined()
  })

  test('Deve modificar título', () => {
    const { sut, usuario } = makeSut()
    sut.modificarTitulo('novo título', usuario.getId())

    expect(sut.getTitulo()).toBe('novo título')
    expect(sut.getEditadoPor()).toBe(usuario.getId())
    expect(sut.getEditadoEm()).toBeDefined()
  })

  test('Deve modificar texto', () => {
    const { sut, usuario } = makeSut()
    sut.modificarTexto('novo texto', usuario.getId())

    expect(sut.getTexto()).toBe('novo texto')
    expect(sut.getEditadoPor()).toBe(usuario.getId())
    expect(sut.getEditadoEm()).toBeDefined()
  })

  test('Deve modificar capa', () => {
    const { sut, usuario } = makeSut()
    sut.modificarCapa('caminho/capa', usuario.getId())

    expect(sut.getCapa()).toBe('caminho/capa')
    expect(sut.getEditadoPor()).toBe(usuario.getId())
    expect(sut.getEditadoEm()).toBeDefined()
  })
})
