import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CollectionComponentComponent } from './collection-component.component';

describe('CollectionComponentComponent', () => {
  let component: CollectionComponentComponent;
  let fixture: ComponentFixture<CollectionComponentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
