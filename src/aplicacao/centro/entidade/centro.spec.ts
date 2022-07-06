import Centro from './centro'
import { v4 as uuid } from 'uuid'
import Usuario from '../../usuarios/entidade/usuario'

interface SutTypes {
  sut: Centro
  usuario: Usuario
}

const makeSut = (): SutTypes => {
  const usuario = new Usuario(uuid(), 'Nome', 'nome@mail.com')
  const sut = new Centro(uuid(), 'sobre', usuario.getId())
  return {
    sut,
    usuario
  }
}

describe('Centro', () => {
  test('Deve retornar erro se nenhum id for fornecido', () => {
    const { usuario } = makeSut()
    expect(() => {
      new Centro('', 'sobre', usuario.getId())
    }).toThrowError('O id é obrigatório')
  })

  test('Deve retornar erro se nenhum nome for fornecido', () => {
    const { usuario } = makeSut()
    expect(() => {
      new Centro(uuid(), '', usuario.getId())
    }).toThrowError('A descrição do centro é obrigatória')
  })

  test('Deve retornar erro se nenhum usuário for fornecido', () => {
    expect(() => {
      new Centro(uuid(), 'sobre', '')
    }).toThrowError("O usuário é obrigatório")
  })

  test('Deve criar um centro se todos os dados estiverem corretos', () => {
    const { sut, usuario } = makeSut()
    expect(sut.getId()).toHaveLength(36)
    expect(sut.getDescricao()).toBe('sobre')
    expect(sut.getUsuario()).toBe(usuario.getId())
  })
})