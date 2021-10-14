export interface VoteDto {
  answers: Record<string, string>;
}

export interface AnswerStatisticDto {
  answerName: string,
  count: number,
}

export interface StatisticViewDto {
  questionName: string;
  questionData: Array<AnswerStatisticDto>;
}
