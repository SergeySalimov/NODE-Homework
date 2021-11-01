import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-work-button-line-block',
  templateUrl: './button-line-block.component.html',
  styleUrls: ['./button-line-block.component.scss']
})
export class ButtonLineBlockComponent {
  @Input() showHistory: boolean;
  @Input() disableSendRequest: boolean;
  @Output() sendRequestEmit: EventEmitter<void> = new EventEmitter<void>();
  @Output() changeHistoryEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
}
