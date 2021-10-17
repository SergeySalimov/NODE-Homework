import { Component, OnInit } from '@angular/core';
import { RequestForm } from '../../interfaces/interfaces.vm';
import { PostmanService } from '../../services/postman.service';
import { RequestDto } from '../../interfaces/interfaces.dto';
import { WorkPageHelper } from './work-page.helper';

@Component({
  selector: 'app-work-page',
  templateUrl: './work-page.component.html',
  styleUrls: ['./work-page.component.scss']
})
export class WorkPageComponent implements OnInit {
  showHistory = false;
  disableSendRequest = true;
  
  constructor(public postmanService: PostmanService) {}
  
  ngOnInit(): void {
  }
  
  sendRequest(data: RequestForm) {
    const req: RequestDto = WorkPageHelper.translateFormDataToRequestDto(data);
    
    this.postmanService.sendRequest(req).subscribe(data => {
      console.log(data);
    });
  }
  
}
