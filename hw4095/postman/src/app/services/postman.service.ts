import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HistoryDto, RequestDto, ResponseDto, UploadFileDto } from '../interfaces/interfaces.dto';
import { finalize, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class PostmanService {
  private $isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoaded$: Observable<boolean> = this.$isLoaded.asObservable();
  private $history: BehaviorSubject<HistoryDto> = new BehaviorSubject<HistoryDto>([]);
  history$: Observable<HistoryDto> = this.$history.asObservable();
  private $response: Subject<ResponseDto> = new Subject<ResponseDto>();
  response$: Observable<ResponseDto> = this.$response.asObservable();
  $uploadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  uploadProgress$: Observable<number> = this.$uploadProgress.asObservable();
  private $disableLoadButton: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  disableLoadButton$: Observable<boolean> = this.$disableLoadButton.asObservable();
  $uploadFileList: BehaviorSubject<UploadFileDto[]> = new BehaviorSubject<UploadFileDto[]>([]);
  uploadFileList$: Observable<UploadFileDto[]> = this.$uploadFileList.asObservable();

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

  getUploadFileList(): void {
    this.$isLoaded.next(true);
    this.http.get<UploadFileDto[]>(`${this.rootURL}/list-of-upload-files`).pipe(
      finalize(() => this.$isLoaded.next(false)),
      map((data: UploadFileDto[]) => data.map((el, i) => ({ ...el, position: i + 1 }))),
    ).subscribe(data => {
      this.$uploadFileList.next(data);
    });
  }

  uploadFiles(file: File, comment: string): Observable<UploadFileDto> {
    this.$disableLoadButton.next(true);

    const formData: FormData = new FormData();
    const fileLength: string = file.size.toString();

    formData.append('file', file);
    formData.append('comment', comment);

    // ToDo need to add here real session token
    const sessionToken: string = 'TOKEN:' + (Date.now().toString(36) + Math.random().toString(36).substring(2, 15));

    // open webSocket
    const wsUrl: string = environment.webSocketUrl;
    const connection: WebSocket = new WebSocket(wsUrl);

    connection.onopen = () => {
      connection.send(sessionToken);
    };
    connection.onmessage = (event) => {
      const message: string = event.data;
      if (message.startsWith('progress:')) {
        const progress: string = message.slice(9);
        this.$uploadProgress.next(+progress);
      }
    };
    connection.onerror = (event) => {
      // ToDo add show toast here
      console.log('error on webSocket: ', event);
    };

    return this.http.post<UploadFileDto>(
      `${this.rootURL}/upload-file`,
      formData,
      {
        headers: {
          'custom-token': sessionToken,
          'file-length': fileLength,
        },
      },
    ).pipe(
      finalize(() => {
        this.$disableLoadButton.next(false);
        connection.close();
      }),
    );
  }
}
