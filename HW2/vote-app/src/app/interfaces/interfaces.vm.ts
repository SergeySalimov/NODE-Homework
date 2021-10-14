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
  questionsData: Record<string, string>[],
  answersData: Record<string, string>[],
  data: Record<string, Record<string, number>>,
}
