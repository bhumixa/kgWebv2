import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductSummaryCompComponent } from './product-summary-comp.component';

describe('ProductSummaryCompComponent', () => {
  let component: ProductSummaryCompComponent;
  let fixture: ComponentFixture<ProductSummaryCompComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSummaryCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSummaryCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
