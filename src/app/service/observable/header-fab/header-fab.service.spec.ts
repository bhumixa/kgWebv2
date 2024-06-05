import { TestBed } from '@angular/core/testing';

import { HeaderFabService } from './header-fab.service';

describe('HeaderFabService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HeaderFabService = TestBed.get(HeaderFabService);
    expect(service).toBeTruthy();
  });
});
