import { v4 as uuid } from 'uuid'
import Chat from './chat'

describe('Chat', () => {
  test('Deve retornar erro se nenhum id for fornecido', () => {
    expect(() => {
      new Chat('', 'mensagem', new Date('05-01-2022 19:30'))
    }).toThrowError('O id é obrigatório')
  })

  test('Deve retornar erro se a última mensagem não for fornecida', () => {
    expect(() => {
      new Chat(uuid(), '', new Date('05-01-2022 19:30'))
    }).toThrowError('A última mensagem é obrigatória')
  })
})
