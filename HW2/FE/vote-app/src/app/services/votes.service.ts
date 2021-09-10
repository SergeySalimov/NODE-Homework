import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, pluck } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { QuestionVM, StatisticVM, VariantsVM } from '../interfaces/interfaces.vm';
import { VoteDto } from '../interfaces/interfaces.dto';

@Injectable()
export class VotesService {
  $isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoaded$: Observable<boolean> = this.$isLoaded.asObservable();
  
  constructor(private readonly http: HttpClient) {
  }
  
  getQuestions(): Observable<QuestionVM[]> {
    this.$isLoaded.next(true);
    return this.http.get<VariantsVM>(`${environment.backendServerUrl}/variants`).pipe(
      pluck('data'),
      finalize(() => this.$isLoaded.next(false)),
    );
  }
  
  getStatistic(): Observable<Record<string, Record<string, number>>> {
    this.$isLoaded.next(true);
    
    return this.http.get<StatisticVM>(`${environment.backendServerUrl}/stat`).pipe(
      pluck('data'),
      finalize(() => this.$isLoaded.next(false)),
    );
  }
  
  postVote(vote: VoteDto) {
    this.$isLoaded.next(true);
    // const mockData: VoteDto = {
    //   answers: {
    //     ['1']: '1-1',
    //     ['2']: '2-1',
    //     ['3']: '3-1',
    //   },
    // };
    return this.http.post(`${environment.backendServerUrl}/vote`, vote).pipe(
      finalize(() => this.$isLoaded.next(false)),
    );
  }
}
