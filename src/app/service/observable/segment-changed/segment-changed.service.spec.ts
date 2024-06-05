import { TestBed } from '@angular/core/testing';

import { SegmentChangedService } from './segment-changed.service';

describe('SegmentChangedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SegmentChangedService = TestBed.get(SegmentChangedService);
    expect(service).toBeTruthy();
  });
});
