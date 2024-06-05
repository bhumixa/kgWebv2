import { TestBed } from '@angular/core/testing';

import { DealerClubService } from './dealer-club.service';

describe('DealerClubService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DealerClubService = TestBed.get(DealerClubService);
    expect(service).toBeTruthy();
  });
});
