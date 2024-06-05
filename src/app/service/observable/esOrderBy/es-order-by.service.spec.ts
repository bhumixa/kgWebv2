import { TestBed } from '@angular/core/testing';

import { EsOrderByService } from './es-order-by.service';

describe('EsOrderByService', () => {
  let service: EsOrderByService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EsOrderByService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
