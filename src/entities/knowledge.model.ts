import { UserStructure } from './user.model';

export type KnowledgeStructure = {
  id: string;
  name: string;
  interestingScore: number;
  difficultyLevel: number;
  owner: UserStructure;
};
