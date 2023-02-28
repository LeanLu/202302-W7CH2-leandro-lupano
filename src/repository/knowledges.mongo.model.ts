import { Schema, model } from 'mongoose';
import { KnowledgeStructure } from '../entities/knowledge.model';

const knowledgeSchema = new Schema<KnowledgeStructure>({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  interestingScore: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },

  difficultyLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

export const KnowledgeModel = model('Knowledge', knowledgeSchema, 'knowledges');
