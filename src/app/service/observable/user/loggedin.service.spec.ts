import { TestBed } from '@angular/core/testing';

import { LOGGEDINService } from './loggedin.service';

describe('LOGGEDINService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LOGGEDINService = TestBed.get(LOGGEDINService);
    expect(service).toBeTruthy();
  });
});
