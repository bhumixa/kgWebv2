import { TestBed } from '@angular/core/testing';

import { SelectedValuesService } from './selected-values.service';

describe('SelectedValuesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectedValuesService = TestBed.get(SelectedValuesService);
    expect(service).toBeTruthy();
  });
});
