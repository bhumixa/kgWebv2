import { TestBed } from '@angular/core/testing';

import { ApplySearchService } from './apply-search.service';

describe('ApplySearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplySearchService = TestBed.get(ApplySearchService);
    expect(service).toBeTruthy();
  });
});
