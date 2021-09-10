export interface AnswerVM {
  answerId: string;
  answerText: string;
}

export interface QuestionVM {
  questionId: string;
  questionText: string;
  answers: Array<AnswerVM>;
}

export interface VariantsVM {
  _id: string;
  created: Date;
  data: Array<QuestionVM>;
}

export interface StatisticVM {
  updated: Date;
  data: Record<string, Record<string, number>>,
}
