import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestForm } from '../../interfaces/interfaces.vm';
import { PostmanService } from '../../services/postman.service';
import { RequestDto, ResponseDto } from '../../interfaces/interfaces.dto';
import { WorkPageHelper } from './work-page.helper';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-work-page',
  templateUrl: './work-page.component.html',
  styleUrls: ['./work-page.component.scss']
})
export class WorkPageComponent implements OnInit, OnDestroy {
  showHistory = false;
  disableSendRequest = true;
  request$: Observable<ResponseDto>;
  historyData: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  subscription: Subscription;
  
  constructor(public postmanService: PostmanService) {}
  
  ngOnInit(): void {
    this.postmanService.getHistory();
  }
  
  sendRequest(data: RequestForm) {
    const req: RequestDto = WorkPageHelper.translateFormDataToRequestDto(data);
    
    this.request$ = this.postmanService.sendRequest(req).pipe(
      finalize(() => this.postmanService.getHistory()),
    );
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
