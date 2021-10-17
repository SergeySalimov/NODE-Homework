import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestTypeEnum, URL_REGEXP } from '../../../interfaces/constant';

@Component({
  selector: 'work-request-block',
  templateUrl: './request-block.component.html',
  styleUrls: ['./request-block.component.scss']
})
export class RequestBlockComponent implements OnInit {
  @Output() requestFormStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
  requestForm: FormGroup;
  type = RequestTypeEnum;
  
  get headers(): FormArray {
    return this.requestForm.controls.headers as FormArray;
  }
  
  constructor(private readonly fb: FormBuilder) {
  }
  
  ngOnInit(): void {
    this.initForm();
  }
  
  initForm(): void {
    this.requestForm = this.fb.group({
      type: [RequestTypeEnum.GET],
      url: ['http://', [Validators.required, Validators.pattern(URL_REGEXP)]],
      body: [''],
      headers: this.fb.array([
        this.fb.group({
          key: ['', Validators.required],
          value: ['', Validators.required],
        }),
      ]),
    });
  }
  
  addHeader(): void {
    this.headers.push(
      this.fb.group({
        key: ['', Validators.required],
        value: ['', Validators.required],
      }),
    );
    this.getIsInvalidOnChangeInForm();
  }
  
  removeHeader(i: number): void {
    this.headers.removeAt(i);
    this.getIsInvalidOnChangeInForm();
  }
  
  getIsInvalidOnChangeInForm(): void {
    this.requestFormStatus.emit(this.requestForm.invalid);
  }
}
