import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiaCompUserKycComponent } from './dia-comp-user-kyc.component';

describe('DiaCompUserKycComponent', () => {
  let component: DiaCompUserKycComponent;
  let fixture: ComponentFixture<DiaCompUserKycComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DiaCompUserKycComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiaCompUserKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
