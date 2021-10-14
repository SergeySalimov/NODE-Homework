import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, pluck } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QuestionVM, StatisticVM, VariantsVM } from '../interfaces/interfaces.vm';
import { VoteDto } from '../interfaces/interfaces.dto';

@Injectable()
export class VotesService {
  $isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoaded$: Observable<boolean> = this.$isLoaded.asObservable();
  
  rootURL = '/api';
  
  constructor(private readonly http: HttpClient) {}
  
  getQuestions(): Observable<QuestionVM[]> {
    this.$isLoaded.next(true);
    return this.http.get<VariantsVM>(`${this.rootURL}/variants`).pipe(
      pluck('data'),
      finalize(() => this.$isLoaded.next(false)),
    );
  }
  
  getStatistic(): Observable<StatisticVM> {
    this.$isLoaded.next(true);
    
    return this.http.get<StatisticVM>(`${this.rootURL}/stat`).pipe(
      finalize(() => this.$isLoaded.next(false)),
    );
  }
  
  postVote(vote: VoteDto) {
    this.$isLoaded.next(true);
    
    return this.http.post(`${this.rootURL}/vote`, vote, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }).pipe(
      finalize(() => this.$isLoaded.next(false)),
    );
  }
}
