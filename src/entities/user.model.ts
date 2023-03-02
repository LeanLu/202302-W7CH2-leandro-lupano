import { KnowledgeStructure } from './knowledge.model';

export type UserStructure = {
  id: string;
  userName: string;
  email: string;
  password: string;
  knowledges: KnowledgeStructure[];
};
