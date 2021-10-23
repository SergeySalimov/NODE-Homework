import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RequestDto, ResponseDto } from '../interfaces/interfaces.dto';
import { finalize } from 'rxjs/operators';

@Injectable()
export class PostmanService {
  $isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoaded$: Observable<boolean> = this.$isLoaded.asObservable();
  $history: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  history$: Observable<any> = this.$history.asObservable();
  
  rootURL = '/api';
  
  constructor(private readonly http: HttpClient) {
  }
  
  sendRequest(req: RequestDto): Observable<ResponseDto> {
    this.$isLoaded.next(true);
    return this.http.post<ResponseDto>(`${this.rootURL}/request`, req).pipe(
      finalize(() => this.$isLoaded.next(false)),
    );
  }
  // Todo create interface
  getHistory(): void {
    this.$isLoaded.next(true);
    this.http.get<any>(`${this.rootURL}/history`).pipe(
      finalize(() => this.$isLoaded.next(false)),
    ).subscribe(data => this.$history.next(data));
  }
}
