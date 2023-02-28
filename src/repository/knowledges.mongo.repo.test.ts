import { KnowledgeStructure } from '../entities/knowledge.model';
import { KnowledgeModel } from './knowledges.mongo.model';
import { KnowledgesMongoRepo } from './knowledges.mongo.repo';

jest.mock('./knowledges.mongo.model.js');

describe('Given KnowledgesMongoRepo repository', () => {
  const repo = new KnowledgesMongoRepo();

  describe('When the repository is instanced', () => {
    test('Then, the repo should be instance of KnowledgesMongoRepo', () => {
      expect(repo).toBeInstanceOf(KnowledgesMongoRepo);
    });
  });

  describe('When the query method is used', () => {
    beforeEach(async () => {
      (KnowledgeModel.find as jest.Mock).mockResolvedValue([]);
    });

    test('Then the find method have been called', () => {
      repo.query();
      expect(KnowledgeModel.find).toHaveBeenCalled();
    });
    test('Then the repo.query should return the mock value', async () => {
      const result = await repo.query();
      expect(result).toEqual([]);
    });
  });

  describe('When the queryId method is used', () => {
    test('Then if the findById method resolve value to an object, it should return the object', async () => {
      (KnowledgeModel.findById as jest.Mock).mockResolvedValue({ id: '1' });
      const result = await repo.queryId('1');
      expect(KnowledgeModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    test('Then if the findById method resolve value to undefined, it should throw an Error', async () => {
      (KnowledgeModel.findById as jest.Mock).mockResolvedValue(undefined);
      expect(async () => repo.queryId('')).rejects.toThrow();
    });
  });

  describe('When the create method is used', () => {
    test('Then if it has an object to create, it should return the created object', async () => {
      (KnowledgeModel.create as jest.Mock).mockResolvedValue({ name: 'test' });

      const result = await repo.create({ name: 'test' });
      expect(KnowledgeModel.create).toHaveBeenCalled();
      expect(result).toEqual({ name: 'test' });
    });
  });

  describe('When the update method is used', () => {
    const mockKnowledge = {
      id: '1',
      name: 'test',
    } as Partial<KnowledgeStructure>;

    test('Then if the findByIdAndUpdate method resolve value to an object, it should return the object', async () => {
      (KnowledgeModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        name: 'test',
        id: '1',
      });
      const result = await repo.update(mockKnowledge);
      expect(KnowledgeModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({ name: 'test', id: '1' });
    });

    test('Then if the findByIdAndUpdate method resolve value to undefined, it should throw an Error', async () => {
      (KnowledgeModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        undefined
      );
      expect(async () => repo.update(mockKnowledge)).rejects.toThrow();
    });
  });

  describe('When the delete method is used', () => {
    beforeEach(async () => {
      (KnowledgeModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});
    });

    test('Then if it has an object to delete with its ID, the findByIdAndDelete function should be called', async () => {
      await repo.destroy('1');
      expect(KnowledgeModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then if the findByIdAndDelete method resolve value to undefined, it should throw an Error', async () => {
      (KnowledgeModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
        undefined
      );
      expect(async () => repo.destroy('')).rejects.toThrow();
    });
  });
});
