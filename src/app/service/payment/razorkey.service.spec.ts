import { TestBed } from '@angular/core/testing';

import { RazorkeyService } from './razorkey.service';

describe('RazorkeyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RazorkeyService = TestBed.get(RazorkeyService);
    expect(service).toBeTruthy();
  });
});
