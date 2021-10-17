import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestDto } from '../interfaces/interfaces.dto';
import { delay, finalize } from 'rxjs/operators';

@Injectable()
export class PostmanService {
  $isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoaded$: Observable<boolean> = this.$isLoaded.asObservable();
  
  rootURL = '/api';
  
  constructor(private readonly http: HttpClient) {
  }
  
  sendRequest(req: RequestDto) {
    this.$isLoaded.next(true);
    // ToDo probably set headers is redundant here
    return this.http.post(`${this.rootURL}/request`, req, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }).pipe(
      delay(500),
      finalize(() => this.$isLoaded.next(false)),
    );
  }
}
