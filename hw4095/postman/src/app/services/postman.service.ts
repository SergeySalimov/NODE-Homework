import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HistoryDto, RequestDto, ResponseDto } from '../interfaces/interfaces.dto';
import { finalize } from 'rxjs/operators';

@Injectable()
export class PostmanService {
  $isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoaded$: Observable<boolean> = this.$isLoaded.asObservable();
  private $history: BehaviorSubject<HistoryDto> = new BehaviorSubject<HistoryDto>([]);
  history$: Observable<HistoryDto> = this.$history.asObservable();
  private $response: Subject<ResponseDto> = new Subject<ResponseDto>();
  response$: Observable<ResponseDto> = this.$response.asObservable();

  rootURL = '/api';

  constructor(private readonly http: HttpClient) {
  }

  sendRequest(req: RequestDto): void {
    this.$isLoaded.next(true);
    this.http.post<ResponseDto>(`${this.rootURL}/requests`, req).pipe(
      finalize(() => {
        this.$isLoaded.next(false);
        this.getHistory();
      }),
    ).subscribe((data: ResponseDto) => this.$response.next(data));
  }

  getHistory(): void {
    this.$isLoaded.next(true);
    this.http.get<HistoryDto>(`${this.rootURL}/histories`).pipe(
      finalize(() => this.$isLoaded.next(false)),
    ).subscribe((data: HistoryDto) => this.$history.next(data.reverse()));
  }

  deleteHistory(id: string): Observable<void> {
    this.$isLoaded.next(true);
    return this.http.delete<void>(`${this.rootURL}/histories/${id}`).pipe(
      finalize(() => this.$isLoaded.next(false)),
    );
  }

  uploadFiles(file: File, comment: string): any {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('comment', comment);

    return this.http.post(
      `${this.rootURL}/upload-file`,
      formData,
      ).subscribe();
  }
}
