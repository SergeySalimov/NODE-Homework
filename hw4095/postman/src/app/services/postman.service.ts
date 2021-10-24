import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HistoryDto, RequestDto, ResponseDto } from '../interfaces/interfaces.dto';
import { finalize } from 'rxjs/operators';

@Injectable()
export class PostmanService {
  $isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoaded$: Observable<boolean> = this.$isLoaded.asObservable();
  private _history: BehaviorSubject<HistoryDto> = new BehaviorSubject<HistoryDto>([]);
  history$: Observable<HistoryDto> = this._history.asObservable();
  
  rootURL = '/api';
  
  constructor(private readonly http: HttpClient) {
  }
  
  sendRequest(req: RequestDto): Observable<ResponseDto> {
    this.$isLoaded.next(true);
    return this.http.post<ResponseDto>(`${this.rootURL}/requests`, req).pipe(
      finalize(() => this.$isLoaded.next(false)),
    );
  }
  
  getHistory(): void {
    this.$isLoaded.next(true);
    this.http.get<HistoryDto>(`${this.rootURL}/histories`).pipe(
      finalize(() => this.$isLoaded.next(false)),
    ).subscribe(data => this._history.next(data.reverse()));
  }
  
  deleteHistory(id: string): Observable<void> {
    this.$isLoaded.next(true);
    return this.http.delete<void>(`${this.rootURL}/histories/${id}`).pipe(
      finalize(() => this.$isLoaded.next(false)),
    );
  }
}
