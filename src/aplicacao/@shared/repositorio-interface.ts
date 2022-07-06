export default interface RepositorioInterface<T> {
  criar(entidade: T): Promise<void>;
  atualizar(entidade: T): Promise<void>;
  get(id: string): Promise<T>;
  getTodos(): Promise<T[]>;
}
