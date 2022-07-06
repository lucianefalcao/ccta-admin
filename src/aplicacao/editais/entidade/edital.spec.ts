import { v4 as uuid } from 'uuid'
import Usuario from '../../usuarios/entidade/usuario'
import Edital from './edital'

interface SutTypes {
  sut: Edital
  usuario: Usuario
}

const makeSut = (): SutTypes => {
  const usuario = new Usuario(uuid(), 'Nome', 'nome@mail.com')
  const sut = new Edital(uuid(), 'Título', 'caminho/documento', usuario.getId())
  return {
    sut,
    usuario
  }
}

describe('Edital', () => {
  test('Deve retornar erro se nenhum id for fornecido', () => {
    const { usuario } = makeSut()
    expect(() => {
      new Edital('', 'Título', 'caminho/documento', usuario.getId())
    }).toThrowError('O id é obrigatório')
  })

  test('Deve retornar erro se nenhum título for fornecido', () => {
    const { usuario } = makeSut()
    expect(() => {
      new Edital(uuid(), '', 'caminho/documento', usuario.getId())
    }).toThrowError('O título é obrigatório')
  })

  test('Deve retornar erro se nenhum texto for fornecido', () => {
    const { usuario } = makeSut()
    expect(() => {
      new Edital(uuid(), 'Título', '', usuario.getId())
    }).toThrowError('O documento é obrigatório')
  })

  test('Deve retornar erro se nenhum usuário for fornecido', () => {
    expect(() => {
      new Edital(uuid(), 'Título', 'caminho/documento', '')
    }).toThrowError('O usuário é obrigatório')
  })

  test('Deve criar um edital se todos os dados estiverem corretos', () => {
    const { sut, usuario } = makeSut()
    expect(sut.getId()).toHaveLength(36)
    expect(sut.getTitulo()).toBe('Título')
    expect(sut.getDocumento()).toBe('caminho/documento')
    expect(sut.getCriadoPor()).toBe(usuario.getId())
  })

  test('Deve modificar título', () => {
    const { sut, usuario } = makeSut()
    sut.modificarTitulo('novo título', usuario.getId())

    expect(sut.getId()).toHaveLength(36)
    expect(sut.getDocumento()).toBe('caminho/documento')
    expect(sut.getTitulo()).toBe('novo título')
    expect(sut.getEditadoPor()).toBe(usuario.getId())
    expect(sut.getEditadoEm()).toBeDefined()
  })

  test('Deve modificar documento', () => {
    const { sut, usuario } = makeSut()
    sut.modificarDocumento('novoCaminho/documento', usuario.getId())

    expect(sut.getId()).toHaveLength(36)
    expect(sut.getTitulo()).toBe('Título')
    expect(sut.getDocumento()).toBe('novoCaminho/documento')
    expect(sut.getEditadoPor()).toBe(usuario.getId())
    expect(sut.getEditadoEm()).toBeDefined()
  })
})
