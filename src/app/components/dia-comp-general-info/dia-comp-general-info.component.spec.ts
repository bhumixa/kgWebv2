import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiaCompGeneralInfoComponent } from './dia-comp-general-info.component';

describe('DiaCompGeneralInfoComponent', () => {
  let component: DiaCompGeneralInfoComponent;
  let fixture: ComponentFixture<DiaCompGeneralInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DiaCompGeneralInfoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiaCompGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
