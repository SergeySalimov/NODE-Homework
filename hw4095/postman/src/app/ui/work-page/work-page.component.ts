import { Component, OnInit } from '@angular/core';
import { RequestForm } from '../../interfaces/interfaces.vm';
import { PostmanService } from '../../services/postman.service';
import { History, RequestDto, ResponseDto } from '../../interfaces/interfaces.dto';
import { WorkPageHelper } from './work-page.helper';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-work-page',
  templateUrl: './work-page.component.html',
  styleUrls: ['./work-page.component.scss']
})
export class WorkPageComponent implements OnInit {
  showHistory = true;
  disableSendRequest = true;
  request$: Observable<ResponseDto>;
  private _requestDataPatch: Subject<RequestForm> = new Subject<RequestForm>();
  private _activeHistoryId: Subject<string> = new Subject<string>();
  requestDataPatch$: Observable<RequestForm> = this._requestDataPatch.asObservable();
  activeHistoryId$: Observable<string> = this._activeHistoryId.asObservable();
  
  constructor(public postmanService: PostmanService, public route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.postmanService.getHistory();
  }
  
  sendRequest(data: RequestForm) {
    const req: RequestDto = WorkPageHelper.translateFormDataToRequestDto(data);
    
    this.request$ = this.postmanService.sendRequest(req).pipe(
      finalize(() => this.postmanService.getHistory()),
    );
  }
  
  deleteHistory(id: string) {
    this.postmanService.deleteHistory(id).subscribe(() => {
      this.postmanService.getHistory();
    });
  }
  
  applyHistory(history: History) {
    this._activeHistoryId.next(history.id);
    this._requestDataPatch.next(WorkPageHelper.translateHistoryToFormData(history));
  }
}
