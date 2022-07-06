import { v4 as uuid } from 'uuid'
import Usuario, { Permissao } from './usuario'

const makeSut = (): Usuario => {
  const id = uuid()
  return new Usuario(id, 'Nome', 'nome@mail.com')
}

describe('Usuário', () => {
  test('Deve retornar erro se nenhum id for informado', () => {
    expect(() => {
      new Usuario('', 'Nome', 'nome@mail.com')
    }).toThrowError('O id é obrigatório')
  })

  test('Deve retornar erro se nenhum nome for informado', () => {
    expect(() => {
      new Usuario(uuid(), '', 'nome@mail.com')
    }).toThrowError('O nome é obrigatório')
  })

  test('Deve retornar erro se nenhum email for informado', () => {
    expect(() => {
      new Usuario(uuid(), 'Nome', '')
    }).toThrowError('O email é obrigatório')
  })

  test('Deve retornar erro se o email é inválido', () => {
    expect(() => {
      new Usuario(uuid(), 'Nome', 'email')
    }).toThrowError('O email é inválido')
  })

  test('Deve criar um usuário ativo se todos os dados forem fornecidos corretamente', () => {
    const sut = makeSut()

    expect(sut.getId()).toHaveLength(36)
    expect(sut.getNome()).toBe('Nome')
    expect(sut.getEmail()).toBe('nome@mail.com')
    expect(sut.estaAtivo()).toBe(true)
  })

  test('Deve inativar um usuário', () => {
    const sut = makeSut()
    sut.inativar()
    expect(sut.estaAtivo()).toBe(false)
  })

  test('Deve modificar o nome do usuário', () => {
    const sut = makeSut()
    sut.mudarNome('Fulano')
    expect(sut.getNome()).toBe('Fulano')
  })

  test('Deve modificar o email do usuário', () => {
    const sut = makeSut()
    sut.mudarEmail('fulano@mail.com')
    expect(sut.getEmail()).toBe('fulano@mail.com')
  })

  test('Deve adicionar permissão ao usuário', () => {
    const sut = makeSut()
    sut.adicionarPermissao(Permissao.GERENCIAR_EVENTOS)
    expect(sut.getPermissoes()).toContainEqual(Permissao.GERENCIAR_EVENTOS)
  })

  test('Deve remover permissão do usuário', () => {
    const sut = new Usuario(uuid(), 'Nome', 'nome@mail.com', [Permissao.GERENCIAR_EVENTOS])
    sut.removerPermissao(Permissao.GERENCIAR_EVENTOS)
    expect(sut.getPermissoes()).toEqual([])
  })
})
