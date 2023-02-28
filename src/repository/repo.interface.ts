export interface Repo<T> {
  query(): Promise<T[]>;
  queryId(id: string): Promise<T>;
  create(knowledge: Partial<T>): Promise<T>;
  update(knowledge: Partial<T>): Promise<T>;
  destroy(id: string): Promise<void>;
}
