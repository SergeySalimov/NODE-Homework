import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'work-button-line-block',
  templateUrl: './button-line-block.component.html',
  styleUrls: ['./button-line-block.component.scss']
})
export class ButtonLineBlockComponent {
  @Input() showHistory: boolean = true;
  @Input() disableSendRequest: boolean = true;
  @Output() onSendRequest: EventEmitter<void> = new EventEmitter<void>();
  @Output() onChangeHistory: EventEmitter<boolean> = new EventEmitter<boolean>();
}
