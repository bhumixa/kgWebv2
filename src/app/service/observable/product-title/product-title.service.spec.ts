import { TestBed } from '@angular/core/testing';

import { ProductTitleService } from './product-title.service';

describe('ProductTitleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductTitleService = TestBed.get(ProductTitleService);
    expect(service).toBeTruthy();
  });
});
