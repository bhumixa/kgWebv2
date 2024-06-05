import { TestBed } from '@angular/core/testing';

import { SelectedCountryService } from './selected-country.service';

describe('SelectedCountryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectedCountryService = TestBed.get(SelectedCountryService);
    expect(service).toBeTruthy();
  });
});
