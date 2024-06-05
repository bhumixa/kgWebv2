import { TestBed } from '@angular/core/testing';

import { OpenCartService } from './open-cart.service';

describe('OpenCartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpenCartService = TestBed.get(OpenCartService);
    expect(service).toBeTruthy();
  });
});
