import fs from 'fs/promises';
import { KnowledgeStructure } from '../entities/knowledge.model';
import { KnowledgesFileRepo } from './knowledges.mongo.repo';
jest.mock('fs/promises');

describe('Given KnowledgesFileRepo repository', () => {
  const repo = new KnowledgesFileRepo();

  describe('When the repository is instance', () => {
    test('Then, the repo should be instance of KnowledgesFileRepo', () => {
      expect(repo).toBeInstanceOf(KnowledgesFileRepo);
    });
  });

  describe('When the query method is used', () => {
    beforeEach(async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[]');
    });

    test('Then the readFile method have been called', () => {
      repo.query();
      expect(fs.readFile).toHaveBeenCalled();
    });
    test('Then the repo.query should return the mock value', async () => {
      const result = await repo.query();
      expect(result).toEqual([]);
    });
  });

  describe('When the queryId method is used', () => {
    beforeEach(async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[{"id": "1"}]');
    });

    test('Then if it has an object with a valid ID, it should return the object', async () => {
      const result = await repo.queryId('1');
      expect(fs.readFile).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    test('Then if it has an object with NO valid ID, it should throw an Error', async () => {
      expect(async () => repo.queryId('2')).rejects.toThrow();
    });
  });

  describe('When the create method is used', () => {
    test('Then if it has an object to create, it should return the created object', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[{"id": "1"}]');

      const result = await repo.create({ name: 'test' });
      expect(fs.readFile).toHaveBeenCalled();
      expect(result).toEqual({ name: 'test', id: '2' });
    });

    test('Then if there is no initial value, the created object should has the id: 1', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[]');

      const result = await repo.create({ name: 'test' });
      expect(fs.readFile).toHaveBeenCalled();
      expect(result).toEqual({ name: 'test', id: '1' });
    });
  });

  describe('When the update method is used', () => {
    beforeEach(async () => {
      (fs.readFile as jest.Mock).mockResolvedValue(
        '[{"id": "1"}, {"id": "2"}]'
      );
    });

    test('Then if it has an object to update, it should return the updated object', async () => {
      const mockKnowledge = {
        id: '2',
        name: 'test',
      } as Partial<KnowledgeStructure>;

      const result = await repo.update(mockKnowledge);
      expect(fs.readFile).toHaveBeenCalled();
      expect(result).toEqual({ name: 'test', id: '2' });
    });

    test('Then if it has an object with NO ID, it should throw an Error', async () => {
      expect(async () => repo.update({ name: 'test' })).rejects.toThrow();
    });

    test('Then if it has an object with NO ID, it should throw an Error', async () => {
      expect(async () =>
        repo.update({
          id: '3',
          name: 'test',
        })
      ).rejects.toThrow();
    });
  });

  describe('When the delete method is used', () => {
    beforeEach(async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[{"id": "1"}]');
    });

    test('Then if it has an object to delete, the readFile function should be called', async () => {
      await repo.destroy('1');
      expect(fs.readFile).toHaveBeenCalled();
    });

    test('Then if it has an object with NO ID, it should throw an Error', async () => {
      expect(async () => repo.destroy('3')).rejects.toThrow();
    });
  });
});
