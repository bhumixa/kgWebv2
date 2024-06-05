import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CountryselectionComponent } from './countryselection.component';

describe('CountryselectionComponent', () => {
  let component: CountryselectionComponent;
  let fixture: ComponentFixture<CountryselectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryselectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
