import Curso, { CursoSubTipoGraduacao, CursoTipo } from './curso'
import { v4 as uuid } from 'uuid'
import Usuario from '../../usuarios/entidade/usuario'

interface SutTypes {
  sut: Curso
  usuario: Usuario
}

const makeSut = (): SutTypes => {
  const usuario = new Usuario(uuid(), 'Nome', 'nome@mail.com')
  const sut = new Curso(uuid(), 'nome', 'descrição', CursoTipo.GRADUACAO, CursoSubTipoGraduacao.BACHARELADO, 5, usuario.getId())
  return {
    sut,
    usuario
  }
}

describe('Curso', () => {
  test('Deve retornar erro se nenhum id for fornecido', () => {
    const { usuario } = makeSut()
    expect(() => {
      new Curso('', 'nome', 'descrição', CursoTipo.GRADUACAO, CursoSubTipoGraduacao.BACHARELADO, 5, usuario.getId())
    }).toThrowError('O id é obrigatório')
  })

  test('Deve retornar erro se nenhum nome for fornecido', () => {
    const { usuario } = makeSut()
    expect(() => {
      new Curso(uuid(), '', 'descrição', CursoTipo.GRADUACAO, CursoSubTipoGraduacao.BACHARELADO, 5, usuario.getId())
    }).toThrowError('O nome é obrigatório')
  })

  test('Deve retornar erro se nenhuma descrição for fornecida', () => {
    const { usuario } = makeSut()
    expect(() => {
      new Curso(uuid(), 'nome', '', CursoTipo.GRADUACAO, CursoSubTipoGraduacao.BACHARELADO, 5, usuario.getId())
    }).toThrowError('A descrição é obrigatória')
  })

  test('Deve retornar erro se nenhum tipo for fornecida', () => {
    const { usuario } = makeSut()
    expect(() => {
      new Curso(uuid(), 'nome', 'descrição', null, CursoSubTipoGraduacao.BACHARELADO, 5, usuario.getId())
    }).toThrowError('O tipo é obrigatório')
  })

  test('Deve retornar erro se nenhum subtipo for fornecida', () => {
    const { usuario } = makeSut()
    expect(() => {
      new Curso(uuid(), 'nome', 'descrição', CursoTipo.GRADUACAO, null, 5, usuario.getId())
    }).toThrowError('O subtipo é obrigatório')
  })

  test('Deve retornar erro se a quantidade de períodos não for fornecida', () => {
    const { usuario } = makeSut()
    expect(() => {
      new Curso(uuid(), 'nome', 'descrição', CursoTipo.GRADUACAO, CursoSubTipoGraduacao.BACHARELADO, 0, usuario.getId())
    }).toThrowError('O número de períodos é obrigatório')
  })

  test('Deve retornar erro se nenhum usuário for fornecido', () => {
    expect(() => {
      new Curso(uuid(), 'nome', 'descrição', CursoTipo.GRADUACAO, CursoSubTipoGraduacao.BACHARELADO, 5, '')
    }).toThrowError("O usuário é obrigatório")
  })

  test('Deve criar um curso se todos os dados estiverem corretos', () => {
    const { sut, usuario } = makeSut()
    expect(sut.getId()).toHaveLength(36)
    expect(sut.getNome()).toBe('nome')
    expect(sut.getDescricao()).toBe('descrição')
    expect(sut.getTipo()).toBe(CursoTipo.GRADUACAO)
    expect(sut.getSubtipo()).toBe(CursoSubTipoGraduacao.BACHARELADO)
    expect(sut.getPeriodos()).toBe(5)
    expect(sut.getUsuario()).toBe(usuario.getId())
  })
})