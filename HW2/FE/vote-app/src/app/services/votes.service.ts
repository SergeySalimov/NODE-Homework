import { Injectable } from '@angular/core';
import { QuestionAfter, QuestionBefore } from '../interfaces/question';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, finalize, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

const questionsBefore: QuestionBefore[] = [
  {
    questionId: '1',
    questionText: 'Будет ли что-то 1',
    answers: [
      { answerId: '1-1', answerText: 'да'},
      { answerId: '1-2', answerText: 'нет'},
      { answerId: '1-3', answerText: 'не знаю'},
    ],
  },
  {
    questionId: '2',
    questionText: 'Будет ли что-то 2',
    answers: [
      { answerId: '2-1', answerText: 'да'},
      { answerId: '2-2', answerText: 'нет'},
      { answerId: '2-3', answerText: 'не знаю'},
    ],
  },
  {
    questionId: '3',
    questionText: 'Будет ли что-то 3',
    answers: [
      { answerId: '3-1', answerText: 'да'},
      { answerId: '3-2', answerText: 'нет'},
      { answerId: '3-3', answerText: 'не знаю'},
    ],
  },
];
const questionsAfter: QuestionAfter[] = [
  {
    questionId: '1',
    questionText: 'Будет ли что-то 1',
    answers: [
      { answerId: '1-1', answerText: 'да', answerCount: 5 },
      { answerId: '1-2', answerText: 'нет', answerCount: 6 },
      { answerId: '1-3', answerText: 'не знаю', answerCount: 3 },
    ],
  },
  {
    questionId: '2',
    questionText: 'Будет ли что-то 2',
    answers: [
      { answerId: '2-1', answerText: 'да', answerCount: 11 },
      { answerId: '2-2', answerText: 'нет', answerCount: 1 },
      { answerId: '2-3', answerText: 'не знаю', answerCount: 2 },
    ],
  },
  {
    questionId: '3',
    questionText: 'Будет ли что-то 3',
    answers: [
      { answerId: '3-1', answerText: 'да', answerCount: 5 },
      { answerId: '3-2', answerText: 'нет', answerCount: 5 },
      { answerId: '3-3', answerText: 'не знаю', answerCount: 4 },
    ],
  },
];

@Injectable()
export class VotesService {
  $isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoaded$: Observable<boolean> = this.$isLoaded.asObservable();
  
  questions: QuestionBefore[];
  
  constructor(private readonly http: HttpClient) {}
  
  getQuestions(): Observable<Array<QuestionBefore>> {
    this.$isLoaded.next(true);
    // return this.http.get('http://178.172.195.18:7780');
    
    return of(questionsBefore).pipe(
      delay(300),
      finalize(() => this.$isLoaded.next(false)),
    );
  }
  
  getAnswers(): Observable<Array<QuestionAfter>> {
    this.$isLoaded.next(true);
    return of(questionsAfter).pipe(
      delay(300),
      finalize(() => this.$isLoaded.next(false)),
    );
  }
}
