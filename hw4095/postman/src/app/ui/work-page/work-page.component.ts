import { Component, OnInit } from '@angular/core';
import { RequestForm } from '../../interfaces/interfaces.vm';

@Component({
  selector: 'app-work-page',
  templateUrl: './work-page.component.html',
  styleUrls: ['./work-page.component.scss']
})
export class WorkPageComponent implements OnInit {
  showHistory = false;
  disableSendRequest = true;
  
  constructor() {
  }
  
  ngOnInit(): void {
  }
  
  sendRequest(data: RequestForm) {
    console.log(data);
    
  }
  
}
