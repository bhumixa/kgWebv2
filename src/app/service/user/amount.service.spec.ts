import { TestBed } from '@angular/core/testing';

import { AmountService } from './amount.service';

describe('AmountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AmountService = TestBed.get(AmountService);
    expect(service).toBeTruthy();
  });
});
