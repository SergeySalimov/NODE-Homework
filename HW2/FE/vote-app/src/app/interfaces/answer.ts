export interface AnswerBefore {
  answerId: string;
  answerText: string;
}

export interface AnswerAfter extends AnswerBefore {
  answerCount: number;
}
