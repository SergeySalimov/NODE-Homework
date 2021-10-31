import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonLineBlockComponent } from './button-line-block.component';

describe('ButtonLineBlockComponent', () => {
  let component: ButtonLineBlockComponent;
  let fixture: ComponentFixture<ButtonLineBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonLineBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonLineBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
