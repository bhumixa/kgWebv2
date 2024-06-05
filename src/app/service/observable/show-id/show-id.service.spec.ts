import { TestBed } from '@angular/core/testing';

import { ShowIdService } from './show-id.service';

describe('ShowIdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShowIdService = TestBed.get(ShowIdService);
    expect(service).toBeTruthy();
  });
});
