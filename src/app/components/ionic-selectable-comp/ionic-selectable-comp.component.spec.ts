import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IonicSelectableCompComponent } from './ionic-selectable-comp.component';

describe('IonicSelectableCompComponent', () => {
  let component: IonicSelectableCompComponent;
  let fixture: ComponentFixture<IonicSelectableCompComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IonicSelectableCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IonicSelectableCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
