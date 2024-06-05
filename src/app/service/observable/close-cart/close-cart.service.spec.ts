import { TestBed } from '@angular/core/testing';

import { CloseCartService } from './close-cart.service';

describe('CloseCartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CloseCartService = TestBed.get(CloseCartService);
    expect(service).toBeTruthy();
  });
});
