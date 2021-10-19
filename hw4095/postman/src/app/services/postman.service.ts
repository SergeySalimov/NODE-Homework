import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RequestDto, ResponseDto } from '../interfaces/interfaces.dto';
import { finalize } from 'rxjs/operators';

@Injectable()
export class PostmanService {
  $isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoaded$: Observable<boolean> = this.$isLoaded.asObservable();
  
  rootURL = '/api';
  
  constructor(private readonly http: HttpClient) {
  }
  
  sendRequest(req: RequestDto): Observable<ResponseDto> {
    this.$isLoaded.next(true);
    return this.http.post<ResponseDto>(`${this.rootURL}/request`, req).pipe(
      finalize(() => this.$isLoaded.next(false)),
    );
  }
}
