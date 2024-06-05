import { TestBed } from '@angular/core/testing';

import { LOGGEDOUTService } from './loggedout.service';

describe('LOGGEDOUTService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LOGGEDOUTService = TestBed.get(LOGGEDOUTService);
    expect(service).toBeTruthy();
  });
});
