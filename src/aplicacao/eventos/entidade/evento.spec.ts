import Evento from './evento'
import { v4 as uuid } from 'uuid'
import Usuario from '../../usuarios/entidade/usuario'

interface SutTypes {
  sut: Evento
  usuario: Usuario
}

const makeSut = (): SutTypes => {
  const usuario = new Usuario(uuid(), 'Nome', 'nome@mail.com')
  const sut = new Evento(uuid(), 'Título', 'Descrição', usuario.getId(), new Date('05-01-2022 19:30'))
  return {
    sut,
    usuario
  }
}

describe('Evento', () => {
  test('Deve retornar erro se nenhum id for fornecido', () => {
    const { usuario } = makeSut()
    expect(() => {
      new Evento('', 'Título', 'Descrição', usuario.getId(), new Date('05-01-2022 19:30'))
    }).toThrowError('O id é obrigatório')
  })

  test('Deve retornar erro se nenhum título for fornecido', () => {
    const { usuario } = makeSut()
    expect(() => {
      new Evento(uuid(), '', 'Descrição', usuario.getId(), new Date('05-01-2022 19:30'))
    }).toThrowError('O título é obrigatório')
  })

  test('Deve retornar erro se nenhum texto for fornecido', () => {
    const { usuario } = makeSut()
    expect(() => {
      new Evento(uuid(), 'Título', '', usuario.getId(), new Date('05-01-2022 19:30'))
    }).toThrowError('A descrição é obrigatória')
  })

  test('Deve retornar erro se nenhum usuário for fornecido', () => {
    expect(() => {
      new Evento(uuid(), 'Título', 'Descrição', '', new Date('05-01-2022 19:30'))
    }).toThrowError('O usuário é obrigatório')
  })

  test('Deve criar um evento se todos os dados estiverem corretos', () => {
    const { sut, usuario } = makeSut()
    expect(sut.getId()).toHaveLength(36)
    expect(sut.getTitulo()).toBe('Título')
    expect(sut.getDescricao()).toBe('Descrição')
    expect(sut.getData()).toStrictEqual(new Date('05-01-2022 19:30'))
    expect(sut.getCriadoPor()).toBe(usuario.getId())
  })

  test('Deve modificar título', () => {
    const { sut, usuario } = makeSut()
    sut.modificarTitulo('novo título', usuario.getId())

    expect(sut.getId()).toHaveLength(36)
    expect(sut.getDescricao()).toBe('Descrição')
    expect(sut.getData()).toStrictEqual(new Date('05-01-2022 19:30'))
    expect(sut.getTitulo()).toBe('novo título')
    expect(sut.getEditadoPor()).toBe(usuario.getId())
    expect(sut.getEditadoEm()).toBeDefined()
  })

  test('Deve modificar a descrição', () => {
    const { sut, usuario } = makeSut()
    sut.modificarDescricao('nova descrição', usuario.getId())

    expect(sut.getId()).toHaveLength(36)
    expect(sut.getTitulo()).toBe('Título')
    expect(sut.getData()).toStrictEqual(new Date('05-01-2022 19:30'))
    expect(sut.getDescricao()).toBe('nova descrição')
    expect(sut.getEditadoPor()).toBe(usuario.getId())
    expect(sut.getEditadoEm()).toBeDefined()
  })

  test('Deve modificar data', () => {
    const { sut, usuario } = makeSut()
    const data = new Date('05-01-2022 19:30')
    sut.modificarData(data, usuario.getId())

    expect(sut.getId()).toHaveLength(36)
    expect(sut.getTitulo()).toBe('Título')
    expect(sut.getDescricao()).toBe('Descrição')
    expect(sut.getData()).toStrictEqual(data)
    expect(sut.getEditadoPor()).toBe(usuario.getId())
    expect(sut.getEditadoEm()).toBeDefined()
  })
})