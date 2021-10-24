import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { History, HistoryDto } from '../../../interfaces/interfaces.dto';
import { RequestTypeEnum } from '../../../interfaces/constant';

@Component({
  selector: 'work-history-block',
  templateUrl: './history-block.component.html',
  styleUrls: ['./history-block.component.scss']
})
export class HistoryBlockComponent implements OnInit {
  @Input() histories: HistoryDto;
  @Input() activeHistoryId: string;
  @Output() deleteHistoryEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() applyHistoryEmit: EventEmitter<History> = new EventEmitter<History>();
  TYPE = RequestTypeEnum;
  
  constructor() { }

  ngOnInit(): void {
  }
}
