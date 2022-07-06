import Centro from '../entidade/centro'

export default interface CentroRepositorioInterface {
  criar (entidade: Centro): Promise<void>
  atualizar (entidade: Centro): Promise<void>
  get (): Promise<Centro>
}
