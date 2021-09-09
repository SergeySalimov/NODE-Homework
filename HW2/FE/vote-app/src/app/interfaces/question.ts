import { AnswerAfter, AnswerBefore } from './answer';

export interface QuestionBefore {
  questionId: string;
  questionText: string;
  answers: AnswerBefore[];
}

export interface QuestionAfter extends QuestionBefore {
  answers: AnswerAfter[];
}
