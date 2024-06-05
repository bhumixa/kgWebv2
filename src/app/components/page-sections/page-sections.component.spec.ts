import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageSectionsComponent } from './page-sections.component';

describe('PageSectionsComponent', () => {
  let component: PageSectionsComponent;
  let fixture: ComponentFixture<PageSectionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
