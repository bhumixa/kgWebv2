import { TestBed } from '@angular/core/testing';

import { ShowFilterService } from './show-filter.service';

describe('ShowFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShowFilterService = TestBed.get(ShowFilterService);
    expect(service).toBeTruthy();
  });
});
