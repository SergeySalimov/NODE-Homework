import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-work-page',
  templateUrl: './work-page.component.html',
  styleUrls: ['./work-page.component.scss']
})
export class WorkPageComponent implements OnInit {
  showHistory = false;
  selected = 'GET';

  constructor() { }

  ngOnInit(): void {
  }

}
