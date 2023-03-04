import { KnowledgeStructure } from '../entities/knowledge.model';
import { KnowledgeModel } from './knowledges.mongo.model';
import { KnowledgesMongoRepo } from './knowledges.mongo.repo';

jest.mock('./knowledges.mongo.model.js');

jest.mock('../config.js', () => ({
  _dirname: 'test',
  config: {
    secret: 'test',
  },
}));

describe('Given KnowledgesMongoRepo repository', () => {
  const repo = KnowledgesMongoRepo.getInstance();

  describe('When the repository is instanced', () => {
    test('Then, the repo should be instance of KnowledgesMongoRepo', () => {
      expect(repo).toBeInstanceOf(KnowledgesMongoRepo);
    });
  });

  describe('When the query method is used', () => {
    test('Then it should return the mock data', async () => {
      const mockData = [{ name: 'test' }];

      (KnowledgeModel.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnValue(mockData),
      }));

      const result = await repo.query();

      expect(KnowledgeModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('When the queryId method is used', () => {
    test('Then if there is an existing data, it should return the mock value', async () => {
      const mockData = { name: 'test' };

      (KnowledgeModel.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnValue(mockData),
      }));

      const result = await repo.queryId('1');

      expect(KnowledgeModel.findById).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    test('Then if there is an existing data, it should return the mock value', async () => {
      (KnowledgeModel.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnValue(null),
      }));

      expect(async () => repo.queryId('')).rejects.toThrow();
    });
  });

  describe('When the create method is used', () => {
    test('Then if it has an object to create, it should return the created object', async () => {
      (KnowledgeModel.create as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnValue({ name: 'test' }),
      }));

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
      (KnowledgeModel.findByIdAndUpdate as jest.Mock).mockImplementation(
        () => ({
          populate: jest.fn().mockReturnValue({
            name: 'test',
            id: '1',
          }),
        })
      );
      const result = await repo.update(mockKnowledge);
      expect(KnowledgeModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({ name: 'test', id: '1' });
    });

    test('Then if the findByIdAndUpdate method resolve value to null, it should throw an Error', async () => {
      (KnowledgeModel.findByIdAndUpdate as jest.Mock).mockImplementation(
        () => ({
          populate: jest.fn().mockReturnValue(null),
        })
      );
      expect(
        async () => (await repo.update(mockKnowledge)) as KnowledgeStructure
      ).rejects.toThrow();
    });
  });

  describe('When the destroy method is used', () => {
    beforeEach(async () => {
      (KnowledgeModel.findByIdAndDelete as jest.Mock).mockReturnValue({});
    });

    test('Then if it has an object to delete with its ID, the findByIdAndDelete function should be called', async () => {
      await repo.destroy('1');
      expect(KnowledgeModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then if the findByIdAndDelete method resolve value to null, it should throw an Error', async () => {
      (KnowledgeModel.findByIdAndDelete as jest.Mock).mockReturnValue(null);
      expect(async () => repo.destroy('')).rejects.toThrow();
    });
  });

  describe('When the search method is used', () => {
    test('Then if it has an mock query object, it should return an empty array', async () => {
      const mockQuery = { key: 'test', value: 'test' };
      (KnowledgeModel.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnValue({
          name: 'test',
          id: '1',
        }),
      }));
      const result = await repo.search(mockQuery);
      expect(result).toEqual({
        name: 'test',
        id: '1',
      });
    });
  });
});
